import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function Detail({ route, navigation }) {
  const { item } = route.params;
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [playingStates, setPlayingStates] = useState({});


  if (!item) {
    return <Text>Error: No data available</Text>; // ถ้าไม่มีข้อมูลให้แสดงข้อความผิดพลาด
  }
  useEffect(() => {
    console.log("Received item: ", item); // ตรวจสอบว่าข้อมูลได้รับครบถ้วน
  }, []);

  const speakText = (key, label, text) => {
    // หยุดการอ่านก่อนหน้า
    Speech.stop();
  
    // ถ้ามีการเล่นอยู่ -> หยุดเสียงและตั้งค่าเป็น false
    if (playingStates[key]) {
      setPlayingStates((prev) => ({ ...prev, [key]: false }));
    } else {
      // อ่านข้อความออกเสียง
      Speech.speak(`${label} ${text}`, { language: "th-TH", pitch: 1.0, rate: 1.0 });
  
      // อัปเดต state ให้ปุ่มนี้เป็น isPlaying: true
      setPlayingStates((prev) => ({ ...prev, [key]: true }));
  
      // ตั้งค่าให้หยุดเล่นเมื่ออ่านจบ
      setTimeout(() => {
        setPlayingStates((prev) => ({ ...prev, [key]: false }));
      }, 3000); // ปรับเวลาตามระยะเวลาการอ่าน
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,

        backgroundColor: "#FFFFFF",
        paddingVertical: 20,
      }}
    >
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
            onPress={() => navigation.navigate("MedBag")}
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
        <Image
          source={{
            uri: `http://172.20.10.2:3000/api/uploads/${item.imagepath}`,
          }}
          style={{
            width: 270,
            height: 270,
            borderRadius: 8,
            marginRight: 10,
            marginTop: 20,
            marginLeft: 10,
          }}
        />
        <View
          style={{
            marginTop: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["ชื่อยา"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() =>{ 
              speakText("ชื่อยา", "ชื่อยา",item.medicinename)
              setIsPlaying(!isPlaying)
            }}
          >
            <Icon
              name={playingStates["ชื่อยา"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ชื่อยา:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.medicinename}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["ปริมาณยา"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText( "ปริมาณยา", "ปริมาณยา",item.dose)}
          >
            <Icon
              name={playingStates["ปริมาณยา"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ปริมาณยา:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.dose}</Text>
          </Text>
        </View>

        
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["รูปแบบเภสัชภัณฑ์"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("รูปแบบเภสัชภัณฑ์", "รูปแบบเภสัชภัณฑ์",item.form)}
          >
            <Icon
              name={playingStates["รูปแบบเภสัชภัณฑ์"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                รูปแบบเภสัชภัณฑ์:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.form}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["เลขทะเบียนยา"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("เลขทะเบียนยา", "เลขทะเบียนยา",item.registrationnumber)}
          >
            <Icon
              name={playingStates["เลขทะเบียนยา"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              เลขทะเบียนยา:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.registrationnumber}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["วันที่ผลิต"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("วันที่ผลิต", "วันที่ผลิต",item.mfg)}
          >
            <Icon
              name={playingStates["วันที่ผลิต"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              วันที่ผลิต:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.mfg}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["วันหมดอายุ"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("วันหมดอายุ", "วันหมดอายุ",item.exp)}
          >
            <Icon
              name={playingStates["วันหมดอายุ"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              วันหมดอายุ:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.exp}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["คำเตือน"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("คำเตือน", "คำเตือน",item.warning)}
          >
            <Icon
              name={playingStates["คำเตือน"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color:"red"}}>
              **คำเตือน:{" "}
            </Text>
            <Text style={{ fontSize: 18, color:"red" }}>{item.warning}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["ข้อบ่งชี้"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("ข้อบ่งชี้", "ข้อบ่งชี้",item.indication)}
          >
            <Icon
              name={playingStates["ข้อบ่งชี้"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ข้อบ่งชี้:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.indication}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["วิธีการใช้งาน"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("วิธีการใช้งาน", "วิธีการใช้งาน",item.usage)}
          >
            <Icon
              name={playingStates["วิธีการใช้งาน"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              วิธีการใช้งาน:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.usage}</Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            
          }}
        >
          {/* ปุ่มเล่นถอยหลัง 10 วินาที */}
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: playingStates["ผลกระทบ"] ? "#00CC00" : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight:10
            }}
            onPress={() => speakText("ผลกระทบ", "ผลกระทบ",item.effect)}
          >
            <Icon
              name={playingStates["ผลกระทบ"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <Text
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ผลกระทบ:{" "}
            </Text>
            <Text style={{ fontSize: 18 }}>{item.effect}</Text>
          </Text>
        </View>
       
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  controls: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  loopButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
