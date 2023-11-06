/*
  Warnings:

  - You are about to drop the column `last_name` on the `Like` table. All the data in the column will be lost.
*/
-- AlterTable
ALTER TABLE `Like` DROP COLUMN `last_name`;

ALTER TABLE `Content` DROP FOREIGN KEY `Content_content_parent_id_fkey`;
ALTER TABLE `Content` DROP INDEX `Content_content_parent_id_key`

