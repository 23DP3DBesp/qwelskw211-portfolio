# QWELSKW portfolio

HTML, CSS and vanilla JavaScript frontend with a Cloudflare Worker, D1 database and R2 media storage, hosted through Sites.

## Owner administration

Open `/admin`. Sites signs the visitor in with ChatGPT. The server enrolls only the verified email configured by the site owner in `ADMIN_OWNER_EMAIL`. Enrollment stores the stable site-scoped user ID in D1. Subsequent access checks use that ID; another signed-in account cannot use the administration APIs. Changing public contact email does not change admin access. Do not clear the `owner` table to transfer access without verifying the replacement identity.

No password, account credential or production authentication bypass is shipped to the browser. The HTML administration page is embedded in the Worker and is not a public static asset. The hosting platform must remain responsible for sanitizing and forwarding the `oai-authenticated-user-*` identity headers. Never expose this Worker directly behind a proxy that trusts client-supplied identity headers.

The site currently remains owner-private. Publishing it for general visitors is a separate audience change; admin checks stay in place.

## Daily editing

- **Projects:** create a project, upload a cover and result images, add a YouTube/Vimeo video link, enter EN/RU text, choose Web/Design/Video and a sort number. Photos belong in Design.
- **Draft / published / hidden:** drafts and hidden projects, including uploaded media only referenced by them, are restricted to the owner. Use the saved-preview link after saving. Smaller sort numbers appear first.
- **Texts, services and contacts:** search original copy and edit both languages, or update Telegram, Instagram, GitHub and email.
- **Inquiries:** the website form saves service, task description and contact method in D1. Mark requests read or processed. No automatic email is sent.

Images: JPEG, PNG, WebP, up to 10 MB each. Galleries: 24 images. SVG uploads are rejected. Large video files use external YouTube/Vimeo links. Unreferenced uploaded files remain private, allowing recovery when editing a draft; there is no destructive media deletion UI.

## Development

Requires Node and npm. `npm ci`, `npm run db:generate` after schema changes, then `npm run build` and `npm run dev`.

Local preview runs at port 4173 with persistent local D1/R2 state in ignored `.wrangler/`. It is anonymous by default: production login is managed by Sites. `npm test` uses an isolated Miniflare environment to test verified owner headers, rejected callers, CSRF, draft media access, revision conflicts and form rate limiting. Test identity headers are never a production login mechanism.

Production settings: `ADMIN_OWNER_EMAIL` is a server-side secret configured in Sites. Logical bindings are `DB` and `MEDIA` in `.openai/hosting.json`. Drizzle migrations under `drizzle/` are schema-only; applied migrations are immutable. The first request seeds the original project concepts and contact details exactly once. Later deployments preserve edited data.

`dist/` is generated output and is rebuilt completely. `server/seed.json` contains only initial concepts, not the live source of truth. Content changes made in admin are stored in D1, image bytes in R2, and language preferences only in local browser storage.
