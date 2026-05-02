import { StyleSheet, View } from "react-native";

import { ThemedText } from "../../components/themed-text";

export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">
        Step {current} of {total}
      </ThemedText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(current / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  track: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
});
