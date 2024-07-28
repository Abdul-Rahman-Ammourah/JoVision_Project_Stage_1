import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Button, TextInput } from "react-native-paper";
import mime from 'mime';
import RNFS from 'react-native-fs';
import Footer from "../Footer";
import { requestStoragePermission } from "./Permissions";
export default function Gallery({ navigation }) {
  const [photos, setPhotos] = useState({
    uri:[],
    type:[],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [text, setText] = useState('');
  const getPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 30,
        assetType: 'All',
      });
      const photoURIs = result.edges.map((edge) => edge.node.image.uri);
      const photoTypes = result.edges.map((edge) => edge.node.type);
      setPhotos({uri:photoURIs,type:photoTypes});
    } catch (error) {
      console.error("Failed to load photos:", error);
    }
  };
  const checkPermissions = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.error('Storage permission denied');
    }
    return hasPermission;
  };
  
  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => {
          setSelectedPhoto(item);
          setShowOptions(true);
          setHighlightedIndex(photos.uri.indexOf(item));
        }}>
          <Image 
            source={{ uri: item }}
            style={[styles.image, highlightedIndex == photos.uri.indexOf(item) && styles.highlightedImage]}
          />
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    const initialize = async () => {
      const permissionGranted = await checkPermissions();
      if (permissionGranted) {
        await getPhotos();
      }
    };
    initialize();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await getPhotos();
    setRefreshing(false);
  };

  const Rename = async () => {
    const file = await convertContentUriToFile(selectedPhoto);
    console.log(RNFS.DocumentDirectoryPath)
    try {
      if (file) {
        const filefilter = file.originalFilepath.lastIndexOf('/');
        const filedir = file.originalFilepath.substring(0, filefilter);
        const newfile = `${filedir}/${text}.jpg`;
        await RNFS.moveFile(file.originalFilepath, newfile);
        setPhotos(photos.uri.map(photo => photo === selectedPhoto ? newfile : photo));
      } else {
        console.error("Failed to rename photo: File path is invalid");
      }
    } catch (error) {
      console.error("Failed to rename photo:", error);
    }
  };
  const convertContentUriToFile = async (contentUri) => {
    try {
      const fileInfo = await RNFS.stat(contentUri);
      return fileInfo;
    } catch (error) {
      console.error("Failed to convert content URI to file path:", error);
      return null;
    }
  };
  const Delete = async () => {
    try {
      const file = await convertContentUriToFile(selectedPhoto);
      if (file) {
        await RNFS.unlink(file.originalFilepath);
        console.log("Deleted photo:", file.originalFilepath);
        setPhotos(prevPhotos => ({
          uri: prevPhotos.uri.filter(photo => photo !== selectedPhoto),
          type: prevPhotos.type.filter((_, index) => prevPhotos.uri[index] !== selectedPhoto)
        }));
        setShowOptions(false);
        setHighlightedIndex(null);
      } else {
        console.error("Failed to delete photo: File path is invalid");
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  const ViewInFullScreen = async () => {
    const file  = await convertContentUriToFile(selectedPhoto);
    const type = mime.getType(file.originalFilepath);
    
    navigation.navigate("SlideShow", {file:photos,initialIndex:highlightedIndex });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos.uri}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.contentList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Modal
        visible={showOptions && !showTextInput}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowOptions(false);
          setHighlightedIndex(null);
        }}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => {setShowOptions(false); setHighlightedIndex(null)}}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.modalButtonContainer}>
                <Button mode="contained" onPress={() => setShowTextInput(true)} style={styles.modalButton}>Rename</Button>
                <Button mode="contained" onPress={Delete} style={styles.modalButton}>Delete</Button>
                <Button mode="contained" onPress={ViewInFullScreen} style={styles.modalButton}>View</Button>
              </View>
              
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <Modal 
          visible={showTextInput}
          transparent
          animationType="fade"
          onRequestClose={() => {
          setShowTextInput(false);
          setHighlightedIndex(false);
          setShowOptions(false);
        }}>
      <TouchableOpacity style={styles.modalOverlay} onPress={() => {setShowTextInput(false); setHighlightedIndex(null); setShowOptions(false);setText('')}}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.modalButtonContainer}>
                <TextInput
                  mode="flat"
                  label="Rename"
                  value={text}
                  onChangeText={text => setText(text)}
                  style={styles.modalTextInput}
                />
                <Button mode="contained" onPress={() => Rename()} style={styles.modal2Button}>Rename</Button>
              </View>
              
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <View style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentList: {
    paddingBottom: 50, 
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: '#000', 
  },
  imageContainer: {
    width: '50%',
    padding: 2,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  highlightedImage: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  modal: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    marginHorizontal: 5,
  },
  modal2Button: {
    alignSelf: 'center',
  },
  modalTextInput: {
    width: '55%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
