# Certificate Generation & Distribution Module

Adds bulk certificate issuing, delivery and public verification on top of the
existing Event / Registration system. Registration ≠ eligibility — the event
host uploads an attendance spreadsheet that decides who gets a certificate.

## Host workflow

```
Admin → Events → (event) → Certificates
  → Settings: enable, pick template, toggles                     PUT  /api/admin/events/:id/certificate-settings
  → Upload Attendance Sheet (.csv/.xlsx/.xls, ≤5MB)              POST /api/admin/events/:id/certificate-imports
  → Map columns (auto-detected) → Validate & Preview            PUT  /api/admin/certificate-imports/:batchId/mapping
  → Review table (READY/UNMATCHED/INVALID/DUPLICATE/…)          PATCH /api/admin/certificate-participants/:id
  → Confirm → Generate N Certificates                           POST /api/admin/certificate-imports/:batchId/generate
  → Batch progress (polled)                                      GET  /api/admin/certificate-batches/:batchId/progress
  → Certificate table: View / Download / Resend / Revoke
```

Certificates + emails are produced by a DB-backed job queue
(`certificate_jobs`) drained by an in-process worker (`server/lib/certificateWorker.js`,
concurrency 3). The HTTP request only enqueues.

## Public verification (no auth, rate-limited)

- `GET /verify-certificate` — enter a Certificate ID
- `GET /verify/c/:token` — QR-code target (unguessable 24-byte token)
- API: `GET /api/certificates/verify/:token`, `/api/certificates/lookup/:number`,
  `/api/certificates/file/:token` (inline PDF)
- Returns only: participant name, event, event date text, certificate ID, issuer.
  States: `VALID` / `NOT_FOUND` / `REVOKED`.

## Data model (all in `server/db/schema.sql`, accessed via `server/db/certificateStore.js`)

`certificate_templates`, `event_certificate_configs`, `certificate_import_batches`,
`certificate_participant_imports`, `certificates` (UNIQUE `eventId+participantEmail`),
`certificate_jobs`, `certificate_emails`, `audit_logs`. `events.endDate` column added.

## Certificate identity

- `certificateNumber` — human-readable, format from config `idFormat`
  (`{org}-{event}-{year}-{seq}` → `ELA-BML-2026-000001`). Not a security token.
- `verificationToken` — `crypto.randomBytes(24)` hex, the actual verification key.

## Idempotency / safety

- One active certificate per (event, email) — re-uploading the same sheet marks
  rows `ALREADY_CERTIFIED` and generates nothing new.
- Generate/email jobs are safe to re-run: an already-rendered PDF is skipped, a
  `SENT` email is not resent (unless `force`, used by Resend / Retry).
- Retry only touches failed jobs; successful certificates are never regenerated.

## Config

`PUBLIC_BASE_URL` (`.env`) — origin for QR codes and email links.
Email reuses `server/lib/mailer.js` (now returns `true`/`false` so the queue can
mark `FAILED` and offer "Retry Failed Emails").

## Template render modes

`certificate_templates.renderMode`:

- **`classic`** (default) — the PDF layout is generated from the template fields
  (org name, heading, body text, signatory) plus optional logo / signature /
  seal / background images. Landscape A4.
- **`overlay`** — upload the design as the **Background** — a **PDF** (best;
  stays vector, border never clips) or PNG/JPG, A4 portrait. Ideally a *blank*
  version (frame, logos, headings, "Mr./Ms." line, signature — but no
  participant name, programme name or dates). `pdf-lib` stamps the
  event-specific parts on top:
  - **name** — participant name on the "Mr./Ms." line (Times Bold, navy)
  - **body** — up to four stacked, centred calligraphy lines (bundled
    **Parisienne**, `server/lib/fonts/`): `pre` / `title` (gold) / `mid` /
    `post`, filled from `{{event_name}}`, `{{event_date_text}}`,
    `{{organization_name}}` etc. Any line blank is skipped; a single `body.text`
    also works.
  - **qr** — links to `/verify/c/<token>`
  - **certId** — the certificate number
  - **erase** — optional `{x,y,width,height,color}` rectangle drawn first, to
    cover old body text if the uploaded design isn't blank (match the paper
    colour). Omit for a blank design.

  All coordinates are **top-left PDF points** (renderOverlay converts to
  pdf-lib's bottom-left space). Positions come from `overlayConfig` merged over
  `DEFAULT_OVERLAY` in `server/lib/certificatePdf.js`; a blank field uses the
  default, `size: 0` skips an element. Generate one test certificate and nudge
  the numbers in the template editor.

  `overlayConfig` shape: `{ name:{x,y,size,color},
  body:{x,y,width,size,lineGap,color,accentColor,pre,title,mid,post,text},
  qr:{x,y,size}, certId:{x,y,width,size,color},
  erase:{x,y,width,height,color} }` — every key optional. One blank background
  works for **every** event.

  Font note: a script face must have a plain Unicode cmap for `pdf-lib` —
  Parisienne works, Petit Formal Script renders blank. Swap the `.ttf` in
  `server/lib/fonts/` + `SCRIPT_FONT_PATH` to change it.

## Extending attendance sources (future)

`event_certificate_configs.eligibilityMode` and
`certificate_import_batches.attendanceSource` are enum-ready. A new source only
has to produce `certificate_participant_imports` rows with a status — the
generation engine is source-agnostic.

## Tests

Pure logic: `server/lib/*.test.js` (`certificateDates`, `certificateTemplate`,
`spreadsheet` + `participantValidation`, `participantPipeline`, `certificateId`,
`certificatePdf`). Run: `node server/lib/<name>.test.js`.
Full HTTP workflow verified end-to-end against MySQL (upload → map → match →
review → generate → PDF → email queue → verify → revoke → retry).
