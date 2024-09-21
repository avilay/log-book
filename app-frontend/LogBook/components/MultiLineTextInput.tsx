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
  onChangeText
}: {
  value: string;
  onChangeText: InputDoneHandler;
}) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            onChangeText={onChangeText}
            value={value}
            multiline={true}
            numberOfLines={3}
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
