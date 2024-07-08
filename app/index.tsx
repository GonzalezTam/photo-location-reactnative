import React from "react";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { deletePhoto } from "@/redux/slices/photoSlice";
import { RootState } from "@/redux";
import { Photo } from "../types/PhotoInterface";

const HomeScreen = () => {
  const [pressedPhoto, setPressedPhoto] = React.useState("");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const dispatch = useDispatch();
  const photos = useSelector(
    (state: RootState) => state.photos.photos as Photo[],
  );

  const handleDelete = (id: string) => {
    dispatch(deletePhoto(id));
    setShowDeleteModal(false);
    setPressedPhoto("");
  };

  return (
    <View style={styles.container}>
      {photos.length > 0 ? (
        <>
          <Modal visible={showDeleteModal} transparent animationType="fade">
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>¿Estás seguro de eliminar la foto?</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    text="Cancelar"
                    buttonStyle={{ backgroundColor: "#666666" }}
                    textStyle={{ color: "#FFFFFF" }}
                    handlePress={() => {
                      setShowDeleteModal(false);
                      setPressedPhoto("");
                    }}
                  />
                  <Button
                    text="Eliminar"
                    handlePress={() => handleDelete(pressedPhoto)}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <FlatList
            style={styles.gallery}
            data={photos}
            numColumns={3}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onLongPress={() => {
                    setPressedPhoto(item.uuid);
                    setShowDeleteModal(true);
                  }}
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
                </Pressable>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <Text style={styles.noPhotos}>No hay fotos</Text>
      )}
      <Button
        text="Tomar foto"
        handlePress={() => router.push("/CaptureScreen")}
      />
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#c6c6c6",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  gallery: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
  },
  imageItem: {
    margin: 5,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
    borderRadius: 5,
  },
});

export default HomeScreen;
