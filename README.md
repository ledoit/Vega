# Vega

Photo portfolio builder + client delivery for students and photographers.

**Live:** https://vega.menhir-holdings.com

## Modes

| Mode | URL | Device |
|------|-----|--------|
| Product home | `/` | Any |
| Admin (upload, curate, publish) | `/admin` | Desktop |
| Client delivery (pick → download) | `/deliver/{token}` | Mobile |
| Demo published portfolio | `/demo` | Any |

Portfolio builder is a **controller + previewer** — publish to `{slug}.vega.menhir-holdings.com` or custom domain. Delivery is a **facet** on the same album model (private albums, lifecycle states).

## Docs

- [Product definition](./docs/PRODUCT.md)
- [DNS setup](./docs/DNS.md)
- [BOB migration](./docs/BOB-MIGRATION.md)

## Dev

```bash
npm install
npm run dev
```

## Repo

https://github.com/ledoit/Vega
