import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Channel as ChannelType } from "stream-chat";
import {
  MessageList,
  MessageInput,
  Channel,
  LoadingIndicator,
  useChatContext,
} from "stream-chat-expo";

const ChannelScreen = () => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();

  const { client } = useChatContext();

  const fetchChannel = async () => {
    const channel = await client.queryChannels({ cid });
    console.log("channel array:", channel);

    setChannel(channel[0]);
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  if (!channel) {
    return <LoadingIndicator />;
  }
  return (
    <Channel audioRecordingEnabled={true} channel={channel}>
      <MessageList />
      <SafeAreaView edges={["bottom"]}>
        <MessageInput />
      </SafeAreaView>
    </Channel>
  );
};

export default ChannelScreen;
