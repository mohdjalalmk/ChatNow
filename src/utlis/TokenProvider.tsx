import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/superbase";

export const TokenProvider = async () => {
  // Create a single supabase client for interacting with your database

  const { data, error } = await supabase.functions.invoke("stream-token");
  return data.token ;
};
