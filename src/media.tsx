import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
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
  const playingIcon = isPlaying ? "▶️" : "⏸️";
  const volumeIcon = isMuted ? "🔇" : "🔊";
  const likeIcon = media.like_status === "liked" ? "❤️" : media.like_status === "disliked" ? "💔" : "🤍";

  const title = hasTitle ? media.title : "No title";
  const artist = media.artist && media.artist.trim() !== "" ? media.artist : "Unknown artist";
  const album = media.album && media.album.trim() !== "" ? media.album : undefined;

  const markdown = `
# 🎵 ${title}

${artist ? `**${artist}**` : ""}${album ? ` · ${album}` : ""}

---

${playingIcon} **Status:** ${isPlaying ? "Playing" : "Paused"}

${volumeIcon} **Volume:** ${media.volume}% ${isMuted ? "(Muted)" : ""}

${likeIcon} **Like Status:** ${media.like_status === "liked" ? "Liked" : media.like_status === "disliked" ? "Disliked" : "None"}
`;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Title" text={title} icon={Icon.Music} />
          {media.artist && media.artist.trim() !== "" && (
            <Detail.Metadata.Label title="Artist" text={artist} icon={Icon.Person} />
          )}
          {album && <Detail.Metadata.Label title="Album" text={album} icon={Icon.Cd} />}
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Status"
            text={isPlaying ? "Playing" : "Paused"}
            icon={isPlaying ? Icon.Play : Icon.Pause}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Volume" text={`${media.volume}%`} icon={Icon.SpeakerOn} />
          <Detail.Metadata.Label
            title="Muted"
            text={isMuted ? "Yes" : "No"}
            icon={isMuted ? Icon.SpeakerOff : Icon.SpeakerOn}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title="Like Status"
            text={media.like_status === "liked" ? "Liked" : media.like_status === "disliked" ? "Disliked" : "None"}
            icon={media.like_status === "liked" ? Icon.Heart : Icon.HeartDisabled}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action title="Refresh" onAction={revalidate} icon={Icon.ArrowClockwise} />
          {hasTitle && <Action.CopyToClipboard title="Copy Track Info" content={`${title} - ${artist}`} />}
        </ActionPanel>
      }
    />
  );
}
