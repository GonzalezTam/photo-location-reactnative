import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({
  text,
  buttonStyle,
  textStyle,
  handlePress,
}: {
  text: string;
  buttonStyle?: object;
  textStyle?: object;
  handlePress: () => void;
}) => (
  <TouchableOpacity
    style={{ ...styles.button, ...buttonStyle }}
    onPress={handlePress}
  >
    <Text style={{ ...styles.text, ...textStyle }}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#C72068",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Button;
