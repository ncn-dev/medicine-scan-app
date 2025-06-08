import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import axios from "axios";

export default function Detail({ route, navigation }) {
  const { item } = route.params;
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [playingStates, setPlayingStates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  if (!editedItem) {
    return <Text>Error: No data available</Text>; // ถ้าไม่มีข้อมูลให้แสดงข้อความผิดพลาด
  }
  useEffect(() => {
    console.log("Received item: ", editedItem); // ตรวจสอบว่าข้อมูลได้รับครบถ้วน
  }, []);

  const speakText = (key, label, text) => {
    // หยุดการอ่านก่อนหน้า
    Speech.stop();

    // ถ้ามีการเล่นอยู่ -> หยุดเสียงและตั้งค่าเป็น false
    if (playingStates[key]) {
      setPlayingStates((prev) => ({ ...prev, [key]: false }));
    } else {
      // อ่านข้อความออกเสียง
      Speech.speak(`${label} ${text}`, {
        language: "th-TH",
        pitch: 1.0,
        rate: 1.0,
      });

      // อัปเดต state ให้ปุ่มนี้เป็น isPlaying: true
      setPlayingStates((prev) => ({ ...prev, [key]: true }));

      // ตั้งค่าให้หยุดเล่นเมื่ออ่านจบ
      setTimeout(() => {
        setPlayingStates((prev) => ({ ...prev, [key]: false }));
      }, 3000); // ปรับเวลาตามระยะเวลาการอ่าน
    }
  };
  // const renderRightActions = (id) => (
  //   <TouchableOpacity
  //     style={{
  //       justifyContent: "center",
  //       alignItems: "center",
  //       backgroundColor: "#FF8C00",
  //       borderRadius: 9,
  //       width: 70,
  //       height: 40,
  //       marginTop: 7,
  //     }}
  //     onPress={() => {
  //       setModalVisible(true);
  //     }}
  //   >
  //     <Icon name="edit" size={30} color="#fff" />
  //   </TouchableOpacity>
  // );

  const updateData = async (id) => {
    console.log(id);
    const data = {
      id: editedItem.id,
      medicinename: editedItem.medicinename,
      dose: editedItem.dose,
      form: editedItem.form,
      registrationnumber: editedItem.registrationnumber,
      mfg: editedItem.mfg,
      exp: editedItem.exp,
      warning: editedItem.warning,
      indication: editedItem.indication,
      usage: editedItem.usage,
      rating: editedItem.effect,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `https://m66pnkvf-3000.asse.devtunnels.ms/api/user/updatemedbag`,
        data
      );
      if (!response.ok) {
        alert("Data updated successfully");
        console.log("Data updated successfully");
      } else {
        console.log("update is failed");
      }
    } catch (err) {
      console.log.error(err);
      alert("Failed");
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
            uri: `https://m66pnkvf-3000.asse.devtunnels.ms/api/uploads/${editedItem.imagepath}`,
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
              marginRight: 10,
            }}
            onPress={() => {
              speakText("ชื่อยา", "ชื่อยา", editedItem.medicinename);
              setIsPlaying(!isPlaying);
            }}
          >
            <Icon
              name={playingStates["ชื่อยา"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>
          //
          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>ชื่อยา: </Text>
              <Text
                style={{
                  fontSize: 18,
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.medicinename}
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["ปริมาณยา"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() => speakText("ปริมาณยา", "ปริมาณยา", editedItem.dose)}
          >
            <Icon
              name={playingStates["ปริมาณยา"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                ปริมาณยา:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.dose}
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["รูปแบบเภสัชภัณฑ์"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() =>
              speakText("รูปแบบเภสัชภัณฑ์", "รูปแบบเภสัชภัณฑ์", editedItem.form)
            }
          >
            <Icon
              name={playingStates["รูปแบบเภสัชภัณฑ์"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                รูปแบบเภสัชภัณฑ์:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.form}
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["เลขทะเบียนยา"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() =>
              speakText(
                "เลขทะเบียนยา",
                "เลขทะเบียนยา",
                editedItem.registrationnumber
              )
            }
          >
            <Icon
              name={playingStates["เลขทะเบียนยา"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  เลขทะเบียนยา:{" "}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    flexShrink: 1,
                    maxWidth: "100%",
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {editedItem.registrationnumber}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["วันที่ผลิต"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() =>
              speakText("วันที่ผลิต", "วันที่ผลิต", editedItem.mfg)
            }
          >
            <Icon
              name={playingStates["วันที่ผลิต"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                วันที่ผลิต:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
              >
                {editedItem.mfg}
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["วันหมดอายุ"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() =>
              speakText("วันหมดอายุ", "วันหมดอายุ", editedItem.exp)
            }
          >
            <Icon
              name={playingStates["วันหมดอายุ"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                วันหมดอายุ:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.exp}
              </Text>
            </View>
          </TouchableOpacity>
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
              marginRight: 10,
            }}
            onPress={() => speakText("คำเตือน", "คำเตือน", editedItem.warning)}
          >
            <Icon
              name={playingStates["คำเตือน"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
                **คำเตือน:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: "red",
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.warning}
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["ข้อบ่งชี้"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() =>
              speakText("ข้อบ่งชี้", "ข้อบ่งชี้", editedItem.indication)
            }
          >
            <Icon
              name={playingStates["ข้อบ่งชี้"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                ข้อบ่งชี้:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  flexShrink: 1,
                  maxWidth: "100%",
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.indication}
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: playingStates["วิธีการใช้งาน"]
                ? "#00CC00"
                : "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() =>
              speakText("วิธีการใช้งาน", "วิธีการใช้งาน", editedItem.usage)
            }
          >
            <Icon
              name={playingStates["วิธีการใช้งาน"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 70,
            }}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                วิธีการใช้งาน:{" "}
              </Text>
              <Text style={{
                fontSize: 18,
                flexShrink: 1,
                maxWidth: "100%"
              }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {editedItem.usage}
              </Text>
            </View>
          </TouchableOpacity>
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
              marginRight: 10,
            }}
            onPress={() => speakText("ผลกระทบ", "ผลกระทบ", editedItem.effect)}
          >
            <Icon
              name={playingStates["ผลกระทบ"] ? "pause" : "play-arrow"}
              size={25}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              width: "100%",
              height: 50,
            }}
            onPress={() => setModalVisible(true)}
          >


            <View
              style={{
                backgroundColor: "#D9D9D9",
                padding: 10,
                borderRadius: 10,
                marginTop: 5,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>ผลกระทบ: </Text>
              <Text style={{ fontSize: 18 }}>{editedItem.effect}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#33CC00",
              borderRadius: 9,
              width: 100,
              height: 60,
              marginTop: 30,
              paddingVertical: 5,
            }}
            onPress={() => {
              updateData(item.id);
            }}
          >
            <Icon name="save" size={29} color="#fff" />
            <Text style={{ color: "white", fontWeight: "bold" }}>update</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  width: 300,
                  padding: 20,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Medicine Name"
                  value={editedItem.medicinename}
                  onChangeText={(text) =>
                    setEditedItem((prev) => ({
                      ...prev,
                      medicinename: text,
                    }))
                  }
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      ปิด
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => setModalVisible(false)} // Close the modal
                  >
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
