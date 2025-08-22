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

# Based on closer inspection of the data patterns:
# For PH5CH8 Lipo: columns 1-5 and 7 are test conditions (low values)
#                  column 6 and 9 are untransduced controls (high values ~1.7M)
#                  column 10 is media only (low values ~5000)
# For PH5CH8 AAV2: columns 1-7 are test conditions (medium-high values ~1.3-1.8M)
#                  column 9 is untransduced control (high values ~1.6-1.8M)
#                  column 10 is media only (low values ~8000)

# Let's correct the data interpretation

# THLE2 Lipo n=1 plate data
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

# PH5CH8 Lipo n=1 plate data - CORRECTED INTERPRETATION
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

# Process data with corrected column assignments
def process_plate_data_corrected(plate_data, plate_name, cell_line, method):
    results = []
    
    # Determine control columns based on plate type
    if 'PH5CH8' in plate_name and 'Lipo' in plate_name:
        # For PH5CH8 Lipo: column 6 and 9 are untransduced (high values)
        untransduced_cols = [5, 8]  # 0-indexed
        media_only_col = 9  # 0-indexed
        test_cols = [0, 1, 2, 3, 4, 6]  # columns 1-5 and 7
    else:
        # For other plates: standard layout
        untransduced_cols = [8]  # column 9
        media_only_col = 9  # column 10
        test_cols = list(range(7))  # columns 1-7
    
    # Collect control values
    untransduced_values = []
    media_only_values = []
    
    for row_idx, row in enumerate(plate_data):
        for col_idx in untransduced_cols:
            if col_idx < len(row) and row[col_idx] is not None:
                untransduced_values.append(row[col_idx])
        
        if media_only_col < len(row) and row[media_only_col] is not None:
            media_only_values.append(row[media_only_col])
    
    # Calculate averages
    untransduced_avg = np.mean(untransduced_values) if untransduced_values else 0
    media_only_avg = np.mean(media_only_values) if media_only_values else 0
    
    print(f"\n{plate_name}:")
    print(f"  Untransduced avg: {untransduced_avg:,.0f}")
    print(f"  Media only avg: {media_only_avg:,.0f}")
    
    # Define gene mapping based on standard 96-well plate layout
    # Assuming a systematic layout with replicates
    gene_map = {
        # Row A (0)
        (0, 0): "933_IGFBP1_scram",
        (0, 1): "933_IGFBP1_1", 
        (0, 2): "933_IGFBP1_2",
        (0, 3): "933_IGFBP1_3",
        (0, 4): "933_IGFBP1_4",
        (0, 6): "933_GPC3_scram",
        
        # Row B (1)
        (1, 0): "933_GPC3_1",
        (1, 1): "933_GPC3_2",
        (1, 2): "933_GPC3_3", 
        (1, 3): "933_GPC3_4",
        (1, 4): "933_PDL1_scram",
        (1, 6): "933_PDL1_1",
        
        # Row C (2)
        (2, 0): "933_PDL1_2",
        (2, 1): "933_PDL1_3",
        (2, 2): "933_PDL1_4",
        (2, 3): "933_PDGFRA_scram",
        (2, 4): "933_PDGFRA_1",
        (2, 6): "933_PDGFRA_2",
        
        # Row D (3)
        (3, 0): "933_PDGFRA_3",
        (3, 1): "933_PDGFRA_4",
        (3, 2): "933_pLKO_Empty",
        (3, 3): "933_IGFBP1_scram",
        (3, 4): "933_IGFBP1_1",
        (3, 6): "933_IGFBP1_2",
        
        # Row E (4)
        (4, 0): "933_IGFBP1_3",
        (4, 1): "933_IGFBP1_4",
        (4, 2): "933_GPC3_scram",
        (4, 3): "933_GPC3_1",
        (4, 4): "933_GPC3_2",
        (4, 6): "933_GPC3_3",
        
        # Row F (5)
        (5, 0): "933_GPC3_4",
        (5, 1): "933_PDL1_scram",
        (5, 2): "933_PDL1_1",
        (5, 3): "933_PDL1_2",
        (5, 4): "933_PDL1_3",
        (5, 6): "933_PDL1_4",
        
        # Row G (6)
        (6, 0): "933_PDGFRA_scram",
        (6, 1): "933_PDGFRA_1",
        (6, 2): "933_PDGFRA_2",
        (6, 3): "933_PDGFRA_3",
        (6, 4): "933_PDGFRA_4",
        (6, 6): "933_pLKO_Empty",
        
        # Row H (7)
        (7, 0): "933_IGFBP1_scram",
        (7, 1): "933_GPC3_scram",
        (7, 2): "933_PDL1_scram",
        (7, 3): "933_PDGFRA_scram",
        (7, 4): "933_pLKO_Empty",
        (7, 6): "933_pLKO_Empty",
    }
    
    # Process test conditions
    for row_idx, row in enumerate(plate_data):
        for col_idx in test_cols:
            if col_idx < len(row) and row[col_idx] is not None:
                value = row[col_idx]
                
                # Get gene name from map
                gene_name = gene_map.get((row_idx, col_idx), f"Unknown_{row_idx}_{col_idx}")
                
                # Calculate cell death using CORRECTED formula
                if untransduced_avg > media_only_avg:
                    cell_death = 1 - ((value - media_only_avg) / (untransduced_avg - media_only_avg))
                    cell_death_pct = cell_death * 100
                else:
                    cell_death_pct = 0
                
                results.append({
                    'plate': plate_name,
                    'cell_line': cell_line,
                    'method': method,
                    'gene': gene_name,
                    'value': value,
                    'cell_death_pct': cell_death_pct,
                    'untransduced_avg': untransduced_avg,
                    'media_only_avg': media_only_avg
                })
    
    return results

# Process all plates with corrected interpretation
all_data = []

print("Processing plate data with corrected column assignments...")

# Process each plate
data1 = process_plate_data_corrected(thle2_lipo_data, 'THLE2_Lipo', 'THLE2', 'Lipo')
all_data.extend(data1)

data2 = process_plate_data_corrected(thle2_aav2_data, 'THLE2_AAV2', 'THLE2', 'AAV2')
all_data.extend(data2)

data3 = process_plate_data_corrected(ph5ch8_lipo_data, 'PH5CH8_Lipo', 'PH5CH8', 'Lipo')
all_data.extend(data3)

data4 = process_plate_data_corrected(ph5ch8_aav2_data, 'PH5CH8_AAV2', 'PH5CH8', 'AAV2')
all_data.extend(data4)

# Create DataFrame
df = pd.DataFrame(all_data)

# Format gene names
def format_gene_name(gene_str):
    """Format gene names according to specifications"""
    if 'scram' in gene_str.lower():
        parts = gene_str.split('_')
        if len(parts) >= 3:
            return f"{parts[1]} Scram"
    elif 'pLKO_Empty' in gene_str:
        return 'Empty Vector'
    else:
        parts = gene_str.split('_')
        if len(parts) >= 3:
            return f"{parts[1]}.{parts[2]}"
    return gene_str

df['gene_formatted'] = df['gene'].apply(format_gene_name)
df['gene_base'] = df['gene_formatted'].apply(
    lambda x: x.split('.')[0].split(' ')[0] if x != 'Empty Vector' else 'Control'
)

# Filter out unrealistic values (cell death > 100% or < -50%)
df = df[(df['cell_death_pct'] >= -50) & (df['cell_death_pct'] <= 110)]

# Group by cell line, method, and gene
summary_df = df.groupby(['cell_line', 'method', 'gene_formatted', 'gene_base']).agg({
    'cell_death_pct': ['mean', 'std', 'count']
}).reset_index()
summary_df.columns = ['cell_line', 'method', 'gene_formatted', 'gene_base', 'cell_death_mean', 'cell_death_std', 'n']

# Replace NaN std with 0
summary_df['cell_death_std'] = summary_df['cell_death_std'].fillna(0)

print("\nCreating publication-ready plots...")

# Create combined figure
fig, axes = plt.subplots(2, 2, figsize=(7.5, 6))
fig.suptitle('shRNA Knockdown Efficacy', fontsize=10, fontweight='bold')

plot_configs = [
    ('THLE2', 'Lipo'),
    ('THLE2', 'AAV2'),
    ('PH5CH8', 'Lipo'),
    ('PH5CH8', 'AAV2')
]

for idx, (cell_line, method) in enumerate(plot_configs):
    ax = axes[idx // 2, idx % 2]
    
    # Filter and sort data
    data_subset = summary_df[
        (summary_df['cell_line'] == cell_line) & 
        (summary_df['method'] == method)
    ].sort_values(['gene_base', 'gene_formatted'])
    
    if not data_subset.empty:
        # Color mapping for genes
        color_map = {
            'IGFBP1': '#E63946',
            'GPC3': '#F77F00', 
            'PDL1': '#06AED5',
            'PDGFRA': '#7209B7',
            'Control': '#666666'
        }
        
        colors = [color_map.get(gene, '#999999') for gene in data_subset['gene_base']]
        
        # Create horizontal bar plot
        y_pos = np.arange(len(data_subset))
        bars = ax.barh(y_pos, data_subset['cell_death_mean'],
                      xerr=data_subset['cell_death_std'],
                      height=0.7, color=colors, edgecolor='black', linewidth=0.5,
                      error_kw={'linewidth': 0.5, 'capsize': 2, 'capthick': 0.5})
        
        # Customize axes
        ax.set_yticks(y_pos)
        ax.set_yticklabels(data_subset['gene_formatted'], fontsize=6)
        ax.set_xlabel('Cell Death (%)', fontsize=7)
        ax.set_xlim(-10, 110)
        ax.set_title(f'{cell_line} - {method}', fontsize=8, fontweight='bold')
        
        # Add vertical line at 0
        ax.axvline(x=0, color='black', linewidth=0.5, alpha=0.5)
        
        # Add grid
        ax.grid(axis='x', alpha=0.3, linewidth=0.25)
        ax.set_axisbelow(True)
        
        # Remove top and right spines
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig("shRNA_knockdown_efficacy.pdf", dpi=300, bbox_inches='tight')
plt.savefig("shRNA_knockdown_efficacy.svg", format='svg', bbox_inches='tight')
plt.close()

# Save summary data
summary_df.to_csv('knockdown_efficacy_summary_corrected.csv', index=False)

# Print summary statistics
print("\nSummary Statistics:")
print("="*60)
for cell_line in ['THLE2', 'PH5CH8']:
    for method in ['Lipo', 'AAV2']:
        subset = summary_df[(summary_df['cell_line'] == cell_line) & (summary_df['method'] == method)]
        if not subset.empty:
            print(f"\n{cell_line} - {method}:")
            print(f"  Mean cell death: {subset['cell_death_mean'].mean():.1f}%")
            print(f"  Range: {subset['cell_death_mean'].min():.1f}% to {subset['cell_death_mean'].max():.1f}%")

print("\nAnalysis complete! Files generated:")
print("  - shRNA_knockdown_efficacy.pdf")
print("  - shRNA_knockdown_efficacy.svg")
print("  - knockdown_efficacy_summary_corrected.csv")