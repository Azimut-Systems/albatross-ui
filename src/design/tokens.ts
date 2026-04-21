/**
 * Design tokens — single source of truth for semantic colors.
 *
 * Visual primitives (spacing, radii, surfaces) live in index.css as CSS vars.
 * This file is for palette mappings consumed in TSX (badge colors keyed by
 * status/activity unions). Change a color here and every badge updates.
 */

export type BadgeTone = {
  border: string;
  bg: string;
  text: string;
};

const statusCritical: BadgeTone = {
  border: 'var(--status-critical)',
  bg: 'var(--status-critical-bg)',
  text: 'var(--status-critical)',
};

const statusWarning: BadgeTone = {
  border: 'var(--status-warning)',
  bg: 'var(--status-warning-bg)',
  text: 'var(--status-warning)',
};

const statusSuccess: BadgeTone = {
  border: 'var(--status-success)',
  bg: 'var(--status-success-bg)',
  text: 'var(--status-success-fg)',
};

const statusInfo: BadgeTone = {
  border: 'var(--status-info)',
  bg: 'var(--status-info-bg)',
  text: 'var(--status-info)',
};

const statusAccent: BadgeTone = {
  border: 'var(--accent)',
  bg: 'rgb(var(--accent-rgb) / 0.2)',
  text: 'var(--accent)',
};

export const TARGET_STATUS_TONES = {
  Critical: statusCritical,
  Warning: statusWarning,
  Normal: statusSuccess,
} as const;

export const CAMERA_STATUS_TONES = {
  Connected: statusSuccess,
  Disconnected: statusCritical,
} as const;

export const CAMERA_ACTIVITY_TONES = {
  Idle: statusInfo,
  Active: statusAccent,
} as const;

export const VESSEL_CLASS_TONE: BadgeTone = statusInfo;
export const AUTO_TAG_TONE: BadgeTone = statusSuccess;
