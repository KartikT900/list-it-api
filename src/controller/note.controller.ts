import { Request, Response, Router } from 'express';

// Models
import { GetNotesResponse } from 'models/GetNotesResponse.js';
import { GetNotesWithVersionsResponse } from 'models/GetNotesWithVersionsResponse.js';
import { SaveNoteRequest } from 'models/SaveNoteRequest';
import { UpdateNoteRequest } from 'models/UpdateNoteRequest';

// Service methods
import {
  deleteNoteById,
  getNoteVersions,
  getOwnedNotesByUserId,
  getSharedNotesByUserId,
  saveNote,
  updateNote,
  updateNoteSharedOwners
} from '../service/note.service';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/saveNote', async (req: Request, res: Response) => {
  try {
    const saveRequest = req.body as SaveNoteRequest;

    if (!saveRequest.ownerId || !saveRequest.title) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const result = await saveNote(saveRequest);

    if (result) {
      return res.status(200).json({
        message: `Note with NoteId:${result.noteId} created successfully`
      });
    } else {
      return res
        .status(500)
        .json({ message: 'Failed to create Note' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/notes', async (req: Request, res: Response) => {
  try {
    const userId: string = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const ownedNotes = await getOwnedNotesByUserId(userId);
    const sharedNotes = await getSharedNotesByUserId(userId);

    if (ownedNotes || sharedNotes) {
      const result: GetNotesResponse = {
        owned: ownedNotes,
        shared: sharedNotes
      };

      return res.status(200).json(result);
    } else {
      return res
        .status(500)
        .json({ message: 'Failed to retrieve notes' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/shareNote', async (req: Request, res: Response) => {
  try {
    const userId: string = req.query.userId as string;
    const noteId: string = req.query.noteId as string;

    if (!userId || !noteId) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const result = await updateNoteSharedOwners(noteId, userId);

    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(500)
        .json({ message: 'Failed to update note' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/updateNote', async (req: Request, res: Response) => {
  try {
    const updateNoteRequest: UpdateNoteRequest =
      req.body as UpdateNoteRequest;

    const result = await updateNote(updateNoteRequest);

    if (!result) {
      return res
        .status(500)
        .json({ message: 'Failed to update note' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/noteVersions', async (req: Request, res: Response) => {
  try {
    const noteId: string = req.query.noteId as string;

    if (!noteId) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const result = await getNoteVersions(noteId);

    if (result) {
      const notesWithVersions: GetNotesWithVersionsResponse = {
        current: {
          id: result.id,
          noteId: result.noteId,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          title: result.title,
          content: result.content,
          ownerId: result.ownerId,
          lastModifiedBy: result.ownerId
        },
        previousVersions: [
          ...(result.noteversions?.map((note) => {
            return {
              ...note,
              createdAt: new Date(note.createdAt)
            };
          }) ?? [])
        ]
      };

      return res.status(200).json(notesWithVersions);
    }

    return res
      .status(500)
      .json({ message: 'Failed to retrieve notes' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/deleteNote', async (req: Request, res: Response) => {
  try {
    const noteId: string = req.query.noteId as string;

    if (!noteId) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const result = await deleteNoteById(noteId);

    if (result) {
      return res.status(200).json({
        message: `Note with NoteId:${result.noteId} deleted successfully`
      });
    }

    return res
      .status(500)
      .json({ message: 'Failed to retrieve note' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
