/*
  Warnings:

  - You are about to drop the `Digitalizados` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Patrimonios` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Digitalizados`;
