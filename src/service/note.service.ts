import { v4 as uuidv4 } from 'uuid';

// Models
import { Note } from 'models/Note';
import { SaveNoteRequest } from 'models/SaveNoteRequest';

import prisma from '../prismaClient';
import { UpdateNoteRequest } from 'models/UpdateNoteRequest';

/**
 * Creates and saves a new Note into the database
 *
 * @param saveNoteRequest details about the new note to save
 * @returns Newly created note
 */
export async function saveNote(
  saveNoteRequest: SaveNoteRequest
): Promise<Note | null> {
  /** Generate a [RFC4122]{@link https://www.ietf.org/rfc/rfc4122.txt} UUID */
  const noteId: string = uuidv4();

  const result = await prisma.note.create({
    data: {
      ...saveNoteRequest,
      lastModifiedBy: saveNoteRequest.ownerId,
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
    },
    include: {
      sharedOwners: true
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
    },
    include: {
      sharedOwners: true
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

/**
 * Updates details of an existing note, while also creating a new version for current note details (before the update). Shared users for a NoteId are also allowed to update the note, provided they the said userId exists as shared for the note.
 *
 * @param updateNoteRequest request containing new note details to update
 * @returns updated note
 */
export async function updateNote(
  updateNoteRequest: UpdateNoteRequest
): Promise<Note | null> {
  /** Get existing note details */
  const currentNoteInfo: Note | null = await findNoteById(
    updateNoteRequest.noteId
  );

  /** If note does not exist, just exit. */
  if (!currentNoteInfo) {
    throw new Error(
      `Failed to find note with NoteId:${updateNoteRequest.noteId}`
    );
  }

  /** While this scenario is not possible from the front-end, it's
   * better to handle this edge case and avoid potential security issues
   * that may crop up with invalid/unauthorized edits to a note with a user,
   * with whom the note is not even shared.
   *
   * This is checking to see if the modifiedBy (alias -> userId) property in
   * updateNoteRequest, is either the note owner or one of the shared owners.
   * If said user is neither, than throw an error.
   */
  if (
    currentNoteInfo.ownerId !== updateNoteRequest.modifiedBy &&
    !currentNoteInfo.sharedOwners?.find(
      (x) => x.userId === updateNoteRequest.modifiedBy
    )
  ) {
    throw new Error(
      `Failed to update note with userId:${updateNoteRequest.modifiedBy}`
    );
  }

  /** Update existing note with new details and create a new note version with
   * existing note details
   */
  const result = await prisma.note.update({
    where: {
      noteId: updateNoteRequest.noteId
    },
    data: {
      title: updateNoteRequest.title,
      lastModifiedBy: updateNoteRequest.modifiedBy,
      content: updateNoteRequest.content,
      noteversions: {
        create: [
          {
            title: currentNoteInfo.title,
            content: currentNoteInfo.content,
            modifiedBy: updateNoteRequest.modifiedBy,
            createdAt: currentNoteInfo.updatedAt
          }
        ]
      }
    }
  });

  return result;
}

export async function getNoteVersions(
  noteId: string
): Promise<Note | null> {
  const result = await prisma.note.findUnique({
    where: {
      noteId
    },
    include: {
      noteversions: true
    }
  });

  return result;
}

export async function deleteNoteById(noteId: string) {
  /**
   * Check if any relational data exists for a note
   */
  const relationalNoteData = await prisma.note.findUnique({
    where: {
      noteId
    },
    include: {
      noteversions: {
        take: 1
      },
      sharedOwners: {
        take: 1
      }
    }
  });

  /** No note with given noteId found */
  if (!relationalNoteData) {
    return relationalNoteData;
  }

  /** Before we can delete a note from DB, we first need to delete
   * relational data from noteversion and noteonuser tables.
   */
  if (
    relationalNoteData.sharedOwners.length !== 0 ||
    relationalNoteData.noteversions.length !== 0
  ) {
    await prisma.note.update({
      where: {
        noteId
      },
      data: {
        noteversions: {
          deleteMany: {}
        },
        sharedOwners: {
          deleteMany: {}
        }
      }
    });
  }

  const result = await prisma.note.delete({
    where: {
      noteId
    }
  });

  return result;
}
