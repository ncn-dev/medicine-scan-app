import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useReminderContext } from "./ReminderContext";
import { getData } from "../utils/getUserAccount";

export default function MedBag({ navigation, route }) {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const prevDataLength = useRef(0);
  const isFirstLoad = useRef(true);
  

  const fetchData = async (uploaded = false) => {
    try {
      const username = await getData();
      const response = await axios.get(
        `http://172.20.10.3:3000/api/user/medbag/${username}`
      );
      const newData = response.data;
  
      if (uploaded) {
        console.log("Modal เปิดเพราะอัปโหลดเสร็จ");
        setModalVisible(true);
      }
  
      setData(newData); // ตั้งค่าใหม่ให้กับ data
      prevDataLength.current = newData.length;
      
      console.log(newData); // แสดงข้อมูลที่ได้จากการดึงข้อมูล
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // ตรวจสอบว่า params มีค่า `uploaded` หรือไม่
    if (route.params?.uploaded) {
      console.log("Modal เปิดเพราะอัปโหลดเสร็จ");
      setModalVisible(true); // เปิด Modal
      navigation.setParams({ uploaded: false }); // รีเซ็ตค่า uploaded หลังจากเปิด Modal
    } else {
      fetchData(false); // ถ้าไม่มีการอัปโหลด ให้โหลดข้อมูล
    }
  }, [route.params, navigation]);

  const isExpired = (expDate) => {
    if(expDate === null){
      return false;
    }
    const today = new Date();
    const exp = new Date(expDate);
    console.log(exp < today);
    return exp < today;
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.post(
        `http://172.20.10.3:3000/api/user/deletemedbag/${id}`
      );
      console.log(response.data.message); // ตรวจสอบข้อความตอบกลับ

      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CC0000",
        borderRadius: 10,
        width: 80,
        height: 140,
        marginTop: 10,
      }}
      onPress={() => {
        Alert.alert("ยืนยันการลบ", "คุณต้องการที่จะลบยานี้ใช่หรือไม่", [
          {
            text: "ยกเลิก",
          },
          {
            text: "ยืนยัน",
            onPress: () => {
              deleteData(id);
            },
          },
        ]);
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
        onPress={() => {
          console.log("ดูรายละเอียด", item);
          navigation.navigate("Detail", { item: item });
        }}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          marginVertical: 10,
          backgroundColor: "#fff",
          elevation: 5,
        }}
      >
        {/* ส่วนบน */}
        <View
          style={{
            backgroundColor: expired ? "#e60000" : "#077d23",
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {expired ? "หมดอายุแล้ว โปรดนำไปทิ้งโดยด่วน" : ""}
          </Text>
        </View>

        {/* ส่วนล่าง */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#DCDCDC",
            padding: 10,
          }}
        >
          <Image
            source={{
              uri: `http://172.20.10.3:3000/api/uploads/${imagepath}`,
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 8,
              marginRight: 10,
            }}
          />
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{name}</Text>
            <Text style={{ color: "#555", marginTop: 5 }}>{dose}</Text>
            <Text style={{ color: "#555", marginTop: 5 }}>{date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};


  const { beforeMealReminder, afterMealReminder, saveReminderSettings } =
    useReminderContext();
  const getTextColor = () => {
    if (beforeMealReminder && afterMealReminder) return "#007BFF"; // น้ำเงิน
    if (beforeMealReminder || afterMealReminder) return "#4CAF50"; // เขียว
    return "#000"; // ดำ
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

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 0, textAlign: 'center' }}
            >
              ต้องการตั้งเวลากินยาหรือไม่ 🕐
            </Text>

            {/*<Pressable
              style={{ padding: 10 }}
              onPress={() => {
                saveReminderSettings(!beforeMealReminder, afterMealReminder);
              }}
            >
              <Text style={{ color: beforeMealReminder ? "#4CAF50" : "#000", fontSize:16 }}>
                ก่อนอาหาร
              </Text>
            </Pressable>

            <Pressable
              style={{ padding: 10 }}
              onPress={() => {
                saveReminderSettings(beforeMealReminder, !afterMealReminder);
              }}
            >
              <Text style={{ color: afterMealReminder ? "#4CAF50" : "#000", fontSize:16 }}>
                หลังอาหาร
              </Text>
            </Pressable>*/}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-center", // ชิดขวา
                marginTop: 20,
              }}
            >
              {/* ปุ่มตกลง */}
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginRight: 10,
                  marginLeft: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("ReminderScreen")
                }}
              >
                <Text style={{ color: "#0022e6", fontSize:17 }}>
                  ตกลง
                </Text>
              </Pressable>

              {/* ปุ่มยกเลิก */}
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  marginLeft: 70
                 
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#e60000", fontSize:17 }}>ยกเลิก</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/*<View style={{ padding: 20, backgroundColor: "#fff", borderRadius: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>แจ้งเตือนการกินยา</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <CheckBox
            value={beforeMealReminder}
            onValueChange={(newValue) =>{
              console.log("ก่อนอาหาร:", newValue);
              saveReminderSettings(newValue, afterMealReminder)
            }}
          />
          <Text style={{ marginLeft: 10 }}>ก่อนอาหาร</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <CheckBox
            value={afterMealReminder}
            onValueChange={(newValue) =>{
              console.log("ก่อนอาหาร:", newValue);
              saveReminderSettings(beforeMealReminder, newValue)
            }}
          />
          <Text style={{ marginLeft: 10 }}>หลังอาหาร</Text>
        </View>
      </View>*/}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            name={`ชื่อยา : ${item.medicinename}`}
            dose={`ขนาดยา : ${item.dose}`}
            date={`EXP : ${item.exp == null ? 'ยังไม่ได้กำหนด' : `${item.exp}`}`}
            imagepath={`${item.imagepath}`}
            item={item}
          />
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
