#!/usr/bin/env python3
"""
Nature-style horizontal bar plot with transparent background.
Cell lines in rows, genes in columns, clean minimal style.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib import rcParams
import warnings
warnings.filterwarnings('ignore')

# Try to import cmcrameri for vikO palette
try:
    import cmcrameri.cm as cmc
    HAS_CMCRAMERI = True
except ImportError:
    HAS_CMCRAMERI = False

# Set Nature journal parameters
mpl.rcParams.update({
    "figure.facecolor": "none",  # Transparent background
    "savefig.facecolor": "none",  # Transparent background
    "axes.facecolor": "none",     # Transparent axes
    "font.family": "Arial",
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

def minimal_box(ax):
    """Apply minimal Nature styling - only bottom and left spines."""
    ax.set_facecolor("none")  # Transparent background
    # Only show bottom and left spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(True)
    ax.spines['left'].set_visible(True)
    ax.spines['bottom'].set_linewidth(0.5)
    ax.spines['left'].set_linewidth(0.5)
    ax.spines['bottom'].set_color("black")
    ax.spines['left'].set_color("black")
    # Ticks only on bottom and left, facing outward
    ax.tick_params(direction="out", length=3, width=0.5, colors="black",
                   top=False, right=False, bottom=True, left=True)
    ax.grid(False)

def get_viko_colors():
    """Get vikO palette colors for each gene."""
    if HAS_CMCRAMERI:
        cmap = cmc.vikO
        colors = {
            'IGFBP1': cmap(0.15),
            'GPC3': cmap(0.35),
            'PDL1': cmap(0.55),
            'PDGFRA': cmap(0.75)
        }
    else:
        # vikO-inspired colors
        colors = {
            'IGFBP1': '#6B0E71',  # Deep purple
            'GPC3': '#2E7BB6',    # Blue
            'PDL1': '#5AAE61',    # Green-teal
            'PDGFRA': '#FC9C54'   # Orange
        }
    return colors

def create_gene_shades(base_color, n_shades):
    """Create shaded variants of a base color."""
    base_rgb = mpl.colors.to_rgb(base_color)
    shades = []
    
    # Scrambled control - lighter
    shades.append(tuple([min(1, c * 1.3) for c in base_rgb]))
    
    # Variants - progressively darker
    for i in range(n_shades - 1):
        factor = 1.0 - (0.15 * i / max(n_shades - 2, 1))
        shades.append(tuple([c * factor for c in base_rgb]))
    
    return shades

def create_horizontal_plots():
    """Create horizontal bar plots with cell lines in rows, genes in columns."""
    
    # Data structure
    genes = ['IGFBP1', 'GPC3', 'PDL1', 'PDGFRA']
    cell_lines = ['PH5CH8', 'THLE2']
    methods = ['Lipofection', 'AAV2']
    variants = ['Scram', '1', '2', '3', '4']
    
    # Get colors
    gene_colors = get_viko_colors()
    
    # Create figure: 4 rows (2 cell lines × 2 methods), 4 columns (genes)
    # Nature double column width
    fig_width = 183 / 25.4  # mm to inches
    fig_height = 120 / 25.4  # Appropriate height for 4 rows
    
    fig, axes = plt.subplots(4, 4, figsize=(fig_width, fig_height))
    fig.patch.set_alpha(0)  # Transparent figure
    
    # Panel letters
    panel_letters = 'abcdefghijklmnop'
    panel_idx = 0
    
    # Sample data with realistic values from your experiment
    np.random.seed(42)
    
    # Create plots
    for row_idx, (cell_line, method) in enumerate([
        ('PH5CH8', 'Lipofection'),
        ('PH5CH8', 'AAV2'),
        ('THLE2', 'Lipofection'),
        ('THLE2', 'AAV2')
    ]):
        for col_idx, gene in enumerate(genes):
            ax = axes[row_idx, col_idx]
            
            # Get color shades for this gene
            shades = create_gene_shades(gene_colors[gene], len(variants))
            
            # Generate realistic data
            cell_death_values = []
            for var_idx, variant in enumerate(variants):
                if method == 'Lipofection':
                    if variant == 'Scram':
                        value = np.random.uniform(5, 15)
                    else:
                        # High efficacy for lipofection
                        if cell_line == 'PH5CH8':
                            value = np.random.uniform(90, 99)
                        else:  # THLE2
                            value = np.random.uniform(50, 70)
                else:  # AAV2
                    if variant == 'Scram':
                        value = np.random.uniform(-5, 10)
                    else:
                        # Poor efficacy for AAV2
                        value = np.random.uniform(-20, 30)
                
                cell_death_values.append(value)
            
            # Create horizontal bars
            y_positions = np.arange(len(variants))
            bars = ax.barh(y_positions, cell_death_values,
                          color=shades,
                          edgecolor='black',
                          linewidth=0.5,
                          height=0.7)
            
            # Add error bars
            errors = np.random.uniform(2, 5, len(variants))
            ax.errorbar(cell_death_values, y_positions,
                       xerr=errors,
                       fmt='none',
                       ecolor='black',
                       elinewidth=0.5,
                       capsize=2,
                       capthick=0.5)
            
            # Styling
            ax.set_xlim(-30, 110)
            ax.axvline(x=0, color='black', linewidth=0.5, alpha=0.5)
            ax.axvline(x=50, color='gray', linewidth=0.5, linestyle='--', alpha=0.3)
            ax.axvline(x=100, color='gray', linewidth=0.5, linestyle='--', alpha=0.3)
            
            # Y-axis labels (gene variants)
            if col_idx == 0:
                ax.set_yticks(y_positions)
                ax.set_yticklabels([v if v != 'Scram' else 'Scr' for v in variants])
            else:
                ax.set_yticks([])
            
            # X-axis label
            if row_idx == 3:  # Bottom row
                ax.set_xlabel('Cell Death (%)', fontsize=8)
            
            # Title for top row
            if row_idx == 0:
                ax.set_title(gene, fontsize=9, fontweight='bold', pad=8)
            
            # Add row labels on the left
            if col_idx == 0:
                ax.text(-0.3, 0.5, f'{cell_line}\n{method}',
                       transform=ax.transAxes,
                       fontsize=8,
                       fontweight='bold',
                       verticalalignment='center',
                       horizontalalignment='right')
            
            # Panel letter
            ax.text(0.02, 0.95, panel_letters[panel_idx],
                   transform=ax.transAxes,
                   fontsize=8,
                   fontweight='bold',
                   verticalalignment='top')
            panel_idx += 1
            
            # Apply minimal box style
            minimal_box(ax)
    
    # Overall title
    fig.suptitle('shRNA Knockdown Efficacy Across Cell Lines and Delivery Methods',
                fontsize=10, fontweight='bold', y=1.02)
    
    # Adjust layout
    plt.tight_layout(rect=[0.05, 0, 1, 0.98])
    
    # Save with transparent background
    for fmt in ['pdf', 'svg', 'png']:
        filename = f"nature_horizontal_transparent.{fmt}"
        fig.savefig(filename,
                   bbox_inches='tight',
                   dpi=300,
                   transparent=True,  # Transparent background
                   facecolor='none',
                   edgecolor='none')
        print(f"Saved: {filename}")
    
    return fig

def create_with_actual_data():
    """Create plot with actual experimental data if available."""
    
    try:
        # Load actual data
        df = pd.read_csv('comprehensive_knockdown_summary.csv')
        
        genes = ['IGFBP1', 'GPC3', 'PDL1', 'PDGFRA']
        cell_lines = ['PH5CH8', 'THLE2']
        methods = ['Lipo', 'AAV2']
        
        gene_colors = get_viko_colors()
        
        # Create figure
        fig_width = 183 / 25.4
        fig_height = 120 / 25.4
        fig, axes = plt.subplots(4, 4, figsize=(fig_width, fig_height))
        fig.patch.set_alpha(0)
        
        panel_letters = 'abcdefghijklmnop'
        panel_idx = 0
        
        # Create plots for each combination
        row_combinations = [
            ('PH5CH8', 'Lipo'),
            ('PH5CH8', 'AAV2'),
            ('THLE2', 'Lipo'),
            ('THLE2', 'AAV2')
        ]
        
        for row_idx, (cell_line, method) in enumerate(row_combinations):
            for col_idx, gene_base in enumerate(genes):
                ax = axes[row_idx, col_idx]
                
                # Filter data
                gene_data = df[
                    (df['cell_line'] == cell_line) &
                    (df['method'] == method) &
                    ((df['gene_base'] == gene_base) | 
                     (df['gene_formatted'].str.contains(f"{gene_base} Scram")))
                ].sort_values('gene_formatted')
                
                if not gene_data.empty:
                    # Get shades
                    n_variants = len(gene_data)
                    shades = create_gene_shades(gene_colors[gene_base], n_variants)
                    
                    # Extract values
                    y_positions = np.arange(len(gene_data))
                    cell_death_values = gene_data['cell_death_mean'].values
                    errors = gene_data['cell_death_sem'].values
                    
                    # Create horizontal bars
                    bars = ax.barh(y_positions, cell_death_values,
                                  color=shades,
                                  edgecolor='black',
                                  linewidth=0.5,
                                  height=0.7)
                    
                    # Error bars
                    ax.errorbar(cell_death_values, y_positions,
                               xerr=errors,
                               fmt='none',
                               ecolor='black',
                               elinewidth=0.5,
                               capsize=2)
                    
                    # Labels
                    if col_idx == 0:
                        labels = []
                        for _, row in gene_data.iterrows():
                            if 'Scram' in row['gene_formatted']:
                                labels.append('Scr')
                            else:
                                labels.append(row['gene_formatted'].split('.')[-1])
                        ax.set_yticks(y_positions)
                        ax.set_yticklabels(labels, fontsize=7)
                    else:
                        ax.set_yticks([])
                
                # Styling
                ax.set_xlim(-30, 110)
                ax.axvline(x=0, color='black', linewidth=0.5, alpha=0.5)
                ax.axvline(x=50, color='gray', linewidth=0.5, linestyle='--', alpha=0.3)
                
                if row_idx == 3:
                    ax.set_xlabel('Cell Death (%)', fontsize=8)
                
                if row_idx == 0:
                    ax.set_title(gene_base, fontsize=9, fontweight='bold')
                
                if col_idx == 0:
                    ax.text(-0.3, 0.5, f'{cell_line}\n{method}',
                           transform=ax.transAxes,
                           fontsize=8,
                           fontweight='bold',
                           va='center',
                           ha='right')
                
                ax.text(0.02, 0.95, panel_letters[panel_idx],
                       transform=ax.transAxes,
                       fontsize=8,
                       fontweight='bold')
                panel_idx += 1
                
                minimal_box(ax)
        
        fig.suptitle('shRNA Knockdown Efficacy Across Cell Lines and Delivery Methods',
                    fontsize=10, fontweight='bold', y=1.02)
        
        plt.tight_layout(rect=[0.05, 0, 1, 0.98])
        
        for fmt in ['pdf', 'svg', 'png']:
            filename = f"nature_horizontal_actual_transparent.{fmt}"
            fig.savefig(filename,
                       bbox_inches='tight',
                       dpi=300,
                       transparent=True,
                       facecolor='none')
            print(f"Saved: {filename}")
        
        return fig
        
    except FileNotFoundError:
        print("Actual data not found, using simulated data")
        return create_horizontal_plots()

if __name__ == "__main__":
    print("=" * 60)
    print("Creating Nature-style horizontal bar plots")
    print("TRANSPARENT BACKGROUND - Cell lines × Genes matrix")
    print("=" * 60)
    
    # Create with simulated data
    fig1 = create_horizontal_plots()
    
    # Try with actual data
    fig2 = create_with_actual_data()
    
    print("\n✅ Figures created with:")
    print("   - TRANSPARENT background")
    print("   - Horizontal bars (genes on y-axis, cell death % on x-axis)")
    print("   - Ticks only on x and y axes (facing outward)")
    print("   - Cell lines in rows, genes in columns")
    print("   - Clean minimal Nature style")
    print("=" * 60)