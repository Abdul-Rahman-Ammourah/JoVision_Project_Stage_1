import React, { useRef, useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import { useCameraDevice, Camera, useCameraPermission } from "react-native-vision-camera";
import Permission from "./Permission";

export default function CameraS1() {
    const { requestPermission, hasPermission } = useCameraPermission();
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(true);
    const device = useCameraDevice("back");
    const cameraRef = useRef(null);

    useEffect(() => {
        const renderCamera = async () => {
            if (hasPermission) {
                setIsLoading(false);
                Permission();
            }
        };
        renderCamera();
    },[])

    const takePhoto = async () => {
        try {
            const photo = await cameraRef.current.takePhoto({
                flash: 'off',
                qualityPrioritization: 'speed',
            });
            setPhoto(photo);
            setShowCamera(false);
        } catch (error) {
            console.error("Failed to take photo:", error);
        }
    };
    const savePhoto = async () => {
        
    };
    
    const discardPhoto = () => {
       
    };
    
    if (!hasPermission) return <Permission />;
    if (isLoading){
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color={"#0000ff"}  />
                <Text style={{fontSize:16, color:"black"}}>Waiting for the permission</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {showCamera ? (
                <>
                    <Camera
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        photo={true}
                    />

                    <TouchableOpacity style={styles.button} onPress={takePhoto} />
                </>
            ) : (
                <Modal
                    visible={!showCamera}
                    transparent
                    onRequestClose={() => setShowCamera(true)}
                >
                    <View style={styles.modal}>

                        <Image source={{ uri: `file://${photo.path}` }} style={styles.image} />

                        <View style={styles.modalButtonContainer}>

                            <TouchableOpacity style={styles.modalButton} onPress={() => setShowCamera(true)}>
                                <Text>Discard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={null}>
                                <Text>Save</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 75,
        width: 75,
        height: 75,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#9F96FF',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'relative',
        bottom: 150,
        width: '100%',
    },
    modalButton: {
        width: 150,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#9F96FF',
    },
});
