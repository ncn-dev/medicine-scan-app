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
import Checkbox from 'expo-checkbox';
import axios from "axios";


const logo = require("../assets/image/1.png");

export default function RegisterScreen({ navigation }) {
  const [cardid, setCardid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [isChecked, setChecked] = useState(false);

  const fetchingData = async() =>{
    if(!cardid || !password || !name || !date ){
      alert("Please input information");
      return;
    }
    const formData = new FormData();
    formData.append("identitynumber", cardid)
    formData.append("password", password)
    formData.append("fullname", name)
    formData.append("dateofbirth", date)
    console.log(formData);
    try{
      const response = await axios.post(
        "http://192.168.10.104:3000/api/register",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data",
          }
        }
      )
      console.log(response.data.status);
      if(response.data.status){
        navigation.navigate("NextScreen")
      }else{
        alert("Register Failed / Please input agin!!!")
      }
      
    }catch(error){
      console.error(error);
      alert("Register Failed");
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
              value={cardid}
              onChangeText={(text) => setCardid(text)}
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
              onChangeText={(text) => setPassword(text)}
            />
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
              placeholder="Ex.14/10/2003"
              value={date}
              onChangeText={(text) => setDate(text)}
            />
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
              style={{margin : 10}}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#18253B' : undefined}
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
