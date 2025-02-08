import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../auth/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
export function UserApplication({ navigation }) {
  // user data
  const [userInfo, setUserInfo] = useState({});
  // community application
  const [applications, setApplications] = useState([]);
  // fetching details
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(firestore, "userDetails", user.email);

        // Real-time listener for user details
        const unsubscribeFirestore = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserInfo({ ...docSnap.data(), userEmail: user.email });
              console.log(
                "Real-time update from userApplication:",
                docSnap.data()
              );
            } else {
              console.log("No such document!");
              setUserInfo({});
            }
          },
          (error) => {
            console.error("Error fetching document:", error);
            setUserInfo({});
          }
        );

        return () => unsubscribeFirestore(); // Cleanup Firestore listener
      } else {
        console.log("No user is logged in");
        setUserInfo(null);
      }
    });

    return () => unsubscribeAuth(); // Cleanup Auth listener on unmount
  }, [auth, firestore]);

  useEffect(() => {
    if (userInfo?.community) {
      const fetchCommunityData = async () => {
        try {
          const docRef = doc(firestore, "community", userInfo.community);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setApplications(docSnap.data().application); // Store all details in `applications`
            console.log("Community details fetched:", docSnap.data());
          } else {
            console.warn("No such community document!");
          }
        } catch (error) {
          console.error("Error fetching community document:", error);
        }
      };

      fetchCommunityData();
    }
  }, [userInfo.community]);
  return (
    <>
      {!userInfo.community && (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image
            source={require("../../assets/joinCommunity.png")}
            style={{ width: 300, height: 300 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
            Join in the Community
          </Text>
        </View>
      )}
      {!applications && (
        <View
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              height: "90%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Image
              source={require("../../assets/emptyApplications.png")}
              style={{ width: 300, height: 300 }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
              No Application in This Community
            </Text>
          </View>
          <TouchableOpacity
            style={styles.applicationBtn}
            onPress={() => navigation.navigate("ApplicationForm", { userInfo })}
            activeOpacity={0.7} // Adds a subtle press effect
          >
            <Ionicons name="create-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Create Application</Text>
          </TouchableOpacity>
        </View>
      )}
      {userInfo.community && applications && (
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.applicationContainer}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginVertical: 10,
                }}
              >
                Community Application
              </Text>
              <FlatList
                data={applications}
                keyExtractor={(item) => item.desc} //temporary key
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <TouchableOpacity
              style={styles.applicationBtn}
              onPress={() =>
                navigation.navigate("ApplicationForm", { userInfo })
              }
              activeOpacity={0.7} // Adds a subtle press effect
            >
              <Ionicons name="create-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Create Application</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  applicationContainer: {
    height: "90%",
    width: "100%",
    paddingVertical: 10,
  },
  applicationBtn: {
    backgroundColor: "#007AFF", // Same as the default iOS button color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "auto",
    flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF", // Default button text color
    fontSize: 18,
    fontWeight: "600",
  },
});

// application data container
const renderItem = ({ item }) => (
  <View style={itemStyles.card}>
    {/* Left Section - Category Image */}
    <View style={itemStyles.imageContainer}>
      <Ionicons name="folder-outline" size={50} color="#007AFF" />
    </View>

    {/* Right Section - Details */}
    <View style={itemStyles.detailsContainer}>
      <Text style={itemStyles.sender}>{item.sender}</Text>
      <Text style={itemStyles.title}>{item.title}</Text>
      <Text style={itemStyles.desc}>{item.desc}</Text>

      <TouchableOpacity
        style={itemStyles.attachmentBtn}
        onPress={() => console.log("View Attachments")}
      >
        <Text style={itemStyles.attachmentText}>
          View Attachment ({item.attachments.length})
        </Text>
      </TouchableOpacity>

      <Text style={itemStyles.dateTime}>
        {item.date} | {item.time}
      </Text>
    </View>
  </View>
);

// renderItem styles
const itemStyles = StyleSheet.create({
  card: {
    width: "90%",
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    width: "80%",
    paddingLeft: 10,
  },
  sender: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 4,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  attachmentBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  attachmentText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  dateTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
export default UserApplication;
