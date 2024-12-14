import React from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';

const logo = require("./assets/image/1.png")
const logo2 = require("./assets/image/3.png")

//หน้าหลัก
const HomeScreen = ({ navigation}) =>{
  return(
<View style={{flex: 1, backgroundColor: "#FFFF"}}>
    <View style={{}}>
      <Text style={{marginTop:100,textAlign:'right',fontSize:40,marginRight:70}}>DoseAlert</Text>
      <Image source={logo} style={{width:150,height:130,marginLeft:35,marginTop:-89}}/>

      <View style={{justifyContent:'center',alignItems: 'center',marginTop:-40}}>
        <Image source={logo2} style={{width:500,height:500}}/>
      </View>

      {/*ปุ่มไปหน้าภัดไป*/}
      <View style={{marginTop:-20,paddingHorizontal:60}}>
        <TouchableOpacity
        onPress={() => navigation.navigate('NextScreen')}
        style={{ backgroundColor: '#18253B', paddingVertical:20,paddingHorizontal:40, borderRadius: 40, alignItems: 'center'}}
        >
          <Text style={{color: '#FFFFFF', fontSize: 20 ,fontWeight: 'bold',}}>GET STARTED</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop:20,textAlign:'left',marginLeft:80,}}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>If you are a pharmacist, </Text>
          <TouchableOpacity
              onPress={()=> navigation.navigate('PharmacistHomeScreen')}
          >
            <Text 
              style={{
                color: '#428CA3', 
                fontSize: 16 ,
                fontWeight: 'bold', 
                alignSelf: 'flex-end',
                textDecorationLine: 'underline',
                }}
              >Click me

            </Text>
            </TouchableOpacity>
          </View>
          </View> 
        </View>

    </View>
    );
};

//หน้าถัดไป
const NextScreen = () =>{
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#F5F5F5'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>Welcom to NextScreen</Text>
    </View>
  );
};

//หน้าเภสัช
const PharmacistHomeScreen = () =>{
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#F5F5F5'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>Welcom to PharmacistHomeScreen </Text>
    </View>
  );
};

const Stack =  createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // ระบุหน้าแรก
        screenOptions={{
          headerShown:false, //ซ่อน hrader Bar 
        }}
      >
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name='NextScreen' component={NextScreen}/>
        <Stack.Screen name='PharmacistHomeScreen' component={PharmacistHomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
     
  );
}





