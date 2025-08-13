#!/bin/bash
# Video encoding utilities for web optimization
# Usage: ./encode-videos.sh input-video.mp4

if [ $# -eq 0 ]; then
    echo "Usage: $0 <input-video.mp4>"
    echo "This script generates optimized MP4, WebM, and poster frames for web use"
    exit 1
fi

INPUT="$1"
BASENAME=$(basename "$INPUT" .mp4)

echo "🎬 Encoding videos for web optimization..."

# Create output directory
mkdir -p public/Portfolio/media

# Generate 16:9 versions (1280x720)
echo "📺 Creating 16:9 versions..."
ffmpeg -i "$INPUT" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p" \
  -c:v libx264 -profile:v high -crf 19 -preset slow -movflags +faststart -an \
  "public/Portfolio/media/${BASENAME}-16x9.mp4"

ffmpeg -i "$INPUT" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -crf 28 -b:v 0 -row-mt 1 -an \
  "public/Portfolio/media/${BASENAME}-16x9.webm"

# Generate 1:1 versions (720x720)
echo "📱 Creating 1:1 square versions..."
ffmpeg -i "$INPUT" -vf "scale=720:720:force_original_aspect_ratio=increase,crop=720:720,format=yuv420p" \
  -c:v libx264 -profile:v high -crf 19 -preset slow -movflags +faststart -an \
  "public/Portfolio/media/${BASENAME}-1x1.mp4"

ffmpeg -i "$INPUT" -vf "scale=720:720:force_original_aspect_ratio=increase,crop=720:720" \
  -c:v libvpx-vp9 -crf 28 -b:v 0 -row-mt 1 -an \
  "public/Portfolio/media/${BASENAME}-1x1.webm"

# Generate 21:9 banner versions (1280x549)
echo "🖼️ Creating 21:9 banner versions..."
ffmpeg -i "$INPUT" -vf "scale=1280:549:force_original_aspect_ratio=decrease,pad=1280:549:(ow-iw)/2:(oh-ih)/2,format=yuv420p" \
  -c:v libx264 -profile:v high -crf 19 -preset slow -movflags +faststart -an \
  "public/Portfolio/media/${BASENAME}-21x9.mp4"

ffmpeg -i "$INPUT" -vf "scale=1280:549:force_original_aspect_ratio=decrease,pad=1280:549:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -crf 28 -b:v 0 -row-mt 1 -an \
  "public/Portfolio/media/${BASENAME}-21x9.webm"

# Generate 9:16 mobile versions (720x1280)
echo "📱 Creating 9:16 mobile versions..."
ffmpeg -i "$INPUT" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,format=yuv420p" \
  -c:v libx264 -profile:v high -crf 19 -preset slow -movflags +faststart -an \
  "public/Portfolio/media/${BASENAME}-9x16.mp4"

ffmpeg -i "$INPUT" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -crf 28 -b:v 0 -row-mt 1 -an \
  "public/Portfolio/media/${BASENAME}-9x16.webm"

# Generate poster frames (at 1 second mark)
echo "🖼️ Creating poster frames..."
ffmpeg -ss 00:00:01 -i "public/Portfolio/media/${BASENAME}-16x9.mp4" -frames:v 1 -q:v 2 \
  "public/Portfolio/media/${BASENAME}-16x9-poster.jpg"

ffmpeg -ss 00:00:01 -i "public/Portfolio/media/${BASENAME}-1x1.mp4" -frames:v 1 -q:v 2 \
  "public/Portfolio/media/${BASENAME}-1x1-poster.jpg"

ffmpeg -ss 00:00:01 -i "public/Portfolio/media/${BASENAME}-21x9.mp4" -frames:v 1 -q:v 2 \
  "public/Portfolio/media/${BASENAME}-21x9-poster.jpg"

ffmpeg -ss 00:00:01 -i "public/Portfolio/media/${BASENAME}-9x16.mp4" -frames:v 1 -q:v 2 \
  "public/Portfolio/media/${BASENAME}-9x16-poster.jpg"

echo "✅ Video encoding complete!"
echo "📁 Files generated in public/Portfolio/media/:"
ls -la "public/Portfolio/media/${BASENAME}"*

echo ""
echo "📋 Usage in Astro components:"
echo "<SmartVideo"
echo "  mp4Src=\"/Portfolio/media/${BASENAME}-16x9.mp4\""
echo "  webmSrc=\"/Portfolio/media/${BASENAME}-16x9.webm\""
echo "  poster=\"/Portfolio/media/${BASENAME}-16x9-poster.jpg\""
echo "  aspect=\"16/9\""
echo "/>"
