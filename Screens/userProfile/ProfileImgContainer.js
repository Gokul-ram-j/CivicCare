import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../auth/firebase";

export function ProfileImgContainer() {
  const [imageUri, setImageUri] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const auth = getAuth();

  // updating userProfile
  const updateUserProfile = async () => {
    if (!userEmail || !imageUri) return;

    try {
      const userRef = doc(firestore, "userDetails", userEmail);
      await updateDoc(userRef, { userProfile: imageUri });

      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // getting user Email
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserEmail(user.email);
    } else {
      console.log("No user is logged in");
    }

    // Unsubscribe after getting the user
    unsubscribe();
  });

  // getting userProfile image src
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userEmail) {
        console.error("User email is required!");
        return;
      }

      try {
        const userRef = doc(firestore, "userDetails", userEmail);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setImageUri(userSnap.data().userProfile); // ✅
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (userEmail) {
      fetchUserDetails();
    }
  }, [userEmail]);

  useEffect(() => {
    updateUserProfile(imageUri);
  }, [imageUri]);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to proceed."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.imageContainer}>
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require("../../assets/defaultAvatarImg.jpg")
        }
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <MaterialIcons name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    marginVertical: 15,
    width: 300,
    marginHorizontal: "auto",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ccc",
    marginHorizontal: "auto",
  },
  button: {
    position: "absolute",
    width: 40,
    height: 40,
    backgroundColor: "#007BFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    left: "62%",
    top: "68%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProfileImgContainer;
