import { Action, ActionPanel, Detail, Icon, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { reconnect } from "./utils/applescript";
import React, { useState } from "react";

export default function Command() {
  const [hasReconnected, setHasReconnected] = useState(false);

  const { data: result, isLoading, error, revalidate } = usePromise(
    async () => {
      if (!hasReconnected) {
        const response = await reconnect();
        setHasReconnected(true);

        if (response.includes("Attempting to reconnect")) {
          await showToast({
            style: Toast.Style.Animated,
            title: "Reconnecting",
            message: response,
          });
        } else {
          await showToast({
            style: Toast.Style.Animated,
            title: "Status",
            message: response,
          });
        }

        return response;
      }
      return null;
    },
    [],
    {
      execute: true,
    }
  );

  if (error) {
    return (
      <Detail
        markdown={`# ⚠️ Error\n\n${error.message}`}
        actions={
          <ActionPanel>
            <Action
              title="Try Again"
              onAction={() => {
                setHasReconnected(false);
                revalidate();
              }}
              icon={Icon.ArrowClockwise}
            />
          </ActionPanel>
        }
      />
    );
  }

  if (isLoading || !result) {
    return <Detail isLoading={true} markdown="# Reconnecting..." />;
  }

  const isReconnecting = result.includes("Attempting to reconnect");
  const icon = isReconnecting ? "🔄" : "ℹ️";

  return (
    <Detail
      markdown={`# ${icon} ${result}`}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Result" content={result} />
          <Action
            title="Try Again"
            onAction={() => {
              setHasReconnected(false);
              revalidate();
            }}
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
          />
        </ActionPanel>
      }
    />
  );
}
