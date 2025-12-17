
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Authenticated users can select appointments') THEN
        CREATE POLICY "Authenticated users can select appointments" ON appointments FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'doctors' AND policyname = 'Authenticated users can select doctors') THEN
        CREATE POLICY "Authenticated users can select doctors" ON doctors FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Authenticated users can select profiles') THEN
        CREATE POLICY "Authenticated users can select profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;

