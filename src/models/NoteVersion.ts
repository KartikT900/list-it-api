export interface NoteVersion {
  id?: number;
  note_id?: string;
  title: string;
  content: string;
  modifiedBy: string;
  createdAt: Date;
}
