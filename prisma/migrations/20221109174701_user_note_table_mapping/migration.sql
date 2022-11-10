-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "user_id" VARCHAR(20) NOT NULL,
    "nickname" VARCHAR,

    CONSTRAINT "User_Primary_Key" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "noteId" VARCHAR(40) NOT NULL,
    "ownerId" VARCHAR(255) NOT NULL,

    CONSTRAINT "Note_Primary_Key" PRIMARY KEY ("noteId")
);

-- CreateTable
CREATE TABLE "noteonuser" (
    "noteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "noteonuser_pkey" PRIMARY KEY ("noteId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unique_user" ON "user"("name", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Unique_note" ON "note"("noteId");

-- AddForeignKey
ALTER TABLE "noteonuser" ADD CONSTRAINT "noteonuser_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "note"("noteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noteonuser" ADD CONSTRAINT "noteonuser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
