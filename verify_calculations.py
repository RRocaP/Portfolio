#!/usr/bin/env python3

import numpy as np

# Let's verify the calculations with actual data from PH5CH8 Lipo plate
# This plate shows very low values in columns 1-5 (test conditions) compared to controls

# PH5CH8 Lipo n=1 plate data - columns 1-5 have very low values (3000-8000 range)
# while column 6 (and 9) have very high values (1.7-1.8 million range)

# Test conditions (columns 1-5, first row)
test_values = [7131, 4646, 4967, 4992, 5812]

# Untransduced controls (column 9)
untransduced_values = [1681581, 1714396, 1757023, 1165473, 1203301, 1208762]
untransduced_avg = np.mean(untransduced_values)

# Media only controls (column 10)
media_only_values = [8451, 5063, 5276, 4501, 4055, 3263, 1652]
media_only_avg = np.mean(media_only_values)

print("PH5CH8 Lipo Plate Analysis:")
print("-" * 50)
print(f"Untransduced average: {untransduced_avg:,.0f}")
print(f"Media only average: {media_only_avg:,.0f}")
print(f"Denominator (Untransduced - Media): {untransduced_avg - media_only_avg:,.0f}")
print()

print("Test condition calculations:")
for i, test_val in enumerate(test_values, 1):
    numerator = test_val - media_only_avg
    denominator = untransduced_avg - media_only_avg
    survival_fraction = numerator / denominator
    cell_death = 1 - survival_fraction
    cell_death_pct = cell_death * 100
    
    print(f"\nCondition {i} (value={test_val:,}):")
    print(f"  Numerator (Test - Media): {numerator:,.0f}")
    print(f"  Survival fraction: {survival_fraction:.4f}")
    print(f"  Cell death: {cell_death:.4f}")
    print(f"  Cell death %: {cell_death_pct:.1f}%")

print("\n" + "="*50)
print("ISSUE IDENTIFIED:")
print("The test conditions (columns 1-5) have MUCH LOWER values than untransduced controls.")
print("This causes the survival fraction to be near 0, resulting in ~99% cell death.")
print("\nColumn 6 appears to be untransduced control based on high values (~1.7-1.8M)")
print("The actual test conditions might be in different positions than assumed.")
print("\nNeed to re-examine the platemap to correctly identify which wells contain:")
print("1. Test conditions (shRNA treatments)")
print("2. Untransduced controls") 
print("3. Media only controls")