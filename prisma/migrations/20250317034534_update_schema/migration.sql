/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ParentalAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ParentalAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_parentalAccountId_fkey";

-- AlterTable
ALTER TABLE "ParentalAccount" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ParentalAccount_name_key" ON "ParentalAccount"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentalAccountId_fkey" FOREIGN KEY ("parentalAccountId") REFERENCES "ParentalAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
