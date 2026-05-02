import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

export type ProgressState = {
  stepIndex: number;
  ageRange: string;
  goal: string;
  extraFocus: string;
  appStyle: string;
  notifications: boolean;
  notes: string;
  updatedAt: string;
};

const STORAGE_KEY = "@multi-step-progress";

function getBackendUrl(): string {
  const packagerHost =
    Constants.manifest?.debuggerHost ||
    (Constants.manifest as any)?.debuggerHost ||
    (Constants.expoConfig as any)?.hostUri;

  if (packagerHost) {
    const host = packagerHost.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:3000/progress`;
    }
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/progress";
  }

  return "http://localhost:3000/progress";
}

function safeParse(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function saveLocalProgress(progress: ProgressState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

async function loadLocalProgress(): Promise<ProgressState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
}

export async function loadProgress(): Promise<ProgressState | null> {
  const localProgress = await loadLocalProgress();

  try {
    const response = await fetch(getBackendUrl(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const remoteProgress = (await response.json()) as ProgressState;
    await saveLocalProgress(remoteProgress);
    return remoteProgress;
  } catch {
    return localProgress;
  }
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  await saveLocalProgress(progress);

  try {
    const response = await fetch(getBackendUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progress),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }
  } catch {
    throw new Error("Failed to save progress to backend.");
  }
}
