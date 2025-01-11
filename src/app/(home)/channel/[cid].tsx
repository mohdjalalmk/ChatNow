import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
import * as Crypto from "expo-crypto";

const ChannelScreen = () => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();

  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();

  const fetchChannel = async () => {
    const channel = await client.queryChannels({ cid });
    console.log("channel array:", channel);

    setChannel(channel[0]);
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  const startACall = async () => {
    // create a call using channel members
    const UUID = Crypto.randomUUID();
    const members = Object.values(channel?.state?.members).map((member) => ({
      user_id: member.user_id,
    }));

    console.log("members:", members);

    const call = videoClient.call("default", UUID);

    await call.getOrCreate({
      ring:true,
      data: {
        members,
      },
    });
    // await call.join()
    // await call.getOrCreate();
    // navigate to the call screen
    // router.push(`/call`);
  };

  if (!channel) {
    return <LoadingIndicator />;
  }
  return (
    <Channel audioRecordingEnabled={true} channel={channel}>
      <Stack.Screen
        options={{
          title: "Chat",
          headerRight: () => <Text onPress={startACall}>Call</Text>,
        }}
      />
      <MessageList />
      <SafeAreaView edges={["bottom"]}>
        <MessageInput />
      </SafeAreaView>
    </Channel>
  );
};

export default ChannelScreen;
