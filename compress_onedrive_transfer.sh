#!/bin/bash

# Simple script to create a compressed archive of OneDrive files
# Downloads to temp, compresses, then uploads as single file

set -e

ARCHIVE_NAME="onedrive_backup_$(date +%Y%m%d_%H%M%S)"
TARGET_BUCKET="oci_buck:Onedrive_backup_2025-08-14"
TEMP_DIR="/tmp/${ARCHIVE_NAME}"

echo "=== OneDrive to Compressed Archive Transfer ==="
echo "Archive name: ${ARCHIVE_NAME}.tar.gz"
echo "Target bucket: $TARGET_BUCKET"
echo ""

# Create temp directory
mkdir -p "$TEMP_DIR"

# Step 1: Download all files from OneDrive
echo "Step 1: Downloading files from OneDrive..."
rclone copy od:/ "$TEMP_DIR/" --progress

# Step 2: Create manifest
echo ""
echo "Step 2: Creating manifest..."
MANIFEST_FILE="$TEMP_DIR/MANIFEST.md"

cat > "$MANIFEST_FILE" << EOF
# OneDrive Backup Archive

**Archive:** ${ARCHIVE_NAME}.tar.gz  
**Created:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Method:** rclone download → tar.gz compression → OCI upload  

## Files Included

EOF

# Add file listing with sizes and checksums
echo "| File Path | Size (bytes) | MD5 Hash |" >> "$MANIFEST_FILE"
echo "|-----------|--------------|----------|" >> "$MANIFEST_FILE"

find "$TEMP_DIR" -type f ! -name "MANIFEST.md" | while read -r filepath; do
    relative_path=${filepath#$TEMP_DIR/}
    size=$(stat -f%z "$filepath" 2>/dev/null || echo "0")
    md5hash=$(md5 -q "$filepath" 2>/dev/null || echo "unavailable")
    echo "| $relative_path | $size | $md5hash |" >> "$MANIFEST_FILE"
done

# Add summary
echo "" >> "$MANIFEST_FILE"
TOTAL_FILES=$(find "$TEMP_DIR" -type f ! -name "MANIFEST.md" | wc -l | tr -d ' ')
TOTAL_SIZE=$(find "$TEMP_DIR" -type f ! -name "MANIFEST.md" -exec stat -f%z {} \; | awk '{sum+=$1} END {print sum}')
echo "**Total Files:** $TOTAL_FILES" >> "$MANIFEST_FILE"
echo "**Total Size:** $TOTAL_SIZE bytes" >> "$MANIFEST_FILE"

# Step 3: Create compressed archive and upload
echo ""
echo "Step 3: Creating compressed archive and uploading..."
echo "This may take several minutes..."

cd "$TEMP_DIR"
tar -czf - . | rclone rcat "$TARGET_BUCKET/${ARCHIVE_NAME}.tar.gz" --progress

# Step 4: Upload manifest separately for easy access
echo ""
echo "Step 4: Uploading manifest separately..."
rclone copy "$MANIFEST_FILE" "$TARGET_BUCKET/" --progress

# Step 5: Cleanup
echo ""
echo "Step 5: Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo ""
echo "=== Transfer Complete! ==="
echo "Created in $TARGET_BUCKET:"
echo "  📦 ${ARCHIVE_NAME}.tar.gz"
echo "  📋 MANIFEST.md"
echo ""
echo "All OneDrive files have been compressed into a single archive."
