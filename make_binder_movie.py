#!/usr/bin/env python3
"""
Protein-Binder Movie Generator
==============================

Generate cinematic protein-binder interaction videos using PyMOL and ffmpeg.

Installation:
    pip install -r requirements-local.txt
    conda install -c conda-forge pymol-open-source

Usage:
    python make_binder_movie.py target.pdb binder.pdb output.mp4
    python make_binder_movie.py --square --fps 60 target.pdb binder.pdb output.mp4

Examples:
    # Generate three square videos for a portfolio
    python make_binder_movie.py --square receptor.pdb peptide1.pdb left.mp4
    python make_binder_movie.py --square receptor.pdb peptide2.pdb middle.mp4
    python make_binder_movie.py --square receptor.pdb peptide3.pdb right.mp4

The script creates a 12-second video (360 frames @ 30fps):
    - Frames 0-119: Binder fades in and translates to binding site
    - Frames 120-239: Complex rotates 360° around Y axis
    - Frames 240-359: Gentle rocking motion (loop-friendly)

Colors:
    - Target: Grey cartoon
    - Binder: Orange-to-purple gradient (colorblind-safe)
    - H-bonds: Pink dashed lines (≤3.5Å)
"""

import argparse
import subprocess
import shutil
import sys
from pathlib import Path
import numpy as np
from typing import Optional, Tuple


def check_dependencies() -> Tuple[str, str]:
    """Check if PyMOL and ffmpeg are available in PATH."""
    # Check for PyMOL
    pymol_cmd = shutil.which("pymol")
    if not pymol_cmd:
        print("Error: PyMOL not found in PATH")
        print("Install with: conda install -c conda-forge pymol-open-source")
        sys.exit(1)
    
    # Check for ffmpeg
    ffmpeg_cmd = shutil.which("ffmpeg")
    if not ffmpeg_cmd:
        print("Error: ffmpeg not found in PATH")
        print("Install with: conda install -c conda-forge ffmpeg")
        sys.exit(1)
    
    return pymol_cmd, ffmpeg_cmd


def create_pymol_script(
    target_path: Path,
    binder_path: Path,
    output_dir: Path,
    total_frames: int = 360,
    square: bool = False
) -> str:
    """Generate PyMOL script for rendering frames."""
    
    # PyMOL script with inline Python
    script = f'''
import os
import sys
from pymol import cmd

# Load structures
cmd.load("{target_path}", "target")
cmd.load("{binder_path}", "binder")

# Basic setup
cmd.bg_color("white")
cmd.set("ray_trace_mode", 3)  # High quality
cmd.set("ray_shadows", "off")
cmd.set("ambient", 0.3)
cmd.set("specular", 0.5)
cmd.set("shininess", 10)
cmd.set("reflect", 0.1)
cmd.set("antialias", 2)
cmd.set("ray_opaque_background", "on")

# Style the target (grey cartoon)
cmd.hide("everything", "target")
cmd.show("cartoon", "target")
cmd.set("cartoon_fancy_helices", 1)
cmd.set("cartoon_highlight_color", "grey50")
cmd.color("grey70", "target")

# Style the binder (orange-purple gradient)
cmd.hide("everything", "binder")
cmd.show("cartoon", "binder")

# Apply gradient coloring to binder (orange to purple)
# Using romaO colorblind-safe gradient
stored.list = []
cmd.iterate("binder and name CA", "stored.list.append(resi)")
residues = sorted(set(int(x) for x in stored.list))

if residues:
    min_resi = min(residues)
    max_resi = max(residues)
    
    for i, resi in enumerate(residues):
        # Gradient from orange (255,140,0) to purple (128,0,128)
        t = i / (len(residues) - 1) if len(residues) > 1 else 0
        r = int(255 * (1-t) + 128 * t)
        g = int(140 * (1-t) + 0 * t)
        b = int(0 * (1-t) + 128 * t)
        color_name = f"grad_{{i}}"
        cmd.set_color(color_name, [r/255.0, g/255.0, b/255.0])
        cmd.color(color_name, f"binder and resi {{resi}}")

# Align binder to target (using CA atoms)
cmd.align("binder and name CA", "target and name CA")

# Calculate center of mass for both
cmd.centerofmass("target", state=1, object="target_com")
cmd.centerofmass("binder", state=1, object="binder_com")

# Get initial binder position
cmd.create("binder_start", "binder", 1, 1)
cmd.translate([0, 0, 50], "binder_start")  # Move far away initially

# Setup view
cmd.zoom("all", buffer=10)
cmd.orient("all")

# Store initial view
cmd.view("v_initial", "store")

# Set viewport size
if {str(square).lower()}:
    cmd.viewport(1080, 1080)
else:
    cmd.viewport(1920, 1080)

# Function to draw H-bonds
def draw_hbonds():
    cmd.delete("hbonds")
    cmd.distance("hbonds", "binder", "target", 3.5, mode=2)
    cmd.hide("labels", "hbonds")
    cmd.set("dash_color", "hotpink", "hbonds")
    cmd.set("dash_gap", 0.3, "hbonds")
    cmd.set("dash_length", 0.2, "hbonds")
    cmd.set("dash_width", 2.0, "hbonds")

# Total frames
total_frames = {total_frames}
fade_frames = 120
rotate_frames = 120
rock_frames = 120

print("Starting render...")

# Phase 1: Fade in and translate (frames 0-119)
for frame in range(fade_frames):
    t = frame / (fade_frames - 1)
    
    # Clear and reset
    cmd.delete("binder_temp")
    cmd.create("binder_temp", "binder_start")
    
    # Interpolate position
    cmd.translate([0, 0, -50 * t], "binder_temp")
    
    # Set transparency (fade in)
    transparency = 1.0 - t
    cmd.set("cartoon_transparency", transparency, "binder_temp")
    
    # Hide original binder, show temp
    cmd.disable("binder")
    cmd.enable("binder_temp")
    
    # Render frame
    cmd.ray(1080, 1080 if {str(square).lower()} else 1080)
    cmd.png(f"{output_dir}/frame_{{frame:04d}}.png")
    
    print(f"Frame {{frame+1}}/{total_frames}", end="\\r")

# Show full binder for remaining phases
cmd.delete("binder_temp")
cmd.delete("binder_start")
cmd.enable("binder")
cmd.set("cartoon_transparency", 0, "binder")

# Draw H-bonds for complex
draw_hbonds()

# Phase 2: Rotate 360° (frames 120-239)
cmd.view("v_initial", "recall")
for frame in range(rotate_frames):
    angle = 360 * frame / rotate_frames
    cmd.rotate("y", 3, "all")  # 3 degrees per frame
    
    cmd.ray(1080, 1080 if {str(square).lower()} else 1080)
    cmd.png(f"{output_dir}/frame_{{frame + fade_frames:04d}}.png")
    
    print(f"Frame {{frame + fade_frames + 1}}/{total_frames}", end="\\r")

# Phase 3: Gentle rocking (frames 240-359)
cmd.view("v_initial", "recall")
for frame in range(rock_frames):
    # Sinusoidal rocking motion
    t = frame / rock_frames
    angle = 15 * np.sin(2 * np.pi * t)  # ±15 degrees
    
    cmd.view("v_initial", "recall")
    cmd.rotate("x", angle, "all")
    
    cmd.ray(1080, 1080 if {str(square).lower()} else 1080)
    cmd.png(f"{output_dir}/frame_{{frame + fade_frames + rotate_frames:04d}}.png")
    
    print(f"Frame {{frame + fade_frames + rotate_frames + 1}}/{total_frames}", end="\\r")

print("\\nRendering complete!")
cmd.quit()
'''
    
    return script


def render_frames(
    target_path: Path,
    binder_path: Path,
    output_dir: Path,
    pymol_cmd: str,
    total_frames: int = 360,
    square: bool = False
) -> None:
    """Render frames using PyMOL."""
    # Create PyMOL script
    script_content = create_pymol_script(
        target_path, binder_path, output_dir, total_frames, square
    )
    
    # Write script to temporary file
    script_path = output_dir / "render_script.pml"
    with open(script_path, "w") as f:
        f.write(script_content)
    
    # Run PyMOL in headless mode
    print("Launching PyMOL...")
    cmd = [pymol_cmd, "-c", "-q", str(script_path)]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error running PyMOL: {result.stderr}")
            sys.exit(1)
    except Exception as e:
        print(f"Error running PyMOL: {e}")
        sys.exit(1)
    
    # Clean up script
    script_path.unlink()


def encode_video(
    frame_dir: Path,
    output_path: Path,
    ffmpeg_cmd: str,
    fps: int = 30,
    square: bool = False
) -> None:
    """Encode frames to MP4 using ffmpeg."""
    print("Encoding video...")
    
    # FFmpeg command for high-quality H.264 encoding
    width, height = (1080, 1080) if square else (1920, 1080)
    
    cmd = [
        ffmpeg_cmd,
        "-y",  # Overwrite output
        "-framerate", str(fps),
        "-i", str(frame_dir / "frame_%04d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "slow",
        "-crf", "18",  # High quality
        "-vf", f"scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2",
        "-movflags", "+faststart",  # Web optimization
        str(output_path)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error encoding video: {result.stderr}")
            sys.exit(1)
        print("Encoding complete!")
    except Exception as e:
        print(f"Error encoding video: {e}")
        sys.exit(1)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Generate protein-binder interaction videos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python make_binder_movie.py receptor.pdb peptide.pdb output.mp4
  python make_binder_movie.py --square --fps 60 1abc.pdb amp.pdb demo.mp4
        """
    )
    
    parser.add_argument("target", type=Path, help="Target protein PDB file")
    parser.add_argument("binder", type=Path, help="Binder/peptide PDB file")
    parser.add_argument("output", type=Path, help="Output MP4 file")
    parser.add_argument(
        "--square",
        action="store_true",
        help="Render square video (1080x1080) instead of widescreen"
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=30,
        help="Frames per second (default: 30)"
    )
    
    args = parser.parse_args()
    
    # Validate inputs
    if not args.target.exists():
        print(f"Error: Target file not found: {args.target}")
        sys.exit(1)
    
    if not args.binder.exists():
        print(f"Error: Binder file not found: {args.binder}")
        sys.exit(1)
    
    # Check dependencies
    pymol_cmd, ffmpeg_cmd = check_dependencies()
    
    # Create temporary directory for frames
    temp_dir = Path("./tmp")
    temp_dir.mkdir(exist_ok=True)
    
    try:
        # Calculate total frames (12 seconds at specified fps)
        total_frames = 12 * args.fps
        
        # Render frames
        render_frames(
            args.target,
            args.binder,
            temp_dir,
            pymol_cmd,
            total_frames,
            args.square
        )
        
        # Encode video
        encode_video(
            temp_dir,
            args.output,
            ffmpeg_cmd,
            args.fps,
            args.square
        )
        
        print(f"Video saved to: {args.output}")
        
    finally:
        # Clean up temporary directory
        if temp_dir.exists():
            print("Cleaning up...")
            shutil.rmtree(temp_dir)
            print("Done!")


if __name__ == "__main__":
    main()