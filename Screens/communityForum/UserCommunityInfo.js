import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../auth/firebase";
import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import UserCommunityAnnouncements from "./UserCommunityAnnouncements";

export function UserCommunityInfo() {
  // const navigation
  const navigation = useNavigation();
  // Storing User Email
  const [userEmail, setUserEmail] = useState({});
  // Storing User Info
  const [userInfo, setUserInfo] = useState({});
  // user community data
  const [item, setItem] = useState({});
  // right top settings controller
  const [showOptions, setShowOptions] = useState(false);
  // Getting details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(firestore, "userDetails", user.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserEmail(user.email);
            setUserInfo({ ...docSnap.data() });
            // console.log("from communityInfo", docSnap.data());
          } else {
            console.log("No such document!");
            setUserInfo({});
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          setUserInfo({});
        }
      }
    });

    return () => unsubscribe(); // Cleanup function to prevent memory leaks
  }, []);

  // fetching user community data

  useEffect(() => {
    if (!userInfo?.community) {
      return;
    }

    const communityRef = doc(firestore, "community", userInfo.community);

    // Real-time listener
    const unsubscribe = onSnapshot(
      communityRef,
      (communitySnap) => {
        if (communitySnap.exists()) {
          setItem(communitySnap.data());
        } else {
          console.log("Community not found");
        }
      },
      (error) => {
        console.error("Error fetching community details:", error);
      }
    );

    // Cleanup function to remove listener when component unmounts or userInfo.community changes
    return () => unsubscribe();
  }, [userInfo.community]);

  // handling leaving community action
  const handleLeaveCommunity = async () => {
    if (!userEmail) {
      Alert.alert("Error", "User email is required.");
      return;
    }
    try {
      const userDocRef = doc(firestore, "userDetails", userEmail);
      const communityRef = doc(firestore, "community", userInfo.community);
      // updating user doc
      await updateDoc(userDocRef, {
        community: "",
      });
      // updating community doc
      await updateDoc(communityRef, {
        members: arrayRemove(userEmail),
      }).then(() => navigation.navigate("CommunityList"));
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };

  // announcement options
  const announcementOptions = [
    {
      type: "Event and Meetups",
      imgURI: require("../../assets/eventsIcon.png"),
    },
    {
      type: "Emergency",
      imgURI: require("../../assets/emerygencyIcon.png"),
    },
    {
      type: "Construction and Road Works",
      imgURI: require("../../assets/constructionIcon.png"),
    },
    {
      type: "Accident",
      imgURI: require("../../assets/accidentIcon.png"),
    },
    {
      type: "Fund Raise and Donation",
      imgURI: require("../../assets/fundRaiseIcon.png"),
    },
    {
      type: "Achievements",
      imgURI: require("../../assets/achievementIcon.png"),
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* announcement btn */}
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={styles.announcementBtn}
      >
        {!modalVisible && (
          <Image
            style={styles.announcementImg}
            source={require("../../assets/announcement.png")}
          />
        )}
        {modalVisible && (
          <Image
            style={styles.announcementImg}
            source={require("../../assets/closeBtn.png")}
          />
        )}
      </TouchableOpacity>
      {/* Modal for Announcement Input */}

      {modalVisible && (
        <View
          style={{
            height: 400,
            width: 60,
            backgroundColor: "rgb(255, 255, 255)",
            elevation: 2,
            position: "absolute",
            left: 18,
            bottom: 80,
            zIndex: 3,
            borderRadius: 25,
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
        >
          {announcementOptions.map((info, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("AnnouncementForm", { type: info.type,community:userInfo.community });
                }}
                key={index}
                style={{ height: "17%", alignItems: "center" }}
              >
                <Image
                  style={{
                    width: "90%",
                    height: "90%",
                    resizeMode: "contain",
                  }}
                  source={info.imgURI}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: "15%", width: "100%" }}>
        <Text style={styles.greetText}>Welcome to </Text>
        <Text style={styles.head}>{userInfo.community}</Text>
        <Text style={styles.greetText}>Community</Text>
      </View>
      {/* all announcement */}
      <View style={{ height: "85%", width: "90%", marginHorizontal: "auto" }}>
        {(!item.announcements || item?.announcements.length == 0) && (
          <View
            style={{
              height: "80%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Image
              style={{ height: "60%", width: "60%" }}
              source={require("../../assets/noAnnouncement.png")}
            />
            <Text style={{ fontWeight: "bold" }}>
              No Announcement has been made Yet
            </Text>
          </View>
        )}
        {item.announcements && (
          <UserCommunityAnnouncements announcements={item.announcements} />
        )}
      </View>
      {/* settings btn */}
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
          <Image
            style={styles.settingsImg}
            source={require("../../assets/settings.png")}
          />
        </TouchableOpacity>
        {/* settings options */}
        {showOptions && (
          <View style={styles.optionsBox}>
            <TouchableOpacity
              onPress={handleLeaveCommunity}
              style={styles.optionButton}
            >
              <FontAwesome
                name="sign-out"
                size={15}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.optionText}>Leave</Text>
            </TouchableOpacity>

            {item && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CommunityDetails", {
                    item,
                  })
                }
                style={styles.optionButton}
              >
                <FontAwesome
                  name="users"
                  size={15}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Members</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greetText: {
    textAlign: "center",
    fontSize: 18,
  },
  head: {
    textAlign: "center",
    fontSize: 25,
  },
  btnContainer: {
    resizeMode: "contain",
    position: "absolute",
    right: 10,
    top: 15,
  },
  announcementBtn: {
    position: "absolute",
    left: 20, // Adjust for proper positioning
    bottom: 20, // 50px above the bottom
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 50, // Circular button
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // For shadow effect (Android)
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 5,
  },
  announcementImg: {
    width: 35,
    height: 35,
  },

  // settings style
  btnContainer: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  settingsImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  optionsBox: {
    position: "absolute",
    top: 35, // Positions below the settings button
    right: 0,
    backgroundColor: "rgb(227, 227, 227)",
    borderRadius: 8,
    padding: 5,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FF3B30",
    marginVertical: 3,
    borderRadius: 5,
  },
  optionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8,
  },
});

export default UserCommunityInfo;
