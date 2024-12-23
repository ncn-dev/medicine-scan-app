import React, { useState } from "react";

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
import { Checkbox } from "react-native-paper";

const logo = require("../assets/image/1.png");
const logo4 = require("../assets/image/4.png");

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, backgroundColor: "#FFFF" }}>
          <View>
            <Text
              style={{
                marginTop: 100,
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
              placeholder="Enter your username"
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
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                color="#3498db" // สีเมื่อ checkbox ถูกเลือก
                uncheckedColor="#D9D9D9" // สีเมื่อ checkbox ไม่ถูกเลือก
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
              onPress={() =>
                alert(`Welcome ,${username}! Remember Me:${rememberMe}`)
              }
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "bold" }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20, textAlign: "left", marginLeft: 40 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 16 }}>Register Account, </Text>
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
                    }}
                  >
                    Click me
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
