# Script to generate thumbnails for existing videos in Azure Blob Storage
# This script downloads each video, extracts a frame using FFmpeg, and uploads the thumbnail

param(
    [string]$AccountName = "davendestaticimages",
    [string]$SourceContainer = "davendesiteimages",
    [string]$ThumbnailContainer = "davendesiteimages-thumbnails",
    [int]$ThumbnailWidth = 250,
    [int]$ThumbnailHeight = 150,
    [int]$CaptureSecond = 1
)

# Check if FFmpeg is installed
$ffmpegPath = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpegPath) {
    Write-Host "FFmpeg is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install FFmpeg from https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "Or use: winget install ffmpeg" -ForegroundColor Yellow
    exit 1
}

# Check if Azure CLI is installed
$azPath = Get-Command az -ErrorAction SilentlyContinue
if (-not $azPath) {
    Write-Host "Azure CLI is not installed." -ForegroundColor Red
    Write-Host "Please install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Login check
Write-Host "Checking Azure login status..." -ForegroundColor Cyan
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    az login
}

Write-Host "Using Azure account: $($account.name)" -ForegroundColor Green

# Create temp directory
$tempDir = Join-Path $env:TEMP "video-thumbnails-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Write-Host "Temp directory: $tempDir" -ForegroundColor Gray

# Video extensions to process
$videoExtensions = @(".mp4", ".mov", ".avi", ".wmv", ".mkv", ".webm")

# Get list of blobs in source container
Write-Host "`nListing videos in container '$SourceContainer'..." -ForegroundColor Cyan
$blobs = az storage blob list --account-name $AccountName --container-name $SourceContainer --auth-mode login --output json | ConvertFrom-Json

# Filter to video files only
$videos = $blobs | Where-Object { 
    $ext = [System.IO.Path]::GetExtension($_.name).ToLower()
    $videoExtensions -contains $ext
}

Write-Host "Found $($videos.Count) video files to process" -ForegroundColor Green

if ($videos.Count -eq 0) {
    Write-Host "No videos found. Exiting." -ForegroundColor Yellow
    exit 0
}

# Process each video
$processed = 0
$failed = 0

foreach ($video in $videos) {
    $videoName = $video.name
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($videoName)
    $thumbnailName = "$baseName.jpg"
    
    Write-Host "`n[$($processed + $failed + 1)/$($videos.Count)] Processing: $videoName" -ForegroundColor Cyan
    
    # Check if thumbnail already exists
    $existingThumb = az storage blob exists --account-name $AccountName --container-name $ThumbnailContainer --name $thumbnailName --auth-mode login --output json | ConvertFrom-Json
    if ($existingThumb.exists) {
        Write-Host "  Thumbnail already exists, skipping..." -ForegroundColor Yellow
        $processed++
        continue
    }
    
    try {
        # Download video
        $localVideoPath = Join-Path $tempDir $videoName
        Write-Host "  Downloading video..." -ForegroundColor Gray
        az storage blob download --account-name $AccountName --container-name $SourceContainer --name $videoName --file $localVideoPath --auth-mode login --output none
    
    # Generate thumbnail with FFmpeg
        $localThumbnailPath = Join-Path $tempDir $thumbnailName
        Write-Host "  Generating thumbnail..." -ForegroundColor Gray
        
        $ffmpegArgs = @(
            "-i", $localVideoPath,
 "-ss", $CaptureSecond,
       "-vframes", "1",
     "-vf", "scale=${ThumbnailWidth}:${ThumbnailHeight}:force_original_aspect_ratio=decrease,pad=${ThumbnailWidth}:${ThumbnailHeight}:(ow-iw)/2:(oh-ih)/2",
            "-y",
       $localThumbnailPath
        )
        
   $ffmpegResult = & ffmpeg @ffmpegArgs 2>&1
        
     if (Test-Path $localThumbnailPath) {
  # Upload thumbnail
  Write-Host "  Uploading thumbnail..." -ForegroundColor Gray
    az storage blob upload --account-name $AccountName --container-name $ThumbnailContainer --name $thumbnailName --file $localThumbnailPath --auth-mode login --overwrite --output none
            
     Write-Host "  SUCCESS: $thumbnailName" -ForegroundColor Green
       $processed++
        } else {
            Write-Host "  FAILED: FFmpeg did not create thumbnail" -ForegroundColor Red
            $failed++
        }
     
        # Clean up local files
        if (Test-Path $localVideoPath) { Remove-Item $localVideoPath -Force }
        if (Test-Path $localThumbnailPath) { Remove-Item $localThumbnailPath -Force }
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total videos: $($videos.Count)" -ForegroundColor White
Write-Host "Processed successfully: $processed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "========================================" -ForegroundColor Cyan
