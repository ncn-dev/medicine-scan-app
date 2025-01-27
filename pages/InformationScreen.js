import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function InformationSceen({ route, navigation }) {
  const { uploadedData } = route.params || {};
  const [data, setData] = useState(uploadedData);

  useEffect(() => {
    console.log(uploadedData);
  }, []);

  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Homepage")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              //backgroundColor: "#D9D9D9",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
              marginRight: 300,
            }}
          >
            <Icon name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            marginTop: 20,
          }}
        >
          <View>
            {Object.entries(data).map(([key, value]) => (
              <View key={key} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{key}:</Text>
                <Text style={{ fontSize: 16 }}>{value}</Text>
              </View>
            ))}
          </View>
          {/* <Text style={{ fontSize: 24 }}>{data.Dosage}</Text> */}
        </View>
      </ScrollView>
    </View>
  );
}
