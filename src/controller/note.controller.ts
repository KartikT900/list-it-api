import { Request, Response, Router } from 'express';

import { SaveNoteRequest } from 'models/SaveNoteRequest';
import {
  getOwnedNotesByUserId,
  getSharedNotesByUserId,
  saveNote,
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
      const result = {
        owned: ownedNotes,
        shared: sharedNotes
      };

      return res.status(200).json(result);
    } else {
      return res
        .status(500)
        .json({ message: 'Failed to retrive notes' });
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

export default router;
