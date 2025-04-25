import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./pages/Home";
import NextScreen from "./pages/NextScreen";
import PharmacistHomeScreen from "./pages/Pharamacist";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import InformationSceen from "./pages/InformationScreen";
import Homepage from "./pages/Homepage";
import MedBag from "./pages/Medbag";
import SettingPage from "./pages/Settingpage";

import Detail from "./pages/Detail";
import Chatbot from "./pages/Chatbot";
import ReminderScreen from "./pages/ReminderScreen";
import { ReminderProvider } from "./pages/ReminderContext";

const Stack = createStackNavigator();

export default function App() {
  return (
      <ReminderProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Homepage"
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
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Homepage"
              component={Homepage}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="InformationScreen"
              component={InformationSceen}
            />
            <Stack.Screen 
              name="SettingPage" 
              component={SettingPage} 
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="MedBag"
              component={MedBag}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="PharmacistHomeScreen"
              component={PharmacistHomeScreen}
            />
            <Stack.Screen 
              name="Detail" 
              component={Detail} 
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Chatbot"
              component={Chatbot}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="ReminderScreen"
              component={ReminderScreen}
              options={{ gestureEnabled: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ReminderProvider>
    
  );
}
