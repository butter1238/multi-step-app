import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "../../components/themed-text";

export function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected ? styles.buttonSelected : styles.buttonUnselected,
        pressed && styles.buttonPressed,
      ]}
    >
      <ThemedText style={selected ? styles.labelSelected : styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexBasis: "48%",
    maxWidth: "48%",
    marginBottom: 10,
  },
  buttonSelected: {
    backgroundColor: "#2563eb",
  },
  buttonUnselected: {
    backgroundColor: "#f3f4f6",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  label: {
    color: "#111827",
  },
  labelSelected: {
    color: "#ffffff",
  },
});
