import { NoteVersion } from './NoteVersion';
import { SharedOwners } from './SharedOwners';

export interface Note {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  noteId: string;
  title: string;
  content: string;
  ownerId: string;
  lastModifiedBy: string;
  sharedOwners?: SharedOwners[];
  noteversions?: NoteVersion[];
}
