import {
  findNoteById,
  getNoteVersions,
  getOwnedNotesByUserId,
  getSharedNotesByUserId,
  saveNote,
  updateNote,
  updateNoteSharedOwners
} from '../../src/service/note.service';

import { Note } from '../../src/models/Note';
import { SaveNoteRequest } from '../../src/models/SaveNoteRequest';

import { prismaMock } from '../../setupTest';
import { UpdateNoteRequest } from '../../src/models/UpdateNoteRequest';

/** These tests are borderline pointless, except when the service has some
 * business logic, other than plain queries */
describe('note.service', () => {
  const note: Note = {
    id: 1,
    title: 'test',
    content: 'test content',
    noteId: '9896bd3f-fe69-4bf0-b5c2-1dafd8c4c40f',
    ownerId: 'testowner',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    lastModifiedBy: 'testowner',
    sharedOwners: [
      {
        userId: 'sharedowner1',
        noteId: '9896bd3f-fe69-4bf0-b5c2-1dafd8c4c40f'
      }
    ]
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

  describe('updateNote', () => {
    const updatedNote: Note = {
      id: 1,
      title: 'test1',
      content: 'test content1',
      noteId: '9896bd3f-fe69-4bf0-b5c2-1dafd8c4c40f',
      ownerId: 'testowner',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      lastModifiedBy: 'testowner',
      sharedOwners: [
        {
          userId: 'sharedowner1',
          noteId: '9896bd3f-fe69-4bf0-b5c2-1dafd8c4c40f'
        }
      ]
    };
    const updateNoteRequest: UpdateNoteRequest = {
      noteId: updatedNote.noteId,
      modifiedBy: updatedNote.ownerId,
      title: updatedNote.title,
      content: updatedNote.content
    };

    it('updates note successfully', async () => {
      prismaMock.note.findUnique.mockResolvedValue(note);

      prismaMock.note.update.mockResolvedValue(updatedNote);

      const result = await updateNote(updateNoteRequest);

      expect(result).toEqual(updatedNote);
    });

    it('throws error when note is not found', async () => {
      prismaMock.note.findUnique.mockResolvedValue(null);

      await expect(updateNote(updateNoteRequest)).rejects.toThrow();
      await expect(
        updateNote(updateNoteRequest)
      ).rejects.toThrowError(
        `Failed to find note with NoteId:${updateNoteRequest.noteId}`
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaMock.note.update).not.toBeCalled();
    });

    it('throws error when the modifiedBy value is neither an owner nor a shared owner for the note to update', async () => {
      prismaMock.note.findUnique.mockResolvedValue(note);

      await expect(
        updateNote({
          ...updateNoteRequest,
          modifiedBy: 'unknownowner'
        })
      ).rejects.toThrow();
      await expect(
        updateNote({
          ...updateNoteRequest,
          modifiedBy: 'unknownowner'
        })
      ).rejects.toThrowError(
        'Failed to update note with userId:unknownowner'
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaMock.note.update).not.toBeCalled();
    });
  });

  it('runs getNoteVersions successfully', async () => {
    const noteWithVersions: Note = {
      ...note,
      noteversions: [
        {
          id: 1,
          note_id: '100473f6-bd29-4f3b-acb5-3268e98d360f',
          title: 'test note1',
          content: 'xnxsjxnjsxjsnsxnjsnxnjnsjxjnnjsxu7878979787',
          createdAt: new Date(Date.now()),
          modifiedBy: '40468f14087e2de0fe24'
        }
      ]
    };

    prismaMock.note.findUnique.mockResolvedValue(noteWithVersions);

    const result = await getNoteVersions(noteWithVersions.noteId);

    expect(result).toEqual(noteWithVersions);
  });
});
