import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function MedBag({ navigation }) {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.10.104:3000/api/user/medbag/admin"
      );
      await setData(response.data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const Card = ({ name, dose, date ,item,}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Detail",{ item : item })}
      style={{
        height: 170, // ความสูงการ์ดรวม
        borderRadius: 10,
        marginVertical: 10,
        overflow: "hidden", // ป้องกันสีล้นออกนอกการ์ด
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}
    >
      {/* ส่วนบนของการ์ด */}
      <View
        style={{
          flex: 0.3, // ส่วนบนจะ占พื้นที่ 60% ของการ์ด
          backgroundColor: "#4682B4", // สีส่วนบน
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      {/* ส่วนล่างของการ์ด */}
      <View
        style={{
          flex: 0.5, // ส่วนล่างจะ占พื้นที่ 40% ของการ์ด
          backgroundColor: "#DCDCDC", // สีส่วนล่าง
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginLeft: 40,
            marginTop: -10,
          }}
        >
          {name}
        </Text>
        <Text
          style={{ fontSize: 14, color: "#555", marginLeft: 40, marginTop: 1 }}
        >
          {dose}
        </Text>
        <Text
          style={{ fontSize: 14, color: "#555", marginLeft: 40, marginTop: 1 }}
        >
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        marginTop: 60,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyItems: "flex-start",
          alignItems: "center",
          marginTop: -20,
          marginLeft: 10,
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
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#333",
        }}
      >
        Medicine Bags
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            name={`Drug name : ${item.medicinename}`}
            dose={`Dosage : ${item.dose}`}
            date={`MFG : ${item.mfg}, EXP : ${item.exp}`}
          />
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
