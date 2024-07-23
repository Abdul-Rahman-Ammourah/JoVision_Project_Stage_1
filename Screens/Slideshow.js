import React,{ useEffect,useRef,useState } from "react";
import { View,Text,StyleSheet, FlatList,Image } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import Footer from "./Footer";
export default function SlideShow({navigation}) {
    const [Photos, setPhotos] = useState([]);
    const [refresing, setRefresing] = useState(false);
    const [isPaused,setIsPaused] = useState(false);
    const Scrollref = useRef(null);
    const Srollindex = useRef(0);
    const getPhotos = async () => {
        try {
            const result = await CameraRoll.getPhotos({
                first: 10,
                assetType: "Photos",
            });
            const photoURIs = result.edges.map(edge => edge.node.image.uri);
            setPhotos(photoURIs);
        } catch (error) {
            console.error("Failed to load photos:", error);
        }
    };
    useEffect(() => {
        getPhotos();
    }, []);
    useEffect(() => {
        if (!isPaused && Photos.length > 0) {
            const interval = setInterval(() => {
                Srollindex.current = (Srollindex.current + 1) % Photos.length;
                Scrollref.current.scrollToIndex({ animated: true, index: Srollindex.current });
            }, 1000);

            return () => clearInterval(interval);
        }
    },[Photos,isPaused])
    
    const renderItem = ({ item }) => {
        return (
            <View style={styles.container}>
                <Image source={{ uri: item }} style={styles.Image}/>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            
            <FlatList
                    ref={Scrollref}
                    data={Photos}
                    renderItem={renderItem}
                    keyExtractor={(index) => index.toString()}
                    contentContainerStyle={styles.contentList}
                    style={styles.list}
                    horizontal       
                    scrollEnabled={false}             
                />
            <View style={styles.footerContainer}>
                <Footer navigation={navigation}/>
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
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    Image: {
        width: 300,
        height: 300,
        resizeMode: 'cover',
        
    }
})