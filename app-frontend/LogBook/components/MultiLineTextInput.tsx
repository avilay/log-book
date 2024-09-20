import { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

type InputDoneHandler = (text: string) => void;

export default function MultiLineTextInput({
  value,
  onInputDone
}: {
  value: string;
  onInputDone: InputDoneHandler;
}) {
  const [text, setText] = useState<string>(value);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            onChangeText={(txt) => setText(txt)}
            value={text}
            multiline={true}
            numberOfLines={3}
            onBlur={() => onInputDone(text)}
            onEndEditing={() => onInputDone(text)}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start"
    // marginVertical: 20
  },
  inner: {
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 10,
    flexGrow: 1,
    borderColor: "darkgray",
    borderWidth: 1
  }
});
