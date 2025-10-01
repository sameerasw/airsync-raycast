import { Action, ActionPanel, List, Icon, showToast, Toast, Color, closeMainWindow } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getApps, mirrorApp, App } from "./utils/applescript";
import React, { useState, useEffect } from "react";

export default function Command() {
  const { data: appsData, isLoading, error, revalidate } = usePromise(getApps);

  // Show toast and close window on error
  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to get apps",
        message: error.message,
      });
    }
  }, [error]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleMirrorApp = async (app: App) => {
    try {
      setSelectedApp(app.package_name);
      const response = await mirrorApp(app.package_name);

      if (response.success) {
        await showToast({
          style: Toast.Style.Success,
          title: "Launching App Mirror",
          message: response.message,
        });
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to mirror app",
          message: response.message,
        });
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to mirror app",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSelectedApp(null);
    }
  };

  if (isLoading) {
    return <List isLoading={true} searchBarPlaceholder="Loading apps..." />;
  }

  if (!appsData || appsData.apps.length === 0) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.AppWindow}
          title="No Apps Found"
          description="No apps available for mirroring"
          actions={
            <ActionPanel>
              <Action title="Refresh" onAction={revalidate} icon={Icon.ArrowClockwise} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  // Sort apps: non-system apps first, then by name
  const sortedApps = [...appsData.apps].sort((a, b) => {
    if (a.system_app !== b.system_app) {
      return a.system_app ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search apps..."
      isShowingDetail
    >
      {sortedApps.map((app: App) => {
        const appIcon = app.icon
          ? `data:image/png;base64,${app.icon}`
          : Icon.AppWindow;

        const isSystemApp = app.system_app;

        return (
          <List.Item
            key={app.package_name}
            icon={appIcon}
            title={app.name}
            detail={
              <List.Item.Detail
                markdown={`# ${app.name}\n\n${app.package_name}\n\n${isSystemApp ? "🔧 System App" : "📱 User App"}`}
              />
            }
            actions={
              <ActionPanel>
                <Action
                  title="Mirror App"
                  icon={Icon.Monitor}
                  onAction={() => handleMirrorApp(app)}
                />
                <Action.CopyToClipboard
                  title="Copy Package Name"
                  content={app.package_name}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
                <Action
                  title="Refresh"
                  onAction={revalidate}
                  icon={Icon.ArrowClockwise}
                  shortcut={{ modifiers: ["cmd"], key: "r" }}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
