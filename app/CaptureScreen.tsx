import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Crypto from "expo-crypto";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { addPhoto } from "../redux/slices/photoSlice";

//type Facing = "front" | "back";

const TakePhotoScreen = () => {
  //const [facing, setFacing] = useState<Facing>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const cameraRef = useRef<CameraView>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("El permiso de ubicación fue denegado");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (errorMsg) {
      alert(errorMsg);
      router.back();
    }
  }, [errorMsg]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (location && photo) {
        dispatch(
          addPhoto({ uuid: Crypto.randomUUID(), uri: photo.uri, location }),
        );
        router.back();
      } else {
        setErrorMsg("No se pudo obtener la ubicación o la foto");
      }
    }
  };

  //const toggleCameraFacing = () => {
  //  setFacing((current) => (current === "back" ? "front" : "back"));
  //};

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Necesitas otorgar permiso para acceder a la cámara
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.text}>Solicitar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView style={styles.camera} facing="back" ref={cameraRef}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.capture} onPress={takePhoto} />
        </View>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  permissionButton: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
  permissionText: {
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    width: 70,
    height: 70,
    bottom: 24,
    borderRadius: 50,
    borderColor: "white",
    backgroundColor: "white",
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default TakePhotoScreen;
