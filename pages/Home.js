import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native";
const logo = require("../assets/image/1.png");
const logo2 = require("../assets/image/3.png");

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFF" }}>
      <View style={{}}>
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
          style={{ width: 150, height: 130, marginLeft: 35, marginTop: -89 }}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: -40,
          }}
        >
          <Image source={logo2} style={{ width: 500, height: 500 }} />
        </View>

        {/*ปุ่มไปหน้าภัดไป*/}
        <View style={{ marginTop: -20, paddingHorizontal: 60 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{
              backgroundColor: "#18253B",
              paddingVertical: 20,
              paddingHorizontal: 40,
              borderRadius: 40,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "bold" }}
            >
              {" "}
              GET STARTED
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ marginTop: 20, textAlign: "left", marginLeft: 80, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16 }}>If you are a pharmacist, </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("PharmacistHomeScreen")}
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
        </View> */}
      </View>
    </View>
  );
}
