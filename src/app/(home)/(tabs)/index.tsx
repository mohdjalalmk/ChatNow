import { useAuth } from "@/src/providers/AuthProvider";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
} from "stream-chat-expo";

export default function ChatScreen() {
  const [channel, setChannel] = useState();
  const { user } = useAuth();

  return (
    <ChannelList
      filters={{ members: { $in: [user.id] } }}
      onSelect={(channel) => {
        router.push(`/channel/${channel.cid}`);
      }}
    />
  );
}
