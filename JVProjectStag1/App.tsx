import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Screens
import Camera from './Screens/S1Camera';
import Secsers from "./Screens/S2Sensers";
import Galllery from "./Screens/S3Gallery";
import SlideShow from "./Screens/S4Slideshow";

//Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera"  screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="Secsers" component={Secsers} />
        <Stack.Screen name="Galllery" component={Galllery} />
        <Stack.Screen name="SlideShow" component={SlideShow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}