/*
  Warnings:

  - Added the required column `index` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `Subtask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `board` ADD COLUMN `index` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `column` ADD COLUMN `index` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `subtask` ADD COLUMN `index` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `index` INTEGER NOT NULL;
