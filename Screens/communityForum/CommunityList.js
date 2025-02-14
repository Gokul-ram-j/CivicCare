import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "../auth/firebase";
import NotFound from "./NotFound";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import Loader from "../loadingScreen/Loader";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
export default function CommunityList() {
  const [search, setSearch] = useState("");

  // navigation
  const navigation = useNavigation();
  // Storing User Email
  const [userEmail, setUserEmail] = useState("");
  // Storing User Info
  const [userInfo, setUserInfo] = useState({});
  // fetching all community details
  const [communityData, setCommunityData] = useState([]);
  // handling Loading Progress
  const [loading, setLoading] = useState(false);
  // for filtering data
  const [filteredData, setFilteredData] = useState([]);

  // Updating User's community Details
  const handleJoinCommunity = async (communityId) => {
    if (userEmail) {
      const userRef = doc(firestore, "userDetails", userEmail);
      const commmunityRef = doc(firestore, "community", communityId);
      try {
        setLoading(true);
        await setDoc(userRef, { community: communityId }, { merge: true }).then(
          () => {
            setDoc(
              commmunityRef,
              { members: arrayUnion(userEmail) },
              { merge: true }
            ).then(() => navigation.navigate("UserCommunityInfo", communityId)); // Merge ensures other fields are not overwritten
          }
        ); // Merge ensures other fields are not overwritten
        console.log(`User ${userEmail} joined community: ${communityId}`);
      } catch (error) {
        console.error("Error updating community:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Getting details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setUserEmail(user.email);
          // console.log(userEmail);
        } catch (error) {
          console.error("Error fetching detail(unsubscribe):", error);
          setUserInfo("");
        }
      } else {
        console.log("No user is logged in");
        setUserInfo("");
      }
    });

    return () => unsubscribe(); // Cleanup function to prevent memory leaks
  }, []);

  // Fetching community details
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "community"),
      (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommunityData(docs);
        setFilteredData(docs);
      },
      (error) => {
        console.error("Error fetching community data:", error);
      }
    );

    return () => unsubscribe(); // Cleanup function to stop listening when the component unmounts
  }, []);

  // List Item Component
  const ListItem = ({ item }) => {
    return (
      <View style={listItemStyle.itemBox}>
        <Image
          source={{ uri: item.profileImgURL }}
          style={listItemStyle.profileImage}
        />
        <View style={listItemStyle.infoContainer}>
          <Text style={listItemStyle.communityName}>{item.id}</Text>
          <Text style={listItemStyle.members}>
            Members: {item.members.length}
          </Text>
          <View style={listItemStyle.buttonContainer}>
            <TouchableOpacity
              style={listItemStyle.button}
              onPress={() => navigation.navigate("CommunityDetails", { item })}
            >
              <Octicons color="white" name="eye" size={24} />
              <Text style={listItemStyle.buttonText}>View Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={listItemStyle.button}
              onPress={() => handleJoinCommunity(item.id)}
            >
              <FontAwesome6 color="white" name="people-group" size={24} />
              <Text style={listItemStyle.buttonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const listItemStyle = StyleSheet.create({
    itemBox: {
      width: "90%",
      flexDirection: "row",
      backgroundColor: "#f0f0f0",
      alignItems: "center",
      marginVertical: 5,
      padding: 15,
      borderRadius: 5,
      marginHorizontal: "auto",
      borderWidth: 1, // Adds a border around the box
      borderColor: "#ccc", // Defines the color of the border
      shadowColor: "#000", // The shadow color (black)
      shadowOffset: { width: 0, height: 2 }, // Defines the shadow's offset
      shadowOpacity: 0.1, // The opacity of the shadow
      shadowRadius: 5, // The blur radius of the shadow
      elevation: 5,
      borderBottomRightRadius: 25,
      borderTopLeftRadius: 25,
    },
    profileImage: {
      width: "30%",
      height: "100%",
      borderRadius: 10,
      marginRight: 10,
    },
    infoContainer: {
      width: "70%",
    },
    communityName: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    members: {
      fontSize: 14,
      marginBottom: 5,
    },
    buttonContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: "90%",
      gap: 2,
    },
    button: {
      backgroundColor: "#007AFF", // Match the default button color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    buttonText: {
      color: "#fff", // Match the default button text color
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 2,
    },
  });

  //  suggesting community that match search word
  useEffect(() => {
    if (search) {
      const filtered = communityData.filter((item) =>
        item.id.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(communityData);
    }
  }, [search]);
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <SafeAreaView>
          <View>
            <View style={styles.container}>
              {/* Search Input */}
              <TextInput
                style={styles.input}
                placeholder="Search Community"
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
              />

              {/* Search Button */}
              <View style={styles.button}>
                <Text style={styles.buttonText}>🔍</Text>
              </View>
            </View>

            {/* community list */}
            <View>
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<NotFound />}
                renderItem={({ item }) => <ListItem item={item} />}
              />
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    margin: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#333",
  },
});
