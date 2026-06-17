import Dexie, { type Table } from "dexie";

export interface TextFile {
  id: string;
  name: string;
  content: string;
  type: "markdown";
  updatedAt: number;
}

export interface AttachedAsset {
  id: string;
  name: string;
  data: Blob;
  type: "image" | "pdf";
  mimeType: string;
  size: number;
  updatedAt: number;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  column: "todo" | "inprogress" | "done";
  order: number;
  createdAt: number;
}

export type ColumnId = "todo" | "inprogress" | "done";

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

class NoteEditorDB extends Dexie {
  files!: Table<TextFile, string>;
  assets!: Table<AttachedAsset, string>;
  kanban!: Table<KanbanCard, string>;

  constructor() {
    super("NoteEditorDB");
    this.version(1).stores({
      files: "id, name, updatedAt",
      assets: "id, name, type, updatedAt",
      kanban: "id, column, order",
    });
  }
}

export const db = new NoteEditorDB();

// ── File helpers ──

export function generateId(): string {
  return crypto.randomUUID();
}

export async function getAllFiles(): Promise<TextFile[]> {
  return db.files.orderBy("name").toArray();
}

export async function getFile(id: string): Promise<TextFile | undefined> {
  return db.files.get(id);
}

export async function saveFile(file: TextFile): Promise<void> {
  await db.files.put({ ...file, updatedAt: Date.now() });
}

export async function deleteFile(id: string): Promise<void> {
  await db.files.delete(id);
}

// ── Asset helpers ──

export async function getAllAssets(): Promise<AttachedAsset[]> {
  return db.assets.orderBy("name").toArray();
}

export async function getAsset(id: string): Promise<AttachedAsset | undefined> {
  return db.assets.get(id);
}

export async function saveAsset(asset: AttachedAsset): Promise<void> {
  await db.assets.put({ ...asset, updatedAt: Date.now() });
}

export async function deleteAsset(id: string): Promise<void> {
  await db.assets.delete(id);
}

// ── Kanban helpers ──

export async function getKanbanCards(): Promise<KanbanCard[]> {
  return db.kanban.orderBy("order").toArray();
}

export async function getKanbanCardsByColumn(
  column: ColumnId,
): Promise<KanbanCard[]> {
  return db.kanban.where("column").equals(column).sortBy("order");
}

export async function saveKanbanCard(card: KanbanCard): Promise<void> {
  await db.kanban.put(card);
}

export async function deleteKanbanCard(id: string): Promise<void> {
  await db.kanban.delete(id);
}

export async function updateKanbanCardColumn(
  id: string,
  column: ColumnId,
  order: number,
): Promise<void> {
  await db.kanban.update(id, { column, order });
}

export async function getNextKanbanOrder(column: ColumnId): Promise<number> {
  const cards = await getKanbanCardsByColumn(column);
  if (cards.length === 0) return 0;
  return Math.max(...cards.map((c) => c.order)) + 1;
}
