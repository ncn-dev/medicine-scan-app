import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";

export default function ChatScreen({ route, navigation }) {
  const [isUploading, setIsUploading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const { question } = route.params || {};
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  useEffect(() => {
    if (question) {
      const formatted = formatQuestion(question);
      setInput(formatted);
      // เอาคำถามไปถาม GPT ได้เลย เช่นเรียก API หรือ set ค่าบนหน้าจอ
      console.log("คำถามที่ส่งมา:", question);
      // callGPT(question);
    }
  }, [question]);

  const formatQuestion = (raw) => {
    if (raw.startsWith("ชื่อยา:")) {
      const medName = raw.replace("ชื่อยา:", "").trim();
      return `${medName} ช่วยในเรื่องใด?`;
    }
    return raw;
  };

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "สวัสดีค่ะ อยากสอบถามข้อมูลเกี่ยวกับยาอะไรไหมครับ!",
      sender: "other",
      imageUri: null,
    },
    // { id: "1", text: "สวัสดีครับ!", sender: "other", imageUri: null },
    // { id: "2", text: "มีอะไรให้ช่วยไหมครับ?", sender: "other", imageUri: null },
    // { id: "3", text: "อยากได้ mockup แชทครับ", sender: "me", imageUri: null },
  ]);

  const [input, setInput] = useState("");

  const getMedicineName = (raw) => {
    if (!raw) return "";
    // ถ้ามาในรูป "พาราเซตามอล ช่วยในเรื่องใด?" ให้ตัดเอาแค่ชื่อยา
    return raw.replace("ช่วยอะไร?", "").trim();
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // 1) แสดงข้อความผู้ใช้ก่อน
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [
      { id: Date.now().toString(), text: input, sender: "me" },
      ...prev,
    ]);
    setInput("");

    try {
      const historyToSend = [...chatHistory, userMessage];
      const response = await axios.post("https://m66pnkvf-3000.asse.devtunnels.ms/api/chatbot", {
        history: historyToSend,
      });
      const replyText = response.data.reply_message;

      // อัปเดต history และแสดงคำตอบหลัก
      const assistantMessage = { role: "assistant", content: replyText };
      setChatHistory([...historyToSend, assistantMessage]);
      setMessages((prev) => [
        { id: Date.now().toString(), text: replyText, sender: "other" },
        ...prev,
      ]);

      // 3) ให้ GPT สร้าง follow-up questions
      const followUpPrompt = `จากคำตอบนี้:
        ${replyText}

        ช่วยสร้างคำถามต่อยอด 3 ข้อ ที่เกี่ยวข้องกับยา "${getMedicineName(
        question
      )}" โดยคำถามควรเกี่ยวข้องกับสิ่งที่ผู้ใช้มักสงสัย เช่น วิธีใช้, ผลข้างเคียง, ข้อควรระวัง ฯลฯ

      **ให้ออกมาเป็น array ของ string ภาษาไทย เท่านั้น**`;
      const followUpRes = await axios.post(
        "https://m66pnkvf-3000.asse.devtunnels.ms/api/chatbot",
        {
          history: [
            ...historyToSend,
            assistantMessage,
            { role: "user", content: followUpPrompt },
          ],
        }
      );

      // 4) parse follow-up จาก reply (สมมติเป็น JSON)
      let followUps = [];
      try {
        followUps = JSON.parse(followUpRes.data.reply_message);
      } catch {
        // ถ้าไม่เป็น JSON ก็ split ตามบรรทัด
        followUps = followUpRes.data.reply_message
          .split("\n")
          .map((l) => l.replace(/^\d+\.\s*/, "").trim())
          .filter((l) => l);
      }

      setSuggestedQuestions(followUps);
    } catch (err) {
      console.error(err);
    }
  };

  {
    /*const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };

    // แสดงข้อความผู้ใช้ก่อน
    setMessages((prevMessages) => [
      { id: Date.now().toString(), text: input, sender: "me" },
      ...prevMessages,
    ]);

    setInput("");

    try {
      const historyToSend = [...chatHistory, userMessage];

      const response = await axios.post("http://172.20.10.2:3000/api/chatbot", {
        history: historyToSend, // 👈 ส่งไปด้วย
      });

      let replyText = response.data.reply_message || "ระบบขัดข้อง กรุณาลองใหม่";

      const medName = getMedicineName(question);

      const followUps = [
        `ควรทาน ${medName} ปริมาณเท่าไหร่?`,
        `${medName} มีผลข้างเคียงไหม?`,
        `สามารถทาน ${medName} ร่วมกับยาอื่นได้ไหม?`,
      ];

      setSuggestedQuestions(followUps);
      const assistantMessage = { role: "assistant", content: replyText };

      // เพิ่ม assistant reply เข้า history
      setChatHistory([...historyToSend, assistantMessage]);

      // แสดงข้อความ bot
      setMessages((prevMessages) => [
        {
          id: Date.now().toString(),
          text: replyText,
          sender: "other",
          imageUri: null,
        },
        ...prevMessages,
      ]);
    } catch (err) {
      console.error(err);
    }
  };*/
  }

  const renderMessage = ({ item }) => {
    const isMe = item.sender === "me";

    return (
      <View
        style={{
          flexDirection: isMe ? "row-reverse" : "row",
          alignItems: "flex-start",
          marginVertical: 5,
          alignSelf: isMe ? "flex-end" : "flex-start",
          paddingHorizontal: 10,
        }}
      >
        {/* ไอคอนคนพูด */}
        <Icon
          name={isMe ? "person" : "support-agent"}
          size={24}
          color={isMe ? "#000000" : "#007AFF"}
          style={{ marginHorizontal: 8, marginTop: 4 }}
        />

        {/* Bubble */}
        <View
          style={[
            isMe ? styles.myMessageContainer : styles.otherMessageContainer,
            { flexShrink: 1 },
          ]}
        >
          <Text
            style={[
              isMe ? styles.sendmessageText : styles.messageText,
              { flexShrink: 1 },
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access me dia library is required");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      uploadImage(imageUri);
    }
  };

  const uploadImage = async (imageUri) => {
    if (!imageUri) {
      alert("Please select an image first.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    try {
      const response = await axios.post(
        `https://m66pnkvf-3000.asse.devtunnels.ms/api/images/uploads`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      console.log(result);
      if (response.status) {
        setMessages((prevMessages) => [
          { id: Date.now().toString(), text: result, sender: "me", imageUri },
          ...prevMessages,
        ]);
      } else {
        alert("upload failed:" + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error uoloading image: ", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View
        style={{
          flexDirection: "row",
          justifyItems: "flex-start",
          alignItems: "center",
          marginTop: 50,
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Homepage")}
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

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={{ flex: 1, paddingHorizontal: 10 }}
        inverted
      />
      {suggestedQuestions.length > 0 && (
        <View style={{ paddingHorizontal: 15, paddingBottom: 5 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            คำถามแนะนำ:
          </Text>
          {suggestedQuestions.map((q, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setInput(q)}
              style={{
                backgroundColor: "#e0f0ff",
                padding: 10,
                borderRadius: 10,
                marginBottom: 5,
              }}
            >
              <Text>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={{ marginLeft: 10 }}>
          {isUploading ? (
            <ActivityIndicator size="small" color="blue" />
          ) : (
            <Icon name="image" size={30} color="black" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="พิมพ์ข้อความ..."
        />

        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  myMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#4682B4",
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  messageText: {
    color: "#000000",
  },
  sendmessageText: {
    color: "#ffff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "#f9f9f9",
  },
});
