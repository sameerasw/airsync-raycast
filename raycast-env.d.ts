/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `status` command */
  export type Status = ExtensionPreferences & {}
  /** Preferences accessible in the `disconnect` command */
  export type Disconnect = ExtensionPreferences & {}
  /** Preferences accessible in the `reconnect` command */
  export type Reconnect = ExtensionPreferences & {}
  /** Preferences accessible in the `notifications` command */
  export type Notifications = ExtensionPreferences & {}
  /** Preferences accessible in the `media` command */
  export type Media = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `status` command */
  export type Status = {}
  /** Arguments passed to the `disconnect` command */
  export type Disconnect = {}
  /** Arguments passed to the `reconnect` command */
  export type Reconnect = {}
  /** Arguments passed to the `notifications` command */
  export type Notifications = {}
  /** Arguments passed to the `media` command */
  export type Media = {}
}

