import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";

import HomeScreen from "./pages/Home";
import NextScreen from "./pages/NextScreen";
import PharmacistHomeScreen from "./pages/Pharamacist";

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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NextScreen" component={NextScreen} />
        <Stack.Screen
          name="PharmacistHomeScreen"
          component={PharmacistHomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
