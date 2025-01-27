import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { View, Text } from "react-native";

export default function App() {
  useEffect(() => {
    // ขอสิทธิ์แจ้งเตือน
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("ต้องอนุญาตให้แอปสามารถส่งแจ้งเตือน");
      } else {
        console.log("Permission granted");
      }
    };

    requestPermissions();

    // ตั้งแจ้งเตือนทุก 10 วินาที
    const scheduleNotification = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "แจ้งเตือนใหม่!",
          body: "นี่คือการแจ้งเตือนแบบเด้งใน iOS!",
          sound: true,
        },
        trigger: {
          seconds: 10,
          repeats: true,
        },
      });

      console.log("Notification scheduled!");
    };

    scheduleNotification();

    // Listener ดักจับการแจ้งเตือน
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Received:", notification);
      }
    );

    // Listener ดักจับเมื่อผู้ใช้ตอบสนองต่อการแจ้งเตือน
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User interacted with notification:", response);
      });

    // ทำความสะอาด Listener เมื่อ component ถูก unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>แจ้งเตือนแบบเด้งจะทำงานใน 10 วินาที</Text>
    </View>
  );
}
