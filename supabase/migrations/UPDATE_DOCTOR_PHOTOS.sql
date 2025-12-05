-- Update existing doctor records with profile photos
-- Run this in Supabase SQL Editor to add images to existing doctors

UPDATE doctors 
SET profile_photo_url = '/images/doctors/doctor_noura_alrashid_1764849899936.png'
WHERE scfhs_license = '10101010';

UPDATE doctors 
SET profile_photo_url = '/images/doctors/doctor_sara_alahmed_1764849915248.png'
WHERE scfhs_license = '20202020';

UPDATE doctors 
SET profile_photo_url = '/images/doctors/doctor_laila_alomari_1764849928738.png'
WHERE scfhs_license = '30303030';

UPDATE doctors 
SET profile_photo_url = '/images/doctors/doctor_amal_alharbi_1764849951730.png'
WHERE scfhs_license = '40404040';

UPDATE doctors 
SET profile_photo_url = '/images/doctors/doctor_haifa_alsulaiman_1764849970279.png'
WHERE scfhs_license = '50505050';
