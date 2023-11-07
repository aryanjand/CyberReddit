/*
  Warnings:

  - A unique constraint covering the columns `[user_id,content_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Like_user_id_content_id_key` ON `Like`(`user_id`, `content_id`);
