import { Stack } from "expo-router";

const ChannelStack = () => {
  return (
    <Stack>
      <Stack.Screen name="[cid]" options={{ headerShown: false, }} />
    </Stack>
  );
};

export default ChannelStack;
