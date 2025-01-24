import { useCalls, useCallStateHooks } from "@stream-io/video-react-native-sdk";
import { router, useSegments } from "expo-router";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { Platform, View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CallProvider = ({ children }: PropsWithChildren) => {
  const calls = useCalls();
  const call = calls[0];
  const segments = useSegments();
  const isCallScreen = segments[1] === "call";
  const { top } = useSafeAreaInsets();


  

  useEffect(() => {
    if (!call) return;
    if (!isCallScreen && call.state.callingState === "ringing") {
      router.push(`/call`);
    }
  }, [call, isCallScreen]);

  return (
    <>
      {children}
      {call && !isCallScreen && call.state.callingState !== "ringing" && (
        <View style={[styles.notificationContainer, { top: top + 10 }]}>
          <Text style={styles.notificationText}>
            Incoming Call
          </Text>
          <Pressable
            style={styles.answerButton}
            onPress={() => {
              router.push(`/call`);
            }}
          >
            <Text style={styles.buttonText}>Back to active call</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderColor: "#4CAF50",
    borderWidth: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  answerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CallProvider;
