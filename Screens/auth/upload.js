// import React, { useState } from "react";
// import { View, Text, Button, ScrollView } from "react-native";
// import DocumentPicker from "react-native-document-picker";
// import RNFS from "react-native-fs";
// import Papa from "papaparse";

// const CsvReader = () => {
//   const [csvData, setCsvData] = useState([]);

//   const handleFilePick = async () => {
//     try {
//       // Open file picker
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles], // Allow all files, but filter CSV manually
//       });

//       // Check if the selected file is CSV
//       if (!res[0].name.endsWith(".csv")) {
//         alert("Please select a CSV file.");
//         return;
//       }

//       // Read file contents
//       const fileUri = res[0].uri;
//       const fileContent = await RNFS.readFile(fileUri, "utf8");

//       // Parse CSV data
//       Papa.parse(fileContent, {
//         header: true, // Treat the first row as column names
//         skipEmptyLines: true,
//         complete: (result) => {
//           setCsvData(result.data);
//         },
//         error: (error) => {
//           console.error("CSV Parsing Error:", error);
//         },
//       });
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log("User cancelled file picker.");
//       } else {
//         console.error("Error picking file:", err);
//       }
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Button title="Pick CSV File" onPress={handleFilePick} />
//       {csvData.length > 0 && (
//         <ScrollView horizontal>
//           <View>
//             <Text style={{ fontWeight: "bold", marginTop: 10 }}>
//               Parsed CSV Data:
//             </Text>
//             {csvData.map((row, index) => (
//               <Text key={index}>{JSON.stringify(row)}</Text>
//             ))}
//           </View>
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// export default CsvReader;
