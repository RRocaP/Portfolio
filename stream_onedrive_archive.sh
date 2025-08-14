#!/bin/bash

# Script to transfer OneDrive files as a single compressed archive
# Creates tar.gz stream directly to OCI bucket

set -e

ARCHIVE_NAME="onedrive_backup_$(date +%Y%m%d_%H%M%S)"
TARGET_BUCKET="oci_buck:Onedrive_backup_2025-08-14"

echo "Creating compressed archive stream: ${ARCHIVE_NAME}.tar.gz"
echo "Target: $TARGET_BUCKET"

# Create manifest first
echo "Generating manifest..."
MANIFEST_FILE="/tmp/${ARCHIVE_NAME}_manifest.md"

cat > "$MANIFEST_FILE" << EOF
# OneDrive Backup Archive: $ARCHIVE_NAME

**Created:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Archive Type:** tar.gz compressed stream  
**Source:** OneDrive files  
**Method:** Direct streaming via rclone  

## Archive Contents

EOF

# Add file list to manifest
echo "| File Path | Size (bytes) |" >> "$MANIFEST_FILE"
echo "|-----------|--------------|" >> "$MANIFEST_FILE"

rclone ls od:/ | while read -r size filepath; do
    echo "| $filepath | $size |" >> "$MANIFEST_FILE"
done

echo "">> "$MANIFEST_FILE"
echo "**Total Files:** $(rclone ls od:/ | wc -l | tr -d ' ')" >> "$MANIFEST_FILE"
echo "**Total Size:** $(rclone size od:/ --json | jq -r '.bytes') bytes" >> "$MANIFEST_FILE"

# Upload manifest first
echo "Uploading manifest..."
rclone copy "$MANIFEST_FILE" "$TARGET_BUCKET/" --progress

# Create and stream compressed archive
echo "Creating and streaming compressed archive..."
echo "This will take some time as files are compressed and uploaded..."

# Use rclone mount or direct streaming approach
# Method 1: Create tar stream directly
(
    echo "Creating tar.gz stream from OneDrive..."
    # Create a fifo pipe for the tar stream
    PIPE="/tmp/onedrive_pipe_$$"
    mkfifo "$PIPE"
    
    # Start rclone rcat in background to read from pipe
    rclone rcat "$TARGET_BUCKET/${ARCHIVE_NAME}.tar.gz" --progress < "$PIPE" &
    RCAT_PID=$!
    
    # Stream files through tar and gzip to the pipe
    {
        # For each file in OneDrive, cat it and add to tar
        rclone ls od:/ | while read -r size filepath; do
            echo "Adding: $filepath"
            rclone cat "od:/$filepath" | tar rf - --transform="s,^,$filepath," --mode=644 || true
        done
    } | gzip > "$PIPE"
    
    # Wait for rcat to finish
    wait $RCAT_PID
    
    # Clean up pipe
    rm -f "$PIPE"
    
) 2>&1 | tee "/tmp/${ARCHIVE_NAME}_log.txt"

echo "Archive creation completed!"
echo "Files created in $TARGET_BUCKET:"
echo "  - ${ARCHIVE_NAME}.tar.gz (compressed archive)"
echo "  - ${ARCHIVE_NAME}_manifest.md (file listing and metadata)"

# Cleanup
rm -f "$MANIFEST_FILE"

echo "Process completed successfully!"
