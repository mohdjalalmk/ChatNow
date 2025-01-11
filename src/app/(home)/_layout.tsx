import { useAuth } from "@/src/providers/AuthProvider";
import CallProvider from "@/src/providers/CallProvider";
import { ChatProvider } from "@/src/providers/ChatProviders";
import VideoProvider from "@/src/providers/VideoProvider";
import { Redirect, Slot, Stack } from "expo-router";
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance("5gsxn33t5zd7");

export default function HomeLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href={"/(auth)/login"} />;
  }
  return (
    <ChatProvider>
      <VideoProvider>
        <CallProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </CallProvider>
      </VideoProvider>
    </ChatProvider>
  );
}
