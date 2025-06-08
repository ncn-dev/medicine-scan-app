import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import axios from "axios";
import { FlatList, TextInput } from "react-native-gesture-handler";
//import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ReminderContext } from "./ReminderContext";
import { getData, getMedicineAfter, getMedicineBefore } from "../utils/getUserAccount";
import { SafeAreaView } from 'react-native';
export default function Homepage({ route, navigation }) {
  const [seach, setseach] = useState("");
  const [data, setData] = useState([]);
  const { alertData, setAlertData } = useContext(ReminderContext);
  const [visible, setVisible] = useState(false);
  const [pillCount, setPillCount] = useState(0);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [eatBefore, setEatBefore] = useState([]);
  const [eatAfter, setEatAfter] = useState([]);

  useEffect(() => {
    const fetchingData = async () => {
      const eatBeforeData = await AsyncStorage.getItem("eatBefore");
      console.log('Before Data : ', eatBeforeData)
      const eatAfterData = await AsyncStorage.getItem("eatAfter");
      console.log('After Data : ', eatAfterData)

      if (eatBeforeData) {
        setEatBefore(JSON.parse(eatBeforeData));
        console.log('Eat Before : ', JSON.parse(eatBeforeData));
      } else {
        setEatBefore([]);
      }

      if (eatAfterData) {
        setEatAfter(JSON.parse(eatAfterData));
        console.log('Eat After : ', JSON.parse(eatAfterData));
      } else {
        setEatAfter([]);
      }
    };
    fetchingData();
    console.log("useEffect for eatBefore and eatAfter called");

  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning  ☀️";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  const fetchData = async () => {
    try {
      const username = await getData();
      // await console.log(username);
      if (!username) {
        navigation.navigate("Home")

      }
      const response = await axios.get(
        `https://m66pnkvf-3000.asse.devtunnels.ms/api/user/medbag/${username}`
      );
      await setData(response.data);
      // console.log(data);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    // จากนี้ไปคือ logic ปกติที่ให้ทำงานตอน alertData เปลี่ยน
    if (alertData) {
      setPillCount(alertData.pills);
      setVisible(true);
    }
  }, [alertData]);

  const closeModal = () => {
    setVisible(false);
    setAlertData(null); // reset alert
  };

  const images = [
    { id: 1, uri: require("../assets/image/krung.jpg"), title: "Drug 1" },
    {
      id: 2,
      uri: require("../assets/image/medicine.jpg"),
      title: "Medicine 2",
    },
  ];

  const images1 = [
    { id: 1, uri: require("../assets/image/drugs.jpg"), title: "drugs 2" },
    {
      id: 2,
      uri: require("../assets/image/1.jpg"),
      title: "drugs 3",
    },
  ];

  const imageSize = Dimensions.get("window").width * 0.8;

  const isExpired = (expDate) => {
    // console.log('EXP DATE', expDate)
    if (expDate === null) {
      return true;
    }
    const today = new Date();
    const exp = new Date(expDate);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffDays);
    return diffDays;
  };

  return (
    <View style={{ marginTop: 10, backgroundColor: "#FFFFFF" }}>
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)", // dim background
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 20,
              width: "80%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
              💊 กรุณาอย่าลืมทานยาในวันนี้นะคะ
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 4 }}>ก่อนอาหาร</Text>
              <Text style={{ fontSize: 15, color: "#444" }}>
                {eatBefore.length > 0
                  ? eatBefore.join(", ")
                  : "ไม่มียาที่ต้องทานก่อนอาหาร"}
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 4 }}>หลังอาหาร</Text>
              <Text style={{ fontSize: 15, color: "#444" }}>
                {eatAfter.length > 0
                  ? eatAfter.join(", ")
                  : "ไม่มียาที่ต้องทานหลังอาหาร"}
              </Text>
            </View>

            <Text style={{ fontSize: 15, marginBottom: 24, color: "#666", textAlign: "center" }}>
              รวมทั้งหมด {eatBefore.length + eatAfter.length} เม็ด
            </Text>

            <TouchableOpacity
              onPress={closeModal}
              style={{
                backgroundColor: "#4CAF50",
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>ตกลง</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          backgroundColor: "#FFFFFF",
          width: "100%",
          marginTop: -10,
        }}
      >
        <View
          style={{
            paddingTop: 70,
            paddingLeft: 15,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              paddingHorizontal: 30,
            }}
          >
            Hi, {getGreeting()}
          </Text>
        </View>
        {/* <View style={{ flex: 1, paddingLeft: 40, paddingRight: 40 }}>
          <TextInput
            style={{
              height: 50,
              borderColor: "#D9D9D9",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              marginVertical: 10,
              backgroundColor: "#D9D9D9",
              paddingLeft: 50,
            }}
            placeholder="Asking any question"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 10,
              top: 30,
              transform: [{ translateY: -10 }],
              paddingLeft: 40,
            }}
            onPress={() => setseach()}
          >
            <Icon name="search" size={30} color="#666" />
          </TouchableOpacity>
        </View> */}
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,

          backgroundColor: "#FFFFFF",
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            paddingHorizontal: 30,
            marginTop: 80,
          }}
        >
          <FlatList
            data={images}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  margin: 11,
                  backgroundColor: "#f4f4f4",
                  borderRadius: 21,
                  overflow: "hidden",
                  alignItems: "center",
                  width: imageSize,
                }}
              >
                <Image
                  source={item.uri}
                  style={{ width: "100%", height: 170, borderRadius: 21 }}
                  resizeMode="cover"
                />
              </View>
            )}
            contentContainerStyle={{ paddingTop: 70 }}
            snapToInterval={imageSize + 30} // เพิ่มขนาดของ margin เพื่อให้ภาพแต่ละภาพพอดีกับหน้าจอ
            decelerationRate="fast" // ให้การเลื่อนทำได้เร็วและราบรื่น
            pagingEnabled={true} // การเลื่อนแต่ละหน้าจะล็อคที่ตำแหน่ง
          />
        </View>

        <ScrollView
          horizontal // กำหนดให้เลื่อนได้ในแนวนอน
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row", // จัดเรียงกล่องในแนวนอน
            justifyContent: "flex-start", // จัดกล่องให้เริ่มต้นที่ซ้าย
            alignItems: "center", // จัดกล่องให้อยู่กลางในแนวตั้ง
            marginTop: 10,
            paddingHorizontal: 30, // ระยะห่างจากด้านบน
            minHeight: 155,
          }}
        >
          {data.length === 0 ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
            </View>
          ) : (
            data.map((item) => {
              // console.log(expired);
              const expired = isExpired(item.exp);
              // console.log('Nonpawit', typeof expired);
              return (
                <View
                  key={item.id} // ใช้ key ที่ไม่ซ้ำกัน (มักจะใช้ ID)
                  style={{
                    backgroundColor: "#DCDCDC",
                    padding: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    minwidth: 150,
                    maxWidt: 250,
                    height: "auto",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                    marginTop: 10,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#000",
                      marginBottom: 5,
                      textAlign: "center",
                      flexWrap: "wrap",
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.medicinename}
                  </Text>

                  <Text
                    style={{
                      fontSize: 15,
                      color: expired < 0 ? "#e60000" : "gray",
                      marginBottom: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {
                      expired === true ? "ท่านยังไม่ได้ตั้งวันหมดอายุของยา" : expired < 0 ? "ยาหมดอายุแล้ว" : "กำลังจะหมดอายุภายใน"
                    }
                  </Text>

                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "700",
                      color: expired < 0 ? "#e60000" : "#000000",
                    }}
                  >
                    {
                      expired === true ? "" : expired < 0 ? 'อันตรายถึงชีวิต' : `${expired} วัน`
                    }
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View
          style={{
            marginTop: 5,
            textAlign: "left",
            marginLeft: 10,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                marginTop: 20,
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: 15,
              }}
            >
              Go to my Medicine Bag,
            </Text>

            <TouchableOpacity
              style={{ zIndex: 100, elevation: 10 }}
              onPress={() => {
                // console.log("Navigating to MedBag");
                navigation.navigate("MedBag");
              }}
            >
              <Text
                style={{
                  marginTop: 20,
                  paddingLeft: 3,
                  color: "#428CA3",
                  fontSize: 15,
                  fontWeight: "bold",
                  alignSelf: "flex-end",
                  textDecorationLine: "underline",
                }}
              >
                click here
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: -60, paddingHorizontal: 30 }}>
          <FlatList
            data={images1}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  margin: 11,
                  backgroundColor: "#f4f4f4",
                  borderRadius: 21,
                  overflow: "hidden",
                  alignItems: "center",
                  width: imageSize,
                }}
              >
                <Image
                  source={item.uri}
                  style={{ width: "100%", height: 170, borderRadius: 21 }}
                  resizeMode="cover"
                />
              </View>
            )}
            contentContainerStyle={{ paddingTop: 70 }}
            snapToInterval={imageSize + 30} // เพิ่มขนาดของ margin เพื่อให้ภาพแต่ละภาพพอดีกับหน้าจอ
            decelerationRate="fast" // ให้การเลื่อนทำได้เร็วและราบรื่น
            pagingEnabled={true} // การเลื่อนแต่ละหน้าจะล็อคที่ตำแหน่ง
          />
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 70, // อยู่เหนือ navbar ที่สูง 200px
          left: 250,
          right: 0,
          alignItems: "center", // จัดให้ปุ่มอยู่ตรงกลางจอ
          zIndex: 999,
          // ให้ลอยอยู่เหนือทุกอย่าง
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("NextScreen")}
          style={{
            backgroundColor: "#1E293B",
            borderRadius: 30,
            width: 120,
            height: 50,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            gap: 5,
          }}
        >
          <Icon name="fullscreen" size={40} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              marginTop: 1,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Scan
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: -80,
          left: 0,
          right: 0,
          height: 120,
          backgroundColor: "#1E293B",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Homepage")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -20,
            marginLeft: 10,
          }}
        >
          <Icon name="home" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 3 }}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("MedBag")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -20,
            marginLeft: 20,
          }}
        >
          <Icon name="work" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 3 }}>
            MedBag
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ReminderScreen")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -30,
            marginLeft: 25,
          }}
        >
          <Icon name="schedule" size={40} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 5 }}>
            Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Chatbot")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -20,
            marginLeft: 20,
          }}
        >
          <Icon name="forum" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 2 }}>
            Chatbot
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SettingPage")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -20,
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <Icon name="logout" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 0, marginTop: 2 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      {/*<View
        style={{
          position: "absolute",
          bottom: 10,
          alignSelf: "center",
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("NextScreen")}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#1E293B",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="schedule" size={40} color="#FFFFFF" />
        </TouchableOpacity>
      </View>*/}
    </View>
  );
}
