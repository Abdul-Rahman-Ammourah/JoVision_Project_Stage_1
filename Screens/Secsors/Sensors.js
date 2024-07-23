import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNLocation from 'react-native-location';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import Footer from '../Footer';

// Configure RNLocation
RNLocation.configure({
  distanceFilter: 0,
  desiredAccuracy: {
    ios: 'best',
    android: 'balancedPowerAccuracy',
  },
  androidProvider: 'auto',
  interval: 5000,
  fastestInterval: 10000,
  maxWaitTime: 5000,
  activityType: 'other',
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1,
  headingOrientation: 'portrait',
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false,
});

export default function Sensors({ navigation }) {
  const [location, setLocation] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState(null);

  // Request location permission and get the location
  const getLocation = async () => {
    const permission = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    });
    if (permission) {
      const latestLocation = await RNLocation.getLatestLocation({ timeout: 100 });
      setLocation(latestLocation);
    }
  };

  // Set up accelerometer subscription
  useEffect(() => {
    // Set update interval for accelerometer
    setUpdateIntervalForType(SensorTypes.accelerometer, 500); // 500ms

    const accelerometerSubscription = accelerometer.subscribe(({ x, y, z }) => {
      setAccelerometerData({ x, y, z });
    });

    const getLocationDetails = setInterval(getLocation, 10000);

    return () => {
      clearInterval(getLocationDetails);
      accelerometerSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Location Details</Text>
      {location && (
        <View style={styles.locationContainer}>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>Altitude: {location.altitude}</Text>
          <Text>Speed: {location.speed}</Text>
        </View>
      )}

      <Text>Accelerometer Data</Text>
      {accelerometerData && (
        <View style={styles.locationContainer}>
          <Text>X: {accelerometerData.x}</Text>
          <Text>Y: {accelerometerData.y}</Text>
          <Text>Z: {accelerometerData.z}</Text>
        </View>
      )}
      <View style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    marginTop: 20,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
