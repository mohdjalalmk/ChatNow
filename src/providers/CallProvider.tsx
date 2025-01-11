import { useCalls } from "@stream-io/video-react-native-sdk";
import { router, useSegments } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { Platform, View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CallProvider = ({ children }: PropsWithChildren) => {
  const calls = useCalls();
  const call = calls[0];
  const segements = useSegments();
  const isCallScreen = segements[1] === "call";
  const { top } = useSafeAreaInsets();
  useEffect(() => {
    if (!call) {
      return;
    }
    console.warn("there is an incoming call", Platform.OS);
    if (!isCallScreen && call.state.callingState ==='ringing') {
      router.push(`/call`);
    }
  }, [call, isCallScreen]);
  return (
    <>
      {children}
      {call && !isCallScreen && (
        <Pressable
          onPress={() => {
            router.push(`/call`);
          }}
          style={{
            position: "absolute",
            top: top + 30,
            left: 10,
            right: 10,
            padding: 10,
            backgroundColor: "green",
          }}
        >
          <Text>Active Call {call?.id}</Text>
        </Pressable>
      )}
    </>
  );
};
export default CallProvider;
