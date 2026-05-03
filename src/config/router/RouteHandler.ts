import BreadCrumbLabel from './BreadCrumbLabel';
import { RouterKeys } from './RouterKeys';

// ─── Route handle type ────────────────────────────────────────────────────────

export interface RouteHandle {
  breadCrumbLabel?: string;
  shortcut?: { key: string; label: string };
}

// ─── Platform ─────────────────────────────────────────────────────────────────

const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// ─── Modifier symbols (for badge display) ────────────────────────────────────
export const MOD  = isMac ? '⌘' : 'Ctrl';
export const ALT  = isMac ? '⌥' : 'Alt';
export const SHF  = '⇧';

// ─── HotKeys (display labels) ─────────────────────────────────────────────────

export const HotKeys = {
  CtrlEnter:  `${MOD}+↵`,
  CtrlS:      `${MOD}+S`,
  CtrlE:      `${MOD}+E`,
  CtrlQ:      `${MOD}+Q`,
  CtrlB:      `${MOD}+B`,
  CtrlD:      `${MOD}+D`,
  CtrlO:      `${MOD}+O`,
  CtrlR:      `${MOD}+R`,
  CtrlI:      `${MOD}+I`,
  CtrlT:      `${MOD}+T`,
  CtrlP:      `${MOD}+P`,
  CtrlH:      `${MOD}+H`,
  CtrlU:      `${MOD}+U`,

  CtrlAltB:   `${MOD}+${ALT}+B`,
  CtrlAltD:   `${MOD}+${ALT}+D`,
  CtrlAltR:   `${MOD}+${ALT}+R`,

  CtrlShiftB: `${MOD}+${SHF}+B`,
  CtrlShiftD: `${MOD}+${SHF}+D`,

  ShiftT:     `${SHF}+T`,
  ShiftR:     `${SHF}+R`,

  F1:         'F1',
} as const;

export type HotKeyName = keyof typeof HotKeys;

export const ROUTE_HANDLES: Record<string, RouteHandle> = {
  [RouterKeys.DASHBOARD]: {
    breadCrumbLabel: BreadCrumbLabel.DASHBOARD,
    shortcut: { key: 'd', label: HotKeys.CtrlD },
  },
  [RouterKeys.USER]: {
    breadCrumbLabel: BreadCrumbLabel.USER.BASE_PATH,
    shortcut: { key: 'u', label: HotKeys.CtrlU },
  },
};