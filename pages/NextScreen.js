import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";

import * as ImagePicker from "expo-image-picker";
//หน้าถัดไป
export default function NextScreen() {
  const [data, setData] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access me dia library is required");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  const uploadImage = async () => {
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
        "http://192.168.10.104:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/from-data",
          },
        }
      );
      alert("Image uploaded successfully.");
      console.log(response.data.message);
      setData(response.data);
    } catch (error) {
      console.error("error uoloading image:", error);
      alert("Failed to uplad image or fetch OCR data");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.10.104:3000/api/ocr");
      setData(response.data);
    } catch (error) {
      console.log(err);
    }
  };

  /*useEffect(() => {
    fetchData();
  }, []);*/

  return (
    <View>
      <ScrollView contentContainerStyle={{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#F5F5F5",
        paddingVertical:20
      }}
      >
        <View
          style={{
            //flex: 1,
            justifyContent: "center",
            alignItems: "center",
            
            backgroundColor: "#DCDCDC",
            marginTop: 50,
            paddingLeft:10,
            paddingRight:10
          }}
        >
          <Text style={{ fontSize: 24,  }}>
            {data.message}
          </Text>
        </View>

        {/*อัปโหลดรูป*/}
        <View
          style={{
            //flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "#F5F5F5",
            paddingBottom: 40,
            marginTop:10
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Pick an Image
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: "#18253B",
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18 }}>Choose Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={openCamera}
          style={{
            backgroundColor: "#18253B",
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 20,
          }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18 }}>Open OpenCamera</Text>

          </TouchableOpacity>

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 200, height: 200, marginTop: 20 }}
            />
          )}
          {/*๊Upload Buttom */}
          <TouchableOpacity
            onPress={uploadImage}
            style={{
              backgroundColor: "#FF0000",
              paddingVertical: 15,
              paddingHorizontal: 40,
              alignItems: "center",
              marginBottom: 50,
              borderRadius: 10,
              marginTop: 40,
            }}
            disable={isUploading}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18 }}>
              {isUploading ? "Uploading..." : "Upload Image"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
