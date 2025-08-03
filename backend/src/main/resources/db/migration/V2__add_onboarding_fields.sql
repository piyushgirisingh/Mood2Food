-- Add onboarding fields to students table (safe version)
-- This migration will only add columns that don't already exist

-- Add onboarding_completed column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add preferred_meal_times column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS preferred_meal_times VARCHAR(1000);

-- Add emotional_eating_frequency column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS emotional_eating_frequency VARCHAR(50);

-- Add stress_triggers column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS stress_triggers VARCHAR(1000);

-- Add comfort_foods column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS comfort_foods VARCHAR(1000);

-- Add preferred_coping_methods column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS preferred_coping_methods VARCHAR(1000);

-- Add support_contacts column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS support_contacts VARCHAR(2000);

-- Add calming_songs column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS calming_songs VARCHAR(1000);

-- Add preferred_activities column if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS preferred_activities VARCHAR(1000); 