import React, { useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";

const logo = require("../assets/image/1.png");

export default function RegisterScreen({ navigation }) {
  const [idcard, setIdcard] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setshowDatePicker] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [isPasswordVisible,setIsPasswordVisible] = useState(false);

  const onDataChange = (event, selectedDate) => {
    setshowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }else{
      alert("please select a valid date");
    }
  };

  const fetchingData = async () => {
    if (!idcard || !password || !name || !date) {
      alert("Please input information");
      return;
    }
    
    const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : ""; // format date to YYYY-MM-DD
    
    if (!formattedDate){
      alert("Invalid date");
      return;
    }
    const data = {
      "idcard": idcard,
      "password": password,
      "fullname": name,
      "dateofbirth": formattedDate
    }
    // const formData = new FormData();
    // formData.append("idcard", idcard);
    // formData.append("password", password);
    // formData.append("fullname", name);
    // formData.append("dateofbirth", formattedDate);
    // console.log(formData);
    try {
      const response = await axios.post(
        `http://172.20.10.2:3000/api/auth/register`,
        data,
      );
      if (!response.ok) {
        navigation.navigate("Homepage", { username: idcard });
      } else {
        alert("Register Failed, Please Trying Again.");
      }
    } catch (err) {
      console.error(err);
      alert("Register Failed, Please Trying Again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Text
            style={{
              marginTop: 100,
              textAlign: "right",
              fontSize: 40,
              marginRight: 70,
            }}
          >
            DoseAlert
          </Text>
          <Image
            source={logo}
            style={{
              width: 150,
              height: 130,
              marginLeft: 35,
              marginTop: -89,
            }}
          />
          <View>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              You are now registed in as a User.
            </Text>
          </View>
          {/*Add Textbox Fields*/}
          <View style={{ paddingHorizontal: 50, marginTop: 40 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 5,
              }}
            >
              Enter Identity Card Number
            </Text>
            <TextInput
              style={{
                height: 50,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "#D9D9D9",
              }}
              placeholder="Ex.12-3-4567-89123-4"
              value={idcard}
              onChangeText={(text) => setIdcard(text)}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 5,
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                height: 50,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "#D9D9D9",
              }}
              placeholder="Ex.******"
              value={password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={{
                position:"absolute",
                right:70,
                top:"39%",
                transform: [{ translateY: -10 }],
              }}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
            <Icon
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={25}
              color="#666"
            />

            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 5,
              }}
            >
              Firstname-Lastname
            </Text>
            <TextInput
              style={{
                height: 50,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "#D9D9D9",
              }}
              placeholder="Ex.Nonpawit Silabumrungrad"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 5,
              }}
            >
              Date of Birth
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "#D9D9D9",
                justifyContent: "center", // เพิ่มบรรทัดนี้เพื่อจัดตำแหน่งให้ข้อความอยู่ล่างสุด
                alignItems: "flex-start",
              }}
              onPress={() => setshowDatePicker(true)}
            >
              <Text style={{}}>{date.toLocaleDateString('en-GB')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDataChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 20,
              marginLeft: 45,
            }}
          >
            <Checkbox
              style={{ margin: 10 }}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#18253B" : undefined}
            />
            <Text style={{ fontWeight: "bold" }}>Remember me</Text>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#18253B",
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 40,

                marginTop: 5,
                width: 290,
              }}
              onPress={fetchingData}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20, textAlign: "left", marginLeft: 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginLeft: 40 }}
              >
                Already have account,
              </Text>
              
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
``