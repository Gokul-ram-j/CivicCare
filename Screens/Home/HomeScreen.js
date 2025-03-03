import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Vibration,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Location from "expo-location";
import moment from "moment";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { firestore as db, auth } from "../auth/firebase";
import { useNavigation } from "@react-navigation/native";
import Foundation from '@expo/vector-icons/Foundation';
const { height, width } = Dimensions.get("window");


// 🔹 Set notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => {
    Vibration.vibrate([1000, 500, 500,1000, 1000, 500,500,1000]); 

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});


export default function HomeScreen() {
  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [isMemberOfCommunity, setIsMemberOfCommunity] = useState(false);
  const [communityName, setCommunityName] = useState("");

  // 🔹 Handle notification tap to navigate to SOSAlertInfo
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped on notification:", response.notification);
        Vibration.vibrate(); // Vibrate on tap

        const notificationData = response.notification.request.content.data;

        // Ensure navigation is available
        if (navigation && navigation.navigate) {
          navigation.navigate("AppTabs", {
            screen: "Home",
            params: {
              screen: "SOSEmergencyMsg",
              params: notificationData,
            },
          });
        } else {
          console.warn("Navigation object is not available");
        }
      });

    return () => {
      responseListener.remove();
    };
  }, [navigation]); // Make sure `navigation` is included in dependencies

  // 🔹 Register for push notifications
  useEffect(() => {
    async function registerForPushNotifications() {
      if (!Device.isDevice) {
        Alert.alert("Must use a physical device for push notifications");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission for push notifications was denied");
        return;
      }

      // 🔹 Get Expo Push Token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      setExpoPushToken(token);

      // 🔹 Store token in Firestore for the logged-in user
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, "users", user.email),
          { pushToken: token },
          { merge: true }
        );
      }
    }

    registerForPushNotifications();
  }, []);

  // 🔹 Check if the user is a member of a community
  useEffect(() => {
    
    async function checkUserCommunity() {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("User not logged in.");
        return;
      }

      const userDoc = await getDoc(doc(db, "userDetails", user.email));
      if (!userDoc.exists()) {
        Alert.alert("User details not found.");
        return;
      }

      const userData = userDoc.data();
      const userCommunity = userData.community;

      if (!userCommunity) {
        setIsMemberOfCommunity(false);
        Alert.alert("You are not a member of any community. Please join one.");
        return;
      }

      setCommunityName(userCommunity);
      setIsMemberOfCommunity(true);
    }

    checkUserCommunity();
  }, []);

  // 🔹 Get actual location (City, Street, etc.)
  async function getActualLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return "Location not available";
    }

    let location = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];
      return `${address.street}, ${address.city}, ${address.region}`;
    }

    return "Location not found";
  }

  // 🔹 Send emergency notifications to community members
  async function checkUserCommunityAndSendNotifications() {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("User not logged in.");
      return;
    }

    const userDoc = await getDoc(doc(db, "userDetails", user.email));
    if (!userDoc.exists()) {
      Alert.alert("User details not found.");
      return;
    }

    const userData = userDoc.data();
    const userCommunity = userData.community;

    if (!userCommunity) {
      setIsMemberOfCommunity(false);
      Alert.alert("You are not a member of any community.");
      return;
    }

    setCommunityName(userCommunity);
    setIsMemberOfCommunity(true);

    const communityDoc = await getDoc(doc(db, "community", userCommunity));
    if (!communityDoc.exists()) {
      Alert.alert("Community details not found.");
      return;
    }

    const communityData = communityDoc.data();
    const members = communityData.members;

    if (!members || members.length === 0) {
      Alert.alert("No members in this community.");
      return;
    }

    let pushTokens = [];

    for (const memberEmail of members) {
      const memberDoc = await getDoc(doc(db, "users", memberEmail));
      if (memberDoc.exists() && memberDoc.data().pushToken) {
        pushTokens.push(memberDoc.data().pushToken);
      }
    }

    if (pushTokens.length === 0) {
      Alert.alert("No valid push tokens found.");
      return;
    }

    const date = moment().format("YYYY-MM-DD");
    const time = moment().format("hh:mm A");
    const location = await getActualLocation();
    const messages = pushTokens.map((token) => ({
      to: token,
      sound: "../../assets/sos.mp3",  // Custom sound file
      title: "🚨 Emergency Alert 🚨",
      body: `${userData.userData.name} needs help immediately!`,
      data: {
        name: userData.userData.name,
        date: date,
        time: time,
        location: location,
      },
    }));
    
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    Alert.alert("Emergency notifications sent!");
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity  style={styles.sosButton} onPress={checkUserCommunityAndSendNotifications}>
      <Foundation name="alert" size={150} color="white" />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Emergency Push Notifications</Text>
        <Text style={styles.communityText}>
          {isMemberOfCommunity
            ? `Community: ${communityName}`
            : "Not part of any community"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%',
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    position: "absolute",
    top: height * 0.1,
    width: width * 0.5,
    height: height * 0.25,
    borderRadius: height * 0.125,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  sosText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  communityText: {
    fontSize: 16,
    marginTop: 10,
  },
});
