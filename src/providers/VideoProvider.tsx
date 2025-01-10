import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/superbase";
import { tokenProvider } from "../utlis/TokenProvider";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;

const VideoProvider = ({ children }: PropsWithChildren) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const { profile } = useAuth();
  useEffect(() => {
    if (!profile) {
      return;
    }
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);

    const initVideoClient = async () => {
      const user = {
        id: profile.id,
        name: profile.full_name,
        image: data.publicUrl,
      };
      const client = new StreamVideoClient({ apiKey, user, tokenProvider });
      setVideoClient(client);
    };
    initVideoClient();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [profile?.id]);
  if (!videoClient) {
    return <ActivityIndicator />;
  }
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default VideoProvider;
