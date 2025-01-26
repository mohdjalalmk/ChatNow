import { serve } from 'https://deno.land/std@0.182.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

console.log(`Function "user-self-deletion" up and running!`);

serve(async (req: Request) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization')!;
    
    // Create a Supabase client using the Authorization header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // If no user is found, return an error response
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found or authentication error" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the user's profile
    const { data: profiles, error: userError } = await supabaseClient
      .from('profiles')
      .select('id, avatar_url')
      .eq('id', user.id);

    // Handle any errors or if no profile is found
    if (userError || !profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Profile not found or query error" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user_id = profiles[0].id;
    const user_avatar = profiles[0].avatar_url;

    // Create an admin client for privileged operations (user deletion, avatar removal)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Delete the user's avatar from storage
    const { data: avatar_deletion, error: avatar_error } = await supabaseAdmin
      .storage
      .from('avatars')
      .remove([user_avatar]);
    
    if (avatar_error) throw avatar_error;

    console.log('Avatar deleted: ' + JSON.stringify(avatar_deletion, null, 2));

    // Delete the user from Supabase Auth
    const { data: deletion_data, error: deletion_error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (deletion_error) throw deletion_error;

    console.log('User & files deleted user_id: ' + user_id);

    // Return a success response after successful deletion
    return new Response(
      JSON.stringify({ message: 'User deleted successfully', deletion_data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Catch any errors and return an error response
    return new Response(
      JSON.stringify({ error: "Error: " + error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
