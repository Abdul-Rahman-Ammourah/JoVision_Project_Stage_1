import React, { useEffect,useState } from "react";
import { View,Text,StyleSheet, FlatList, Image, ScrollView, RefreshControl } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Footer from "./Footer";

export default function Gallery({navigation}) {
    const [Photos, setPhotos] = useState([]);
    const [refresing, setRefresing] = useState(false);
    const getPhotos = async () => {
        try {
            const result = await CameraRoll.getPhotos({
                first: 15,
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

    const renderItem = ({ item }) => {
        return (
            <View style={styles.container}>
                <Image source={{ uri: item }} style={styles.Image}/>
            </View>
        )
    }
    const OnRefresh = async () => {
        setRefresing(true);
        
        await getPhotos();

        setRefresing(false);
    }
    
    return (
        <View style={styles.container}>
        <ScrollView
            refreshControl={<RefreshControl refreshing={refresing} onRefresh={OnRefresh} />}
            >
            <FlatList
                    data={Photos}
                    renderItem={renderItem}
                    keyExtractor={(index) => index.toString()}
                    contentContainerStyle={styles.contentList}
                    style={styles.list}
                    scrollEnabled={false}
                    
                />
        </ScrollView>
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
        resizeMode: 'contain',
    }
})