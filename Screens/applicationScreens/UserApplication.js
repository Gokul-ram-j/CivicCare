import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
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
import { FontAwesome } from "@expo/vector-icons";
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
              // console.log(
              //   "Real-time update from userApplication:",
              //   docSnap.data()
              // );
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
      const docRef = doc(firestore, "community", userInfo.community);

      // Listen for real-time updates
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setApplications(docSnap.data().application); // Update state with new data
            // console.log("Real-time community details:", docSnap.data());
          } else {
            console.warn("No such community document!");
          }
        },
        (error) => {
          console.error("Error fetching real-time community document:", error);
        }
      );

      // Cleanup subscription when component unmounts
      return () => unsubscribe();
    }
  }, [userInfo.community]);

  //renderItem
  const statusSteps = ["submitted", "acknowledged", "inProgress", "resolved"];

  const renderItem = ({ item }) => {
    const currentStepIndex = statusSteps.indexOf(item.status);

    // Styles
    const itemStyles = StyleSheet.create({
      card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
        width: "95%",
        alignSelf: "center",
      },
      imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
      },
      categoryImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
      },
      detailsContainer: {
        flex: 1,
        justifyContent: "space-between",
      },
      sender: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
      },
      title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
        marginTop: 5,
      },
      location: {
        fontSize: 12,
        fontWeight: "bold",
        marginVertical:5,
      },
      desc: {
        fontSize: 13,
        color: "#666",
        marginTop: 3,
      },

      // Bottom Section
      bottomContainer: {
        marginTop: 10,
      },

      // Status Bar Styles
      statusContainer: {
        alignItems: "center",
      },
      progressBar: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        position: "relative",
        paddingHorizontal: 10,
      },
      progressLine: {
        flex: 1,
        height: 4,
        backgroundColor: "#ddd",
        marginHorizontal: 2,
      },
      circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
      },
      statusIcon: {
        width: 16,
        height: 16,
        resizeMode: "contain",
      },

      // Attachment Button
      attachmentBtn: {
        marginTop: 10,
        padding: 8,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
      },
      attachmentText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
      },

      // Date & Time
      dateTime: {
        marginTop: 5,
        fontSize: 12,
        color: "#888",
      },
    });

    return (
      <View style={itemStyles.card}>
        {/* Left Section - Category Image */}
        <View style={itemStyles.imageContainer}>
          <Image
            style={itemStyles.categoryImage}
            source={categoryImages[item.category]}
          />
        </View>

        {/* Right Section - Details */}
        <View style={itemStyles.detailsContainer}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <FontAwesome name="user-circle-o" size={17} color="black" />
            <Text style={itemStyles.sender}>{item.sender}</Text>
          </View>
          <Text style={itemStyles.title}>{item.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location-sharp" size={12} color="black" />
            <Text style={itemStyles.location}> {item.location}</Text>
          </View>
          <Text style={itemStyles.desc}>{item.desc}</Text>

          {/* Bottom Section - Status, Attachment & Date */}
          <View style={itemStyles.bottomContainer}>
            {/* Status Progress Bar */}
            <View style={itemStyles.statusContainer}>
              <View style={itemStyles.progressBar}>
                {statusSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    {/* Progress Line */}
                    {index > 0 && (
                      <View
                        style={[
                          itemStyles.progressLine,
                          {
                            backgroundColor:
                              index <= currentStepIndex ? "#007bff" : "#ddd",
                          },
                        ]}
                      />
                    )}
                    {/* Step Circle */}
                    <View
                      style={[
                        itemStyles.circle,
                        {
                          backgroundColor:
                            index <= currentStepIndex ? "#007bff" : "#fff",
                          borderColor:
                            index <= currentStepIndex ? "#007bff" : "#aaa",
                        },
                      ]}
                    >
                      <Image
                        source={StatusBarIcons[step]} // Assign different icons to each status step
                        style={itemStyles.statusIcon}
                      />
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Attachment Button */}
            <TouchableOpacity
              style={itemStyles.attachmentBtn}
              onPress={() =>
                navigation.navigate("AttachmentsImgs", {
                  uris: item.attachments,
                })
              }
            >
              <Text style={itemStyles.attachmentText}>
                View Attachment ({item.attachments.length})
              </Text>
            </TouchableOpacity>

            {/* Date & Time */}
            <Text style={itemStyles.dateTime}>
              {item.date} | {item.time}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
      {(!applications || applications.length == 0) && (
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

// statusbar icons
const StatusBarIcons = {
  submitted: require("../../assets/upload.png"), // Replace with actual paths
  acknowledged: require("../../assets/Acknowledge.png"),
  inProgress: require("../../assets/work-in-progress.png"),
  resolved: require("../../assets/Resolved.png"),
};

const categoryImages = {
  transportation: require("../../assets/transportation.png"),
  sanitation: require("../../assets/sanitation.png"),
  waste_management: require("../../assets/waste_management.png"),
  water_supply: require("../../assets/water_supply.png"),
  energy_electricity: require("../../assets/energy_electricity.png"),
  housing: require("../../assets/housing.png"),
  health_safety: require("../../assets/health_safety.png"),
  environmental_pollution: require("../../assets/environmental_pollution.png"),
};

export default UserApplication;
