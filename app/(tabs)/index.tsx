import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { OptionButton } from "../components/option-button";
import { StepIndicator } from "../components/step-indicator";
import { SummaryPanel } from "../components/summary-panel";
import {
  loadProgress,
  saveProgress,
  type ProgressState,
} from "../lib/progress";

const ageOptions = ["Under 18", "18-29", "30-45", "46+"];
const goalOptions = [
  "Improve fitness",
  "Advance career",
  "Build better habits",
  "Learn a skill",
];
const extraOptionsMap: Record<string, string[]> = {
  "Improve fitness": ["Cardio", "Strength", "Nutrition"],
  "Advance career": ["Leadership", "New tools", "Networking"],
  "Build better habits": ["Sleep schedule", "Focus habits", "Mindfulness"],
};
const styleOptions = ["Light", "Dark", "Minimal", "Vibrant"];

const defaultProgress: ProgressState = {
  stepIndex: 0,
  ageRange: "",
  goal: "",
  extraFocus: "",
  appStyle: "",
  notifications: false,
  notes: "",
  updatedAt: new Date().toISOString(),
};

export default function HomeScreen() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const hasExtraStep = useMemo(
    () => Boolean(progress.goal && extraOptionsMap[progress.goal]?.length),
    [progress.goal],
  );

  const totalSteps = hasExtraStep ? 5 : 4;
  const currentStep = Math.min(progress.stepIndex, totalSteps - 1);
  const summaryStep = totalSteps - 1;
  const isConditionalStep = currentStep === 2 && hasExtraStep;
  const preferencesStep = hasExtraStep ? 3 : 2;

  useEffect(() => {
    async function restore() {
      setLoading(true);
      try {
        const restored = await loadProgress();
        if (restored) {
          setProgress((current) => ({
            ...current,
            ...restored,
            stepIndex: restored.stepIndex ?? 0,
          }));
          setInfoMessage(
            "Loaded saved progress. You can continue where you left off.",
          );
          setApiError(null);
        }
      } catch {
        setApiError("Could not sync with backend. Offline mode enabled.");
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  const stepTitle = useMemo(() => {
    if (currentStep === 0) return "Tell us your age range";
    if (currentStep === 1) return "Choose your main goal";
    if (isConditionalStep) {
      return `${progress.goal} focus`;
    }
    if (currentStep === preferencesStep) return "Preferences & notifications";
    return "Summary & submit";
  }, [currentStep, isConditionalStep, preferencesStep, progress.goal]);

  const saveState = async (nextState: ProgressState) => {
    setProgress(nextState);
    setSaving(true);
    setInfoMessage(null);
    try {
      await saveProgress(nextState);
      setApiError(null);
      setInfoMessage("Progress saved to backend and local storage.");
    } catch {
      setApiError("Unable to sync with backend, progress saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldUpdate = async (updates: Partial<ProgressState>) => {
    const next = {
      ...progress,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.goal && !extraOptionsMap[updates.goal]) {
      next.extraFocus = "";
    }

    if (
      updates.goal &&
      !extraOptionsMap[updates.goal] &&
      next.stepIndex > preferencesStep
    ) {
      next.stepIndex = preferencesStep;
    }

    await saveState(next);
  };

  const moveStep = async (direction: "next" | "back") => {
    const nextIndex =
      direction === "next" ? currentStep + 1 : Math.max(currentStep - 1, 0);
    const next = {
      ...progress,
      stepIndex: Math.min(nextIndex, totalSteps - 1),
      updatedAt: new Date().toISOString(),
    };
    await saveState(next);
  };

  const handleRetry = async () => {
    setApiError(null);
    setInfoMessage("Retrying sync...");
    await saveState(progress);
  };

  const canContinue = useMemo(() => {
    if (currentStep === 0) return Boolean(progress.ageRange);
    if (currentStep === 1) return Boolean(progress.goal);
    if (isConditionalStep) return Boolean(progress.extraFocus);
    if (currentStep === preferencesStep) return Boolean(progress.appStyle);
    return true;
  }, [currentStep, isConditionalStep, preferencesStep, progress]);

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <View style={styles.section}>
          <ThemedText>Which age range describes you?</ThemedText>
          <View style={styles.optionsGrid}>
            {ageOptions.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={progress.ageRange === option}
                onPress={() => void handleFieldUpdate({ ageRange: option })}
              />
            ))}
          </View>
        </View>
      );
    }

    if (currentStep === 1) {
      return (
        <View style={styles.section}>
          <ThemedText>What do you want to achieve with this app?</ThemedText>
          <View style={styles.optionsGrid}>
            {goalOptions.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={progress.goal === option}
                onPress={() => void handleFieldUpdate({ goal: option })}
              />
            ))}
          </View>
        </View>
      );
    }

    if (isConditionalStep) {
      const choices = extraOptionsMap[progress.goal] ?? [];
      return (
        <View style={styles.section}>
          <ThemedText>Select the focus that fits you best.</ThemedText>
          <View style={styles.optionsGrid}>
            {choices.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={progress.extraFocus === option}
                onPress={() => void handleFieldUpdate({ extraFocus: option })}
              />
            ))}
          </View>
        </View>
      );
    }

    if (currentStep === preferencesStep) {
      return (
        <View style={styles.section}>
          <ThemedText>Customize your experience.</ThemedText>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Push notifications</ThemedText>
            <Switch
              value={progress.notifications}
              onValueChange={(value) =>
                void handleFieldUpdate({ notifications: value })
              }
            />
          </View>
          <ThemedText style={styles.label}>Preferred app style</ThemedText>
          <View style={styles.optionsGrid}>
            {styleOptions.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={progress.appStyle === option}
                onPress={() => void handleFieldUpdate({ appStyle: option })}
              />
            ))}
          </View>
          <ThemedText style={styles.label}>Notes (optional)</ThemedText>
          <TextInput
            style={styles.textArea}
            value={progress.notes}
            onChangeText={(text) => void handleFieldUpdate({ notes: text })}
            placeholder="Something you'd like the app to remember"
            placeholderTextColor="#7a7a7a"
            multiline
          />
        </View>
      );
    }

    return (
      <SummaryPanel
        progress={progress}
        hasExtraStep={hasExtraStep}
        onEdit={() => void moveStep("back")}
        onSaveFinal={() =>
          void handleFieldUpdate({ updatedAt: new Date().toISOString() }).then(
            () => {
              setInfoMessage(
                "🎉 All done! Your preferences have been saved successfully.",
              );
            },
          )
        }
      />
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading your saved session...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={styles.flex}
          keyboardVerticalOffset={80}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <ThemedText type="title">Multi-Step Flow</ThemedText>
              <ThemedText style={styles.subtitle}>
                A guided flow with resume and conditional steps.
              </ThemedText>
            </View>
            <StepIndicator current={currentStep + 1} total={totalSteps} />
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                {stepTitle}
              </ThemedText>
              {renderStepContent()}
            </View>
            {apiError ? (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{apiError}</ThemedText>
                <Pressable onPress={handleRetry} style={styles.retryButton}>
                  <ThemedText type="defaultSemiBold">Retry sync</ThemedText>
                </Pressable>
              </View>
            ) : null}
            {infoMessage ? (
              <View style={styles.infoBox}>
                <ThemedText>{infoMessage}</ThemedText>
              </View>
            ) : null}
            <View style={styles.footerButtons}>
              <Pressable
                onPress={() => void moveStep("back")}
                style={[
                  styles.actionButtonSecondary,
                  currentStep === 0 && styles.disabledButton,
                ]}
                disabled={currentStep === 0 || saving}
              >
                <ThemedText style={{ color: "#007AFF" }}>Back</ThemedText>
              </Pressable>
              {currentStep === summaryStep ? null : (
                <Pressable
                  onPress={() => void moveStep("next")}
                  style={[
                    styles.actionButton,
                    (!canContinue || saving) && styles.disabledButton,
                  ]}
                  disabled={!canContinue || saving}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {saving ? "Saving..." : "Next"}
                  </ThemedText>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    marginBottom: 28,
    paddingTop: 8,
  },
  subtitle: {
    color: "#5d5d5d",
    marginTop: 10,
    lineHeight: 24,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 16,
  },
  section: {},
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    marginTop: 20,
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    textAlignVertical: "top",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#b91c1c",
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fca5a5",
  },
  infoBox: {
    backgroundColor: "#dcfce7",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    alignItems: "center",
  },
  actionButtonSecondary: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
    alignItems: "center",
  },
});
