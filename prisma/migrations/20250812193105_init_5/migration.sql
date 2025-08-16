/*
  Warnings:

  - The primary key for the `SubjectPrerequisites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SubjectPrerequisites` table. All the data in the column will be lost.
  - Added the required column `periodId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ClassSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    CONSTRAINT "ClassSchedule_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNING'
);

-- CreateTable
CREATE TABLE "StudentEnrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "grade1" DECIMAL,
    "grade2" DECIMAL,
    "grade3" DECIMAL,
    "grade4" DECIMAL,
    "remedialGrade" DECIMAL,
    "finalGrade" DECIMAL,
    "sectionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    CONSTRAINT "StudentEnrollment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "classroom" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subjectId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    CONSTRAINT "Section_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Section_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("capacity", "classroom", "code", "createdAt", "id", "name", "subjectId", "updatedAt") SELECT "capacity", "classroom", "code", "createdAt", "id", "name", "subjectId", "updatedAt" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE UNIQUE INDEX "Section_code_key" ON "Section"("code");
CREATE TABLE "new_SubjectPrerequisites" (
    "subjectId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    PRIMARY KEY ("subjectId", "prerequisiteId"),
    CONSTRAINT "SubjectPrerequisites_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubjectPrerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SubjectPrerequisites" ("prerequisiteId", "subjectId") SELECT "prerequisiteId", "subjectId" FROM "SubjectPrerequisites";
DROP TABLE "SubjectPrerequisites";
ALTER TABLE "new_SubjectPrerequisites" RENAME TO "SubjectPrerequisites";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
