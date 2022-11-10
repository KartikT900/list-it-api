export interface Note {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  noteId: string;
  title: string;
  content: string;
  ownerId: string;
}
