#!/bin/bash

# Image Optimization Script for Portfolio
# Converts images to modern formats (WebP, AVIF) for better performance

set -e

echo "🖼️ Starting image optimization..."

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        echo "  On macOS: brew install $1"
        echo "  On Ubuntu: sudo apt-get install $1"
        exit 1
    fi
}

# Check for required tools
check_tool "cwebp"
check_tool "avifenc"

# Create optimized directory if it doesn't exist
mkdir -p public/images/optimized

# Function to optimize a single image
optimize_image() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    local output_dir="public/images/optimized"
    
    echo "Processing: $filename"
    
    # Generate WebP version (quality 85 for good balance)
    if [ ! -f "$output_dir/${name}.webp" ]; then
        cwebp -q 85 "$input" -o "$output_dir/${name}.webp" 2>/dev/null
        echo "  ✅ Created ${name}.webp"
    else
        echo "  ⏭️  ${name}.webp already exists"
    fi
    
    # Generate AVIF version (quality 80 for smaller size)
    if [ ! -f "$output_dir/${name}.avif" ]; then
        avifenc --min 0 --max 63 -a end-usage=q -a cq-level=23 "$input" "$output_dir/${name}.avif" 2>/dev/null
        echo "  ✅ Created ${name}.avif"
    else
        echo "  ⏭️  ${name}.avif already exists"
    fi
}

# Find and optimize all images
echo "Finding images to optimize..."

# Process PNG images
for img in public/**/*.png public/*.png; do
    [ -e "$img" ] || continue
    optimize_image "$img"
done

# Process JPEG images
for img in public/**/*.jpg public/*.jpg public/**/*.jpeg public/*.jpeg; do
    [ -e "$img" ] || continue
    optimize_image "$img"
done

# Calculate savings
echo ""
echo "📊 Optimization Summary:"
echo "========================"

original_size=$(find public -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs du -ch 2>/dev/null | grep total | awk '{print $1}')
webp_size=$(find public/images/optimized -name "*.webp" | xargs du -ch 2>/dev/null | grep total | awk '{print $1}')
avif_size=$(find public/images/optimized -name "*.avif" | xargs du -ch 2>/dev/null | grep total | awk '{print $1}')

echo "Original size: ${original_size:-0}"
echo "WebP size: ${webp_size:-0}"
echo "AVIF size: ${avif_size:-0}"

echo ""
echo "✅ Image optimization complete!"
echo ""
echo "To use optimized images, update your HTML/components with:"
echo '<picture>'
echo '  <source srcset="/images/optimized/image.avif" type="image/avif">'
echo '  <source srcset="/images/optimized/image.webp" type="image/webp">'
echo '  <img src="/original-image.jpg" alt="Description">'
echo '</picture>'