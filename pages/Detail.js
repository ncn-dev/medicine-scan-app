import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function Detail({ route, navigation }) {
  const { item } = route.params;
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");

  if (!item) {
    return <Text>Error: No data available</Text>; // ถ้าไม่มีข้อมูลให้แสดงข้อความผิดพลาด
  }
  useEffect(() => {
    console.log("Received item: ", item); // ตรวจสอบว่าข้อมูลได้รับครบถ้วน
  }, []);

  const playPauseHandler = () => {
    if (isPlaying) {
      Speech.stop();
    } else {
      speakAll();
    }
    setIsPlaying(!isPlaying);
  };

  const speakAll = () => {
    const allText = `
      ชื่อยา: ${item.medicinename || "No data"}.
      ขนาดยา: ${item.dose || "No data"}.
      รูปแบบยา: ${item.form}.
      หมายเลขทะเบียน: ${item.registrationnumber || "No data"}.
      วันที่ผลิต: ${item.mfg || "No data"}.
      วันที่หมดอายุ: ${item.exp || "No data"}.
      คำเตือน: ${item.warning || "No data"}.
      การใช้งาน: ${item.usage || "No data"}.
      ผลข้างเคียง: ${item.effect || "No data"}.
    `;
    Speech.speak(allText, {
      language: "th-TH",
      pitch: 1.0,
      rate: 1.0,
      onDone: () => {
        if (isLooping) {
          speakAll();
        } else {
          setIsPlaying(false);
        }
      },
    });
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const skipForward = () => {
    Speech.stop();
    setCurrentText(currentText.slice(10));
    speakAll();
  };

  const skipBackward = () => {
    Speech.stop();
    setCurrentText(currentText.slice(0, -10));
    speakAll();
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,

        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
      }}
    >
      <View style={{ paddingHorizontal: 50, marginTop: 80 }}>
        <View
          style={{
            flexDirection: "row",
            justifyItems: "flex-start",
            alignItems: "center",
            marginTop: -20,
            marginLeft: -20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("MedBag")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#D9D9D9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: `http://172.20.10.2:3000/api/uploads/${item.imagepath}`,
          }}
          style={{
            width: 270,
            height: 270,
            borderRadius: 8,
            marginRight: 10,
            marginTop: 20,
            marginLeft: 10,
            
          }}
        />

        <Text style={{ fontSize: 20, marginTop: 30, marginLeft: 0 }}>
          <Text style={{ fontWeight: "bold" }}>Drug Name: </Text>
          <Text>{item.medicinename}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Dosage: </Text>
          <Text>{item.dose}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Form: </Text>
          <Text>{item.form}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Registrationnumber: </Text>
          <Text>{item.registrationnumber}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Manufacture Date: </Text>
          <Text>{item.mfg}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Expiry Date: </Text>
          <Text>{item.exp}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10, color: "red" }}>
          <Text style={{ fontWeight: "bold" }}>*Warning: </Text>
          <Text>{item.warning}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Indication: </Text>
          <Text>{item.indication}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Usage: </Text>
          <Text>{item.usage}</Text>
        </Text>

        <Text style={{ fontSize: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Effect: </Text>
          <Text>{item.effect}</Text>
        </Text>

        {/* ปุ่มควบคุมการเล่น */}
        <View style={styles.controls}>
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <Icon name="replay-10" size={36} color="white" />
          </TouchableOpacity>

          {/* ปุ่มเล่น/หยุด */}
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={playPauseHandler}
          >
            <Icon
              name={isPlaying ? "pause" : "play-arrow"}
              size={36}
              color="white"
            />
          </TouchableOpacity>

          {/* ปุ่มเล่นไปข้างหน้า 10 วินาที */}
          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <Icon name="forward-10" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  controls: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  playPauseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loopButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
