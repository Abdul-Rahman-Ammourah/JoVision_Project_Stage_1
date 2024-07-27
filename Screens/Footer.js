import React from "react";
import { View, Text, TouchableOpacity,StyleSheet } from "react-native";

export default function Footer({navigation}) {
    return (
        <View style={styles.Footer}>
            <TouchableOpacity style={styles.FooterButton} onPress={() => navigation.navigate("Camera")}>
                <Text style={styles.FooterText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.FooterButton} onPress={() => navigation.navigate("Sensors")}>
                <Text style={styles.FooterText}>Sensors</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.FooterButton} onPress={() => navigation.navigate("Gallery")}>
                <Text style={styles.FooterText}>Gallery</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    Footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#000",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#A1A1A1",
    },
    FooterText: {
    color: "#fff",
    fontSize: 16,
    },
    FooterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})