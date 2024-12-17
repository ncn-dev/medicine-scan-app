import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
//หน้าถัดไป
export default function NextScreen() {
  const [data, setData] = useState("");

  const [imageUri, setImageUri] = useState(null);
  
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

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.10.104:3000/api/ocr");
      setData(response.data);
    } catch (error) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        marginTop:200
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{data.drug_name}</Text>

      {/*อัปโหลดรูป*/}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: "#F5F5F5",
          paddingBottom: 40,
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
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
        )}
         
      </View>
      <View>
        
      </View>
    </View>
  );
}
