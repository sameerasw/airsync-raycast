import { Action, ActionPanel, List, Icon } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getNotifications, Notification } from "./utils/applescript";
import React from "react";

export default function Command() {
  const { data: notifications, isLoading, error, revalidate } = usePromise(getNotifications);

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Error"
          description={error.message}
          actions={
            <ActionPanel>
              <Action title="Retry" onAction={revalidate} icon={Icon.ArrowClockwise} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  if (isLoading) {
    return <List isLoading={true} />;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.Bell}
          title="No Notifications"
          description="There are no notifications from your device"
          actions={
            <ActionPanel>
              <Action title="Refresh" onAction={revalidate} icon={Icon.ArrowClockwise} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} isShowingDetail>
      {notifications.map((notification: Notification) => {
        // Create app icon from base64 or use default
        const appIcon = notification.app_icon_base64
          ? `data:image/png;base64,${notification.app_icon_base64}`
          : Icon.Bell;

        return (
          <List.Item
            key={notification.id}
            icon={appIcon}
            title={`${notification.app} • ${notification.title || "No Title"}`}
            subtitle={notification.body}
            detail={
              <List.Item.Detail
                markdown={`# ${notification.title || "No Title"}\n\n${notification.body}`}
              />
            }
            actions={
              <ActionPanel>
                <Action.CopyToClipboard title="Copy Body" content={notification.body} />
                <Action.CopyToClipboard
                  title="Copy All"
                  content={`${notification.title}\n${notification.body}\n\nApp: ${notification.app}`}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                />
                <Action title="Refresh" onAction={revalidate} icon={Icon.ArrowClockwise} shortcut={{ modifiers: ["cmd"], key: "r" }} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
