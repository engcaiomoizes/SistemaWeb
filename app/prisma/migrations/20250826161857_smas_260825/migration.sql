/*
  Warnings:

  - You are about to drop the column `laudoId` on the `Baixas` table. All the data in the column will be lost.
  - You are about to drop the `Laudos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Baixas` DROP FOREIGN KEY `Baixas_laudoId_fkey`;

-- DropForeignKey
ALTER TABLE `Laudos` DROP FOREIGN KEY `Laudos_autorId_fkey`;

-- DropIndex
DROP INDEX `Baixas_laudoId_fkey` ON `Baixas`;

-- AlterTable
ALTER TABLE `Baixas` DROP COLUMN `laudoId`,
    ADD COLUMN `laudo` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Laudos`;
