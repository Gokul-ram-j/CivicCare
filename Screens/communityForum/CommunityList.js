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
    const navigation = useNavigation();

    return (
      <View style={listItemStyles.itemBox}>
        <Image
          source={{ uri: item.profileImgURL }}
          style={listItemStyles.profileImage}
        />
        <View style={listItemStyles.infoContainer}>
          <Text style={listItemStyles.communityName}>{item.id}</Text>
          <Text style={listItemStyles.members}>
            Members: {item.members.length}
          </Text>
          <View style={listItemStyles.buttonContainer}>
            <TouchableOpacity
              style={[listItemStyles.button, listItemStyles.viewButton]}
              onPress={() => navigation.navigate("CommunityDetails", { item })}
            >
              <Octicons color="white" name="eye" size={20} />
              <Text style={listItemStyles.buttonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[listItemStyles.button, listItemStyles.joinButton]}
              onPress={() => handleJoinCommunity(item.id)}
            >
              <FontAwesome6 color="white" name="people-group" size={20} />
              <Text style={listItemStyles.buttonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const listItemStyles = StyleSheet.create({
    itemBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 12,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width:'90%',
      marginHorizontal:'auto'
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    infoContainer: {
      flex: 1,
      justifyContent: "center",
    },
    communityName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    members: {
      fontSize: 14,
      color: "#666",
      marginBottom: 6,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 4,
    },
    viewButton: {
      backgroundColor: "#3498db",
    },
    joinButton: {
      backgroundColor: "#27ae60",
    },
    buttonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 6,
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
            <View style={styles.listContainer}>
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
  listContainer:{
    height:'87%'
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
