import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { firestore } from "../auth/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import Loader from "../loadingScreen/Loader";

const ApplicationForm = ({ navigation, route }) => {
  // loading state
  const [loading, setLoading] = useState(false);
  // user data
  const { userInfo } = route.params;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Select");
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({}); // Stores errors

  // Get current date and time
  const currentDate = moment().format("YYYY-MM-DD");
  const currentTime = moment().format("hh:mm A");

  // Function to pick an image
  const pickImage = async () => {
    Alert.alert(
      "Upload Image",
      "Choose an option:",
      [
        {
          text: "📷 Take a Photo",
          onPress: async () => {
            const cameraPermission =
              await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
              alert("Camera permission is required!");
              return;
            }

            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
              setAttachments([...attachments, result.assets[0].uri]);
            }
          },
        },
        {
          text: "📁 Choose from Gallery",
          onPress: async () => {
            const mediaPermission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!mediaPermission.granted) {
              alert("Gallery permission is required!");
              return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
              setAttachments([...attachments, result.assets[0].uri]);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // Function to handle form validation
  const uploadApplication = async (applicationObj, userCommunityId) => {
    if (!userCommunityId) {
      console.error("Document ID is missing.");
      return;
    }

    try {
      const docRef = doc(firestore, "community", userCommunityId);

      await updateDoc(docRef, {
        application: arrayUnion(applicationObj),
      });

      console.log("Application added successfully.");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!desc.trim()) newErrors.desc = "Description is required.";
    if (category === "Select")
      newErrors.category = "Please select a valid category.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newApplication = {
      title,
      desc,
      category,
      attachments,
      sender: userInfo.userData.name || "Guest",
      date: currentDate,
      time: currentTime,
    };
    console.log(newApplication);
    setLoading(true);
    await uploadApplication(newApplication, userInfo.community).then(() => {
      setLoading(false);
      Alert.alert("Success", "Application submitted successfully!", [
        { text: "OK", onPress: () => navigation.navigate("UserApplication") },
      ]);
    });
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <SafeAreaView>
          <KeyboardAvoidingView>
            <ScrollView>
              <Text
                style={{
                  marginVertical: 15,
                  fontSize: 25,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Create Your Application
              </Text>
              <View style={styles.container}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.errorInput]}
                  placeholder="Enter title"
                  value={title}
                  onChangeText={setTitle}
                />
                {errors.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    errors.desc && styles.errorInput,
                  ]}
                  placeholder="Enter description"
                  multiline
                  numberOfLines={4}
                  value={desc}
                  onChangeText={setDesc}
                />
                {errors.desc && (
                  <Text style={styles.errorText}>{errors.desc}</Text>
                )}

                <Text style={styles.label}>Category</Text>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={[styles.input, errors.category && styles.errorInput]}
                >
                  <Picker.Item label="Select" value="Select" />
                  <Picker.Item label="Transportation" value="transportation" />
                  <Picker.Item label="Sanitation" value="sanitation" />
                  <Picker.Item
                    label="Waste Management"
                    value="waste_management"
                  />
                  <Picker.Item label="Water Supply" value="water_supply" />
                  <Picker.Item
                    label="Energy & Electricity"
                    value="energy_electricity"
                  />
                  <Picker.Item label="Housing" value="housing" />
                  <Picker.Item label="Health & Safety" value="health_safety" />
                  <Picker.Item
                    label="Environmental Pollution"
                    value="environmental_pollution"
                  />
                </Picker>
                {errors.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}

                <TouchableOpacity
                  style={styles.attachmentBtn}
                  onPress={pickImage}
                >
                  <Icon name="cloud-upload-outline" size={20} color="white" />
                  <Text style={styles.attachmentText}>Upload Attachment</Text>
                </TouchableOpacity>

                {attachments.length > 0 && (
                  <Text style={styles.attachmentPreview}>
                    {attachments.length} Attachment(s) Selected
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitText}>Submit Application</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => navigation.navigate("UserApplication")}
                >
                  <Icon
                    name="arrow-back"
                    size={20}
                    color="white"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.backText}>Back To Applications</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    height: "100%",
    width: "90%",
    marginHorizontal: "auto",
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "#ff4d4d",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    marginBottom: 10,
  },
  attachmentBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  attachmentText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  attachmentPreview: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  backBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  backText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ApplicationForm;
