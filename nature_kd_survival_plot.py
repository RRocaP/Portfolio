#!/usr/bin/env python3
"""
nature_kd_survival_plot.py

Production-ready script for Nature-style knockdown vs survival analysis.
Generates publication-quality figures with inhibitory Hill fits.

Author: Bioinformatics Figure Engineering Team
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from scipy.optimize import curve_fit
from scipy.stats import pearsonr
import sys
import warnings
warnings.filterwarnings('ignore')

# Set global matplotlib parameters for Nature style
mpl.rcParams.update({
    "figure.facecolor": "white",
    "savefig.facecolor": "white",
    "font.family": "DejaVu Sans",
    "font.size": 7,
    "axes.labelsize": 8,
    "axes.titlesize": 9,
    "xtick.labelsize": 7,
    "ytick.labelsize": 7,
    "legend.fontsize": 6,
    "pdf.fonttype": 42,
    "ps.fonttype": 42,
    "svg.fonttype": "none",
})

def nature_box(ax, spine_width=0.5):
    """Apply Nature journal styling to axes."""
    ax.set_facecolor("white")
    for side in ("left", "right", "top", "bottom"):
        ax.spines[side].set_visible(True)
        ax.spines[side].set_linewidth(spine_width)
        ax.spines[side].set_color("black")
    ax.tick_params(direction="in", length=3, width=0.5, colors="black", 
                   which='both', top=True, right=True)
    ax.grid(False)

def inhibitory_hill(x, ic50, hill_coeff, top=100, bottom=0):
    """
    Four-parameter inhibitory Hill equation.
    
    Parameters:
    -----------
    x : array-like
        KD percentage (0-100)
    ic50 : float
        Half-maximal inhibitory concentration
    hill_coeff : float
        Hill coefficient (steepness)
    top : float
        Maximum response (typically 100%)
    bottom : float
        Minimum response (typically 0%)
    
    Returns:
    --------
    array-like
        Predicted survival percentage
    """
    with np.errstate(over='ignore', invalid='ignore'):
        return bottom + (top - bottom) / (1 + (x / ic50) ** hill_coeff)

def fit_hill_curve(kd_vals, survival_vals, hairpin_name):
    """
    Fit inhibitory Hill curve to KD-survival data.
    
    Parameters:
    -----------
    kd_vals : array-like
        Knockdown percentages
    survival_vals : array-like
        Survival percentages
    hairpin_name : str
        Hairpin identifier for error reporting
    
    Returns:
    --------
    tuple
        (popt, r_squared) or (None, None) if fit fails
    """
    try:
        # Remove NaN values
        mask = ~(np.isnan(kd_vals) | np.isnan(survival_vals))
        kd_clean = kd_vals[mask]
        surv_clean = survival_vals[mask]
        
        if len(kd_clean) < 4:
            print(f"  Warning: {hairpin_name} has <4 valid points, skipping fit")
            return None, None
        
        # Initial parameter guesses
        ic50_guess = np.median(kd_clean[kd_clean > 0]) if any(kd_clean > 0) else 50
        hill_guess = -1.0
        top_guess = np.max(surv_clean)
        bottom_guess = np.min(surv_clean)
        
        # Fit with bounds
        bounds = ([0.1, -10, 0, -20], [100, -0.1, 120, 100])
        p0 = [ic50_guess, hill_guess, top_guess, bottom_guess]
        
        popt, _ = curve_fit(inhibitory_hill, kd_clean, surv_clean, 
                           p0=p0, bounds=bounds, maxfev=5000)
        
        # Calculate R-squared
        y_pred = inhibitory_hill(kd_clean, *popt)
        ss_res = np.sum((surv_clean - y_pred) ** 2)
        ss_tot = np.sum((surv_clean - np.mean(surv_clean)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        return popt, r_squared
        
    except Exception as e:
        print(f"  Warning: Could not fit {hairpin_name}: {str(e)}")
        return None, None

def calculate_survival_death(df):
    """
    Calculate survival and death percentages from luminescence data.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input data with required columns
    
    Returns:
    --------
    pd.DataFrame
        Data with added survival_pct and death_pct columns
    """
    df = df.copy()
    
    # Calculate survival percentage
    # %survival = 100 × (lum - blank) / (untreated - blank)
    denominator = df['untreated'] - df['blank']
    denominator = denominator.replace(0, np.nan)  # Avoid division by zero
    
    df['survival_pct'] = 100 * (df['lum'] - df['blank']) / denominator
    
    # Calculate death percentage
    df['death_pct'] = 100 - df['survival_pct']
    
    # Clip values to reasonable ranges
    df['survival_pct'] = df['survival_pct'].clip(0, 150)
    df['death_pct'] = df['death_pct'].clip(-50, 100)
    
    return df

def load_and_validate_data(filepath):
    """
    Load and validate CSV data.
    
    Parameters:
    -----------
    filepath : str
        Path to input CSV file
    
    Returns:
    --------
    pd.DataFrame
        Validated dataframe
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        print(f"Error loading file: {e}")
        sys.exit(1)
    
    # Check required columns
    required_cols = ['well_id', 'hairpin', 'kd_percent', 'lum', 'blank', 'untreated']
    missing_cols = [col for col in required_cols if col not in df.columns]
    
    if missing_cols:
        print(f"Error: Missing required columns: {missing_cols}")
        sys.exit(1)
    
    # Validate numeric columns
    numeric_cols = ['kd_percent', 'lum', 'blank', 'untreated']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Remove rows with NaN in critical columns
    n_before = len(df)
    df = df.dropna(subset=['hairpin', 'kd_percent', 'lum'])
    n_after = len(df)
    
    if n_after < n_before:
        print(f"  Removed {n_before - n_after} rows with missing critical values")
    
    return df

def get_hairpin_colors(hairpins):
    """
    Generate consistent colors for hairpins using vikO-inspired palette.
    
    Parameters:
    -----------
    hairpins : list
        List of unique hairpin names
    
    Returns:
    --------
    dict
        Mapping of hairpin names to colors
    """
    # vikO-inspired colors
    base_colors = [
        '#6B0E71',  # Deep purple
        '#2E7BB6',  # Blue
        '#5AAE61',  # Green-teal
        '#FC9C54',  # Orange
        '#D73027',  # Red
        '#4575B4',  # Dark blue
        '#91BFDB',  # Light blue
        '#FEE090',  # Yellow
    ]
    
    color_map = {}
    for i, hairpin in enumerate(hairpins):
        if 'scramble' in hairpin.lower() or 'scr' in hairpin.lower():
            color_map[hairpin] = '#808080'  # Gray for controls
        else:
            color_map[hairpin] = base_colors[i % len(base_colors)]
    
    return color_map

def create_kd_survival_plot(df, output_prefix='shRNA_knockdown'):
    """
    Create Nature-style KD vs survival plot with Hill fits.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Processed data with survival calculations
    output_prefix : str
        Prefix for output files
    
    Returns:
    --------
    matplotlib.figure.Figure
        The created figure
    """
    # Calculate survival and death percentages
    df = calculate_survival_death(df)
    
    # Get unique hairpins
    hairpins = sorted(df['hairpin'].unique())
    colors = get_hairpin_colors(hairpins)
    
    # Determine layout
    n_hairpins = len(hairpins)
    n_cols = min(4, n_hairpins)
    n_rows = (n_hairpins + n_cols - 1) // n_cols
    
    # Calculate figure size (Nature single column = 89mm = 3.5 inches)
    fig_width = 89 / 25.4 if n_cols <= 2 else 183 / 25.4  # mm to inches
    fig_height = 2.0 * n_rows
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(fig_width, fig_height))
    
    # Ensure axes is always 2D array
    if n_rows == 1 and n_cols == 1:
        axes = np.array([[axes]])
    elif n_rows == 1:
        axes = axes.reshape(1, -1)
    elif n_cols == 1:
        axes = axes.reshape(-1, 1)
    
    # Plot each hairpin
    for idx, hairpin in enumerate(hairpins):
        row = idx // n_cols
        col = idx % n_cols
        ax = axes[row, col]
        
        # Get data for this hairpin
        hairpin_data = df[df['hairpin'] == hairpin].copy()
        
        if hairpin_data.empty:
            ax.set_visible(False)
            continue
        
        # Extract values
        kd_vals = hairpin_data['kd_percent'].values
        survival_vals = hairpin_data['survival_pct'].values
        
        # Plot individual points
        ax.scatter(kd_vals, survival_vals, 
                  color=colors[hairpin], 
                  s=20, 
                  alpha=0.6, 
                  edgecolors='black', 
                  linewidth=0.5,
                  zorder=3)
        
        # Fit and plot Hill curve
        popt, r_squared = fit_hill_curve(kd_vals, survival_vals, hairpin)
        
        if popt is not None:
            # Generate smooth curve
            x_fit = np.linspace(0, 100, 200)
            y_fit = inhibitory_hill(x_fit, *popt)
            
            ax.plot(x_fit, y_fit, 
                   color=colors[hairpin], 
                   linewidth=1.5, 
                   alpha=0.8,
                   zorder=2)
            
            # Add IC50 annotation
            ic50_text = f"IC₅₀={popt[0]:.1f}%\nR²={r_squared:.3f}"
            ax.text(0.95, 0.95, ic50_text,
                   transform=ax.transAxes,
                   fontsize=6,
                   verticalalignment='top',
                   horizontalalignment='right',
                   bbox=dict(boxstyle='round,pad=0.3', 
                            facecolor='white', 
                            edgecolor='none',
                            alpha=0.8))
        
        # Styling
        ax.set_xlim(-5, 105)
        ax.set_ylim(-5, 105)
        ax.set_xlabel('Knockdown (%)', fontsize=8)
        ax.set_ylabel('Survival (%)', fontsize=8)
        ax.set_title(hairpin, fontsize=9, fontweight='bold', pad=5)
        
        # Add reference lines
        ax.axhline(y=50, color='gray', linewidth=0.5, linestyle='--', alpha=0.3)
        ax.axvline(x=50, color='gray', linewidth=0.5, linestyle='--', alpha=0.3)
        
        # Add panel letter
        panel_letter = chr(97 + idx)  # a, b, c, d...
        ax.text(-0.15, 1.05, panel_letter, 
               transform=ax.transAxes,
               fontsize=8, 
               fontweight='bold')
        
        # Apply Nature box style
        nature_box(ax)
    
    # Hide unused subplots
    for idx in range(n_hairpins, n_rows * n_cols):
        row = idx // n_cols
        col = idx % n_cols
        axes[row, col].set_visible(False)
    
    # Overall title
    fig.suptitle('shRNA Knockdown Efficacy vs Cell Survival', 
                fontsize=10, 
                fontweight='bold',
                y=1.02)
    
    # Adjust layout
    plt.tight_layout(rect=[0, 0, 1, 0.98])
    
    # Save figures
    for fmt in ['pdf', 'svg']:
        filename = f"{output_prefix}_Nature.{fmt}"
        fig.savefig(filename, 
                   bbox_inches='tight', 
                   dpi=300,
                   transparent=False,
                   facecolor='white')
        print(f"  Saved: {filename}")
    
    return fig

def main():
    """Main execution function."""
    print("=" * 60)
    print("Nature-Style KD vs Survival Analysis")
    print("=" * 60)
    
    # Default input file (can be modified or made command-line arg)
    input_file = 'knockdown_survival_data.csv'
    
    # Check if custom file provided
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    
    print(f"\nLoading data from: {input_file}")
    
    # Load and validate data
    df = load_and_validate_data(input_file)
    print(f"  Loaded {len(df)} rows with {df['hairpin'].nunique()} unique hairpins")
    
    # Create plot
    print("\nGenerating Nature-style plot...")
    fig = create_kd_survival_plot(df)
    
    # Display summary statistics
    print("\nSummary Statistics:")
    print("-" * 40)
    
    df_proc = calculate_survival_death(df)
    for hairpin in sorted(df['hairpin'].unique()):
        hairpin_data = df_proc[df_proc['hairpin'] == hairpin]
        mean_kd = hairpin_data['kd_percent'].mean()
        mean_survival = hairpin_data['survival_pct'].mean()
        n_points = len(hairpin_data)
        
        print(f"  {hairpin:15} n={n_points:3} KD={mean_kd:5.1f}% Survival={mean_survival:5.1f}%")
    
    print("\n✅ Analysis complete!")
    print("=" * 60)
    
    # Show plot if running interactively
    try:
        plt.show()
    except:
        pass

if __name__ == "__main__":
    main()