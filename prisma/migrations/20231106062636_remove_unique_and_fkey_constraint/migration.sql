-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_content_parent_id_fkey` FOREIGN KEY (`content_parent_id`) REFERENCES `Content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
