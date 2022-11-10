import { v4 as uuidv4 } from 'uuid';

// Models
import { Note } from 'models/Note';
import { SaveNoteRequest } from 'models/SaveNoteRequest';

import prisma from '../prismaClient';

/**
 * Creates and saves a new Note into the database
 *
 * @param saveNoteRequest details about the new note to save
 * @returns Newly created note
 */
export async function saveNote(
  saveNoteRequest: SaveNoteRequest
): Promise<Note | null> {
  const noteId: string = uuidv4();

  const result = await prisma.note.create({
    data: {
      ...saveNoteRequest,
      noteId
    }
  });

  return result;
}

/**
 * Returns either a Note or nothing basis the NoteId
 *
 * @param noteId NoteId
 * @returns Note
 */
export async function findNoteById(
  noteId: string
): Promise<Note | null> {
  const result = await prisma.note.findUnique({
    where: {
      noteId
    }
  });

  return result;
}

/**
 *  Returns a list of notes owned by a particular userId
 *
 * @param userId string User ID of the user to fetch the corresponding notes
 * @returns Note[] list of notes created/owned by the respective user
 */
export async function getOwnedNotesByUserId(
  userId: string
): Promise<Note[] | null> {
  const result = await prisma.note.findMany({
    where: {
      ownerId: userId
    }
  });

  return result;
}

/**
 *  Returns a list of notes shared to a particular userID
 *
 * @param userId string User ID of the user to fetch the shared notes
 * @returns Note[] list of notes shared to the respective user
 */
export async function getSharedNotesByUserId(
  userId: string
): Promise<Note[] | null> {
  const result = await prisma.note.findMany({
    where: {
      sharedOwners: {
        some: {
          userId
        }
      }
    }
  });

  return result;
}

/**
 * Updates an existing note and adds userId as the shared owner
 *
 * @param noteId string NoteId of the respective Note
 * @param userId string UserId of the respective User
 * @returns updated Note
 */
export async function updateNoteSharedOwners(
  noteId: string,
  userId: string
): Promise<Note | null> {
  const result = await prisma.note.update({
    where: {
      noteId
    },
    data: {
      sharedOwners: {
        create: {
          user: {
            connect: {
              user_id: userId
            }
          }
        }
      }
    }
  });

  return result;
}
