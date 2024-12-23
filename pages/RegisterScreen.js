import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
export default function RegisterScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Welcom to Register
      </Text>
    </View>
  );
}
