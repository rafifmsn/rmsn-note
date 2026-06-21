# RMSN Note

A privacy-first, local-first multi-files markdown editor. Full feature list:

- Live markdown preview with LaTeX (KaTeX), Mermaid diagrams, and syntax highlighting (Shiki)
- File rename, delete, and bulk delete
- Export as markdown, pdf, bulk export for tab and all files as zip.
- Resizable editor/preview split panel with show/hide toggle
- Char/token count toggle and share url with QR in the editor status bar
- File uploads: markdown, images (lightbox preview), PDFs (inline viewer)
- Kanban board with drag-and-drop, inline card editing, JSON export/import

> More tools are upcoming (will be placed flex-wrap beside kanban)

Consider copy and paste the test file from [TEST.md](./TEST.md) into the editor panel to see it in action.

## Quick Start

```bash
npm install
npm run dev
npm run build
```

## Project Structure

```
src/
  components/       .astro templates + client .ts logic
    editor/         CodeMirror editor panel + preview
    kanban/         Kanban board, cards, drag-and-drop
    modals/         Lightbox, file upload
    navigation/     Sidebar (file tree, tabs), Topbar (export)
    ui/             Confirm tooltip, buttons
  pages/            Route pages (index, kanban, share)
  services/db.ts    IndexedDB schema + CRUD (Dexie)
  utils/            Pure logic: editor, preview renderer,
                    markdown pipeline, export, QR, codec
  styles/           Global CSS (Tailwind v4 themes)
```

## Key Design Decisions

- **IndexedDB (Dexie)** — All data stays client-side. Unlike `localStorage`, it's not readable from sibling origins, offers larger storage quotas, and supports structured data (blobs for images/PDFs).
- **Tab system** — Files are scoped to tabs (Notes, Ideas, Archive). The DB schema supports adding/removing tabs in the future. Delete All only affects the active tab.
- **Share via encoded URL** — Content is gzip-compressed → base64url-encoded → appended as `?content=` param. The `/share` page decodes and renders it in a read-only editor. Click **Add to Editor** to save it to your workspace.
- **QR codes** — The share modal generates a QR code for the encoded URL (disabled when URL exceeds 2000 chars to avoid unreliable scanning).
- **Export** — Single file (Markdown/PDF), current tab (ZIP), or all files+attachments (ZIP).

## Future Scope

The current UI anticipates growth: the sidebar button row is designed for more actions, and the tab schema supports creating, deleting, and migrating files between tabs, but these are intentionally left out of scope for `v0.0.1-alpha.2`.
