import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import { useCameraDevice, Camera, useCameraPermission } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useFocusEffect } from "@react-navigation/native";

import Permission from "./Permission";
import Footer from '../Footer';

export default function CameraS1({ navigation }) {
    const { requestPermission, hasPermission } = useCameraPermission();
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const device = useCameraDevice("back");
    const cameraRef = useRef(null);

    useEffect(() => {
        const checkPermission = async () => {
            const status = await requestPermission();
            if (status === 'authorized') {
                setIsLoading(false);
            }
        };
        checkPermission();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setIsActive(true);
            return () => setIsActive(false);
        }, [])
    );

    const takePhoto = async () => {
        try {
            const photo = await cameraRef.current.takePhoto({
                flash: 'off',
                photoQualityBalance: 'speed',
                photoQualityPrioritization: 'speed'
            });
            setPhoto(photo);
            setShowCamera(false);
        } catch (error) {
            console.error("Failed to take photo:", error);
        }
    };

    const savePhoto = async () => {
        try {
            if (photo) {
                await CameraRoll.saveAsset(`file://${photo.path}`, {
                    type: 'photo',
                });
                console.log("Photo saved successfully");
                setShowCamera(true);
            }
        } catch (error) {
            console.error("Error while saving the photo", error);
        }
    };

    const discardPhoto = () => {
        setPhoto(null);
        setShowCamera(true);
    };

    if (!hasPermission) return <Permission />;
    if (!isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ fontSize: 16, color: "black" }}>Waiting for the permission</Text>
                
            <View style={styles.footerContainer}>
                <Footer navigation={navigation} />
            </View>
            </View>
            
        );
    }

    return (
        <View style={styles.container}>
            {showCamera ? (
                <>
                    <Camera
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isActive}
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
                        {photo && <Image source={{ uri: `file://${photo.path}` }} style={styles.image} />}
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={discardPhoto}>
                                <Text>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={savePhoto}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 50,
        width: '100%',
    },
    modalButton: {
        width: 150,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#9F96FF',
        borderRadius: 15,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});
