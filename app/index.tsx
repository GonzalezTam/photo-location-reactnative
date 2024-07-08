import React from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { Photo } from "../types/PhotoInterface";

const HomeScreen = () => {
  const photos = useSelector(
    (state: RootState) => state.photos.photos as Photo[],
  );

  return (
    <View style={styles.container}>
      {photos.length > 0 ? (
        <FlatList
          style={styles.gallery}
          data={photos}
          numColumns={3}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/PhotoScreen",
                    params: {
                      uuid: item.uuid,
                    },
                  })
                }
              >
                <Image source={{ uri: item.uri }} style={styles.image} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noPhotos}>No hay fotos</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/CaptureScreen")}
      >
        <Text style={styles.capture}>Tomar foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPhotos: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    padding: 10,
  },
  gallery: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "lightgray",
  },
  imageItem: {
    margin: 5,
  },
  image: {
    width: 150,
    height: 150,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  capture: {
    color: "white",
  },
});

export default HomeScreen;
