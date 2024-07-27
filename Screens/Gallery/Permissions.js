import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions, {
        title: 'Storage Permission',
        message: 'App needs access to your storage to modify files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      // Check if all requested permissions are granted
      return permissions.every(permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  }

  // For iOS, permissions are handled differently, and you may not need to request them explicitly
  return true;
};
