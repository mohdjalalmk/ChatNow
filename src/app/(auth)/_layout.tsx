import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
    const {user} = useAuth()
    console.log(user);
    
    if(user){
        return <Redirect href={'/(home)'}/>
    }
  return <Stack />;
};
export default AuthLayout;
