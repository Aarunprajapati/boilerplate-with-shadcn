import { ROUTE_HANDLES, type RouteHandle } from '@/config/router/RouteHandler';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Build config from ROUTE_HANDLES ─────────────────────────────────────────

const SHORTCUT_CONFIG = Object.entries(ROUTE_HANDLES)
  .filter(([, h]) => (h as RouteHandle).shortcut)
  .map(([routeKey, h]) => ({
    key:   (h as RouteHandle).shortcut!.key,   // e.g. 'd'
    path:  `/${routeKey}`,                     // e.g. '/dashboard'
    label: (h as RouteHandle).shortcut!.label, // e.g. '⌘+D'
  }));

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const withMod = e.ctrlKey || e.metaKey;
      if (!withMod) return;

      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if (isTyping) return;

      // Match directly on key — no hotKeyName needed
      const match = SHORTCUT_CONFIG.find((s) => s.key === e.key.toLowerCase());
      if (!match) return;

      e.preventDefault();
      navigate(match.path);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const HotKeysShortCuts = SHORTCUT_CONFIG;

  const ShortCutWithRoutes: Record<string, string> = Object.fromEntries(
    SHORTCUT_CONFIG.map((s) => [s.path, s.label])
  );

  return { HotKeysShortCuts, ShortCutWithRoutes };
};

export default useKeyboardShortcuts;