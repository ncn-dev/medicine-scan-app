import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Checkbox } from "expo-checkbox";
import Icon from "react-native-vector-icons/MaterialIcons";

const logo = require("../assets/image/1.png");
const logo4 = require("../assets/image/4.png");

// formData.append("identityCardNumber", username)
// formData.append("password", password)

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

  const fetchingData = async () => {
    if (!username || !password) {
      alert("Please input identityCardNumber or Password!");
      return;
    }
    const formData = new FormData();
    formData.append("identitynumber", username);
    formData.append("password", password);
    try {
      const response = await axios.post(
        "http://192.168.10.104:3000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.status);
      if (response.data.status) {
        navigation.navigate("NextScreen");
      } else {
        alert("Please check your username or password");
      }
    } catch (err) {
      console.error("error uploading Formdata:", err);
      alert("Connection Failed");
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, backgroundColor: "#FFFF" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 60,
              marginLeft: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
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
          <View>
            <Text
              style={{
                marginTop: "auto",
                textAlign: "right",
                fontSize: 40,
                marginRight: 70,
              }}
            >
              DoseAlert
            </Text>
            <Image
              source={logo}
              style={{
                width: 150,
                height: 130,
                marginLeft: 35,
                marginTop: -89,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              You are now logged in as a User.
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image source={logo4} style={{ width: 500, height: 300 }} />
          </View>
          {/*Add Textbox  Fields*/}
          <View style={{ paddingHorizontal: 50, marginTop: -20 }}>
            <TextInput
              style={{
                height: 50,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                borderRadius: 30,
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "#D9D9D9",
              }}
              placeholder="Enter Identity Card Number"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <TextInput
              style={{
                height: 50,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                borderRadius: 30,
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "#D9D9D9",
              }}
              placeholder="Enter your password"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            {/*Checkbox*/}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <Checkbox
                style={{ margin: 10 }}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "#18253B" : undefined}
              />
              <Text>Remember Me</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#18253B",
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 40,
                alignItems: "center",
                marginTop: 5,
              }}
              onPress={fetchingData}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "bold" }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20, textAlign: "left", marginLeft: 40 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Register account,{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text
                    style={{
                      color: "#428CA3",
                      fontSize: 16,
                      fontWeight: "bold",
                      alignSelf: "flex-end",
                      textDecorationLine: "underline",
                      paddingLeft: 3,
                    }}
                  >
                    click here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
