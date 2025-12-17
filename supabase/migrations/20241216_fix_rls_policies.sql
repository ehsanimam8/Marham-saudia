
CREATE POLICY "Authenticated users can insert pre_consultation_data" ON pre_consultation_data
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Authenticated users can update pre_consultation_data" ON pre_consultation_data
    FOR UPDATE USING (auth.role() = 'authenticated');

