import type { ColorModeIndex, IconBase, IconColor } from '../types';

/**
 * Icon instance
 *
 * @see {@link https://github.com/websemantics/file-icons-js/blob/master/index.js#L1107}
 */
export default class Icon {
  /** Index of the icon's appearance in the enclosing array */
  index: number;

  /** Icon's CSS class (e.g., "js-icon") */
  icon: string;

  /** Icon's color classes */
  color: IconColor;

  /** Pattern for matching names or pathnames */
  match: RegExp;

  /** priority that determined icon's order of appearance */
  priority = 1;

  /** Match against system path instead of basename */
  matchPath = false;

  /** to match executable names in hashbangs */
  interpreter: RegExp | null = null;

  /** to match grammar scope-names */
  scope: RegExp | null = null;

  /** to match alias patterns */
  lang: RegExp | null = null;

  /** to match file signatures */
  signature: RegExp | null = null;

  constructor(index: number, data: IconBase) {
    this.index = index;
    [this.icon, this.color, this.match] = data;
    this.priority = data[3] || 1;
    this.matchPath = data[4] || false;
    this.interpreter = data[5] || null;
    this.scope = data[6] || null;
    this.lang = data[7] || null;
    this.signature = data[8] || null;
  }

  /**
   * Return the CSS classes for displaying the icon as a string.
   *
   * @param colorMode - The color mode index to use for the color class.
   * @returns The icon classes as a string.
   */
  getClass(colorMode: ColorModeIndex | null = null) {
    // No color needed or available
    if (
      colorMode === undefined ||
      colorMode === null ||
      !this.color[colorMode]
    ) {
      return this.icon;
    }

    return `${this.icon} ${this.color[colorMode]}`;
  }

  /**
   * Return the CSS classes for displaying the icon as an array.
   *
   * @param colorMode - The color mode index to use for the color class.
   * @returns The icon classes as an array.
   */
  getClassList(colorMode?: ColorModeIndex): string[] {
    // No color needed or available
    const classList = [this.icon];

    if (colorMode !== undefined && colorMode !== null) {
      const colorClass = this.color[colorMode];
      if (colorClass) {
        classList.push(colorClass);
      }
    }

    return classList;
  }
}
