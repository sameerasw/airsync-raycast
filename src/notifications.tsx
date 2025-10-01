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
    <List isLoading={isLoading}>
      {notifications.map((notification: Notification) => (
        <List.Item
          key={notification.id}
          icon={Icon.Bell}
          title={notification.title || "No Title"}
          subtitle={notification.app}
          accessories={[{ text: notification.app }]}
          detail={
            <List.Item.Detail
              markdown={`# ${notification.title}\n\n${notification.body}`}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="App" text={notification.app} icon={Icon.AppWindow} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Title" text={notification.title} />
                  <List.Item.Detail.Metadata.Label title="Body" text={notification.body} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="ID" text={notification.id} />
                </List.Item.Detail.Metadata>
              }
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
      ))}
    </List>
  );
}
