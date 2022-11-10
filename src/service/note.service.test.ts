import {
  findNoteById,
  getOwnedNotesByUserId,
  getSharedNotesByUserId,
  saveNote,
  updateNoteSharedOwners
} from './note.service';

import { prismaMock } from '../../setupTest';
import { SaveNoteRequest } from 'models/SaveNoteRequest.js';

/** These tests are borderline pointless, except when the service has some
 * business logic, other than plain queries */
describe('note.service', () => {
  const note = {
    id: 1,
    title: 'test',
    content: 'test content',
    noteId: '9896bd3f-fe69-4bf0-b5c2-1dafd8c4c40f',
    ownerId: 'testowner',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };

  it('runs savesNote successfully', async () => {
    const saveNoteRequest: SaveNoteRequest = {
      ownerId: note.ownerId,
      title: note.title,
      content: note.content
    };
    prismaMock.note.create.mockResolvedValue(note);

    const result = await saveNote(saveNoteRequest);

    expect(result).toEqual(note);
  });

  it('runs findNoteById successfully', async () => {
    prismaMock.note.findUnique.mockResolvedValue(note);

    const result = await findNoteById(note.noteId);

    expect(result).toEqual(note);
  });

  it('runs findNoteById successfully when a note is not found', async () => {
    prismaMock.note.findUnique.mockResolvedValue(null);

    const result = await findNoteById(note.noteId);

    expect(result).toBeNull();
  });

  it('runs getOwnedNotesByUserId successfully', async () => {
    prismaMock.note.findMany.mockResolvedValue([note]);

    const result = await getOwnedNotesByUserId('userId');

    expect(result).toEqual([note]);
  });

  it('runs getOwnedNotesByUserId successfully when no notes are found', async () => {
    prismaMock.note.findMany.mockResolvedValue([]);

    const result = await getOwnedNotesByUserId('userId');

    expect(result).toEqual([]);
  });

  it('runs getSharedNotesByUserId successfully', async () => {
    prismaMock.note.findMany.mockResolvedValue([note]);

    const result = await getSharedNotesByUserId('userId');

    expect(result).toEqual([note]);
  });

  it('runs getSharedNotesByUserId successfully when no notes are found', async () => {
    prismaMock.note.findMany.mockResolvedValue([]);

    const result = await getSharedNotesByUserId('userId');

    expect(result).toEqual([]);
  });

  it('runs updateNoteSharedOwners successfully', async () => {
    prismaMock.note.update.mockResolvedValue(note);

    const result = await updateNoteSharedOwners(
      note.noteId,
      'userId'
    );

    expect(result).toEqual(note);
  });
});
