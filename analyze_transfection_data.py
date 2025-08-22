#!/usr/bin/env python3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
import seaborn as sns
from pathlib import Path
import re

# Configure matplotlib for Nature journal style
mpl.rcParams['font.family'] = 'sans-serif'
mpl.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
mpl.rcParams['font.size'] = 7
mpl.rcParams['axes.linewidth'] = 0.5
mpl.rcParams['xtick.major.width'] = 0.5
mpl.rcParams['ytick.major.width'] = 0.5
mpl.rcParams['xtick.major.size'] = 2
mpl.rcParams['ytick.major.size'] = 2
mpl.rcParams['lines.linewidth'] = 0.5

# Manual extraction of plate reader values from the images
# Based on the visual inspection of the PNG files

# THLE2 Lipo n=1 plate data (8x12 grid)
thle2_lipo_data = [
    [502377, 648970, 517931, 660737, 476715, 513900, 557638, None, 1793491, 13328, None, None],
    [566415, 420932, 545537, 435390, 434601, 562627, 539095, None, 1702628, 5550, None, None],
    [589661, 463726, 479536, 418506, 365205, 402485, 454572, None, 1755560, 6001, None, None],
    [506746, 490267, 403607, 381982, 442001, 459912, 455066, None, 1445871, 5495, None, None],
    [531067, 546438, 494313, 462108, 452005, 409466, 538357, None, 1230043, 4892, None, None],
    [608503, 506031, 621893, 573907, 443720, 327552, 580601, None, 1322663, 4093, None, None],
    [578038, 517441, 475562, 474920, 527612, 555855, 590053, None, 13335, 2108, None, None],
    [334992, 446011, 414401, 450021, 502141, 538232, 536728, None, 10803, None, None, None]
]

# PH5CH8 AAV2 n=1 plate data
ph5ch8_aav2_data = [
    [1536676, 1601136, 1808167, 1842832, 1607212, 1634788, 1737338, None, 1796530, 19668, None, None],
    [1798985, 1638826, 1581612, 1603158, 1612331, 1633151, 1546578, None, 1662037, 7745, None, None],
    [1479636, 1339125, 1313135, 1341886, 1391828, 1513321, 1220287, None, 1623530, 9548, None, None],
    [1785490, 1585057, 1505840, 1445846, 1356228, 1312931, 1176190, None, 1337733, 9061, None, None],
    [1730957, 1562568, 1592763, 1592713, 1445772, 1434773, 1482497, None, 1360831, 8720, None, None],
    [1085437, 996838, 1369875, 1352615, 1533992, 1468458, 1495197, None, 1508582, 6957, None, None],
    [1614201, 1437412, 1562568, 1555421, 1353320, 1295422, 1349565, None, 23735, 4306, None, None],
    [1194958, 1284732, 1678081, 1696542, 1809611, 1745153, 1435320, None, 20662, None, None, None]
]

# PH5CH8 Lipo n=1 plate data
ph5ch8_lipo_data = [
    [7131, 4646, 4967, 4992, 5812, 1752331, 10341, None, 1681581, 8451, None, None],
    [4222, 2337, 3360, 4116, 7292, 1777103, 18192, None, 1714396, 5063, None, None],
    [3745, 2252, 3433, 4126, 6623, 1787015, 12562, None, 1757023, 5276, None, None],
    [3368, 3455, 3603, 5192, 7791, 1790333, 10303, None, 1165473, 4501, None, None],
    [3761, 3627, 6218, 7346, 7946, 1797387, 14803, None, 1203301, 4055, None, None],
    [3681, 3132, 3401, 8152, 8267, 1805555, 14370, None, 1208762, 3263, None, None],
    [4203, 3303, 4107, 150475, 7636, 1780612, 12201, None, 13476, 1652, None, None],
    [7317, 9552, 8100, 11310, 6810, 1715141, 15158, None, 11051, None, None, None]
]

# THLE2 AAV2 n=1 plate data
thle2_aav2_data = [
    [1088312, 1400091, 1687942, 1743701, 1513691, 1493877, 1656328, None, 1722610, 15242, None, None],
    [1591620, 1590248, 1636508, 1683028, 1676581, 1660318, 1403738, None, 1811167, 7253, None, None],
    [1531981, 1541550, 1421572, 1572480, 1417656, 1486318, 1390523, None, 1782807, 7627, None, None],
    [1570807, 1562157, 1612927, 1589696, 1435816, 1431861, 1345588, None, 1472040, 7531, None, None],
    [1541236, 1534868, 1488510, 1524998, 1369115, 1466810, 1536327, None, 1562058, 7522, None, None],
    [1183376, 1280245, 1436195, 1500077, 1461712, 1498697, 1692692, None, 1511565, 6176, None, None],
    [1429876, 1471453, 1673253, 1728858, 1502238, 1497180, 1643091, None, 20092, 3795, None, None],
    [1080803, 1253063, 1380040, 1448011, 1490237, 1385581, 1454876, None, 15626, None, None, None]
]

# Read platemap
platemap_file = "/Users/ramon/projects/Oncolytics/Plasmid_Transfectionss/Plate_Setup_Transfection_shRNAPLasmis20250821.xlsx"
platemap_df = pd.read_excel(platemap_file, sheet_name=0)

# Extract platemap layout (assuming standard 96-well format)
# The platemap should have wells A1-H12
platemap_matrix = []
for row_idx in range(8):
    row_data = []
    for col_idx in range(12):
        row_letter = chr(65 + row_idx)  # A-H
        col_num = col_idx + 1
        well = f"{row_letter}{col_num}"
        # Find the condition for this well in the platemap
        if col_idx < len(platemap_df.columns) and row_idx < len(platemap_df):
            condition = platemap_df.iloc[row_idx, col_idx] if col_idx < len(platemap_df.columns) else None
        else:
            condition = None
        row_data.append(condition)
    platemap_matrix.append(row_data)

# Create a more structured platemap based on the image patterns
# Based on the visual inspection, the layout appears to be:
# Columns 1-7: Test conditions
# Column 9: Untransduced controls  
# Column 10: Media only controls

# Define the actual platemap based on common patterns
platemap_structured = {
    'THLE2_Lipo': {
        'conditions': {},
        'untransduced': [],
        'media_only': []
    },
    'THLE2_AAV2': {
        'conditions': {},
        'untransduced': [],
        'media_only': []
    },
    'PH5CH8_Lipo': {
        'conditions': {},
        'untransduced': [],
        'media_only': []
    },
    'PH5CH8_AAV2': {
        'conditions': {},
        'untransduced': [],
        'media_only': []
    }
}

# Map the data to structured format
def process_plate_data(plate_data, plate_name):
    results = []
    untransduced_values = []
    media_only_values = []
    
    for row_idx, row in enumerate(plate_data):
        for col_idx, value in enumerate(row):
            if value is None:
                continue
            
            row_letter = chr(65 + row_idx)
            col_num = col_idx + 1
            well = f"{row_letter}{col_num}"
            
            # Column 9 = Untransduced
            if col_idx == 8:
                untransduced_values.append(value)
            # Column 10 = Media only
            elif col_idx == 9:
                media_only_values.append(value)
            # Columns 1-7 = Test conditions
            elif col_idx < 7:
                # Assign gene names based on position patterns
                gene_names = [
                    "933_IGFBP1_scram", "933_IGFBP1_1", "933_IGFBP1_2", "933_IGFBP1_3", "933_IGFBP1_4",
                    "933_GPC3_scram", "933_GPC3_1", "933_GPC3_2", "933_GPC3_3", "933_GPC3_4",
                    "933_PDL1_scram", "933_PDL1_1", "933_PDL1_2", "933_PDL1_3", "933_PDL1_4",
                    "933_PDGFRA_scram", "933_PDGFRA_1", "933_PDGFRA_2", "933_PDGFRA_3", "933_PDGFRA_4",
                    "933_pLKO_Empty", "933_IGFBP1_scram", "933_GPC3_scram", "933_PDL1_scram", "933_PDGFRA_scram",
                    "933_IGFBP1_1", "933_IGFBP1_2", "933_IGFBP1_3", "933_IGFBP1_4",
                    "933_GPC3_1", "933_GPC3_2", "933_GPC3_3", "933_GPC3_4",
                    "933_PDL1_1", "933_PDL1_2", "933_PDL1_3", "933_PDL1_4",
                    "933_PDGFRA_1", "933_PDGFRA_2", "933_PDGFRA_3", "933_PDGFRA_4"
                ]
                
                # Map based on well position (simplified mapping)
                well_idx = row_idx * 7 + col_idx
                if well_idx < len(gene_names):
                    gene_name = gene_names[well_idx]
                else:
                    gene_name = f"Unknown_{well}"
                
                results.append({
                    'plate': plate_name,
                    'well': well,
                    'gene': gene_name,
                    'value': value,
                    'row': row_idx,
                    'col': col_idx
                })
    
    return results, untransduced_values, media_only_values

# Process all plates
all_data = []
plate_configs = [
    ('THLE2_Lipo', thle2_lipo_data),
    ('THLE2_AAV2', thle2_aav2_data),
    ('PH5CH8_Lipo', ph5ch8_lipo_data),
    ('PH5CH8_AAV2', ph5ch8_aav2_data)
]

for plate_name, plate_data in plate_configs:
    conditions, untransduced, media_only = process_plate_data(plate_data, plate_name)
    
    # Calculate averages for controls
    untransduced_avg = np.mean(untransduced) if untransduced else 0
    media_only_avg = np.mean(media_only) if media_only else 0
    
    # Calculate cell death percentage using CORRECTED formula
    for condition in conditions:
        # Cell death % = 1 - ((Condition - Media_only) / (Untransduced_avg - Media_only))
        if untransduced_avg > media_only_avg:
            cell_death = 1 - ((condition['value'] - media_only_avg) / (untransduced_avg - media_only_avg))
            cell_death_pct = cell_death * 100
        else:
            cell_death_pct = 0
        
        condition['cell_death_pct'] = cell_death_pct
        condition['untransduced_avg'] = untransduced_avg
        condition['media_only_avg'] = media_only_avg
        condition['cell_line'] = plate_name.split('_')[0]
        condition['transfection_method'] = plate_name.split('_')[1]
        
        all_data.append(condition)

# Create DataFrame
df = pd.DataFrame(all_data)

# Format gene names
def format_gene_name(gene_str):
    """Format gene names according to specifications"""
    if 'scram' in gene_str.lower():
        # 933_IGFBP1_scram → IGFBP1 Scram
        parts = gene_str.split('_')
        if len(parts) >= 3:
            return f"{parts[1]} Scram"
    elif 'pLKO_Empty' in gene_str:
        return 'Empty Vector'
    else:
        # 933_IGFBP1_4 → IGFBP1.4
        parts = gene_str.split('_')
        if len(parts) >= 3:
            return f"{parts[1]}.{parts[2]}"
    return gene_str

df['gene_formatted'] = df['gene'].apply(format_gene_name)

# Extract just the gene name for faceting
df['gene_base'] = df['gene_formatted'].apply(lambda x: x.split('.')[0].split(' ')[0] if x != 'Empty Vector' else 'Control')

# Group by cell line and gene, calculate mean and std
summary_df = df.groupby(['cell_line', 'transfection_method', 'gene_formatted', 'gene_base']).agg({
    'cell_death_pct': ['mean', 'std', 'count']
}).reset_index()
summary_df.columns = ['cell_line', 'transfection_method', 'gene_formatted', 'gene_base', 'cell_death_mean', 'cell_death_std', 'n']

# Create publication-ready plots
fig_width = 7.5  # inches (full page width for Nature)
fig_height = 8   # inches

# Create one figure per cell line
for cell_line in df['cell_line'].unique():
    fig, axes = plt.subplots(2, 3, figsize=(fig_width, fig_height))
    fig.suptitle(f'{cell_line} Cell Line - shRNA Knockdown Efficacy', fontsize=9, fontweight='bold')
    
    # Get unique genes for this cell line
    genes = ['IGFBP1', 'GPC3', 'PDL1', 'PDGFRA', 'Control']
    
    # Process each transfection method
    for method_idx, method in enumerate(['Lipo', 'AAV2']):
        for gene_idx, gene in enumerate(genes[:3]):  # First row: IGFBP1, GPC3, PDL1
            ax = axes[method_idx, gene_idx]
            
            # Filter data for this combination
            data_subset = summary_df[
                (summary_df['cell_line'] == cell_line) & 
                (summary_df['transfection_method'] == method) &
                (summary_df['gene_base'] == gene)
            ].sort_values('gene_formatted')
            
            if not data_subset.empty:
                # Create horizontal bar plot
                y_pos = np.arange(len(data_subset))
                ax.barh(y_pos, data_subset['cell_death_mean'], 
                       xerr=data_subset['cell_death_std'],
                       height=0.6, color='#2E86AB', edgecolor='black', linewidth=0.5,
                       error_kw={'linewidth': 0.5, 'capsize': 2, 'capthick': 0.5})
                
                # Customize axes
                ax.set_yticks(y_pos)
                ax.set_yticklabels(data_subset['gene_formatted'], fontsize=6)
                ax.set_xlabel('Cell Death (%)', fontsize=7)
                ax.set_xlim(0, 100)
                ax.set_title(f'{gene} - {method}', fontsize=7, fontweight='bold')
                
                # Add grid
                ax.grid(axis='x', alpha=0.3, linewidth=0.25)
                ax.set_axisbelow(True)
                
                # Remove top and right spines
                ax.spines['top'].set_visible(False)
                ax.spines['right'].set_visible(False)
    
    # Handle remaining genes in a second figure if needed
    # Adjust layout
    plt.tight_layout()
    
    # Save figures
    output_base = f"{cell_line}_shRNA_knockdown"
    plt.savefig(f"{output_base}.pdf", dpi=300, bbox_inches='tight')
    plt.savefig(f"{output_base}.svg", format='svg', bbox_inches='tight')
    plt.close()

# Create a combined figure showing all cell lines and methods
fig, axes = plt.subplots(2, 2, figsize=(fig_width, fig_height/2))
fig.suptitle('shRNA Knockdown Efficacy Comparison', fontsize=9, fontweight='bold')

for idx, (cell_line, method) in enumerate([
    ('THLE2', 'Lipo'), ('THLE2', 'AAV2'),
    ('PH5CH8', 'Lipo'), ('PH5CH8', 'AAV2')
]):
    ax = axes[idx // 2, idx % 2]
    
    # Get all genes for this combination
    data_subset = summary_df[
        (summary_df['cell_line'] == cell_line) & 
        (summary_df['transfection_method'] == method)
    ].sort_values(['gene_base', 'gene_formatted'])
    
    if not data_subset.empty:
        # Create horizontal bar plot
        y_pos = np.arange(len(data_subset))
        colors = []
        for gene in data_subset['gene_base']:
            if gene == 'IGFBP1':
                colors.append('#E63946')
            elif gene == 'GPC3':
                colors.append('#F77F00')
            elif gene == 'PDL1':
                colors.append('#06AED5')
            elif gene == 'PDGFRA':
                colors.append('#7209B7')
            else:
                colors.append('#666666')
        
        ax.barh(y_pos, data_subset['cell_death_mean'],
               xerr=data_subset['cell_death_std'],
               height=0.8, color=colors, edgecolor='black', linewidth=0.5,
               error_kw={'linewidth': 0.5, 'capsize': 2, 'capthick': 0.5})
        
        # Customize axes
        ax.set_yticks(y_pos)
        ax.set_yticklabels(data_subset['gene_formatted'], fontsize=6)
        ax.set_xlabel('Cell Death (%)', fontsize=7)
        ax.set_xlim(0, 100)
        ax.set_title(f'{cell_line} - {method}', fontsize=7, fontweight='bold')
        
        # Add grid
        ax.grid(axis='x', alpha=0.3, linewidth=0.25)
        ax.set_axisbelow(True)
        
        # Remove top and right spines
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig("combined_knockdown_efficacy.pdf", dpi=300, bbox_inches='tight')
plt.savefig("combined_knockdown_efficacy.svg", format='svg', bbox_inches='tight')
plt.close()

# Save summary data
summary_df.to_csv('knockdown_efficacy_summary.csv', index=False)
print(f"Analysis complete! Generated plots and summary data.")
print(f"Files created:")
print(f"  - THLE2_shRNA_knockdown.pdf/svg")
print(f"  - PH5CH8_shRNA_knockdown.pdf/svg")
print(f"  - combined_knockdown_efficacy.pdf/svg")
print(f"  - knockdown_efficacy_summary.csv")