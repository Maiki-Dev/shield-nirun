-- AlterTable
ALTER TABLE "Leader" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Leader" ADD CONSTRAINT "Leader_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Leader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
