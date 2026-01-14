import { supabase } from '../supabase';

export async function ensureProfile(userId: string) {
  try {
    console.log('Ensuring profile for user:', userId);

    // Check if profile already exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing profile:', selectError);
    }

    if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return existingProfile;
    }

    // Create new profile
    console.log('Creating new profile for user:', userId);
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        role: 'student',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw insertError;
    }

    console.log('Profile created successfully:', newProfile);
    return newProfile;

  } catch (error) {
    console.error('Failed to ensure profile:', error);
    throw error;
  }
}
