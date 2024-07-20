import { useCameraDevice, useCameraPermission } from "react-native-vision-camera";


export default function Permission () {
    const { requestPermission, hasPermission } = useCameraPermission();
    const device = useCameraDevice("back");

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);
    
    
    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }
    
    if (device == null) {
        return (
            <View style={styles.container}>
                <Text>Camera not found</Text>
            </View>
        );
    }
}