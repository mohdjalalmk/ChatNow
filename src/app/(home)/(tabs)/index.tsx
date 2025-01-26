import { useAuth } from "@/src/providers/AuthProvider";
import { router, Stack } from "expo-router";
import { ChannelList } from "stream-chat-expo";

export default function ChatScreen() {
  const { user } = useAuth();

  return (
    <>
      <Stack.Screen />
      <ChannelList
        filters={{ members: { $in: [user.id] } }}
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
      />
    </>
  );
}
