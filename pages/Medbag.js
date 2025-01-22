import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

export default function MedBag() {
  const [data, setData] = useState([
    { id: "1", name: "John Doe", date: "2025-01-01" },
    { id: "2", name: "Jane Smith", date: "2025-01-05" },
  ]);

  const Card = ({ name, date }) => (
    <View style={styles.card}>
      {/* ส่วนบนของการ์ด */}
      <View style={styles.cardTop}>
        <Text style={styles.name}>{name}</Text>
      </View>
      {/* ส่วนล่างของการ์ด */}
      <View style={styles.cardBottom}>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Bags</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Card name={item.name} date={item.date} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  list: {
    paddingBottom: 10,
  },
  card: {
    height: 200, // ความสูงการ์ดรวม
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden", // ป้องกันสีล้นออกนอกการ์ด
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardTop: {
    flex: 0.3, // ส่วนบนจะ占พื้นที่ 60% ของการ์ด
    backgroundColor: "#4682B4", // สีส่วนบน
    justifyContent: "center",
    alignItems: "center",
  },
  cardBottom: {
    flex: 0.5, // ส่วนล่างจะ占พื้นที่ 40% ของการ์ด
    backgroundColor: "#DCDCDC", // สีส่วนล่าง
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
});
