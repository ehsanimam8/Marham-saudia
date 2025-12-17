CREATE TABLE IF NOT EXISTS priorities (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon TEXT,
    applies_to_categories TEXT, -- comma separated list
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON priorities FOR SELECT USING (true);
CREATE POLICY "Allow service role full access" ON priorities USING (true);
