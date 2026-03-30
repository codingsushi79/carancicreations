-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "inquiry_id" TEXT;

-- CreateIndex
CREATE INDEX "invoices_inquiry_id_idx" ON "invoices"("inquiry_id");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
