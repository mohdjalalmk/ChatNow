import UsersListItem from "@/src/components/UsersList";
import { supabase } from "@/src/lib/superbase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id);
      console.log("profile:",profiles);

      setUsers(profiles);
    };

    fetchUsers();
  }, [user?.id]);

  const renderUserList = ({ item }) => {
    // console.log("ii",item);

    return <UsersListItem userItem={item} />;
  };
  if (!users) {
    return <Text>no users</Text>;
  }
  return (
    <FlatList
      data={users}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => <UsersListItem userItem={item} />}
    />
  );
};
export default UsersScreen;
