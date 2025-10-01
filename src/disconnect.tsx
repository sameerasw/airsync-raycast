import { Action, ActionPanel, Detail, Icon, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { disconnect } from "./utils/applescript";
import React, { useState } from "react";

export default function Command() {
  const [hasDisconnected, setHasDisconnected] = useState(false);

  const { data: result, isLoading, error, revalidate } = usePromise(
    async () => {
      if (!hasDisconnected) {
        const response = await disconnect();
        setHasDisconnected(true);
        
        if (response.includes("Disconnected from")) {
          await showToast({
            style: Toast.Style.Success,
            title: "Disconnected",
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
                setHasDisconnected(false);
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
    return <Detail isLoading={true} markdown="# Disconnecting..." />;
  }

  const isDisconnected = result.includes("Disconnected from");
  const icon = isDisconnected ? "✅" : "ℹ️";

  return (
    <Detail
      markdown={`# ${icon} ${result}`}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Result" content={result} />
        </ActionPanel>
      }
    />
  );
}
