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
import { doc, updateDoc, getDoc, arrayRemove } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

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
    const fetchCommunityDetails = async () => {
      if (userInfo?.community) {
        try {
          const communityRef = doc(firestore, "community", userInfo.community);
          const communitySnap = await getDoc(communityRef);

          if (communitySnap.exists()) {
            setItem(communitySnap.data());
          } else {
            console.log("Community not found");
          }
        } catch (error) {
          console.error("Error fetching community details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // No community, stop loading
      }
    };
    fetchCommunityDetails();
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => console.log("pressed")}
        style={styles.announcementBtn}
      >
        <Image
          style={styles.announcementImg}
          source={require("../../assets/announcement.png")}
        />
      </TouchableOpacity>

      <View>
        <Text style={styles.greetText}>Welcome to </Text>
        <Text style={styles.head}>{userInfo.community}</Text>
        <Text style={styles.greetText}>Community</Text>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
          <Image
            style={styles.settingsImg}
            source={require("../../assets/settings.png")}
          />
        </TouchableOpacity>

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
                  navigation.navigate(
                    "CommunityDetails",
                    {item,navigateBackTo:"UserCommunityInfo"}
                  )
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
  },
  announcementImg: {
    width: 50,
    height: 50,
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

{
  /* <TouchableOpacity
          onPress={handleLeaveCommunity}
          style={{
            backgroundColor: "#FF3B30", 
            padding: 12,
            borderRadius: 8,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center'
          }}
        >
          <FontAwesome
            name="sign-out"
            size={15}
            color="white"
            style={{ marginRight: 8 ,marginTop:5}}
          />
          <Text style={{color:'white',fontSize:14,fontWeight:'bold'}}>Leave</Text>
        </TouchableOpacity> */
}
