/*
  Warnings:

  - Added the required column `localId` to the `Ramais` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ramais` ADD COLUMN `localId` INTEGER NOT NULL;
