using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace DaVendeSoundFunction;

public class GenerateVideoThumbnail
{
    private readonly ILogger<GenerateVideoThumbnail> _logger;
    private const int ThumbnailWidth = 250;
    private const int ThumbnailHeight = 150;
    private static bool _ffmpegInitialized = false;
    private static readonly SemaphoreSlim _initSemaphore = new SemaphoreSlim(1, 1);

    public GenerateVideoThumbnail(ILogger<GenerateVideoThumbnail> logger)
    {
        _logger = logger;
    }

    [Function(nameof(GenerateVideoThumbnail))]
    public async Task Run(
        [BlobTrigger("davendesiteimages/{name}", Connection = "AzureWebJobsStorage")]
        Stream videoStream,
        string name)
    {
      try
        {
            // Only process video files
     string[] videoExtensions = { ".mp4", ".mov", ".avi", ".wmv", ".mkv", ".webm" };
    if (!videoExtensions.Any(ext => name.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
       {
     // Not a video file, skip (let GenerateThumbnail handle images)
       return;
            }

    _logger.LogInformation("Processing video for thumbnail: {Name}", name);

    // Ensure FFmpeg is downloaded and initialized
            await EnsureFFmpegInitializedAsync();

        // Get connection string
            string? connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            if (string.IsNullOrEmpty(connectionString))
{
          _logger.LogError("AzureWebJobsStorage connection string not found");
        return;
            }

   // Create temp directory for processing
            string tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
     Directory.CreateDirectory(tempDir);

     try
      {
            // Save video stream to temp file
  string tempVideoPath = Path.Combine(tempDir, name);
       using (var fileStream = new FileStream(tempVideoPath, FileMode.Create, FileAccess.Write))
  {
 await videoStream.CopyToAsync(fileStream);
     }

    _logger.LogInformation("Video saved to temp: {Path}", tempVideoPath);

    // Generate thumbnail filename (same name but .jpg extension)
       string thumbnailFileName = Path.GetFileNameWithoutExtension(name) + ".jpg";
       string tempThumbnailPath = Path.Combine(tempDir, thumbnailFileName);

      // Extract frame at 1 second (or first frame if video is shorter)
       var mediaInfo = await FFmpeg.GetMediaInfo(tempVideoPath);
  var videoDuration = mediaInfo.Duration;
                var captureTime = videoDuration.TotalSeconds > 1 ? TimeSpan.FromSeconds(1) : TimeSpan.Zero;

        _logger.LogInformation("Video duration: {Duration}, capturing at: {CaptureTime}", videoDuration, captureTime);

              // Extract thumbnail using FFmpeg
                var conversion = await FFmpeg.Conversions.FromSnippet.Snapshot(
        tempVideoPath,
            tempThumbnailPath,
       captureTime);

// Add scaling to match thumbnail dimensions
       conversion.AddParameter($"-vf scale={ThumbnailWidth}:{ThumbnailHeight}:force_original_aspect_ratio=decrease,pad={ThumbnailWidth}:{ThumbnailHeight}:(ow-iw)/2:(oh-ih)/2", ParameterPosition.PostInput);

 await conversion.Start();

           _logger.LogInformation("Thumbnail generated at: {Path}", tempThumbnailPath);

       // Upload thumbnail to blob storage
     var blobServiceClient = new BlobServiceClient(connectionString);
     var containerClient = blobServiceClient.GetBlobContainerClient("davendesiteimages-thumbnails");

 // Ensure container exists
 await containerClient.CreateIfNotExistsAsync();

  // Upload the thumbnail
              using (var thumbnailStream = new FileStream(tempThumbnailPath, FileMode.Open, FileAccess.Read))
      {
        var thumbnailBlobClient = containerClient.GetBlobClient(thumbnailFileName);
       await thumbnailBlobClient.UploadAsync(thumbnailStream, overwrite: true);
     }

  _logger.LogInformation("Video thumbnail uploaded successfully: {ThumbnailName}", thumbnailFileName);
     }
 finally
    {
  // Clean up temp directory
    try
{
           if (Directory.Exists(tempDir))
      {
             Directory.Delete(tempDir, true);
        }
        }
           catch (Exception ex)
       {
_logger.LogWarning(ex, "Failed to clean up temp directory: {TempDir}", tempDir);
          }
   }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating video thumbnail for {Name}: {Message}", name, ex.Message);
     throw;
        }
    }

    private async Task EnsureFFmpegInitializedAsync()
    {
    if (_ffmpegInitialized)
     return;

        await _initSemaphore.WaitAsync();
    try
    {
            if (_ffmpegInitialized)
          return;

     // Set FFmpeg path to temp directory
    string ffmpegPath = Path.Combine(Path.GetTempPath(), "ffmpeg");
          Directory.CreateDirectory(ffmpegPath);
            FFmpeg.SetExecutablesPath(ffmpegPath);

         // Download FFmpeg if not present
            _logger.LogInformation("Downloading FFmpeg binaries to: {Path}", ffmpegPath);
   await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official, ffmpegPath);
            _logger.LogInformation("FFmpeg binaries ready");

       _ffmpegInitialized = true;
        }
    finally
        {
     _initSemaphore.Release();
        }
    }
}
