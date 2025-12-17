
CREATE POLICY "Authenticated users can update appointments" ON appointments
    FOR UPDATE USING (auth.role() = 'authenticated');

