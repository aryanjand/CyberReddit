-- DropIndex
DROP INDEX `Content_content_description_idx` ON `Content`;

-- CreateIndex
CREATE FULLTEXT INDEX `Content_content_description_idx` ON `Content`(`content_description`);
