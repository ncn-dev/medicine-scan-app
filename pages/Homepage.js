import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
//import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Homepage({ route, navigation }) {
  //const { userName } = route.params || { userName: userName};
  const [seach, setseach] = useState("");
  const [userName, setUserName] = useState(route.params?.userName || "Guest");
  useEffect(() => {
    if (route.params?.userName && userName === "Guest") {
      setUserName(route.params.userName); // ตั้งค่า userName ที่ส่งมาจาก route.params
    }
  }, [route.params?.userName]); // ใช้เมื่อ route.params เปลี่ยนแปลง

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

  return (
    <View style={{ marginTop: 10 , backgroundColor:"#FFFFFF"}}>
      <View
        style={{
          position: "absolute",
          zIndex: 10, 
          backgroundColor:"#FFFFFF",
          width:"100%",
          marginTop:-10
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
          Hi, Khun{userName}!
        </Text>
      </View>
      <View style={{ flex: 1, paddingLeft: 40, paddingRight: 40 }}>
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
      </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,

          backgroundColor:"#FFFFFF",
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            paddingHorizontal: 30,
            marginTop:80
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

        <View
          style={{
            flexDirection: "row", // จัดเรียงกล่องในแนวนอน
            justifyContent: "flex-start", // จัดกล่องให้เริ่มต้นที่ซ้าย
            alignItems: "center", // จัดกล่องให้อยู่กลางในแนวตั้ง
            marginTop: 10,
            paddingHorizontal: 30, // ระยะห่างจากด้านบน
          }}
        >
          <View
            style={{
              backgroundColor: "#DCDCDC", // สีพื้นหลังของ card
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              width: 150,
              height: 150, // ขนาด card
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
              }}
            >
              Glippizide
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "gray",
                marginBottom: 20,
              }}
            >
              Remaining Doses
            </Text>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "700",
                color: "#000",
              }}
            >
              <Text
                style={{
                  fontSize: 50, // ขนาดตัวเลข
                  fontWeight: "bold",
                }}
              >
                13
              </Text>
              day
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#DCDCDC", // สีพื้นหลังของ card
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              width: 150,
              height: 150, // ขนาด card
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
              }}
            >
              Glippizide
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "gray",
                marginBottom: 20,
              }}
            >
              Remaining Doses
            </Text>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "700",
                color: "#000",
              }}
            >
              <Text
                style={{
                  fontSize: 50, // ขนาดตัวเลข
                  fontWeight: "bold",
                }}
              >
                13
              </Text>
              day
            </Text>
          </View>
        </View>
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
            <TouchableOpacity onPress={() => navigation.navigate("MedBag")}>
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
          position: "fixed", // ติดกับขอบล่างของหน้าจอ
          bottom: 0,
          left: 0,
          right: 0,
          top: -50,
          width: "100%",
          height: 200, // ความสูง Navbar
          flexDirection: "row", // จัดเรียงแนวนอน
          justifyContent: "space-around", // กระจายไอคอนให้สมดุล
          alignItems: "center", // จัดให้อยู่กึ่งกลางแนวตั้ง
          backgroundColor: "#1E293B", // พื้นหลัง Navbar
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Homepage")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -130,
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
            marginTop: -130,
            marginLeft: 20,
          }}
        >
          <Icon name="work" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 3 }}>
            MedBag
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "#FFFFFF",
            marginLeft: 30,
            marginTop: -100,
            fontSize: 19,
          }}
        >
          Scan
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Homepage")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -130,
            marginLeft: 20,
          }}
        >
          <Icon name="forum" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 2 }}>
            Chatbot
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Homepage")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            flexDirection: "column", // หากต้องการเพิ่มไอคอนหรือข้อความข้างๆ
            alignItems: "center",
            marginTop: -130,
            marginLeft: 20,
            marginRight: 10,
          }}
        >
          <Icon name="settings" size={30} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", marginLeft: 5, marginTop: 2 }}>
            Setting
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E293B", // สีพื้นหลังของแถบ
          position: "absolute",
          bottom: 210,
          borderRadius: 50, // ติดล่างหน้าจอ
          height: 70, // ลดขนาดให้พอดีกับการแสดง
          width: 70, // ขยายเต็มหน้าจอ
          paddingHorizontal: 20,
          marginLeft: 160, // เพิ่ม padding ซ้ายขวา
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("NextScreen")} // ใส่โค้ด onPress ให้ในตำแหน่งที่ถูกต้อง
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: -7,
          }}
        >
          <Icon name="fullscreen" size={45} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
