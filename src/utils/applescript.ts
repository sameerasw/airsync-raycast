import { runAppleScript } from "@raycast/utils";

export interface DeviceStatus {
  device_ip: string;
  device_port: string;
  device_name: string;
  adb_connected: string;
  notifications_count: string;
  device_version: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  app: string;
}

export interface MediaInfo {
  title: string;
  artist: string;
  album?: string;
  is_playing: string;
  volume: string;
  is_muted: string;
  like_status: string;
}

export async function getStatus(): Promise<DeviceStatus | null> {
  try {
    const result = await runAppleScript('tell application "AirSync" to get status');
    if (result.includes("No device connected")) {
      return null;
    }
    return JSON.parse(result);
  } catch (error) {
    console.error("Failed to get status:", error);
    throw new Error("Failed to get AirSync status. Make sure AirSync is running.");
  }
}

export async function disconnect(): Promise<string> {
  try {
    const result = await runAppleScript('tell application "AirSync" to disconnect');
    return result;
  } catch (error) {
    console.error("Failed to disconnect:", error);
    throw new Error("Failed to disconnect. Make sure AirSync is running.");
  }
}

export async function reconnect(): Promise<string> {
  try {
    const result = await runAppleScript('tell application "AirSync" to reconnect');
    return result;
  } catch (error) {
    console.error("Failed to reconnect:", error);
    throw new Error("Failed to reconnect. Make sure AirSync is running.");
  }
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const result = await runAppleScript('tell application "AirSync" to get notifications');
    if (result.includes("No notifications") || result.includes("No device connected")) {
      return [];
    }
    return JSON.parse(result);
  } catch (error) {
    console.error("Failed to get notifications:", error);
    throw new Error("Failed to get notifications. Make sure AirSync is running.");
  }
}

export async function getMedia(): Promise<MediaInfo | null> {
  try {
    const result = await runAppleScript('tell application "AirSync" to get media');
    if (typeof result === "string" && !result.startsWith("{")) {
      return null;
    }
    return JSON.parse(result);
  } catch (error) {
    console.error("Failed to get media:", error);
    throw new Error("Failed to get media info. Make sure AirSync is running.");
  }
}
