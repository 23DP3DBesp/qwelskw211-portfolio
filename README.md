# QWELSKW portfolio

HTML, CSS and vanilla JavaScript frontend with a Cloudflare Worker, D1 database and R2 media storage, hosted through Sites.

## Owner administration

Open `/admin/login` and use the owner username and password. Production uses `ADMIN_USERNAME` and the secret `ADMIN_PASSWORD_HASH`; the generated password is never included in the browser bundle or source repository. `node scripts/setup-admin.mjs` generates random credentials in ignored `.sites-runtime/admin-credentials.txt` and the matching server configuration in `.sites-runtime/admin-auth.json`. Keep the credentials in a password manager. Configure the hash as a Sites runtime secret and redeploy to activate it.

Sessions use random opaque HttpOnly cookies (Secure on HTTPS, SameSite=Strict), expire after 8 hours, and are stored as SHA-256 hashes in D1. Logout revokes the session. Changing the configured password hash invalidates existing sessions. Login attempts are limited by IP; mutations check the request origin. Authenticated ChatGPT headers cannot grant admin access when password mode is configured.

The legacy ChatGPT owner enrollment remains available only when no password hash is configured. The hosting platform's audience setting is separate: a private Site still requires platform sign-in before reaching the password form. Public portfolio access must be enabled separately; admin routes stay password protected.

## Daily editing

Use **Удалить** next to a project to permanently remove its record after confirmation. The server checks ownership, request origin, and the displayed revision. The public project list and total exclude deleted records. Uploaded image files are retained, so deleting one project cannot break another that uses the same image. Unreferenced uploads stay owner-private.

- **Projects:** create a project, upload a cover and result images, add a YouTube/Vimeo video link, enter EN/RU text, choose Web/Design/Video and a sort number. Photos belong in Design.
- **Draft / published / hidden:** drafts and hidden projects, including uploaded media only referenced by them, are restricted to the owner. Use the saved-preview link after saving. Smaller sort numbers appear first.
- **Texts, services and contacts:** search original copy and edit both languages, or update Telegram, Instagram, GitHub and email.
- **Inquiries:** the website form saves service, task description and contact method in D1. Mark requests read or processed. No automatic email is sent.

Images: JPEG, PNG, WebP, up to 10 MB each. Galleries: 24 images. SVG uploads are rejected. Large video files use external YouTube/Vimeo links. Unreferenced uploaded files remain private, allowing recovery when editing a draft; there is no destructive media deletion UI.

## Development

Requires Node and npm. `npm ci`, `npm run db:generate` after schema changes, then `npm run dev`. Development and tests rebuild automatically to avoid serving stale output. Use `npm run build` for a production build.

Local preview runs at `http://127.0.0.1:4173` with persistent local D1/R2 state in ignored `.wrangler/`. Run `node scripts/setup-admin.mjs` once before `npm run dev` to enable local password login. VS Code Live Server on port 5500 only serves files: it cannot run the API, database, or login. Local and production databases are separate. `npm test` uses an isolated Miniflare environment to test verified owner headers, rejected callers, CSRF, draft media access, revision conflicts and form rate limiting. Test identity headers are never a production login mechanism.

Production settings: `ADMIN_OWNER_EMAIL` is a server-side secret configured in Sites. Logical bindings are `DB` and `MEDIA` in `.openai/hosting.json`. Drizzle migrations under `drizzle/` are schema-only; applied migrations are immutable. The first request seeds the original project concepts and contact details exactly once. Later deployments preserve edited data.

`dist/` is generated output and is rebuilt completely. `server/seed.json` contains only initial concepts, not the live source of truth. Content changes made in admin are stored in D1, image bytes in R2, and language preferences only in local browser storage.

All browser API requests validate JSON responses and reject sign-in redirects. Reload the page to sign in again after session expiry. Editor copy defaults are served by `/api/admin/copy-defaults`; inquiry success requires an explicit `{ok:true}` response.

The homepage project statistic counts the published projects returned by the API. Drafts and hidden projects are excluded; failed loading leaves the statistic unknown instead of showing a made-up total.
