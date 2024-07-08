import React from "react";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { View, Text, Image, StyleSheet, Platform, Linking } from "react-native";
import Button from "@/components/Button";
import { Photo } from "@/types/PhotoInterface";
import { RootState } from "@/redux";

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
  const maps: string = Platform.select({
    ios: `maps:0,0?q=${location.latitude},${location.longitude}`,
    android: `geo:0,0?q=${location.latitude},${location.longitude}`,
    default: "",
  });

  const sharePhoto = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Compartir no está disponible en esta plataforma");
      return;
    }
    try {
      await Sharing.shareAsync(uri);
    } catch {
      alert("No se pudo compartir la foto");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      <View style={styles.location}>
        <Text style={styles.text}>Latitud: {location.latitude}</Text>
        <Text style={styles.text}>Longitud: {location.longitude}</Text>
        <Button
          text="Ver en el mapa"
          textStyle={styles.mapsText}
          buttonStyle={styles.mapsButton}
          handlePress={() =>
            Linking.openURL(maps).catch((err) =>
              console.error("An error occurred", err),
            )
          }
        />
      </View>
      <Button text="Compartir Foto" handlePress={sharePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: "90%",
    minHeight: "50%",
    borderRadius: 10,
    padding: 50,
    margin: "auto",
  },
  location: {
    alignItems: "center",
    padding: 16,
    marginBottom: 48,
  },
  text: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  mapsButton: {
    backgroundColor: "#222222",
    padding: 10,
    margin: 16,
  },
  mapsText: {
    color: "white",
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
