import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "../../components/themed-text";
import type { ProgressState } from "../lib/progress";

export function SummaryPanel({
  progress,
  hasExtraStep,
  onEdit,
  onSaveFinal,
}: {
  progress: ProgressState;
  hasExtraStep: boolean;
  onEdit: () => void;
  onSaveFinal: () => void;
}) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Summary</ThemedText>
      <View style={styles.row}>
        <ThemedText type="defaultSemiBold">Age range:</ThemedText>
        <ThemedText>{progress.ageRange || "Not answered"}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText type="defaultSemiBold">Goal:</ThemedText>
        <ThemedText>{progress.goal || "Not answered"}</ThemedText>
      </View>
      {hasExtraStep ? (
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Focus:</ThemedText>
          <ThemedText>{progress.extraFocus || "Not answered"}</ThemedText>
        </View>
      ) : null}
      <View style={styles.row}>
        <ThemedText type="defaultSemiBold">App style:</ThemedText>
        <ThemedText>{progress.appStyle || "Not answered"}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText type="defaultSemiBold">Notifications:</ThemedText>
        <ThemedText>
          {progress.notifications ? "Enabled" : "Disabled"}
        </ThemedText>
      </View>
      {progress.notes ? (
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Notes:</ThemedText>
          <ThemedText>{progress.notes}</ThemedText>
        </View>
      ) : null}
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.secondaryButton}>
          <ThemedText>Edit responses</ThemedText>
        </Pressable>
        <Pressable onPress={onSaveFinal} style={styles.primaryButton}>
          <ThemedText type="defaultSemiBold" style={{ color: "#FFFFFF" }}>
            Save final progress
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  row: {
    marginBottom: 14,
  },
  actions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
  },
});
