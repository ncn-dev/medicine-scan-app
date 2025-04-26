import React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Speech from "expo-speech";
import { Animated } from "react-native";

export default function Detail({ route, navigation }) {
  const { item } = route.params;
  const [editedItem, setEditedItem] = useState(item);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingKey, setSpeakingKey] = useState(null);
  const [duration, setDuration] = useState(8); // 8 วินาทีโดยประมาณ
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = React.useRef(null);
  const progress = useState(new Animated.Value(0))[0];
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [spokenOffset, setSpokenOffset] = useState(0);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };


  

  const detailList = [
    { id: 1, key: "medicinename", label: "ชื่อยา" },
    { id: 2, key: "dose", label: "ปริมาณยา" },
    { id: 3, key: "mfg", label: "วันที่ผลิต" },
    { id: 4, key: "exp", label: "วันที่หมดอายุ" },
    { id: 5, key: "warning", label: "คำเตือน" },
    { id: 6, key: "usage", label: "วิธีการใช้" },
    { id: 7, key: "indication", label: "ข้อบ่งใช้"},
    
  ];

  const faqQuestions = [
    `${editedItem.medicinename} ช่วยอะไร?`,
    `ควรทาน ${editedItem.medicinename} ปริมาณเท่าใด?`,
    `${editedItem.medicinename} ควรบริโภคยังไง?`,
    `ผลข้างเคียงของ ${editedItem.medicinename} คืออะไร?`,
  ];

  useEffect(() => {
    const combinedText = detailList
      .map((item) => `${item.label}: ${editedItem[item.key]}`)
      .join(". ");

    const avgCharsPerSec = 7; // ประมาณการความเร็วพูด
    const estimatedDuration = Math.ceil(combinedText.length / avgCharsPerSec);
    setDuration(estimatedDuration);
  }, [editedItem]);

  const speakText = (key, text) => {
    if (speakingKey === key) {
      Speech.stop();
      setSpeakingKey(null);
    } else {
      Speech.stop();
      setSpeakingKey(key);
      Speech.speak(text, {
        language: "th-TH",
        rate: 1.0,
        pitch: 1.0,
        onDone: () => setSpeakingKey(false),
        onStopped: () => setSpeakingKey(false),
      });
    }
  };

  const speakAllDetails = () => {
    if (isPlayingAll) {
      Speech.stop();
      setSpeakingKey(null);
      setIsPlayingAll(false);
      progress.setValue(0);
      clearInterval(timerRef.current);
      setCurrentTime(0);
    } else {
      const combinedText = detailList
        .map((item) => `${item.label}: ${editedItem[item.key]}`)
        .join(". ");

      const avgCharsPerSec = 7;
      const charsToSkip = spokenOffset * avgCharsPerSec;
      const trimmedText = combinedText.slice(charsToSkip);

      setSpeakingKey("all");
      setIsPlayingAll(true);

      Animated.timing(progress, {
        toValue: 1,
        duration: duration * 1000,
        useNativeDriver: false,
      }).start();

      setCurrentTime(spokenOffset);

      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(timerRef.current);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);

      Speech.speak(trimmedText, {
        language: "th-TH",
        rate: 1.0,
        pitch: 1.0,
        onDone: () => {
          setSpeakingKey(null);
          setIsPlayingAll(false);
          progress.setValue(0);
          clearInterval(timerRef.current);
          setCurrentTime(0);
          setSpokenOffset(0);
        },
        onStopped: () => {
          setSpeakingKey(null);
          setIsPlayingAll(false);
          progress.setValue(0);
          clearInterval(timerRef.current);
        },
      });
    }
  };

  const openEditModal = (key, value) => {
    setSelectedField(key);
    setInputValue(value);
    setModalVisible(true);
  };
  const saveEdit = () => {
    setEditedItem((prev) => ({
      ...prev,
      [selectedField]: inputValue,
    }));
    setModalVisible(false);
  };

  const updatingData = async (id) => {
    const data = {
      id: editedItem.id,
      medicinename: editedItem.medicinename,
      dose: editedItem.dose,
      form: editedItem.form,
      registrationnumber: editedItem.registrationnumber,
      mfg: editedItem.mfg,
      exp: editedItem.exp,
      warning: editedItem.warning,
      indication: editedItem.indication,
      usage: editedItem.usage,
      effect: editedItem.effect,
    };
    try {
      const response = await axios.post(
        `http://172.20.10.2:3000/api/user/updatemedbag`,
        data
      );
      if (!response.ok) {
        alert("Data updated successfully");
        console.log("Data updated successfully");
      } else {
        console.log("Update is failed");
      }
    } catch (err) {
      console.log.error(err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>แก้ไขข้อมูล</Text>
            <TextInput
              style={{
                marginTop: 15,
                backgroundColor: "#F5F5F5",
                height: 40,
                paddingLeft: 10,
              }}
              placeholder="empty"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity
              onPress={saveEdit}
              style={{ alignItems: "flex-end" }}
            >
              <Text
                style={{
                  marginTop: 20,
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
            uri: `http://172.20.10.2:3000/api/uploads/${editedItem.imagepath}`,
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

        <View
          style={{
            marginTop: 30,
            backgroundColor: "#EFEFEF",
            padding: 20,
            borderRadius: 15,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            ❓ คำถามที่พบบ่อยเกี่ยวกับยา
          </Text>
          {faqQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                padding: 12,
                marginVertical: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#CCCCCC",
              }}
              onPress={() => navigation.navigate("Chatbot", { question })}
            >
              <Text style={{ fontSize: 16 }}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {detailList.map((item, index) => (
          <View
            key={item.id}
            style={{
              marginTop: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 35,
                backgroundColor: "#007AFF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
              onPress={() =>
                speakText(item.key, `${item.label}:${editedItem[item.key]}`)
              }
            >
              <Icon
                name={speakingKey === item.key ? "pause" : "play-arrow"}
                size={25}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#D9D9D9",
                padding: 10,
                borderRadius: 10,
                width: "90%",
                height: 70,
                justifyContent: "center",
              }}
              onPress={() => {
                openEditModal(item.key, editedItem[item.key]);
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.label}: {editedItem[item.key]}
              </Text>
            </TouchableOpacity>

            
          </View>
        ))}

        <View
          style={{
            marginTop: 40,
            alignItems: "center",
            backgroundColor: "#FDF5E6",
            borderRadius: 20,
          }}
        >
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
            🔊 ฟังข้อมูลยาทั้งหมด
          </Text>
          {/* แถบเวลา */}
          <View
            style={{
              marginTop: 10,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", width: 50 }}>
              {formatTime(currentTime)}
            </Text>

            <View
              style={{
                flex: 1,
                height: 6,
                backgroundColor: "#ccc",
                borderRadius: 5,
                marginHorizontal: 10,
              }}
            >
              <Animated.View
                style={{
                  height: 6,
                  backgroundColor: "#0D0D21",
                  borderRadius: 5,
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                }}
              />
            </View>

            <Text style={{ fontWeight: "bold", width: 50 }}>
              {formatTime(duration)}
            </Text>
          </View>

          {/* ปุ่มควบคุม */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={{ marginHorizontal: 20 }}
              onPress={() => {
                let newOffset = Math.max(0, currentTime - 10);
                setSpokenOffset(newOffset);
                if (isPlayingAll) {
                  speakAllDetails(); // รีพูด
                } else {
                  setCurrentTime(newOffset);
                }
              }}
            >
              <Icon name="skip-previous" size={35} color="#0D0D21" />
            </TouchableOpacity>

            <TouchableOpacity onPress={speakAllDetails}>
              <Icon
                name={isPlayingAll ? "pause" : "play-arrow"}
                size={45}
                color="#0D0D21"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginHorizontal: 20 }}
              onPress={() => {
                let newOffset = Math.min(duration, currentTime + 10);
                setSpokenOffset(newOffset);
                if (isPlayingAll) {
                  speakAllDetails(); // รีพูด
                } else {
                  setCurrentTime(newOffset);
                }
              }}
            >
              <Icon name="skip-next" size={35} color="#0D0D21" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#33CC00",
              borderRadius: 9,
              width: 100,
              height: 60,
              marginTop: 30,
              paddingVertical: 5,
            }}
            onPress={() => {
              updatingData(item.id);
            }}
          >
            <Icon name="save" size={29} color="#fff" />
            <Text style={{ color: "white", fontWeight: "bold" }}>update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
