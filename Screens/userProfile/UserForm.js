import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { firestore, auth } from "../auth/firebase";

const stateOptions = [
  { label: "Andhra Pradesh", value: "Andhra Pradesh" },
  { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
  { label: "Assam", value: "Assam" },
  { label: "Bihar", value: "Bihar" },
  { label: "Chhattisgarh", value: "Chhattisgarh" },
  { label: "Delhi", value: "Delhi" },
  { label: "Goa", value: "Goa" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Haryana", value: "Haryana" },
  { label: "Himachal Pradesh", value: "Himachal Pradesh" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Kerala", value: "Kerala" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Manipur", value: "Manipur" },
  { label: "Meghalaya", value: "Meghalaya" },
  { label: "Mizoram", value: "Mizoram" },
  { label: "Nagaland", value: "Nagaland" },
  { label: "Odisha", value: "Odisha" },
  { label: "Punjab", value: "Punjab" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Sikkim", value: "Sikkim" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "Tripura", value: "Tripura" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "West Bengal", value: "West Bengal" },
];

const professionOptions = [
  { label: "Business", value: "Business" },
  { label: "Government Employee", value: "Government Employee" },
  { label: "Private Employee", value: "Private Employee" },
];

export default function UserForm({ route }) {
  const { userEmail } = route.params || {};
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dob = watch("dob");
  const navigation = useNavigation();
  // current date
  const currentDate = new Date()
  // update details
  const updateUserData = async (updatedDetails) => {
    if (!userEmail) {
      console.error("User email is required");
      return;
    }

    try {
      const userRef = doc(firestore, "userDetails", userEmail);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const existingData = userSnap.data();

        const updatedData = {
          userData: {
            ...existingData.userData,
            ...updatedDetails,
          },
        };

        await updateDoc(userRef, updatedData);

        Alert.alert("Success", "Details submitted successfully!", [
          { text: "OK", onPress: () => navigation.navigate("UserDetails") },
        ]);
      } else {
        console.error("User document does not exist!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const onSubmit = async (data) => {
    // console.log(data)
    await updateUserData(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              fontWeight: "bold",
              color: "black",
              marginVertical: 20,
            }}
          >
            Edit Your Details
          </Text>
          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}

           {/* Date of Birth */}
           <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{dob || "Select Date of Birth"}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  // Check if the selected date exceeds the current system date
                  if (selectedDate > currentDate) {
                    Alert.alert("Invalid Date", "You cannot select a future date.");
                  } else {
                    console.log(selectedDate);
                    setValue("dob", selectedDate.toISOString().split("T")[0]); // Set the value if valid
                     // Save the selected date
                  }
                }
              }}
            />
          )}


          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <Controller
            control={control}
            name="gender"
            rules={{ required: "Gender is required" }}
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                onValueChange={onChange}
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                value={value}
                placeholder={{ label: "Select Gender", value: null }}
                style={pickerStyle}
              />
            )}
          />
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender.message}</Text>
          )}

          {/* Profession */}
          <Text style={styles.label}>Profession</Text>
          <Controller
            control={control}
            name="profession"
            rules={{ required: "Profession is required" }}
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                onValueChange={onChange}
                items={professionOptions}
                value={value}
                placeholder={{ label: "Select Profession", value: null }}
                style={pickerStyle}
              />
            )}
          />
          {errors.profession && (
            <Text style={styles.errorText}>{errors.profession.message}</Text>
          )}

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <Controller
            control={control}
            name="address"
            rules={{ required: "Address is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your address"
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
              />
            )}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address.message}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          {/* Submit Button */}
          <TouchableOpacity
            onPress={()=>navigation.navigate('UserDetails')}
            style={[styles.button,{backgroundColor:'red'}]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    padding: 20,
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
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
};

const pickerStyle = {
  inputAndroid: { color: "black" },
  inputIOS: { color: "black" },
};
