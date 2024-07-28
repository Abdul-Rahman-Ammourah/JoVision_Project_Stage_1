import React,{ useEffect,useRef,useState } from "react";
import { View,Text,StyleSheet, Image, TouchableOpacity,Modal, TouchableWithoutFeedback} from "react-native";
import Video from "react-native-video";

//Images
import Play from "../assets/Play.png";
import Pause from "../assets/Pause.png";
import Forward from "../assets/Forward.png";
import Rewind from "../assets/Rewind.png";

export default function SlideShow({navigation,route}) {
    const [VideoOptions,setVideoOptions] = useState(false);
    const [pause,setPause] = useState(false);
    const [currentTime,setCurrentTime] = useState(0);
    const [fileType,setFileType] = useState(null);
    const videoRef = useRef(null);
    const [currentIndex,setCurrentIndex] = useState(route.params.initialIndex);
    const {file} = route.params;
    
    useEffect(() => {
        file.type[currentIndex] == "video/mp4" ? setFileType(false) : setFileType(true);
    }, []);
    const handleRewind = () => {
        if (videoRef.current) {
          const newPosition = Math.max(currentTime - 5, 0); 
          videoRef.current.seek(newPosition);
        }
    };

    const handleForward = () => {
        if (videoRef.current) {
          const newPosition = currentTime + 5; 
          videoRef.current.seek(newPosition);
        }
    };
    const handlePrev = () => {
        if (currentIndex > 0) {
            // Update currentIndex first
            setCurrentIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                // Determine fileType based on newIndex
                const newFileType = file.type[newIndex] === "video/mp4" ? false : true;
                setFileType(newFileType);
                console.log(file.type[newIndex], newFileType);
                return newIndex;
            });
        }
    };
    
    const handleNext = () => {
        if (currentIndex < file.uri.length - 1) {
            // Update currentIndex first
            setCurrentIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                // Determine fileType based on newIndex
                const newFileType = file.type[newIndex] === "video/mp4" ? false : true;
                setFileType(newFileType);
                console.log(file.type[newIndex], newFileType);
                return newIndex;
            });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {setVideoOptions(!VideoOptions)}}>
                {fileType ? (<>
                    <Image 
                        source={{ uri: file.uri[currentIndex]}} 
                        style={styles.image}   
                        />
                        <Modal visible={VideoOptions}
                            transparent={true}
                            animationType="fade"
                            >
                        <TouchableOpacity style={styles.layout} onPress={() => setVideoOptions(!VideoOptions)}>
                            <TouchableWithoutFeedback>
                                <View style={styles.VideoModal}>
                                    <TouchableOpacity onPress={handlePrev}>
                                        <Text style={styles.text}>
                                            Prev
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleNext}>
                                        <Text style={styles.text}>
                                            Next
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>
                    </>
                ):(<>
                    <Video 
                        ref={videoRef}
                        source={{ uri: file.uri[currentIndex] }}
                        style={styles.video}
                        onError={(error) => console.log("Error", error)}
                        paused={pause}
                        onProgress={(data) => setCurrentTime(data.currentTime)}
                        onEnd={() => videoRef.current.seek(0)} // Better than Repeat
                        />
                    <Modal visible={VideoOptions}
                            transparent={true}
                            animationType="fade"
                            >
                        <TouchableOpacity style={styles.layout} onPress={() => setVideoOptions(!VideoOptions)}>
                            <TouchableWithoutFeedback>
                                <View style={styles.VideoModal}>
                                    <TouchableOpacity onPress={handlePrev}>
                                        <Text style={styles.text}>
                                            Prev
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleRewind}>
                                        <Image source={Rewind} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setPause(!pause)}>
                                        <Image source={pause ? Play : Pause} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleForward}>
                                        <Image source={Forward} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleNext}>
                                        <Text style={styles.text}>
                                            Next
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>
                    </>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    image: {
        width: "100%",
        height: "100%"
    },
    layout:{
        flex: 1,
        alignItems: 'center',
    },
    Modal: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    ModalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    video: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
    },
    VideoModal: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
})