import { Text } from "react-native";
import {
    CallContent,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";


const callId = "default_b73b791c-62f4-4476-9093-27fe5625255f";


const CallScreen = () => {
    const client = useStreamVideoClient()
    const call = client.call("default", callId);
    call.join({ create: true });
    
  return (
      <StreamCall call={call}>
        <CallContent/>
      </StreamCall>
  );
};
export default CallScreen;
