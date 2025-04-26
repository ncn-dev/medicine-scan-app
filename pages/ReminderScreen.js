import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ReminderContext } from "./ReminderContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReminderScreen = () => {
  const { setAlertData } = useContext(ReminderContext);
  const navigation = useNavigation();
  const [beforeNumberOfDays, setBeforeNumberOfDays] = useState(7);
  const [afterNumberOfDays, setAfterNumberOfDays] = useState(7);

  const [beforeMealSchedules, setBeforeMealSchedules] = useState([
    { hour: 8, minute: 0, pills: 1 },
    { hour: 12, minute: 0, pills: 1 },
    { hour: 18, minute: 0, pills: 1 },
  ]);

  const [afterMealSchedules, setAfterMealSchedules] = useState([
    { hour: 8, minute: 0, pills: 1 },
    { hour: 12, minute: 0, pills: 1 },
    { hour: 18, minute: 0, pills: 1 },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [timesPerDay, setTimesPerDay] = useState(4);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [editingType, setEditingType] = useState(null); // 'before' หรือ 'after'

  const onTimeChange = (event, selectedDate) => {
    if (selectedDate && selectedIndex !== null) {
      console.log("Selected time:", selectedDate);
      const hour = selectedDate.getHours();
      const updated =
        editingType === "before"
          ? [...beforeMealSchedules]
          : [...afterMealSchedules];

      updated[selectedIndex].hour = selectedDate.getHours();
      updated[selectedIndex].minute = selectedDate.getMinutes();

      editingType === "before"
        ? setBeforeMealSchedules(updated)
        : setAfterMealSchedules(updated);
    }
    setShowPicker(false);
    setSelectedIndex(null);
    setEditingType(null);
  };

  // const handleSave = async () => {
  //   // เก็บค่าตารางกินยาไว้ใน context
  //   await AsyncStorage.setItem(
  //     "beforeMealSchedules",
  //     JSON.stringify(beforeMealSchedules)
  //   );
  //   await AsyncStorage.setItem(
  //     "afterMealSchedules",
  //     JSON.stringify(afterMealSchedules)
  //   );
  //   setAlertData({
  //     before: beforeMealSchedules,
  //     after: afterMealSchedules,
  //   });

  //   // แสดง alert แจ้งเตือน
  //   Alert.alert("บันทึกสำเร็จ", "ระบบได้บันทึกเวลาแจ้งเตือนเรียบร้อยแล้ว");
  // };

  const handleSave = async () => {
    const now = new Date();
    
    await AsyncStorage.setItem(
      "beforeMealSchedules",
      JSON.stringify(beforeMealSchedules)
    );
    await AsyncStorage.setItem(
      "afterMealSchedules",
      JSON.stringify(afterMealSchedules)
    );
    await AsyncStorage.setItem(
      "startDate",
      now.toISOString() // <<== เพิ่มอันนี้
    );
    await AsyncStorage.setItem(
      "numberOfDays",
      numberOfDays.toString() // <<== เพิ่มอันนี้
    );
    await AsyncStorage.setItem(
      "beforeNumberOfDays",
      beforeNumberOfDays.toString()
    );
    await AsyncStorage.setItem(
      "afterNumberOfDays",
      afterNumberOfDays.toString()
    );
    
    setAlertData({
      before: beforeMealSchedules,
      after: afterMealSchedules,
    });
  
    Alert.alert("บันทึกสำเร็จ", "ระบบได้บันทึกเวลาแจ้งเตือนเรียบร้อยแล้ว");
  };
  

  const formatTime = (hour, minute) => {
    const formattedHour = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const formattedMinute = String(minute).padStart(2, "0");
    return `${String(formattedHour).padStart(
      2,
      "0"
    )}:${formattedMinute} ${ampm}`;
  };

  const now = new Date();
  const selectedSchedule =
    editingType === "before"
      ? beforeMealSchedules[selectedIndex]
      : afterMealSchedules[selectedIndex];

  const selectedTime = selectedSchedule
    ? new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        selectedSchedule.hour,
        selectedSchedule.minute
      )
    : now;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowHour = now.getHours();
      const nowMinute = now.getMinutes();

      [...beforeMealSchedules, ...afterMealSchedules].forEach((schedule) => {
        if (nowHour === schedule.hour && nowMinute === schedule.minute) {
          setAlertData({
            time: `${schedule.hour}:${schedule.minute}`,
            pills: schedule.pills,
          });
        }
      });
    }, 60000); // ทุก 1 นาที

    return () => clearInterval(interval); // ล้าง timer ตอน component unmount
  }, []);

  useEffect(() => {
    const loadStartDate = async () => {
      const storedStartDate = await AsyncStorage.getItem("startDate");
      const storedNumberOfDays = await AsyncStorage.getItem("numberOfDays");
      const storedBeforeNumberOfDays = await AsyncStorage.getItem("beforeNumberOfDays");
      const storedAfterNumberOfDays = await AsyncStorage.getItem("afterNumberOfDays");
  
      if (storedStartDate && storedNumberOfDays) {
        const startDate = new Date(storedStartDate);
        const today = new Date();
  
        const timeDiff = today.getTime() - startDate.getTime();
        const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
  
        const originalDays = parseInt(storedNumberOfDays, 10);
        const updatedDays = originalDays - daysPassed;
  
        if (updatedDays <= 0) {
          setNumberOfDays(0);
          setBeforeMealSchedules([]);
          setAfterMealSchedules([]);
        } else {
          setNumberOfDays(updatedDays);
        }
      }
  
      if (storedBeforeNumberOfDays) {
        setBeforeNumberOfDays(parseInt(storedBeforeNumberOfDays, 10));
      }
  
      if (storedAfterNumberOfDays) {
        setAfterNumberOfDays(parseInt(storedAfterNumberOfDays, 10));
      }
    };
  
    loadStartDate();
  }, []);
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ paddingHorizontal: 5, marginTop: 40 }}>
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
              marginLeft: 10,
            }}
          >
            <Icon name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Reminder</Text>

        {/*กล่องทานยาก่อนอาหาร*/}
        <View style={styles.reminderBox}>
          <Text style={styles.subTitle}>ตั้งเวลาเตือน (ก่อนอาหาร)</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={styles.blueBadge}>
              <TouchableOpacity
                onPress={() => {
                  const newCount =
                    beforeMealSchedules.length >= 5
                      ? 1
                      : beforeMealSchedules.length + 1;
                  const defaultTime = { hour: 8, minute: 0, pills: 1 };
                  const newSchedules = Array.from(
                    { length: newCount },
                    (_, i) => {
                      return beforeMealSchedules[i] || defaultTime;
                    }
                  );
                  setBeforeMealSchedules(newSchedules);
                }}
                onLongPress={() => {
                  if (beforeMealSchedules.length > 1) {
                    setBeforeMealSchedules(
                      beforeMealSchedules.slice(0, beforeMealSchedules.length - 1)
                    );
                    
                  }
                }}
              >
                <Text style={styles.badgeText}>
                  วันละ {beforeMealSchedules.length} ครั้ง
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.blueBadge}>
              <TouchableOpacity
                onPress={() => {
                  const newDays = beforeNumberOfDays >= 30 ? 1 : beforeNumberOfDays + 1;
                  setBeforeNumberOfDays(newDays);
                }}
              >
                <Text style={styles.badgeText}>
                  เป็นเวลา {beforeNumberOfDays} วัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {showPicker && (
            <DateTimePicker
              mode="time"
              value={selectedTime}
              onChange={onTimeChange}
            />
          )}
          {beforeMealSchedules.map((item, index) => (
            <View key={index} style={styles.scheduleRow}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedIndex(index);
                  setEditingType("before");
                  setShowPicker(true);
                }}
              >
                <Text style={styles.timeText}>
                  {formatTime(item.hour, item.minute)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const newPills = item.pills === 100 ? 1 : item.pills + 1;
                  const updated = [...beforeMealSchedules];
                  updated[index].pills = newPills;
                  setBeforeMealSchedules(updated);

                  // ส่งข้อมูล pills ใหม่เข้า context
                  setAlertData((prev) => ({
                    ...prev,
                    pillCount: newPills,
                  }));
                }}
              >
                <Text style={styles.pillText}>{item.pills} เม็ด</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/*กล่องทานยาหลังอาหาร*/}
        <View style={styles.reminderBox}>
          <Text style={styles.subTitle}>ตั้งเวลาเตือน (หลังอาหาร)</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={styles.blueBadge}>
              <TouchableOpacity
                onPress={() => {
                  const newCount =
                    afterMealSchedules.length >= 5
                      ? 1
                      : afterMealSchedules.length + 1;
                  const defaultTime = { hour: 8, minute: 0, pills: 1 };
                  const newSchedules = Array.from(
                    { length: newCount },
                    (_, i) => {
                      return afterMealSchedules[i] || defaultTime;
                    }
                  );
                  setAfterMealSchedules(newSchedules);
                }}
                onLongPress={() => {
                  if (afterMealSchedules.length > 1) {
                    setAfterMealSchedules(
                      afterMealSchedules.slice(0, afterMealSchedules.length - 1)
                    );
                  }
                }}
              >
                <Text style={styles.badgeText}>
                  วันละ {afterMealSchedules.length} ครั้ง
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.blueBadge}>
              <TouchableOpacity
                onPress={() => {
                  const newDays = afterNumberOfDays >= 14 ? 1 : afterNumberOfDays + 1;
                  setAfterNumberOfDays(newDays);
                }}
              >
                <Text style={styles.badgeText}>
                  เป็นเวลา {afterNumberOfDays} วัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {showPicker && (
            <DateTimePicker
              mode="time"
              value={selectedTime}
              onChange={onTimeChange}
            />
          )}
          {afterMealSchedules.map((item, index) => (
            <View key={index} style={styles.scheduleRow}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedIndex(index);
                  setEditingType("after");
                  setShowPicker(true);
                }}
              >
                <Text style={styles.timeText}>
                  {formatTime(item.hour, item.minute)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const newPills = item.pills === 100 ? 1 : item.pills + 1;
                  const updated = [...afterMealSchedules];
                  updated[index].pills = newPills;
                  setAfterMealSchedules(updated);

                  // ส่งข้อมูล pills ใหม่เข้า context
                  setAlertData((prev) => ({
                    ...prev,
                    pillCount: newPills,
                  }));
                }}
              >
                <Text style={styles.pillText}>{item.pills} เม็ด</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>บันทึกการแจ้งเตือน</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E2A3A",
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 115,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  reminderBox: {
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  blueBadge: {
    backgroundColor: "#94a3b8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  timeText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 20,
  },
  pillText: {
    fontSize: 18,
    marginRight: 50,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#1E2A3A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReminderScreen;
