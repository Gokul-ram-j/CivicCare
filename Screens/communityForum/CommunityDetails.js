import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth, firestore } from "../auth/firebase";
import MembersInfo from "./MembersInfo";
import { Ionicons } from "@expo/vector-icons";

export function CommunityDetails({ route }) {
  // community details
  const { item } = route.params;
  // members email
  const membersEmail = item.members || [];
  // community member details
  const [membersInfo, setMembersInfo] = useState([]);
  // navigation
  const navigation = useNavigation();

  // fetching members details
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const uniqueMembers = new Set(membersEmail); // Prevent duplicate IDs

        const fetchedMembers = await Promise.all(
          [...uniqueMembers].map(async (docId) => {
            const docRef = doc(firestore, "userDetails", docId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docId, ...docSnap.data() } : null;
          })
        );

        // Filter out null values & prevent duplicate appends
        setMembersInfo(fetchedMembers.filter(Boolean));
      } catch (error) {
        console.error("Error fetching member info:", error);
      }
    };

    fetchMembers();
  }, [membersEmail]); // Ensuring it updates when members change

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Community Title */}
          <Text style={styles.communityTitle}>{item.id}</Text>

          {/* Community Profile Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.profileImgURL }} style={styles.image} />
          </View>

          {/* Members Section */}
          <View style={styles.membersSection}>
            <View style={styles.membersHeader}>
              <Ionicons name="people-sharp" size={24} color="#333" />
              <Text style={styles.membersText}>Members</Text>
            </View>

            {membersInfo.length > 0 ? (
              <MembersInfo memberDetail={membersInfo} />
            ) : (
              <Text style={styles.noMembersText}>No members yet.</Text>
            )}
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  container: {
    padding: 15,
    alignItems: "center",
  },
  communityTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#ddd",
    marginVertical: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  membersSection: {
    width: "100%",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  membersText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noMembersText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default CommunityDetails;
