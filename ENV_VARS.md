# Env Variables (Concise)

## Where to get values
- `DATABASE_URL`: Render PostgreSQL service connection string.
- `JWT_SECRET` / `JWT_REFRESH_SECRET`: generate locally.
- `REDIS_URL`: Render Redis URL.
- `ELASTICSEARCH_NODE` / `ELASTICSEARCH_API_KEY`: Elastic Cloud deployment credentials.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Cloudinary Console -> Settings -> API Keys.
- `CORS_ORIGIN`: your Vercel frontend URL.

## Required backend vars
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

## Optional backend vars
- `REDIS_ENABLED`, `REDIS_URL`
- `ELASTICSEARCH_ENABLED`, `ELASTICSEARCH_NODE`, `ELASTICSEARCH_API_KEY`, `ELASTICSEARCH_INDEX`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`

## Frontend vars
- `VITE_API_BASE_URL`: backend public URL + `/api/v1`
- `VITE_SOCKET_URL`: backend public URL

## Validation
Backend validates env at startup in `backend/src/config/env.js`.
If required vars are missing, startup fails with a clear error list.
