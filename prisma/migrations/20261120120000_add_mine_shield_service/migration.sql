-- Fresh databases get the full service catalogue from the seed.
INSERT INTO "Service" ("id", "icon", "titleMn", "titleEn", "textMn", "textEn", "images", "sortOrder", "visible", "updatedAt")
SELECT 'mine-shield', 'mine',
       'Mine Shield — Уул уурхайн хамгаалалт', 'Mine Shield — Mining site security',
       'Алслагдсан уурхай, ашигт малтмалын талбайд хээрийн бэлтгэлтэй хамгаалалтын баг, эргүүлийн автомашин, холбооны хэрэгслээр хамгаалалт үйлчилгээ үзүүлнэ.',
       'Security for remote mines and mineral sites, with field-trained guard teams, patrol vehicles and radio communications.',
       ARRAY[]::TEXT[], (SELECT MAX("sortOrder") + 1 FROM "Service"), true, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Service")
  AND NOT EXISTS (SELECT 1 FROM "Service" WHERE "icon" = 'mine')
ON CONFLICT ("id") DO NOTHING;
