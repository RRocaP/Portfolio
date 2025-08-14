#!/bin/bash

# Script to create a compressed archive from OneDrive files during transfer
# All files will be compressed into a single tar.gz with manifest

set -e

ARCHIVE_NAME="onedrive_backup_$(date +%Y%m%d_%H%M%S)"
TARGET_BUCKET="oci_buck:Onedrive_backup_2025-08-14"
MANIFEST_FILE="/tmp/${ARCHIVE_NAME}_manifest.md"
TEMP_DIR="/tmp/${ARCHIVE_NAME}_temp"

echo "Creating compressed archive from OneDrive: $ARCHIVE_NAME"
echo "Target bucket: $TARGET_BUCKET"

# Create temporary directory
mkdir -p "$TEMP_DIR"

# Create manifest header
cat > "$MANIFEST_FILE" << EOF
# OneDrive Backup Archive Manifest: $ARCHIVE_NAME

**Created:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Archive Type:** tar.gz compressed  
**Source:** OneDrive files via rclone transfer  
**Total Files:** $(rclone ls od:/ --max-depth 1 | wc -l | tr -d ' ')  
**Total Size:** $(rclone size od:/ --json | jq -r '.bytes') bytes

## Files Included

| File Path | Size (bytes) | Modified Date | MD5 Hash |
|-----------|--------------|---------------|----------|
EOF

echo "Generating manifest and downloading files from OneDrive..."

# Download all files from OneDrive to temp directory while creating manifest
rclone copy od:/ "$TEMP_DIR/" --progress -v

# Generate manifest entries for all downloaded files
find "$TEMP_DIR" -type f | while read -r filepath; do
    relative_path=${filepath#$TEMP_DIR/}
    size=$(stat -f%z "$filepath" 2>/dev/null || echo "0")
    modtime=$(stat -f%Sm -t "%Y-%m-%d %H:%M:%S" "$filepath" 2>/dev/null || echo "unknown")
    md5hash=$(md5 -q "$filepath" 2>/dev/null || echo "unavailable")
    
    echo "| $relative_path | $size | $modtime | $md5hash |" >> "$MANIFEST_FILE"
done

# Add manifest to temp directory
cp "$MANIFEST_FILE" "$TEMP_DIR/MANIFEST.md"

echo "Creating compressed archive..."

# Create compressed archive and upload directly
cd "$TEMP_DIR"
tar -czf - . | rclone rcat "$TARGET_BUCKET/${ARCHIVE_NAME}.tar.gz" --progress

echo "Archive created successfully: ${ARCHIVE_NAME}.tar.gz"
echo "Manifest also uploaded as: ${ARCHIVE_NAME}_manifest.md"

# Upload just the manifest separately for easy access
rclone copy "$MANIFEST_FILE" "$TARGET_BUCKET/" --progress

# Cleanup
rm -rf "$TEMP_DIR"
rm -f "$MANIFEST_FILE"

echo "Cleanup completed."
echo "Archive and manifest uploaded to: $TARGET_BUCKET"
