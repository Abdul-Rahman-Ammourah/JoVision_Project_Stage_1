import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import { useCameraDevice, Camera, useCameraPermission } from "react-native-vision-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useFocusEffect } from "@react-navigation/native";
import { Button} from "react-native-paper";
import Video from "react-native-video";
import RNFS from 'react-native-fs';
import Permission from "./Permission";
import Footer from '../Footer';

export default function CameraS1({ navigation }) {
    const { requestPermission, hasPermission } = useCameraPermission();
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [cameraSwitch, setCameraSwitch] = useState(true);
    const [cameraMode, setCameraMode] = useState(true);
    const device = useCameraDevice(cameraSwitch ? "back" : "front");
    const [recording , setRecording] = useState(false);
    const cameraRef = useRef(null);
    const videoRef = useRef(null);
    const currentDate = new Date().toISOString();

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
                photoQualityPrioritization: 'speed',
            });

            const newPath = `${RNFS.DocumentDirectoryPath}/AbdulRahman_${currentDate}.jpg`;
            await RNFS.moveFile(photo.path, newPath);
            console.log(RNFS.DocumentDirectoryPath)
            photo.path = newPath;
            console.log(photo.path);
            setPhoto(photo);
            setShowCamera(false);
        } catch (error) {
            console.error("Failed to take photo:", error);
        }
    };

    const savePhoto_Video = async () => {
        if (cameraMode) {
            try {
                if (photo) {
                    await CameraRoll.saveAsset(`file://${photo.path}`, {
                        type: 'photo',
                    });
                    console.log(RNFS.DocumentDirectoryPath)
                    console.log("Photo saved successfully");
                    setShowCamera(true);
                }
            } catch (error) {
                console.error("Error while saving the photo", error);
            }
        }
        else {
            try{
                if(video){
                    await CameraRoll.saveAsset(`file://${video.path}`, {
                        type: 'video',
                    });
                    console.log("Video saved successfully");
                    setShowCamera(true);
                }
            }catch(error){
                console.error("Error while saving the video", error);
            }
        }
    };
    const discardPhoto_Video = async () => {
        cameraMode ? setPhoto(null) : setVideo(null);
        setShowCamera(true);
    };
    const StartVideo = async () => {
        const newPath = `${RNFS.DocumentDirectoryPath}/AbdulRahman_${currentDate}.mp4`;
        try {
        await cameraRef.current.startRecording({
            onRecordingFinished: async (video) => {
                await RNFS.moveFile(video.path, newPath);
                video.path = newPath;
                setVideo(video);
                console.log(video);
                
            },
            onRecordingError: (error) => console.error("Failed to record Video:",error),
          })
          
        } catch (error) {
            console.error("Failed to record Video:", error);
        }
    }
    const handlePress = () => {
        if (cameraMode) {
            takePhoto();
        } else {
            if (recording) {
                cameraRef.current.stopRecording();
                setShowCamera(false);
                setRecording(false);
            } else {
                StartVideo();
                setRecording(true);
            }
            
        }
    };

    if (!hasPermission) return <Permission />;
    if (isLoading) {
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
                        photo={cameraMode}
                        video={!cameraMode}
                    />
                    <Button
                        mode="contained"
                        onPress={() => setCameraSwitch(!cameraSwitch)}
                        style={styles.iconButton}
                        >Switch</Button>
                    <Button
                        mode="contained"
                        onPress={() => setCameraMode(!cameraMode)}
                        style={styles.iconButton2}
                        >Mode</Button>
                    <TouchableOpacity style={styles.button} onPress={handlePress} >
                        <Text>
                            {cameraMode ? "Take Photo" : recording ? "Stop" : "Record"}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                cameraMode ? (
                    <Modal
                    visible={!showCamera}
                    transparent
                    onRequestClose={() => setShowCamera(true)}
                >
                    <View style={styles.modal}>
                        {photo && <Image source={{ uri: `file://${photo.path}` }} style={styles.image} />}
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={discardPhoto_Video}>
                                <Text>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={savePhoto_Video}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                ) : (
                    <Modal
                    visible={!showCamera}
                    transparent
                    onRequestClose={() => setShowCamera(true)}
                >
                        <View style={styles.modal}>
                            {console.log(video)}
                            {video && <Video
                                ref={videoRef}
                                source={{ uri: `file://${video.path}` }}
                                style={styles.video}
                                onError={(error) => console.log("Error", error)}
                                onEnd={() => videoRef.current.seek(0)} // Better than Repeat
                                />
                            }
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={styles.modalButton} onPress={discardPhoto_Video}>
                                    <Text>Discard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={savePhoto_Video}>
                                    <Text>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )
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
    iconButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    iconButton2:{
        position: 'absolute',
        top: 70,
        right: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    video: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Cover the entire area
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
