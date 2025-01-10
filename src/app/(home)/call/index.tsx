import { Text } from "react-native";
import {
    CallContent,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const userId = "f1a683f3-0bee-4bef-ad72-7e36ebe5b6f3";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjFhNjgzZjMtMGJlZS00YmVmLWFkNzItN2UzNmViZTViNmYzIn0.sKvhTS2LIiewvxJXyUQh11GWM80bRff7tQBCSWqXV5Y";
const callId = "default_b73b791c-62f4-4476-9093-27fe5625255f";
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

const CallScreen = () => {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent/>
      </StreamCall>
    </StreamVideo>
  );
};
export default CallScreen;
