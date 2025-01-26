import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
    const {user} = useAuth()
    
    if(user){
        return <Redirect href={'/(home)'}/>
    }
  return <Stack screenOptions={{headerShown:false}} />;
};
export default AuthLayout;
