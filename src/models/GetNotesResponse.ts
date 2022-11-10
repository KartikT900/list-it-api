import { Note } from './Note';

export interface GetNotesResponse {
  owned: Note[] | null;
  shared: Note[] | null;
}
