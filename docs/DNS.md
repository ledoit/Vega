# DNS — vega.menhir-holdings.com

Wire **Vega** through Cloudflare to Vercel. Same rules as SyncStation — do not touch Zoho mail records.

## Cloudflare record

| Name | Type | Target | Proxy |
|------|------|--------|-------|
| `vega` | CNAME | `cname.vercel-dns.com` | **DNS only** (grey cloud) first |

After Vercel verifies the domain and SSL is green, you may enable orange-cloud with SSL **Full (strict)**.

## Vercel

Project: **vega** (`menhir-tech` team), GitHub: `ledoit/Vega`.

```bash
cd "Menhir Holdings/Website/vega"
npx vercel@54 link --scope menhir-tech --yes
npx vercel@54 domains add vega.menhir-holdings.com --scope menhir-tech
npx vercel@54 --prod --scope menhir-tech
```

In the Vercel dashboard → **vega** → Settings → Domains, confirm `vega.menhir-holdings.com` is assigned to **Production**.

### Future: photographer subdomains

For `{slug}.vega.menhir-holdings.com` published portfolios:

| Name | Type | Target |
|------|------|--------|
| `*.vega` | CNAME | `cname.vercel-dns.com` |

Or use Vercel wildcard domain on the project when portfolio publish ships.

## URLs

| Role | URL |
|------|-----|
| Product home | https://vega.menhir-holdings.com |
| Admin | https://vega.menhir-holdings.com/admin |
| Client delivery | https://vega.menhir-holdings.com/deliver/{token} |
| Demo portfolio | https://vega.menhir-holdings.com/demo |
