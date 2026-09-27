# Google Search Console setup for Drive Curaçao

Use Google Search Console to help Google discover and monitor Drive Curaçao pages, especially the SEO landing pages.

## Goal

Verify `drivecuracao.com`, submit the sitemap, and monitor indexing/search performance.

Important URLs:

- Website: `https://drivecuracao.com/`
- Sitemap: `https://drivecuracao.com/sitemap.xml`
- Robots: `https://drivecuracao.com/robots.txt`

## Recommended property type

Use a **Domain property** if possible:

- `drivecuracao.com`

This covers:

- `https://drivecuracao.com`
- `https://www.drivecuracao.com`
- any future subdomains

If domain verification is not convenient, use a URL-prefix property:

- `https://drivecuracao.com/`

## Verification options

### Best option: DNS verification

1. Open Google Search Console.
2. Add property: `drivecuracao.com`.
3. Choose Domain property.
4. Google provides a TXT record.
5. Add that TXT record in the DNS provider for the domain.
6. Wait for DNS propagation, then click Verify.

### Alternative: HTML file verification

If using URL-prefix property, Google can provide an HTML verification file.

1. Download the Google verification HTML file.
2. Add it to the repo under `public/`.
3. Open a PR and deploy it.
4. Verify in Google Search Console.

Do not commit private credentials or account secrets. A Google verification HTML file is usually safe because it is meant to be public, but confirm the file is exactly the verification file from Google.

## Submit the sitemap

After verification:

1. Open the Drive Curaçao property in Google Search Console.
2. Go to **Sitemaps**.
3. Enter: `sitemap.xml`.
4. Submit.

Google should then discover these important pages:

- `/`
- `/cars`
- `/auto-huren-curacao`
- `/car-rental-curacao-airport`
- `/cheap-car-rental-curacao`
- `/rent-a-car-willemstad`
- `/how-it-works`
- `/faq`

## First checks after submitting

In Search Console, check:

- Sitemap status: Success
- Pages indexed / not indexed
- Crawl errors
- Search queries that start appearing
- Clicks and impressions by page

## What to monitor weekly

Review once per week during the launch phase:

1. Which pages are indexed.
2. Which search queries generate impressions.
3. Which pages get clicks.
4. Any mobile usability or indexing issues.
5. Whether new landing pages are needed for terms Google starts showing.

## Next improvement ideas

Once Search Console is active, use query data to decide the next pages or copy updates:

- If Dutch queries grow, improve `/auto-huren-curacao`.
- If airport queries grow, improve `/car-rental-curacao-airport`.
- If budget queries grow, improve `/cheap-car-rental-curacao`.
- If city/accommodation queries grow, improve `/rent-a-car-willemstad`.
