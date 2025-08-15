-- AddForeignKey
ALTER TABLE `Ramais` ADD CONSTRAINT `Ramais_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `Locais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
