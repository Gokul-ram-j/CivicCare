import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Button,
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
  }, []); // Fetch only once when mounted

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 20, textAlign: "center",fontWeight:'bold' }}> {item.id}</Text>
          <View
            style={{
              width: "100%",
              padding: 10,
              height: 200,
              paddingVertical: 20,
            }}
          >
            <Image
              source={{ uri: item.profileImgURL }}
              style={{
                marginHorizontal: "auto",
                width: "50%",
                height: "100%",
                borderRadius: 50,
              }}
            />
          </View>

          <View style={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: "auto",
                borderBottomWidth: 1,
              }}
            >
              <Ionicons name="people-sharp" size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20 }}>Members</Text>
            </View>

            {membersInfo && <MembersInfo memberDetail={membersInfo} />}
          </View>

          <Button
            title="back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 5,
  },
});

export default CommunityDetails;
