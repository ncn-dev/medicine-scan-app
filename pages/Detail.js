import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Detail({ route }) {
  const { item } = route.params;

  if (!item) {
    return <Text>Error: No data available</Text>; // ถ้าไม่มีข้อมูลให้แสดงข้อความผิดพลาด
  }
  useEffect(() => {
    console.log("Received item: ", item); // ตรวจสอบว่าข้อมูลได้รับครบถ้วน
  }, []);

  return (
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
      <Text style={{ fontSize: 20, marginTop: 30,  marginLeft: -5 }}> Drug Name: {item.medicinename}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>Dosage: {item.dose}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>
        Manufacture Date: {item.mfg}
      </Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>
        Expiry Date: {item.exp}
      </Text>
    </View>
  );
}
