import React from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import { Photo } from "../types/PhotoInterface";
import { useSelector } from "react-redux";
import { RootState } from "../redux";

const PhotoScreen = () => {
  const { uuid } = useLocalSearchParams();
  const photo = useSelector((state) =>
    (state as RootState).photos.photos.find((photo) => photo.uuid === uuid),
  ) as Photo;

  if (!photo) {
    return (
      <View style={styles.container}>
        <Text style={styles.notfound}>Photo not found</Text>
      </View>
    );
  }

  const uri = photo.uri;
  const location = photo.location;

  const sharePhoto = async () => {
    try {
      await Share.share({
        message: "Compartiendo foto",
        url: uri,
      });
    } catch {
      alert("An error occurred while trying to share the photo");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      <Text style={styles.text}>
        Location: {location.latitude}, {location.longitude}
      </Text>
      <TouchableOpacity style={styles.button} onPress={sharePhoto}>
        <Text style={styles.shareButtonText}>Compartir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  image: {
    width: 500,
    height: 500,
    margin: 5,
  },
  text: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
    margin: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  shareButtonText: {
    color: "white",
  },
  notfound: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default PhotoScreen;
