#!/usr/bin/env python3
"""
Nature-quality visualization for transfection death analysis
Using Scientific colour maps by Fabio Crameri (vikO palette)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib import rcParams
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Try to import cmcrameri, if not available use custom vikO colors
try:
    import cmcrameri.cm as cmc
    HAS_CMCRAMERI = True
except ImportError:
    HAS_CMCRAMERI = False
    # Define vikO palette manually if cmcrameri not installed
    # vikO colors from light to dark shades
    VIKO_COLORS = {
        'IGFBP1': ['#FFE4B5', '#FFA500', '#FF8C00', '#FF6B00'],  # Orange shades
        'GPC3': ['#E6E6FA', '#9370DB', '#8A2BE2', '#6A0DAD'],    # Purple shades  
        'PDL1': ['#87CEEB', '#4682B4', '#1E90FF', '#00008B'],    # Blue shades
        'PDGFRA': ['#90EE90', '#3CB371', '#2E8B57', '#006400']   # Green shades
    }

# Set up Nature-style parameters
def setup_nature_style():
    """Configure matplotlib for Nature-quality figures"""
    # Nature uses Helvetica/Arial
    rcParams['font.family'] = 'sans-serif'
    rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
    rcParams['font.size'] = 8
    rcParams['axes.labelsize'] = 9
    rcParams['axes.titlesize'] = 10
    rcParams['xtick.labelsize'] = 8
    rcParams['ytick.labelsize'] = 8
    rcParams['legend.fontsize'] = 7
    
    # Clean style
    rcParams['axes.linewidth'] = 0.5
    rcParams['axes.edgecolor'] = 'black'
    rcParams['axes.facecolor'] = 'white'
    rcParams['axes.spines.top'] = False
    rcParams['axes.spines.right'] = False
    
    # Grid
    rcParams['axes.grid'] = False
    rcParams['grid.alpha'] = 0.3
    rcParams['grid.linewidth'] = 0.5
    
    # Figure
    rcParams['figure.facecolor'] = 'white'
    rcParams['savefig.dpi'] = 300
    rcParams['savefig.bbox'] = 'tight'
    rcParams['savefig.pad_inches'] = 0.1

def get_viko_colors(gene_list):
    """Get vikO palette colors for genes and their variants"""
    if HAS_CMCRAMERI:
        # Use actual vikO colormap
        cmap = cmc.vikO
        n_genes = len(set([g.split('.')[0] for g in gene_list]))
        base_colors = [cmap(i / (n_genes - 1)) for i in range(n_genes)]
        
        color_dict = {}
        gene_base = {}
        for gene in gene_list:
            base_gene = gene.split('.')[0]
            if base_gene not in gene_base:
                gene_base[base_gene] = base_colors[len(gene_base)]
        
        # Create shades for variants
        for gene in gene_list:
            base_gene = gene.split('.')[0]
            variants = [g for g in gene_list if g.startswith(base_gene)]
            n_variants = len(variants)
            
            base_rgb = mpl.colors.to_rgb(gene_base[base_gene])
            for i, variant in enumerate(variants):
                # Create lighter/darker shades
                factor = 0.7 + (0.3 * i / max(n_variants - 1, 1))
                color_dict[variant] = tuple([c * factor for c in base_rgb])
    else:
        # Use predefined colors
        color_dict = {}
        for gene in gene_list:
            base_gene = gene.split('.')[0]
            if base_gene in VIKO_COLORS:
                variants = [g for g in gene_list if g.startswith(base_gene)]
                variant_idx = variants.index(gene)
                color_dict[gene] = VIKO_COLORS[base_gene][min(variant_idx, len(VIKO_COLORS[base_gene])-1)]
    
    return color_dict

def create_nature_barplot(data, title="Transfection-Induced Cell Death Analysis"):
    """
    Create Nature-quality barplot with genes in columns
    Each gene gets one color, variants get shades of that color
    """
    setup_nature_style()
    
    # Prepare data
    df = data.copy()
    
    # Extract gene base names and variants
    df['gene_base'] = df['gene'].str.split('.').str[0]
    df['variant'] = df['gene'].str.split('.').str[1].fillna('1')
    
    # Get unique genes and conditions
    unique_genes = df['gene_base'].unique()
    conditions = df['condition'].unique()
    
    # Get color mapping
    all_genes = df['gene'].unique()
    color_map = get_viko_colors(all_genes)
    
    # Create figure with subplots for each condition
    fig, axes = plt.subplots(len(conditions), 1, figsize=(10, 3 * len(conditions)))
    if len(conditions) == 1:
        axes = [axes]
    
    for idx, condition in enumerate(conditions):
        ax = axes[idx]
        condition_data = df[df['condition'] == condition]
        
        # Group by gene base
        x_pos = 0
        x_positions = []
        x_labels = []
        bar_colors = []
        bar_values = []
        bar_errors = []
        
        for gene_base in unique_genes:
            gene_data = condition_data[condition_data['gene_base'] == gene_base]
            
            if len(gene_data) > 0:
                # Sort variants numerically if possible
                gene_data = gene_data.sort_values('variant')
                
                for _, row in gene_data.iterrows():
                    x_positions.append(x_pos)
                    x_labels.append(row['gene'])
                    bar_colors.append(color_map.get(row['gene'], 'gray'))
                    bar_values.append(row['mean_death'])
                    bar_errors.append(row.get('std_death', 0))
                    x_pos += 1
                
                # Add spacing between gene groups
                x_pos += 0.5
        
        # Create bars
        bars = ax.bar(x_positions, bar_values, color=bar_colors, 
                      edgecolor='black', linewidth=0.5, width=0.8)
        
        # Add error bars if available
        if any(bar_errors):
            ax.errorbar(x_positions, bar_values, yerr=bar_errors,
                       fmt='none', ecolor='black', elinewidth=0.5, capsize=2)
        
        # Styling
        ax.set_ylabel('Cell Death (%)', fontweight='bold')
        ax.set_ylim(-50, 110)
        ax.axhline(y=0, color='black', linewidth=0.5, linestyle='-', alpha=0.5)
        ax.axhline(y=100, color='black', linewidth=0.5, linestyle='--', alpha=0.3)
        
        # X-axis
        ax.set_xticks(x_positions)
        ax.set_xticklabels(x_labels, rotation=45, ha='right')
        
        # Title for subplot
        ax.set_title(condition, fontweight='bold', loc='left')
        
        # Add gene group labels
        gene_positions = {}
        for i, label in enumerate(x_labels):
            gene_base = label.split('.')[0]
            if gene_base not in gene_positions:
                gene_positions[gene_base] = []
            gene_positions[gene_base].append(x_positions[i])
        
        # Add gene group brackets/labels
        for gene_base, positions in gene_positions.items():
            if len(positions) > 1:
                # Add bracket
                y_pos = -60
                ax.plot([min(positions)-0.3, max(positions)+0.3], [y_pos, y_pos], 
                       'k-', linewidth=0.5)
                ax.text(np.mean(positions), y_pos-5, gene_base, 
                       ha='center', va='top', fontsize=7, fontweight='bold')
    
    # Overall title
    fig.suptitle(title, fontsize=12, fontweight='bold', y=1.02)
    
    plt.tight_layout()
    return fig

def create_gene_column_plot(data, output_file="nature_transfection_analysis.pdf"):
    """
    Create publication-quality plot with genes organized in columns
    """
    setup_nature_style()
    
    # Prepare data
    df = data.copy()
    df['gene_base'] = df['gene'].str.split('.').str[0]
    df['variant'] = df['gene'].str.split('.').str[1].fillna('1')
    
    # Get unique elements
    unique_genes = sorted(df['gene_base'].unique())
    unique_conditions = df['condition'].unique()
    
    # Create figure - one column per gene
    fig, axes = plt.subplots(1, len(unique_genes), figsize=(2.5*len(unique_genes), 5))
    if len(unique_genes) == 1:
        axes = [axes]
    
    # Get color map
    all_genes = df['gene'].unique()
    color_map = get_viko_colors(all_genes)
    
    for gene_idx, gene_base in enumerate(unique_genes):
        ax = axes[gene_idx]
        gene_data = df[df['gene_base'] == gene_base]
        
        # Get variants for this gene
        variants = sorted(gene_data['gene'].unique(), 
                         key=lambda x: int(x.split('.')[-1]) if x.split('.')[-1].isdigit() else 0)
        
        # Prepare data for grouped bar plot
        x = np.arange(len(variants))
        width = 0.35
        
        for cond_idx, condition in enumerate(unique_conditions):
            cond_data = gene_data[gene_data['condition'] == condition]
            
            values = []
            errors = []
            colors = []
            
            for variant in variants:
                variant_data = cond_data[cond_data['gene'] == variant]
                if len(variant_data) > 0:
                    values.append(variant_data['mean_death'].iloc[0])
                    errors.append(variant_data.get('std_death', pd.Series([0])).iloc[0])
                else:
                    values.append(0)
                    errors.append(0)
                colors.append(color_map.get(variant, 'gray'))
            
            # Plot bars
            offset = width * (cond_idx - len(unique_conditions)/2 + 0.5)
            # Adjust colors for different conditions
            if cond_idx == 0:
                bar_colors = colors
            else:
                # Make other conditions slightly lighter
                bar_colors = []
                for c in colors:
                    rgb = mpl.colors.to_rgba(c)
                    # Lighten the color slightly
                    adjusted = tuple([min(1.0, val + 0.2 * (cond_idx / len(unique_conditions))) for val in rgb[:3]] + [rgb[3]])
                    bar_colors.append(adjusted)
            
            bars = ax.bar(x + offset, values, width, 
                         color=bar_colors,
                         edgecolor='black', linewidth=0.5,
                         label=condition)
            
            # Add error bars
            if any(errors):
                ax.errorbar(x + offset, values, yerr=errors,
                           fmt='none', ecolor='black', elinewidth=0.5, capsize=2)
        
        # Styling
        ax.set_xlabel('shRNA variant', fontweight='bold')
        if gene_idx == 0:
            ax.set_ylabel('Cell Death (%)', fontweight='bold')
        ax.set_title(gene_base, fontweight='bold', fontsize=10)
        ax.set_xticks(x)
        ax.set_xticklabels([v.split('.')[-1] for v in variants])
        ax.set_ylim(-50, 110)
        ax.axhline(y=0, color='black', linewidth=0.5, alpha=0.5)
        ax.axhline(y=100, color='black', linewidth=0.5, linestyle='--', alpha=0.3)
        
        # Add legend to first subplot
        if gene_idx == 0:
            ax.legend(frameon=False, loc='upper left', fontsize=7)
    
    plt.suptitle('Transfection-Induced Cell Death by Gene Target', 
                fontsize=12, fontweight='bold', y=1.05)
    plt.tight_layout()
    
    # Save figure
    fig.savefig(output_file, dpi=300, bbox_inches='tight')
    fig.savefig(output_file.replace('.pdf', '.svg'), format='svg', bbox_inches='tight')
    
    return fig

# Example usage with sample data
if __name__ == "__main__":
    # Create sample data structure
    sample_data = pd.DataFrame({
        'gene': ['IGFBP1.1', 'IGFBP1.2', 'IGFBP1.3', 'GPC3.1', 'GPC3.2', 'GPC3.3',
                 'PDL1.1', 'PDL1.2', 'PDL1.3', 'PDGFRA.1', 'PDGFRA.2', 'PDGFRA.3'] * 2,
        'condition': ['PH5CH8 Lipofection'] * 12 + ['THLE2 Lipofection'] * 12,
        'mean_death': np.random.uniform(70, 100, 24),
        'std_death': np.random.uniform(2, 10, 24)
    })
    
    # Create the plot
    fig = create_gene_column_plot(sample_data)
    plt.show()
    
    print("Nature-quality figures saved as:")
    print("  - nature_transfection_analysis.pdf")
    print("  - nature_transfection_analysis.svg")