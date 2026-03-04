using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace DaVendeSoundFunction;

public class CompressUploadedVideo
{
    private readonly ILogger<CompressUploadedVideo> _logger;
    private const int ThumbnailWidth = 250;
    private const int ThumbnailHeight = 150;
    private static bool _ffmpegInitialized = false;
    private static readonly SemaphoreSlim _initSemaphore = new SemaphoreSlim(1, 1);

    public CompressUploadedVideo(ILogger<CompressUploadedVideo> logger)
    {
        _logger = logger;
    }

    [Function(nameof(CompressUploadedVideo))]
    public async Task Run(
        [BlobTrigger("davendeoriginalimages/{name}", Connection = "AzureWebJobsStorage")]
        Stream videoStream,
        string name)
    {
        try
        {
            // Only process video files
            string[] videoExtensions = { ".mp4", ".mov", ".avi", ".wmv", ".mkv", ".webm" };
            if (!videoExtensions.Any(ext => name.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
            {
                _logger.LogInformation("Skipping non-video file: {Name}", name);
                return;
            }

            _logger.LogInformation("Processing video for compression: {Name}", name);

            await EnsureFFmpegInitializedAsync();

            string? connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogError("AzureWebJobsStorage connection string not found");
                return;
            }

            string tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(tempDir);

            try
            {
                // Save input to temp file
                string inputPath = Path.Combine(tempDir, name);
                using (var fileStream = new FileStream(inputPath, FileMode.Create, FileAccess.Write))
                {
                    await videoStream.CopyToAsync(fileStream);
                }

                // 1. COMPRESSION
                string compressedFileName = Path.GetFileNameWithoutExtension(name) + ".mp4";
                string outputPath = Path.Combine(tempDir, "compressed_" + compressedFileName);
                
                IConversion compression = FFmpeg.Conversions.New()
                    .AddParameter($"-i \"{inputPath}\"")
                    .SetOutput(outputPath)
                    .AddParameter("-vcodec libx264 -vf \"yadif,scale=1280:720\" -r 30 -movflags +faststart -acodec aac -ac 2");

                await compression.Start();
                _logger.LogInformation("Compression complete.");

                // 2. THUMBNAIL GENERATION (Right from the compressed file)
                string thumbnailFileName = Path.GetFileNameWithoutExtension(name) + ".jpg";
                string tempThumbnailPath = Path.Combine(tempDir, thumbnailFileName);
                
                var mediaInfo = await FFmpeg.GetMediaInfo(outputPath);
                var captureTime = mediaInfo.Duration.TotalSeconds > 1 ? TimeSpan.FromSeconds(1) : TimeSpan.Zero;

                IConversion thumbnailConversion = await FFmpeg.Conversions.FromSnippet.Snapshot(outputPath, tempThumbnailPath, captureTime);
                thumbnailConversion.AddParameter($"-vf scale={ThumbnailWidth}:{ThumbnailHeight}:force_original_aspect_ratio=decrease,pad={ThumbnailWidth}:{ThumbnailHeight}:(ow-iw)/2:(oh-ih)/2", ParameterPosition.PostInput);
                
                await thumbnailConversion.Start();
                _logger.LogInformation("Thumbnail generated.");

                // 3. UPLOAD BOTH
                var blobServiceClient = new BlobServiceClient(connectionString);
                
                // Upload Video
                var videoContainer = blobServiceClient.GetBlobContainerClient("davendesiteimages");
                using (var vStream = new FileStream(outputPath, FileMode.Open, FileAccess.Read))
                {
                    await videoContainer.GetBlobClient(compressedFileName).UploadAsync(vStream, overwrite: true);
                }

                // Upload Thumbnail
                var thumbContainer = blobServiceClient.GetBlobContainerClient("davendesiteimages-thumbnails");
                await thumbContainer.CreateIfNotExistsAsync();
                using (var tStream = new FileStream(tempThumbnailPath, FileMode.Open, FileAccess.Read))
                {
                    await thumbContainer.GetBlobClient(thumbnailFileName).UploadAsync(tStream, overwrite: true);
                }

                // 4. CLEANUP ORIGINAL
                await blobServiceClient.GetBlobContainerClient("davendeoriginalimages").GetBlobClient(name).DeleteIfExistsAsync();
                _logger.LogInformation("Process complete for {Name}", name);
            }
            finally
            {
                if (Directory.Exists(tempDir))
                {
                    Directory.Delete(tempDir, true);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error compressing video {Name}: {Message}", name, ex.Message);
            throw;
        }
    }

    private async Task EnsureFFmpegInitializedAsync()
    {
        if (_ffmpegInitialized) return;

        await _initSemaphore.WaitAsync();
        try
        {
            if (_ffmpegInitialized) return;

            string ffmpegPath = Path.Combine(Path.GetTempPath(), "ffmpeg");
            Directory.CreateDirectory(ffmpegPath);
            FFmpeg.SetExecutablesPath(ffmpegPath);

            _logger.LogInformation("Ensuring FFmpeg binaries at: {Path}", ffmpegPath);
            await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official, ffmpegPath);

            _ffmpegInitialized = true;
        }
        finally
        {
            _initSemaphore.Release();
        }
    }
}
