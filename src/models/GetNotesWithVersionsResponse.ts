import { Note } from './Note';
import { NoteVersion } from './NoteVersion';

export interface GetNotesWithVersionsResponse {
  current: Note;
  previousVersions: NoteVersion[];
}
