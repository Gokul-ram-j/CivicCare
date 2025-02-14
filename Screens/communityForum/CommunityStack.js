import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityList from "./CommunityList";
import { StyleSheet } from "react-native";
import CommunityForum from "./CommunityForum";
import CommunityDetails from "./CommunityDetails";
import { UserCommunityInfo } from "./UserCommunityInfo";
import AnnouncementForm from "./AnnouncementForm";

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator initialRouteName="CommunityForum">
      <Stack.Screen
        name="CommunityForum"
        component={CommunityForum}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommunityList"
        component={CommunityList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserCommunityInfo"
        component={UserCommunityInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommunityDetails"
        component={CommunityDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnnouncementForm"
        component={AnnouncementForm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
