# Hubble by Cavli Wireless

## Project structure

A single Next.js app serves both the frontend and the backend: Route Handlers serve the API, and Server Components read the database directly.

### Backend

| Path                       | Contents                                                    |
| -------------------------- | ----------------------------------------------------------- |
| `src/server/`              | Server-only code, guarded by `server-only`                  |
| `src/server/db.ts`         | Shared Prisma client                                        |
| `src/server/env.ts`        | Environment variable validation                             |
| `src/server/repositories/` | Database queries                                            |
| `src/server/scraper/`      | MMI Connect scraper: auth, fetching, validation and upserts |
| `src/app/api/`             | Route Handlers (`/api/*` endpoints)                         |
| `prisma/`                  | Database schema and migrations                              |
| `src/generated/prisma/`    | Generated Prisma client                                     |

### Frontend

| Path              | Contents                                                 |
| ----------------- | -------------------------------------------------------- |
| `src/app/`        | Pages, root layout and global styles                     |
| `src/layouts/`    | Page layouts (header, footer)                            |
| `src/modules/`    | Feature modules (`home`, `product`) and their components |
| `src/components/` | Reusable UI components                                   |
| `public/`         | Static assets                                            |

### Shared

| Path          | Contents         |
| ------------- | ---------------- |
| `src/consts/` | Constants        |
| `src/types/`  | TypeScript types |
| `src/utils/`  | Helper functions |

Server Components may import from `src/server/` directly; Client Components must not.
