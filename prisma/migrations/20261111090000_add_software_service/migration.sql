-- Fresh databases get the full service catalogue from the seed.
INSERT INTO "Service" ("id", "icon", "titleMn", "titleEn", "textMn", "textEn", "sortOrder", "visible", "updatedAt")
SELECT 'software-web-development', 'software',
       'Программ хангамж ба веб хөгжүүлэлт', 'Software & web development',
       'Байгууллагын вебсайт, дотоод удирдлагын систем болон ажлын урсгал автоматжуулах программ хангамж хөгжүүлнэ.',
       'We build business websites, internal management systems and software that automates day-to-day workflows.',
       (SELECT MAX("sortOrder") + 1 FROM "Service"), true, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Service")
  AND NOT EXISTS (SELECT 1 FROM "Service" WHERE "icon" = 'software')
ON CONFLICT ("id") DO NOTHING;
ALTER TABLE "Service" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

