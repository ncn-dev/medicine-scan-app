import axios from "axios";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";


export default function MedBag({ navigation }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://172.20.10.2:3000/api/user/medbag/admin"
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

  const isExpired = (expDate) => {
    const today = new Date();
    const exp = new Date(expDate);
    console.log(exp < today);
    return exp < today;
  };
  
  const deleteData = async (id) => {
    try{
      const response = await axios.post(`http://172.20.10.2:3000/api/user/deletemedbag/${id}`);
      console.log(response.data.message); // ตรวจสอบข้อความตอบกลับ

      setData(data.filter((item) => item.id !== id));
    }catch(error){
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
    }
  }
 
  const renderRightActions = (id) => (
    <TouchableOpacity  
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CC0000",
        borderRadius: 10,
        width: 80,
        height: 150,
        marginTop: 10,
      }}
      onPress={() => {
        Alert.alert("ยืนยันการลบ","คุณต้องการที่จะลบยานี้ใช่หรือไม่",[
          {
            text: 'ยกเลิก'
          },
          {
            text: 'ยืนยัน',
            onPress: () => {
              deleteData(id)
            }
          },
        ])
      }}
    >
      <Icon name="delete" size={30} color="#fff" />
    </TouchableOpacity>
  );

  const Card = ({ name, dose, date, item, imagepath }) => {
    const expired = isExpired(item.exp);
    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Detail", { item: item })}
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
              backgroundColor: expired ? "#FF0000" : "#4682B4", // สีส่วนบน
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "Black",
                fontSize: 18,
              }}
            >
              {expired ? "*ยาของท่านหมดอายุแล้ว" : ""}
            </Text>
          </View>
          {/* ส่วนล่างของการ์ด */}
          <View
            style={{
              flex: 0.5, // ส่วนล่างจะ占พื้นที่ 40% ของการ์ด
              backgroundColor: "#DCDCDC", // สีส่วนล่าง
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Image
              source={{
                uri: `http://172.20.10.2:3000/api/uploads/${imagepath}`,
              }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                marginRight: 10,
                marginTop: -1,
                marginLeft: 10,
              }}
            />
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
              marginLeft: 90,
              marginTop: -80,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#555",
              marginLeft: 90,
              marginTop: 10,
            }}
          >
            {dose}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#555",
              marginLeft: 90,
              marginTop: 10,
            }}
          >
            {date}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

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
            name={`ชื่อยา : ${item.medicinename}`}
            dose={`ขนาดยา : ${item.dose}`}
            date={`MFG : ${item.mfg}, EXP : ${item.exp}`}
            imagepath={`${item.imagepath}`}
            item={item}
          />
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
