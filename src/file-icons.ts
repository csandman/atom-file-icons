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
   */
  isDir?: boolean;
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

/**
 * Get icon class name of the provided filename. If not found, default to text icon.
 *
 * @param name - file name
 * @returns the icon's class
 * @public
 */
export function getIconClass(
  name: string,
  { colorMode, isDir }: GetClassOptions = {}
): string | null {
  const match = db.matchName(name, isDir);
  const colorModeIndex = getColorModeIndex(colorMode);
  return match ? match.getClass(colorModeIndex) : null;
}

/**
 * Get icon class name of the provided filename. If not found, default to text icon.
 *
 * @param name - file name
 * @returns the icon's class
 * @public
 */
export function getIconClassList(
  name: string,
  { colorMode, isDir }: GetClassOptions = {}
): string[] | null {
  const match = db.matchName(name, isDir);
  const colorModeIndex = getColorModeIndex(colorMode);
  return match ? match.getClassList(colorModeIndex) : null;
}
