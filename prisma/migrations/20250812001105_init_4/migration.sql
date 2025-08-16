/*
  Warnings:

  - You are about to drop the `_CareerSubjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CareerSubjects";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CareerSubjects" (
    "careerId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,

    PRIMARY KEY ("careerId", "subjectId"),
    CONSTRAINT "CareerSubjects_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CareerSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
