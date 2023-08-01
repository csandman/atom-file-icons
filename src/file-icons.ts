import IconTables from './classes/icon-tables';
import iconDb from './db/icondb';
import type { ColorMode, ColorModeIndex } from './types';

export const db = new IconTables(iconDb);

export interface GetClassOptions {
  /**
   * The color mode to use for the icon.
   *
   * @defaultValue 'light'
   */
  colorMode?: ColorMode;

  /**
   * Whether or no the icon returned should be for a directory.
   *
   * @defaultValue false
   */
  isDir?: boolean;

  /**
   * If passed, no fallback icon will be returned
   *
   * @defaultValue false
   */
  skipFallback?: boolean;
}

const getColorModeIndex = (colorMode?: ColorMode): ColorModeIndex => {
  switch (colorMode) {
    case 'dark':
      return 1;

    case 'mono':
      return null;

    case 'light':
    default:
      return 0;
  }
};

const DEFAULT_GET_CLASS_OPTIONS: GetClassOptions = {
  colorMode: 'light',
  isDir: false,
  skipFallback: false,
};

/**
 * Get icon class name of the provided filename. If not found, default to text icon.
 *
 * @param name - file name
 * @returns the icon's class
 */
export function getIconClass(
  name: string,
  {
    colorMode = 'light',
    isDir = false,
    skipFallback = false,
  }: GetClassOptions = DEFAULT_GET_CLASS_OPTIONS
): string | null {
  const match = db.matchName(name, isDir);

  if (!match) {
    if (skipFallback) {
      return null;
    }

    if (isDir) {
      return 'icon-file-directory';
    }

    return 'icon-file-text';
  }

  const colorModeIndex = getColorModeIndex(colorMode);

  return match.getClass(colorModeIndex);
}

/**
 * Get icon class name of the provided filename. If not found, default to text icon.
 *
 * @param name - file name
 * @returns the icon's class
 */
export function getIconClassList(
  name: string,
  { colorMode, isDir, skipFallback }: GetClassOptions = {}
): string[] | null {
  const match = db.matchName(name, isDir);

  if (!match) {
    if (skipFallback) {
      return null;
    }

    if (isDir) {
      return ['icon-file-directory'];
    }

    return ['icon-file-text'];
  }

  const colorModeIndex = getColorModeIndex(colorMode);
  return match.getClassList(colorModeIndex);
}
