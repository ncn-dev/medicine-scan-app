import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function Detail({ route }) {
  const { item } = route.params;

  if (!item) {
    return <Text>Error: No data available</Text>; // ถ้าไม่มีข้อมูลให้แสดงข้อความผิดพลาด
  }
  
  return (
    <View style={{ paddingHorizontal: 50, marginTop: 20 }}>
      <Text>Drug Name: {item.medicinename}</Text>
      <Text>Dosage: {item.dose}</Text>
      <Text>Manufacture Date: {item.mfg}</Text>
      <Text>Expiry Date: {item.exp}</Text>
    </View>
  );
}
