/*
  Warnings:

  - A unique constraint covering the columns `[emailConfirmToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailConfirmExpires" TIMESTAMP(3),
ADD COLUMN     "emailConfirmToken" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailConfirmToken_key" ON "User"("emailConfirmToken");
