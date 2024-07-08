import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { store } from "../redux";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const RootLayoutNav = () => (
  <Provider store={store}>
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "MIS FOTOS", headerTitleAlign: "center" }}
      />
      <Stack.Screen name="PhotoScreen" options={{ headerTitle: "" }} />
      <Stack.Screen name="CaptureScreen" options={{ headerShown: false }} />
    </Stack>
  </Provider>
);
