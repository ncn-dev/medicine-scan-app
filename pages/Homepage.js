import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Homepage({ route }) {
  const { userName } = route.params;
  const [seach, setseach] = useState("");
  return (
    <View style={{ paddingHorizontal: 30, marginTop: 10 }}>
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
          }}
        >
          Hi, {userName}!
        </Text>
      </View>
      <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <TextInput
          style={{
            height: 50,
            borderColor: "#D9D9D9",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginVertical: 10,
            backgroundColor: "#D9D9D9",
            paddingLeft:50
          }}
          placeholder="Asking any question"
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 20,
            top: "41%",
            transform: [{ translateY: -10 }],
          }}
          onPress={() => setseach()}
        >
          <Icon name="search" size={30} color="#666"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}
