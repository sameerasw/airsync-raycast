import { Action, ActionPanel, Detail, Icon, Color } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getMedia } from "./utils/applescript";
import React from "react";

export default function Command() {
  const { data: media, isLoading, error, revalidate } = usePromise(getMedia);

  if (error) {
    return (
      <Detail
        markdown={`# ⚠️ Error\n\n${error.message}`}
        actions={
          <ActionPanel>
            <Action title="Retry" onAction={revalidate} icon={Icon.ArrowClockwise} />
          </ActionPanel>
        }
      />
    );
  }

  if (isLoading) {
    return <Detail isLoading={true} />;
  }

  if (!media) {
    return (
      <Detail
        markdown="# 🎵 No Media Playing\n\nNo media information available."
        actions={
          <ActionPanel>
            <Action title="Refresh" onAction={revalidate} icon={Icon.ArrowClockwise} />
          </ActionPanel>
        }
      />
    );
  }

  const isPlaying = media.is_playing === "true";
  const isMuted = media.is_muted === "true";
  const hasTitle = media.title && media.title.trim() !== "";
  
  const title = hasTitle ? media.title : "No title";
  const artist = media.artist && media.artist.trim() !== "" ? media.artist : "Unknown artist";
  const album = media.album && media.album.trim() !== "" ? media.album : "";
  
  // Volume bar visualization
  const volumeLevel = parseInt(media.volume) || 0;
  const volumeBar = "█".repeat(Math.floor(volumeLevel / 5)) + "░".repeat(20 - Math.floor(volumeLevel / 5));
  
  // Build the player UI
  const markdown = `
# 🎵 Now Playing

---

## ${title}

### ${artist}${album ? ` • ${album}` : ""}

---

### Playback

${isPlaying ? "▶️ **Playing**" : "⏸️ **Paused**"}

---

### Volume ${isMuted ? "🔇" : "🔊"}

\`\`\`
${volumeBar} ${volumeLevel}%
\`\`\`

${isMuted ? "_Muted_" : ""}

---

### Like Status

${media.like_status === "liked" ? "❤️ Liked" : media.like_status === "disliked" ? "💔 Disliked" : "🤍 Not rated"}
`;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label 
            title="Track" 
            text={title} 
            icon={{ source: Icon.Music, tintColor: Color.Purple }}
          />
          <Detail.Metadata.Label 
            title="Artist" 
            text={artist}
            icon={{ source: Icon.Person, tintColor: Color.Blue }}
          />
          {album && (
            <Detail.Metadata.Label 
              title="Album" 
              text={album}
              icon={{ source: Icon.Cd, tintColor: Color.Orange }}
            />
          )}
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Status"
            text={isPlaying ? "Playing" : "Paused"}
            icon={{ 
              source: isPlaying ? Icon.Play : Icon.Pause,
              tintColor: isPlaying ? Color.Green : Color.Orange
            }}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label 
            title="Volume" 
            text={`${volumeLevel}%`}
            icon={{ 
              source: isMuted ? Icon.SpeakerOff : Icon.SpeakerOn,
              tintColor: isMuted ? Color.Red : Color.Green
            }}
          />
          <Detail.Metadata.TagList title="Like">
            <Detail.Metadata.TagList.Item
              text={media.like_status === "liked" ? "Liked" : media.like_status === "disliked" ? "Disliked" : "Not rated"}
              color={media.like_status === "liked" ? Color.Red : media.like_status === "disliked" ? Color.Blue : Color.SecondaryText}
            />
          </Detail.Metadata.TagList>
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action 
            title="Refresh" 
            onAction={revalidate} 
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
          />
          {hasTitle && (
            <Action.CopyToClipboard 
              title="Copy Track Info" 
              content={`${title} - ${artist}`}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}

