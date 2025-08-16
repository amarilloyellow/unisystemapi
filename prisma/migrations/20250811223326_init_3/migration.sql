-- CreateTable
CREATE TABLE "_TeacherSections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TeacherSections_A_fkey" FOREIGN KEY ("A") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TeacherSections_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherSections_AB_unique" ON "_TeacherSections"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherSections_B_index" ON "_TeacherSections"("B");
