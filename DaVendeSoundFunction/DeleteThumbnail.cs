using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Messaging.EventGrid;
using Azure.Messaging.EventGrid.SystemEvents;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace DaVendeSoundFunction;

public class DeleteThumbnail
{
    private readonly ILogger<DeleteThumbnail> _logger;

    public DeleteThumbnail(ILogger<DeleteThumbnail> logger)
    {
        _logger = logger;
    }

    [Function(nameof(DeleteThumbnail))]
    public async Task Run(
        [EventGridTrigger] EventGridEvent eventGridEvent)
    {
        try
        {
            _logger.LogInformation("Event received: {EventType}", eventGridEvent.EventType);

            // Only process blob deleted events
            if (eventGridEvent.EventType != "Microsoft.Storage.BlobDeleted")
            {
                _logger.LogInformation("Ignoring event type: {EventType}", eventGridEvent.EventType);
                return;
            }

            // Parse the event data
            var blobDeletedData = eventGridEvent.Data.ToObjectFromJson<StorageBlobDeletedEventData>();
            if (blobDeletedData == null)
            {
                _logger.LogWarning("Could not parse blob deleted event data");
                return;
            }

            // Extract blob name from the URL
            var blobUrl = blobDeletedData.Url;
            _logger.LogInformation("Blob deleted URL: {Url}", blobUrl);

            // Check if it's from the main images container
            if (!blobUrl.Contains("/davendesiteimages/"))
            {
                _logger.LogInformation("Blob not from davendesiteimages container, skipping");
                return;
            }

            // Extract blob name
            var uri = new Uri(blobUrl);
            var segments = uri.Segments;
            if (segments.Length < 3)
            {
                _logger.LogWarning("Could not extract blob name from URL: {Url}", blobUrl);
                return;
            }

            // Get the original blob name (e.g., "myvideo.mp4" or "photo.jpg")
            var blobName = string.Join("", segments.Skip(2));
            blobName = Uri.UnescapeDataString(blobName);

            _logger.LogInformation("Attempting to delete thumbnail for: {BlobName}", blobName);

            // Get connection string
            string? connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogError("AzureWebJobsStorage connection string not found");
                return;
            }

            // Create blob client for thumbnails container
            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient("davendesiteimages-thumbnails");

            // Logic to determine the thumbnail name based on GenerateThumbnail/GenerateVideoThumbnail logic
            string thumbnailName = blobName;
            string[] videoExtensions = { ".mp4", ".mov", ".avi", ".wmv", ".mkv", ".webm" };

            if (videoExtensions.Any(ext => blobName.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
            {
                // Per GenerateVideoThumbnail.cs, video thumbnails are always .jpg
                thumbnailName = Path.GetFileNameWithoutExtension(blobName) + ".jpg";
                _logger.LogInformation("Video detected. Mapping {BlobName} to thumbnail {ThumbnailName}", blobName, thumbnailName);
            }

            // Delete the corresponding thumbnail
            var thumbnailBlobClient = containerClient.GetBlobClient(thumbnailName);
            var response = await thumbnailBlobClient.DeleteIfExistsAsync();

            if (response.Value)
            {
                _logger.LogInformation("Thumbnail deleted successfully: {ThumbnailName}", thumbnailName);
            }
            else
            {
                _logger.LogInformation("Thumbnail did not exist: {ThumbnailName}", thumbnailName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting thumbnail: {Message}", ex.Message);
            throw;
        }
    }
}
