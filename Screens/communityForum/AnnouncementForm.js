import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { firestore } from "../auth/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

// Adding Announcement
const addAnnouncement = async ( newAnnouncement,communityName) => {
  try {
    // Reference to the document in the "community" collection
    const communityRef = doc(firestore, "community", communityName);

    // Append the new announcement to the "announcements" array
    await updateDoc(communityRef, {
      announcements: arrayUnion(newAnnouncement),
    });

    console.log("Announcement added successfully!");
  } catch (error) {
    console.error("Error adding announcement:", error);
  }
};

// Event modal
const EventModal = ({ visibility, community }) => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(visibility);
  const [desc, setDesc] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [typeOfCelebration, setTypeOfCelebration] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)
  const validateFields = () => {
    let newErrors = {};
    let isValid = true;

    if (!desc.trim()) {
      newErrors.desc = "Description is required";
      isValid = false;
    }
    if (!eventLocation.trim()) {
      newErrors.eventLocation = "Event location is required";
      isValid = false;
    }
    if (!typeOfCelebration.trim()) {
      newErrors.typeOfCelebration = "Type of celebration is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const eventData = {
      desc,
      event_location: eventLocation,
      type_of_celebration: typeOfCelebration,
      event_date: moment(eventDate).format("YYYY-MM-DD"),
      event_time: moment(eventTime).format("hh:mm A"),
      time_of_post: moment().format("hh:mm A"),
      date_of_post: moment().format("YYYY-MM-DD"),
      category:'Events'
    };
    setLoading(true)
    await addAnnouncement(eventData,community).then(() => {
      setLoading(false)
      setVisible(false);
      navigator.goBack();
    });
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Adds a translucent background
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: "100%",
    },
    buttonContainer: {
      width: "100%",
      flexDirection: "row",
    },
    button: {
      padding: 10,
      backgroundColor: "#ddd",
      borderRadius: 5,
      marginBottom: 10,
      alignItems: "center",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      margin: 2,
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#FF3B30",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      margin: 2,
      width: "48%",
    },
    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    // error
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={(text) => {
              setDesc(text);
              setErrors({ ...errors, desc: "" });
            }}
          />
          {errors.desc && <Text style={styles.errorText}>{errors.desc}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Event Location"
            value={eventLocation}
            onChangeText={(text) => {
              setEventLocation(text);
              setErrors({ ...errors, eventLocation: "" });
            }}
          />
          {errors.eventLocation && (
            <Text style={styles.errorText}>{errors.eventLocation}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Type of Celebration"
            value={typeOfCelebration}
            onChangeText={(text) => {
              setTypeOfCelebration(text);
              setErrors({ ...errors, typeOfCelebration: "" });
            }}
          />
          {errors.typeOfCelebration && (
            <Text style={styles.errorText}>{errors.typeOfCelebration}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              Select Event Date: {moment(eventDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setEventDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>
              Select Event Time: {moment(eventTime).format("hh:mm A")}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setEventTime(selectedTime);
              }}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading?"submitting..":"Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigator.goBack()}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Emergency modal
const EmergencyModal = ({ visibility,community }) => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(visibility);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required";
      isValid = false;
    }
    if (!hospitalLocation.trim()) {
      newErrors.hospitalLocation = "Hospital location is required";
      isValid = false;
    }
    if (requirements.length === 0) {
      newErrors.requirements = "At least one medicine/item is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const addRequirement = () => {
    let newErrors = { ...errors };

    if (!medicineName.trim()) {
      newErrors.medicineName = "Medicine/Item name is required";
    } else if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else {
      setRequirements([...requirements, { medicineName, quantity }]);
      setMedicineName("");
      setQuantity("");
      delete newErrors.medicineName;
      delete newErrors.quantity;
    }

    setErrors(newErrors);
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const emergencyData = {
      hospital_name: hospitalName,
      hospital_location: hospitalLocation,
      requirements,
      time_of_post: moment().format("hh:mm A"),
      date_of_post: moment().format("YYYY-MM-DD"),
      category:'Emergency'
    };
    setLoading(true)
    await addAnnouncement(emergencyData,community).then(() => {
      setLoading(false)
      setVisible(false);
      navigator.goBack();
    });
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
      width: "100%",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      gap: 5,
    },
    addButton: {
      backgroundColor: "#28a745",
      paddingVertical: 5,
      borderRadius: 5,
      width: "100%", // Full width button
      alignItems: "center",
      justifyContent: "center",
      margin: 1,
    },
    addText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },

    requirementItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      width: "100%",
      marginBottom: 5,
    },
    removeButton: {
      backgroundColor: "#FF3B30",
      padding: 5,
      borderRadius: 5,
    },
    removeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#FF3B30",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    // empty msg display
    emptyContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    emptyText: {
      fontSize: 16,
      color: "#888",
      fontStyle: "italic",
    },
    // err
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        navigator.goBack();
      }}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Hospital Name"
            value={hospitalName}
            onChangeText={(text) => {
              setHospitalName(text);
              setErrors({ ...errors, hospitalName: "" });
            }}
          />
          {errors.hospitalName && (
            <Text style={styles.errorText}>{errors.hospitalName}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Hospital Location"
            value={hospitalLocation}
            onChangeText={(text) => {
              setHospitalLocation(text);
              setErrors({ ...errors, hospitalLocation: "" });
            }}
          />
          {errors.hospitalLocation && (
            <Text style={styles.errorText}>{errors.hospitalLocation}</Text>
          )}

          <View style={{ width: "100%" }}>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                placeholder="Medicine/Item Name"
                value={medicineName}
                onChangeText={(text) => {
                  setMedicineName(text);
                  setErrors({ ...errors, medicineName: "" });
                }}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  setErrors({ ...errors, quantity: "" });
                }}
              />
            </View>

            {errors.medicineName && (
              <Text style={styles.errorText}>{errors.medicineName}</Text>
            )}
            {errors.quantity && (
              <Text style={styles.errorText}>{errors.quantity}</Text>
            )}

            <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{ fontWeight: "bold", paddingVertical: 2, fontSize: 15 }}
          >
            Requirements
          </Text>
          {errors.requirements && (
            <Text style={styles.errorText}>{errors.requirements}</Text>
          )}

          <FlatList
            data={requirements}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.requirementItem}>
                <Text>
                  {item.medicineName} - {item.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeRequirement(index)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No data available</Text>
              </View>
            }
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading?"submitting..":"Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigator.goBack()}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// construction modal
const ConstructionModal = ({ visibility,community }) => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(visibility);
  const [blockedPath, setBlockedPath] = useState("");
  const [alternatePath, setAlternatePath] = useState("");
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!blockedPath.trim()) {
      newErrors.blockedPath = "Blocked road/path is required";
      isValid = false;
    }
    if (!alternatePath.trim()) {
      newErrors.alternatePath = "Alternate path is required";
      isValid = false;
    }
    if (!duration.trim()) {
      newErrors.duration = "Duration is required";
      isValid = false;
    }
    if (!reason.trim()) {
      newErrors.reason = "Reason for blockage is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const constructionData = {
      blocked_path: blockedPath,
      alternate_path: alternatePath,
      duration,
      reason,
      time_of_post: moment().format("hh:mm A"),
      date_of_post: moment().format("YYYY-MM-DD"),
      category:'Construction'
    };
    setLoading(true)
    await addAnnouncement(constructionData,community).then(() => {
      setLoading(false)
      setVisible(false);
      navigator.goBack();
    });
  };

  // style

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
      width: "100%",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#FF3B30",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        navigator.goBack();
      }}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Path/Road Blocked"
            value={blockedPath}
            onChangeText={(text) => {
              setBlockedPath(text);
              setErrors({ ...errors, blockedPath: "" });
            }}
          />
          {errors.blockedPath && (
            <Text style={styles.errorText}>{errors.blockedPath}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Alternate Path"
            value={alternatePath}
            onChangeText={(text) => {
              setAlternatePath(text);
              setErrors({ ...errors, alternatePath: "" });
            }}
          />
          {errors.alternatePath && (
            <Text style={styles.errorText}>{errors.alternatePath}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Estimated Duration (e.g., 2 days)"
            value={duration}
            onChangeText={(text) => {
              setDuration(text);
              setErrors({ ...errors, duration: "" });
            }}
          />
          {errors.duration && (
            <Text style={styles.errorText}>{errors.duration}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Reason for Blockage"
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              setErrors({ ...errors, reason: "" });
            }}
          />
          {errors.reason && (
            <Text style={styles.errorText}>{errors.reason}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading?"submitting..":"Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigator.goBack()}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Accident Modal
const AccidentModal = ({ visibility,community }) => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(visibility);
  const [accidentType, setAccidentType] = useState("");
  const [casualtyDescription, setCasualtyDescription] = useState("");
  const [accidentLocation, setAccidentLocation] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [medicalRequirements, setMedicalRequirements] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!accidentType.trim()) {
      newErrors.accidentType = "Type of accident is required";
      isValid = false;
    }
    if (!casualtyDescription.trim()) {
      newErrors.casualtyDescription = "Description of casualties is required";
      isValid = false;
    }
    if (!accidentLocation.trim()) {
      newErrors.accidentLocation = "Accident location is required";
      isValid = false;
    }
    if (medicalRequirements.length === 0) {
      newErrors.medicalRequirements = "At least one medical item is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const addMedicalRequirement = () => {
    let newErrors = { ...errors };

    if (!medicineName.trim()) {
      newErrors.medicineName = "Medicine/Item name is required";
    } else if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else {
      setMedicalRequirements([
        ...medicalRequirements,
        { medicineName, quantity },
      ]);
      setMedicineName("");
      setQuantity("");
      delete newErrors.medicineName;
      delete newErrors.quantity;
    }

    setErrors(newErrors);
  };

  const removeMedicalRequirement = (index) => {
    setMedicalRequirements(medicalRequirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const accidentData = {
      accident_type: accidentType,
      casualty_description: casualtyDescription,
      accident_location: accidentLocation,
      medical_requirements: medicalRequirements,
      time_of_post: moment().format("hh:mm A"),
      date_of_post: moment().format("YYYY-MM-DD"),
      category:'Accident'
    };
    setLoading(true)
    await addAnnouncement(accidentData,community).then(() => {
      setLoading(false)
      setVisible(false);
      navigator.goBack();
    });
  };

  // styles
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
      width: "100%",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      gap: 5,
    },
    addButton: {
      backgroundColor: "#28a745",
      paddingVertical: 5,
      borderRadius: 5,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      margin: 1,
    },
    addText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
    requirementItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      width: "100%",
      marginBottom: 5,
    },
    removeButton: {
      backgroundColor: "#FF3B30",
      padding: 5,
      borderRadius: 5,
    },
    removeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#FF3B30",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        navigator.goBack();
      }}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Type of Accident"
            value={accidentType}
            onChangeText={(text) => {
              setAccidentType(text);
              setErrors({ ...errors, accidentType: "" });
            }}
          />
          {errors.accidentType && (
            <Text style={styles.errorText}>{errors.accidentType}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Description of Casualties"
            value={casualtyDescription}
            onChangeText={(text) => {
              setCasualtyDescription(text);
              setErrors({ ...errors, casualtyDescription: "" });
            }}
          />
          {errors.casualtyDescription && (
            <Text style={styles.errorText}>{errors.casualtyDescription}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Accident Location"
            value={accidentLocation}
            onChangeText={(text) => {
              setAccidentLocation(text);
              setErrors({ ...errors, accidentLocation: "" });
            }}
          />
          {errors.accidentLocation && (
            <Text style={styles.errorText}>{errors.accidentLocation}</Text>
          )}

          <View style={{ width: "100%" }}>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                placeholder="Medicine/Item Name"
                value={medicineName}
                onChangeText={(text) => {
                  setMedicineName(text);
                  setErrors({ ...errors, medicineName: "" });
                }}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  setErrors({ ...errors, quantity: "" });
                }}
              />
            </View>

            {errors.medicineName && (
              <Text style={styles.errorText}>{errors.medicineName}</Text>
            )}
            {errors.quantity && (
              <Text style={styles.errorText}>{errors.quantity}</Text>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={addMedicalRequirement}
            >
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{ fontWeight: "bold", paddingVertical: 2, fontSize: 15 }}
          >
            Medical Requirements
          </Text>
          {errors.medicalRequirements && (
            <Text style={styles.errorText}>{errors.medicalRequirements}</Text>
          )}

          <FlatList
            data={medicalRequirements}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.requirementItem}>
                <Text>
                  {item.medicineName} - {item.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeMedicalRequirement(index)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No data available</Text>
              </View>
            }
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading?"submitting..":"Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigator.goBack()}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// FundRaise and Donation modal

const FundRaiseAndDonationModal = ({ visibility,community }) => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(visibility);
  const [organisationName, setOrganisationName] = useState("");
  const [category, setCategory] = useState("fundraise");
  const [description, setDescription] = useState("");
  const [upiDetails, setUpiDetails] = useState("");
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!organisationName.trim()) {
      newErrors.organisationName = "Organisation name is required";
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.description =
        category === "fundraise"
          ? "Reason for fundraising is required"
          : "Description of donation is required";
      isValid = false;
    }
    if (!upiDetails.trim()) {
      newErrors.upiDetails = "UPI ID/Account details are required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const fundRaiseData = {
      organisation_name: organisationName,
      category,
      description,
      upi_details: upiDetails,
      time_of_post: moment().format("hh:mm A"),
      date_of_post: moment().format("YYYY-MM-DD"),
    };
    setLoading(true)
    await addAnnouncement(fundRaiseData,community).then(() => {
      setLoading(false)
      setVisible(false);
      navigator.goBack();
    });
  };

  // styles
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
      width: "100%",
    },
    picker: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#FF3B30",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
  });
  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        navigator.goBack();
      }}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Organisation Name"
            value={organisationName}
            onChangeText={(text) => {
              setOrganisationName(text);
              setErrors({ ...errors, organisationName: "" });
            }}
          />
          {errors.organisationName && (
            <Text style={styles.errorText}>{errors.organisationName}</Text>
          )}

          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setCategory(itemValue);
              setDescription("");
              setErrors({ ...errors, description: "" });
            }}
          >
            <Picker.Item label="Fund Raise" value="fundraise" />
            <Picker.Item label="Donation" value="donation" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder={
              category === "fundraise"
                ? "Reason for Fundraising"
                : "Description of Donation"
            }
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors({ ...errors, description: "" });
            }}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="UPI ID / Account Details"
            value={upiDetails}
            onChangeText={(text) => {
              setUpiDetails(text);
              setErrors({ ...errors, upiDetails: "" });
            }}
          />
          {errors.upiDetails && (
            <Text style={styles.errorText}>{errors.upiDetails}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading?"submitting..":"Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigator.goBack()}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Achievement Modal
const AchievementModal = ({ visibility,community }) => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(visibility);
  const [eventType, setEventType] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");
  const [position, setPosition] = useState("");
  const [errors, setErrors] = useState({});
  const [loading,setLoading]=useState(false)
  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!eventType.trim()) {
      newErrors.eventType = "Type of event/sport is required";
      isValid = false;
    }
    if (!achievementDescription.trim()) {
      newErrors.achievementDescription = "Achievement description is required";
      isValid = false;
    }
    if (!position.trim()) {
      newErrors.position =
        "Position is required (e.g., First, Second, Special Achievement)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const achievementData = {
      event_type: eventType,
      achievement_description: achievementDescription,
      position: position,
      time_of_post: moment().format("hh:mm A"),
      date_of_post: moment().format("YYYY-MM-DD"),
      category:'Achievement'
    };
    setLoading(true)
    addAnnouncement(achievementData,community).then(() => {
      setLoading(false)
      setVisible(false);
      navigator.goBack();
    });
  };

  // styles
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
      width: "100%",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#2196F3",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    cancelButton: {
      backgroundColor: "#FF3B30",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "48%",
    },
    submitText: {
      color: "white",
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        navigator.goBack();
      }}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Type of Event/Sport"
            value={eventType}
            onChangeText={(text) => {
              setEventType(text);
              setErrors({ ...errors, eventType: "" });
            }}
          />
          {errors.eventType && (
            <Text style={styles.errorText}>{errors.eventType}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Description of Achievement"
            value={achievementDescription}
            onChangeText={(text) => {
              setAchievementDescription(text);
              setErrors({ ...errors, achievementDescription: "" });
            }}
          />
          {errors.achievementDescription && (
            <Text style={styles.errorText}>
              {errors.achievementDescription}
            </Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Position (e.g., First, Second, Special Achievement)"
            value={position}
            onChangeText={(text) => {
              setPosition(text);
              setErrors({ ...errors, position: "" });
            }}
          />
          {errors.position && (
            <Text style={styles.errorText}>{errors.position}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading?"submitting..":"Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigator.goBack()}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// main block
export default function AnnouncementForm({ visibility, route }) {
  const { type, community } = route.params;

  // dynamically rendering the modal
  const renderModal = () => {
    switch (type) {
      case "Event and Meetups":
        return <EventModal visibility={visibility} community={community} />;
      case "Emergency":
        return <EmergencyModal visibility={visibility} community={community} />;
      case "Construction and Road Works":
        return (
          <ConstructionModal visibility={visibility} community={community} />
        );
      case "Accident":
        return <AccidentModal visibility={visibility} community={community} />;
      case "Fund Raise and Donation":
        return (
          <FundRaiseAndDonationModal
            visibility={visibility}
            community={community}
          />
        );
      case "Achievements":
        return (
          <AchievementModal visibility={visibility} community={community} />
        );
      default:
        return null;
    }
  };
  return <View>{renderModal()}</View>;
}
