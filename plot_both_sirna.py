#!/usr/bin/env python3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from cmcrameri import cm
import warnings
warnings.filterwarnings('ignore')

def process_and_plot(csv_path, cell_line_name, output_prefix):
    """Process siRNA data and create publication-ready plots"""
    
    # Read the data
    df = pd.read_csv(csv_path)
    
    # Average technical replicates within each biological replicate (plate)
    # Group by Plate and Treatment, then take mean of Luminescence values
    df = df.groupby(['Plate', 'Treatment'])['Luminescence'].mean().reset_index()
    
    # Get MediaOnly baseline value for each plate
    media_only = df[df['Treatment'] == 'MediaOnly'].set_index('Plate')['Luminescence']
    
    # Get Untreated value for each plate  
    untreated = df[df['Treatment'] == 'Untreated'].set_index('Plate')['Luminescence']
    
    # Define treatments to exclude from the plot
    exclude_treatments = ['MediaOnly', 'Media+Lipofectamine', 'Media+Lipofectamine+2%Triton', 'Untreated']
    
    # Filter data for plotting
    plot_df = df[~df['Treatment'].isin(exclude_treatments)].copy()
    
    # Calculate cell death percentage for each row
    cell_death_list = []
    for idx, row in plot_df.iterrows():
        plate = row['Plate']
        treatment_lum = row['Luminescence']
        media_baseline = media_only[plate]
        untreated_baseline = untreated[plate]
        
        # Calculate cell survival first, then convert to cell death
        cell_survival = (treatment_lum - media_baseline) / (untreated_baseline - media_baseline)
        cell_death = (1 - cell_survival) * 100
        cell_death_list.append(cell_death)
    
    plot_df['Cell_Death_Percentage'] = cell_death_list
    
    # Calculate mean and SEM for each treatment
    treatment_stats = plot_df.groupby('Treatment')['Cell_Death_Percentage'].agg(['mean', 'sem', 'count'])
    treatment_stats = treatment_stats.sort_values('mean', ascending=False)
    
    # Create the figure with Nature-style formatting
    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(12, 10))
    
    # Get unique treatments
    treatments = treatment_stats.index
    n_treatments = len(treatments)
    
    # Use CMC vikO colormap with full range to avoid color repetition
    # Ensure we use the full colormap range by slightly adjusting the endpoints
    colors = cm.vikO(np.linspace(0.05, 0.95, n_treatments))
    
    # Create horizontal bar plot
    y_positions = np.arange(n_treatments)
    bars = ax.barh(y_positions, treatment_stats['mean'], 
                   xerr=treatment_stats['sem'],
                   color=colors, alpha=0.8, edgecolor='black', linewidth=0.5,
                   capsize=4, error_kw={'linewidth': 1.5})
    
    # Add individual data points for biological replicates
    for i, treatment in enumerate(treatments):
        treatment_data = plot_df[plot_df['Treatment'] == treatment]['Cell_Death_Percentage']
        jitter = np.random.normal(0, 0.05, len(treatment_data))
        ax.scatter(treatment_data, np.full(len(treatment_data), i) + jitter,
                   color='black', s=40, alpha=0.6, zorder=10)
    
    # Add red dashed line at 70% cell death
    ax.axvline(x=70, color='red', linestyle='--', linewidth=2.5, alpha=0.8)
    
    # Customize the plot
    ax.set_yticks(y_positions)
    ax.set_yticklabels(treatments, fontsize=14)
    ax.set_xlabel('Cell Death (%)', fontsize=16, fontweight='bold')
    ax.set_ylabel('Treatment', fontsize=16, fontweight='bold')
    ax.set_title(f'{cell_line_name} siRNA Screen - Cell Death Analysis', fontsize=18, fontweight='bold', pad=20)
    
    # Set x-axis limits
    ax.set_xlim(0, 100)
    
    # Increase tick label size
    ax.tick_params(axis='x', labelsize=12)
    
    # Add grid for better readability
    ax.grid(axis='x', alpha=0.3, linestyle='-', linewidth=0.5)
    
    # Remove top and right spines for cleaner look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    # Make left and bottom spines thicker
    ax.spines['left'].set_linewidth(2)
    ax.spines['bottom'].set_linewidth(2)
    
    # Tighten layout
    plt.tight_layout()
    
    # Save the plots
    plt.savefig(f'{output_prefix}.pdf', dpi=300, bbox_inches='tight')
    plt.savefig(f'{output_prefix}.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"{cell_line_name} plots saved successfully!")
    print(f"Number of treatments plotted: {n_treatments}")
    print(f"\nTop 5 treatments by cell death in {cell_line_name}:")
    print(treatment_stats.head())
    print("-" * 50)

# Process THLE2 cell line
thle2_path = '/Users/ramon/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles/Main Profile/Files/S0/2/Attachments/0/THLE2_siRNA_Screen_-_Long_Form[12832].csv'
process_and_plot(thle2_path, 'THLE2', '/Users/ramon/projects/oncolyticsAI/Portfolio/thle2_sirna_cell_death')

# Process PH5CH8 cell line
ph5ch8_path = '/Users/ramon/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles/Main Profile/Files/S0/2/Attachments/0/PH5CH8_siRNA_Screen_-_Long_Form[12833].csv'
process_and_plot(ph5ch8_path, 'PH5CH8', '/Users/ramon/projects/oncolyticsAI/Portfolio/ph5ch8_sirna_cell_death')

print("\nAll plots generated successfully!")