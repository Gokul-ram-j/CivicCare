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
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(null);
  const auth = getAuth();

  const uploadImageToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    data.append("upload_preset", "Profile_Imgs");
    data.append("cloud_name", "dja1myfkv");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dja1myfkv/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };
  // function to delete old image
  // const deleteImageFromCloudinary = async (publicId) => {
  //   if (!publicId) return;

  //   try {
  //     await fetch(
  //       `https://api.cloudinary.com/v1_1/dja1myfkv/image/destroy`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ public_id: publicId, api_key: "dja1myfkv" }),
  //       }
  //     );
  //     console.log("Old image deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting old image:", error);
  //   }
  // };

  const updateUserProfile = async (newImageUri) => {
    if (!userEmail || !newImageUri) return;

    try {

      // for deleting old profile which is been upload in cloud
      // if (cloudinaryPublicId) {
      //   await deleteImageFromCloudinary(cloudinaryPublicId);
      // }

      const uploadResult = await uploadImageToCloudinary(newImageUri);
      if (!uploadResult) return;

      const userRef = doc(firestore, "userDetails", userEmail);
      await updateDoc(userRef, {
        userProfile: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
      });

      setImageUri(uploadResult.url);
      setCloudinaryPublicId(uploadResult.publicId);
      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        console.log("No user is logged in");
      }
      unsubscribe();
    });
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userEmail) return;
      try {
        const userRef = doc(firestore, "userDetails", userEmail);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setImageUri(userSnap.data().userProfile);
          setCloudinaryPublicId(userSnap.data().cloudinaryPublicId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserDetails();
  }, [userEmail]);

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
      updateUserProfile(result.assets[0].uri);
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