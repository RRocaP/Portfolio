# Self-Improving Portfolio Features

This portfolio includes automated features to keep your research metrics up-to-date.

## Automatic Metrics Updates

### GitHub Actions Workflow
The portfolio automatically updates research metrics daily from Google Scholar using GitHub Actions.

**Features:**
- Runs daily at 3 AM UTC
- Fetches latest citation count, h-index, and publication count
- Automatically commits changes if metrics have updated
- Can be manually triggered from GitHub Actions tab

### Local Updates
You can also update metrics manually:

```bash
# Install dependencies (first time only)
pip install scholarly

# Run the update script
python scripts/update-metrics.py

# Review changes
git diff src/data/metrics.ts

# Commit and deploy if satisfied
git add -A && git commit -m "chore: update metrics"
git push
```

## Metrics Tracked

The following metrics are automatically updated:
- **Citations**: Total citation count from Google Scholar
- **Publications**: Number of publications
- **h-index**: Hirsch index
- **i10-index**: Number of publications with 10+ citations

## Configuration

The Google Scholar ID is configured in:
- `src/data/metrics.ts` - Scholar ID and URLs
- `scripts/update-metrics.py` - Python script configuration
- `.github/workflows/update-metrics.yml` - GitHub Actions workflow

## Free Tier Limits

This solution works entirely within GitHub's free tier:
- GitHub Actions: 2,000 minutes/month (this uses ~1 minute/day = 30 minutes/month)
- No external API keys required
- Uses the `scholarly` Python package which scrapes Google Scholar publicly

## Troubleshooting

If metrics stop updating:
1. Check GitHub Actions logs for errors
2. Google Scholar may have rate limiting - the workflow will retry next day
3. Ensure your Google Scholar profile is public
4. Verify the Scholar ID is correct in configuration files

## Future Improvements

Potential enhancements (all free):
- Add ORCID metrics fetching
- Track metrics history in a JSON file
- Generate monthly reports
- Add Semantic Scholar as backup source
- Create badges for README with current metrics

## Privacy & Security

- No API keys or secrets required
- Uses public Google Scholar data only
- Runs in GitHub's secure environment
- Changes are transparent in git history