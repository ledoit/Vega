# Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | Recommended on Vercel | Persists workspace JSON across deploys and cold starts |

Create a Blob store in the Vercel project **vega** → Storage → Connect Blob → add token to project env.

Without Blob, production resets to the demo seed on cold start. Local dev persists in `.data/vega-store.json`.
