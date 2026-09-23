using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace DaVendeSoundFunction;

public class GenerateThumbnail
{
    private readonly ILogger<GenerateThumbnail> _logger;
    private const int ThumbnailWidth = 250;
    private const int ThumbnailHeight = 150;
    private static bool _ffmpegInitialized = false;
    private static readonly SemaphoreSlim _initSemaphore = new SemaphoreSlim(1, 1);

    public GenerateThumbnail(ILogger<GenerateThumbnail> logger)
    {
        _logger = logger;
    }

    [Function(nameof(GenerateThumbnail))]
    public async Task Run(
        [BlobTrigger("davendesiteimages/{name}", Connection = "AzureWebJobsStorage")]
        Stream imageStream,
        string name)
    {
        try
        {
            // Skip if already a thumbnail
            if (name.Contains("_thumb"))
            {
                _logger.LogInformation("Skipping thumbnail file: {Name}", name);
                return;
            }

            // Video posters are {basename}.jpg in the thumbnails container (see MediaService and DeleteThumbnail).
            if (name.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase))
            {
                await GenerateVideoThumbnailAsync(imageStream, name);
                return;
            }

            // Skip non-image files
            string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            if (!imageExtensions.Any(ext => name.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
            {
                _logger.LogInformation("Skipping non-image file: {Name}", name);
                return;
            }

            _logger.LogInformation("Processing image: {Name}", name);

            // Load image from stream
            using (Image image = await Image.LoadAsync(imageStream))
            {
                // Resize to thumbnail dimensions (250x150)
                image.Mutate(x => x
                    .Resize(new ResizeOptions
                    {
                        Size = new Size(ThumbnailWidth, ThumbnailHeight),
                        Mode = ResizeMode.Crop
                    }));

                // Keep original filename for thumbnail
                string thumbnailName = name;

                // Get connection string
                string? connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");

                // Create blob client for thumbnails container using connection string
                var blobServiceClient = new BlobServiceClient(connectionString);
                var containerClient = blobServiceClient.GetBlobContainerClient("davendesiteimages-thumbnails");

                // Ensure container exists
                await containerClient.CreateIfNotExistsAsync();

                // Save thumbnail to blob storage
                using (MemoryStream thumbnailStream = new MemoryStream())
                {
                    // Save as JPEG for optimal compression
                    await image.SaveAsJpegAsync(thumbnailStream);
                    thumbnailStream.Position = 0;

                    var thumbnailBlobClient = containerClient.GetBlobClient(thumbnailName);
                    await thumbnailBlobClient.UploadAsync(thumbnailStream, overwrite: true);

                    _logger.LogInformation("Thumbnail created successfully: {ThumbnailName}", thumbnailName);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing image {Name}: {Message}", name, ex.Message);
            throw;
        }
    }

    private async Task GenerateVideoThumbnailAsync(Stream videoStream, string name)
    {
        _logger.LogInformation("Processing video for thumbnail: {Name}", name);

        string? connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
        if (string.IsNullOrEmpty(connectionString))
        {
            _logger.LogError("AzureWebJobsStorage connection string not found");
            return;
        }

        await EnsureFFmpegInitializedAsync();

        string tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempDir);

        try
        {
            string inputPath = Path.Combine(tempDir, Path.GetFileName(name));
            using (var fileStream = new FileStream(inputPath, FileMode.Create, FileAccess.Write))
            {
                await videoStream.CopyToAsync(fileStream);
            }

            string thumbnailName = Path.ChangeExtension(name, ".jpg");
            string tempThumbnailPath = Path.Combine(tempDir, Path.GetFileName(thumbnailName));

            var mediaInfo = await FFmpeg.GetMediaInfo(inputPath);
            var captureTime = mediaInfo.Duration.TotalSeconds > 1 ? TimeSpan.FromSeconds(1) : TimeSpan.Zero;

            IConversion thumbnailConversion = await FFmpeg.Conversions.FromSnippet.Snapshot(inputPath, tempThumbnailPath, captureTime);
            thumbnailConversion.AddParameter(
                $"-vf scale={ThumbnailWidth}:{ThumbnailHeight}:force_original_aspect_ratio=decrease,pad={ThumbnailWidth}:{ThumbnailHeight}:(ow-iw)/2:(oh-ih)/2",
                ParameterPosition.PostInput);
            await thumbnailConversion.Start();

            var containerClient = new BlobServiceClient(connectionString)
                .GetBlobContainerClient("davendesiteimages-thumbnails");
            await containerClient.CreateIfNotExistsAsync();

            using (var thumbnailStream = new FileStream(tempThumbnailPath, FileMode.Open, FileAccess.Read))
            {
                await containerClient.GetBlobClient(thumbnailName).UploadAsync(
                    thumbnailStream,
                    new BlobUploadOptions
                    {
                        HttpHeaders = new BlobHttpHeaders { ContentType = "image/jpeg" }
                    });
            }

            _logger.LogInformation("Video thumbnail created successfully: {ThumbnailName}", thumbnailName);
        }
        finally
        {
            if (Directory.Exists(tempDir))
            {
                Directory.Delete(tempDir, true);
            }
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
