#!/usr/bin/env python3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from cmcrameri import cm
import warnings
warnings.filterwarnings('ignore')

# Read the data
df = pd.read_csv('/Users/ramon/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles/Main Profile/Files/S0/2/Attachments/0/THLE2_siRNA_Screen_-_Long_Form[12832].csv')

# Get MediaOnly baseline value for each plate
media_only = df[df['Treatment'] == 'MediaOnly'].groupby('Plate')['Luminescence'].mean()

# Get Untreated value for each plate  
untreated = df[df['Treatment'] == 'Untreated'].groupby('Plate')['Luminescence'].mean()

# Define treatments to exclude from the plot
exclude_treatments = ['MediaOnly', 'Media+Lipofectamine', 'Media+Lipofectamine+2%Triton', 'Untreated']

# Filter data for plotting
plot_df = df[~df['Treatment'].isin(exclude_treatments)].copy()

# Calculate cell death percentage for each row
# Formula: Cell Death % = (1 - (Untreated - MediaOnly)/(Treatment - MediaOnly)) * 100
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
fig, ax = plt.subplots(figsize=(10, 8))

# Get unique treatments
treatments = treatment_stats.index
n_treatments = len(treatments)

# Use CMC vikO colormap
colors = cm.vikO(np.linspace(0, 1, n_treatments))

# Create horizontal bar plot
y_positions = np.arange(n_treatments)
bars = ax.barh(y_positions, treatment_stats['mean'], 
               xerr=treatment_stats['sem'],
               color=colors, alpha=0.8, edgecolor='black', linewidth=0.5,
               capsize=3, error_kw={'linewidth': 1})

# Add individual data points for biological replicates
for i, treatment in enumerate(treatments):
    treatment_data = plot_df[plot_df['Treatment'] == treatment]['Cell_Death_Percentage']
    jitter = np.random.normal(0, 0.05, len(treatment_data))
    ax.scatter(treatment_data, np.full(len(treatment_data), i) + jitter,
               color='black', s=30, alpha=0.6, zorder=10)

# Add red dashed line at 70% cell death
ax.axvline(x=70, color='red', linestyle='--', linewidth=2, alpha=0.8)

# Customize the plot
ax.set_yticks(y_positions)
ax.set_yticklabels(treatments, fontsize=10)
ax.set_xlabel('Cell Death (%)', fontsize=12, fontweight='bold')
ax.set_ylabel('Treatment', fontsize=12, fontweight='bold')
ax.set_title('THLE2 siRNA Screen - Cell Death Analysis', fontsize=14, fontweight='bold', pad=20)

# Set x-axis limits
ax.set_xlim(0, 100)

# Add grid for better readability
ax.grid(axis='x', alpha=0.3, linestyle='-', linewidth=0.5)

# Remove top and right spines for cleaner look
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Make left and bottom spines thicker
ax.spines['left'].set_linewidth(1.5)
ax.spines['bottom'].set_linewidth(1.5)

# Tighten layout
plt.tight_layout()

# Save the plots
plt.savefig('/Users/ramon/projects/oncolyticsAI/Portfolio/thle2_sirna_cell_death.pdf', dpi=300, bbox_inches='tight')
plt.savefig('/Users/ramon/projects/oncolyticsAI/Portfolio/thle2_sirna_cell_death.png', dpi=300, bbox_inches='tight')
plt.close()

print("Plots saved successfully!")
print(f"Number of treatments plotted: {n_treatments}")
print("\nTop 5 treatments by cell death:")
print(treatment_stats.head())