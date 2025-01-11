import { ActivityIndicator, Text } from "react-native";
import {
  CallContent,
  RingingCallContent,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCalls,
  User,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";

const callId = "default_b73b791c-62f4-4476-9093-27fe5625255f";

const CallScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useStreamVideoClient();
  // const [call, setCall] = useState();

  const calls = useCalls()
  const call = calls[0]

  // useEffect(() => {
  //   const joinCall = async () => {
  //     const call = client.call("default", id);
  //     await call.get();
  //     setCall(call);
  //   };
  //   joinCall();

  //   return () => {
  //     if (call) {
  //       call.leave();
  //     }
  //   };
  // }, [id]);

  if (!call) {
    if(router.canGoBack()){
      router.back()
    }else{
      router.push('/')
    }
    return null
    }

  return (
    <StreamCall call={call}>
      <RingingCallContent />
    </StreamCall>
  );
};
export default CallScreen;
