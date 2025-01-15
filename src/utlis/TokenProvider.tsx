import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/superbase";

export const tokenProvider = async () => {
  // Create a single supabase client for interacting with your database

  const { data, error } = await supabase.functions.invoke("stream-token");
  console.log("s token:",data.token);
  
  return data.token ;
};
