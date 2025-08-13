#!/usr/bin/env python3
"""
Update research metrics from Google Scholar
Can be run locally or via GitHub Actions
"""

import sys
import re

try:
    from scholarly import scholarly
except ImportError:
    print("Installing required package: scholarly")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "scholarly"])
    from scholarly import scholarly

# Configuration
SCHOLAR_ID = 'jYIZGT0AAAAJ'
METRICS_FILE = 'src/data/metrics.ts'

def fetch_scholar_metrics(scholar_id):
    """Fetch metrics from Google Scholar"""
    try:
        print(f"Fetching metrics for Scholar ID: {scholar_id}")
        
        # Search for author
        author = scholarly.search_author_id(scholar_id)
        author = scholarly.fill(author)
        
        # Extract metrics
        metrics = {
            'citations': author.get('citedby', 0),
            'h_index': author.get('hindex', 0),
            'i10_index': author.get('i10index', 0),
            'publications': len(author.get('publications', []))
        }
        
        print(f"✅ Fetched metrics successfully:")
        print(f"   - Citations: {metrics['citations']}")
        print(f"   - Publications: {metrics['publications']}")
        print(f"   - h-index: {metrics['h_index']}")
        print(f"   - i10-index: {metrics['i10_index']}")
        
        return metrics
        
    except Exception as e:
        print(f"❌ Error fetching metrics: {e}")
        return None

def update_metrics_file(metrics, scholar_id):
    """Update the TypeScript metrics file"""
    
    content = f"""export const metrics = {{
  publications: {metrics['publications']}, // From Google Scholar
  citations: {metrics['citations']},   // From Google Scholar
  scholarUserId: '{scholar_id}',
  scholarUrl: 'https://scholar.google.com/citations?user={scholar_id}',
  orcidUrl: 'https://orcid.org/0000-0002-7393-6200',
  hIndex: {metrics.get('h_index', 0)},
  i10Index: {metrics.get('i10_index', 0)},
}};
"""
    
    try:
        with open(METRICS_FILE, 'w') as f:
            f.write(content)
        print(f"✅ Updated {METRICS_FILE}")
        return True
    except Exception as e:
        print(f"❌ Error writing file: {e}")
        return False

def main():
    """Main function"""
    print("🔍 Google Scholar Metrics Updater")
    print("-" * 40)
    
    # Fetch metrics
    metrics = fetch_scholar_metrics(SCHOLAR_ID)
    
    if metrics:
        # Update file
        if update_metrics_file(metrics, SCHOLAR_ID):
            print("\n✨ Metrics updated successfully!")
            print("\nNext steps:")
            print("1. Review the changes: git diff src/data/metrics.ts")
            print("2. Commit if satisfied: git add -A && git commit -m 'chore: update research metrics'")
            print("3. Push to deploy: git push")
        else:
            sys.exit(1)
    else:
        print("\n⚠️  Could not fetch metrics. Keeping existing values.")
        sys.exit(1)

if __name__ == "__main__":
    main()