import React, { useState } from "react";
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

export default function ChatScreen({ navigation }) {
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState([
    { id: "1", text: "สวัสดีครับ!", sender: "other", imageUri: null },
    { id: "2", text: "มีอะไรให้ช่วยไหมครับ?", sender: "other", imageUri: null },
    { id: "3", text: "อยากได้ mockup แชทครับ", sender: "me", imageUri: null },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prevMessages) => [
        { id: Date.now().toString(), text: input, sender: "me" },
      ...prevMessages,
    ]);

    try{
        let replyText = "1";
        if(replyText !== ""){
            replyText ="1";
        }

        setMessages((prevMessages)=>[
            { id: Date.now().toString(), text: replyText, sender: "other", imageUri:null },
            ...prevMessages,
        ]);
    }catch(error){
        console.error(err);
    }


    
    setInput("");
  };

  const renderMessage = ({ item }) => (
    <View
      style={
        item.sender === "me"
          ? styles.myMessageContainer
          : styles.otherMessageContainer
      }
    >
      {item.imageUri ? (
        <Image
          source={{ uri: item.imageUri }}
          style={{
            width: 200,
            height: 150,
            borderRadius: 10,
            marginVertical: 5,
          }}
        />
      ) : (
        <Text
          style={
            item.sender === "me" ? styles.sendmessageText : styles.messageText
          }
        >
          {item.text}
        </Text>
      )}
    </View>
  );

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
        "http://192.168.10.104:3000/api/images/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      console.log(result)
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
    marginVertical: 5,
    maxWidth: "70%",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#ffff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "70%",
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
