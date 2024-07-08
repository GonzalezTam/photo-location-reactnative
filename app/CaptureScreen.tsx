import React, { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Crypto from "expo-crypto";
import * as Location from "expo-location";
import { addPhoto } from "@/redux/slices/photoSlice";

type Facing = "front" | "back";
type FlashMode = "on" | "off";

const TakePhotoScreen = () => {
  const [facing, setFacing] = useState<Facing>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const cameraRef = useRef<CameraView>(null);
  const dispatch = useDispatch();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("El permiso de ubicación fue denegado");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      let { status } = await requestCameraPermission();
      if (status !== "granted") {
        setErrorMsg("El permiso de la cámara fue denegado");
        return;
      }
    };
    getLocation();
    getCameraPermission();
  }, [requestCameraPermission]);

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

  const toggleFlash = () => {
    setFlashMode((current) => (current === "on" ? "off" : "on"));
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!cameraPermission) {
    return <View />;
  }

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      flash={flashMode}
      ref={cameraRef}
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flash} onPress={toggleFlash}>
            <Text style={styles.ico}>⚡️</Text>
            <Text style={styles.flashText}>
              {flashMode === "on" ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.capture} onPress={takePhoto} />
          <TouchableOpacity style={styles.facing} onPress={toggleCameraFacing}>
            <Text style={{ ...styles.ico, top: 4 }}>📸</Text>
          </TouchableOpacity>
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
  flash: {
    position: "absolute",
    width: 62,
    height: 62,
    bottom: 24,
    left: 72,
    borderRadius: 50,
    borderColor: "black",
    backgroundColor: "black",
    opacity: 0.5,
  },
  flashText: {
    color: "white",
    fontSize: 12,
    bottom: 8,
    textAlign: "center",
  },
  facing: {
    position: "absolute",
    width: 62,
    height: 62,
    bottom: 24,
    right: 72,
    borderRadius: 50,
    borderColor: "black",
    backgroundColor: "black",
    opacity: 0.5,
  },
  ico: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
    marginTop: 10,
  },
});

export default TakePhotoScreen;
