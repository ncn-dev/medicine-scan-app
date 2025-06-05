import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { removeData } from "../utils/getUserAccount";

export default function Settingpage({ navigation }) {
  const handleLogout = () => {
    removeData(); // ลบข้อมูลที่ต้องการ
    navigation.navigate("Home");
    console.log("User logged out");
  };

  return (
    <View style={styles.container}>
      {/* ปุ่ม Back */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Homepage")}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* ข้อความ Logout */}
      <Text style={styles.text}>Are you sure you want to log out?</Text>

      {/* ปุ่ม Logout */}
      <TouchableOpacity style={styles.buttonYes} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 100,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonYes: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
