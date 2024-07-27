import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
//Screens
import Camera from "./Screens/Camera/Camera";
import Gallery from "./Screens/Gallery/Gallery";
import Sensors from "./Screens/Secsors/Sensors";
import SlideShow from "./Screens/Slideshow";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="Sensors" component={Sensors} />
        <Stack.Screen name="SlideShow" component={SlideShow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}