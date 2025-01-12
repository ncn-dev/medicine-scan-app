import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";

import HomeScreen from "./pages/Home";
import NextScreen from "./pages/NextScreen";
import PharmacistHomeScreen from "./pages/Pharamacist";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import InformationSceen from "./pages/InformationScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="NextScreen" 
          component={NextScreen} 
          options={{gestureEnabled: false}}
          />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{gestureEnabled: false}}
           
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{gestureEnabled: false}} 
          />
        <Stack.Screen
          name="InformationScreen"
          component={InformationSceen}
          
        />
        <Stack.Screen
          name="PharmacistHomeScreen"
          component={PharmacistHomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
