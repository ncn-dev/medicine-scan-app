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

  const [schedules, setSchedules] = useState([
    { hour: 8, minute: 0, pills: 1 },
    { hour: 12, minute: 0, pills: 1 },
    { hour: 16, minute: 0, pills: 1 },
    { hour: 20, minute: 0, pills: 1 },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [timesPerDay, setTimesPerDay] = useState(4);
  const [numberOfDays, setNumberOfDays] = useState(7);

  const onTimeChange = (event, selectedDate) => {
    if (selectedDate && selectedIndex !== null) {
      console.log("Selected time:", selectedDate);
      const updated = [...schedules];
      updated[selectedIndex].hour = selectedDate.getHours();
      updated[selectedIndex].minute = selectedDate.getMinutes();
      setSchedules(updated);
    }
    setShowPicker(false);
    setSelectedIndex(null);
  };

  const handleSave = async () => {
    // เก็บค่าตารางกินยาไว้ใน context
    await AsyncStorage.setItem("medSchedules", JSON.stringify(schedules));
    setAlertData({
      schedules: schedules,
    });

    // แสดง alert แจ้งเตือน
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

  const now = new Date(); // เอาปี เดือน วัน ปัจจุบัน
  const selectedTime =
    selectedIndex !== null
      ? new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          schedules[selectedIndex].hour,
          schedules[selectedIndex].minute
        )
      : now;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowHour = now.getHours();
      const nowMinute = now.getMinutes();

      schedules.forEach((schedule) => {
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
            onPress={() => navigation.navigate("MedBag")}
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

        <View style={styles.reminderBox}>
          <Text style={styles.subTitle}>ตั้งเวลาเตือน</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={styles.blueBadge}>
              <TouchableOpacity
                onPress={() => {
                  const newCount =
                    schedules.length >= 5 ? 1 : schedules.length + 1;
                  const defaultTime = { hour: 8, minute: 0, pills: 1 };
                  const newSchedules = Array.from(
                    { length: newCount },
                    (_, i) => {
                      return schedules[i] || defaultTime;
                    }
                  );
                  setSchedules(newSchedules);
                }}
                onLongPress={() => {
                  if (schedules.length > 1) {
                    setSchedules(schedules.slice(0, schedules.length - 1));
                  }
                }}
              >
                <Text style={styles.badgeText}>
                  วันละ {schedules.length} ครั้ง
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.blueBadge}>
              <TouchableOpacity
                onPress={() => {
                  const newDays = numberOfDays >= 14 ? 1 : numberOfDays + 1;
                  setNumberOfDays(newDays);
                }}
              >
                <Text style={styles.badgeText}>
                  เป็นเวลา {numberOfDays} วัน
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
          {schedules.map((item, index) => (
            <View key={index} style={styles.scheduleRow}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedIndex(index);
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
                  const updated = [...schedules];
                  updated[index].pills = newPills;
                  setSchedules(updated);
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
