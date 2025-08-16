-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'PENDING',
    "careerId" TEXT,
    CONSTRAINT "User_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("careerId", "createdAt", "documentId", "email", "firstName", "id", "lastName", "password", "status", "updatedAt") SELECT "careerId", "createdAt", "documentId", "email", "firstName", "id", "lastName", "password", "status", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_documentId_key" ON "User"("documentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
