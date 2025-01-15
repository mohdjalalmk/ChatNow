import { Pressable, Text } from "react-native";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from "../providers/AuthProvider";
import { router } from "expo-router";

const UsersListItem = ({ userItem }) => {
    // this page rerendering evry time , un comment this and see
    // console.log(userItem);
    
const {client} = useChatContext ()
const {user: loggedInUser } = useAuth()
    const onStartChat = async () =>{
        const channel = client.channel("messaging", {
            members:[loggedInUser?.id,userItem?.id]
        });
          // Here, 'travel' will be the channel ID
          // await channel.create(); // create channel 
          await channel.watch() // create and subscripe to channel
        //   router.replace(`/channel/${channel.cid}`);

          router.replace(`/(home)/channel/${channel?.cid}`)
    }
  return (
    <Pressable onPress={onStartChat}>
      <Text>{userItem?.full_name}</Text>
    </Pressable>
  );
};

export default UsersListItem;
