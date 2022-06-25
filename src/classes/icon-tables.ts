import Icon from './icon';
import type { IconDb, IconDbItem } from '../types';

export interface Cache {
  directoryName: Record<string, Icon>;
  directoryPath: Record<string, Icon>;
  fileName: Record<string, Icon>;
  filePath: Record<string, Icon>;
  interpreter: Record<string, Icon>;
  scope: Record<string, Icon>;
  language: Record<string, Icon>;
  signature: Record<string, Icon>;
}

const cache: Cache = {
  directoryName: {},
  directoryPath: {},
  fileName: {},
  filePath: {},
  interpreter: {},
  scope: {},
  language: {},
  signature: {},
};

export interface IconTable {
  byName: Icon[];
  byInterpreter: Icon[];
  byLanguage: Icon[];
  byPath: Icon[];
  byScope: Icon[];
  bySignature: Icon[];
}

/**
 * Create IconTables instance
 */
export default class IconTables {
  /** Icons to match directory-type resources. */
  directoryIcons: IconTable;

  /** Icons to match file resources. */
  fileIcons: IconTable;

  /** Icon for binary files. */
  binaryIcon: Icon | null;

  /** Icon for executables. */
  executableIcon: Icon | null;

  constructor(data: IconDb) {
    /**
     * Populate icon-lists from a icons data table.
     */
    const read = (table: IconDbItem): IconTable => {
      const [rawIcons, rawIndexes] = table;

      const icons = rawIcons.map((icon, index) => new Icon(index, icon));

      // Dereference Icon instances from their stored offset
      const indexes = rawIndexes.map((index) =>
        index.map((offset) => icons[offset])
      );

      return {
        byName: icons,
        byInterpreter: indexes[0],
        byLanguage: indexes[1],
        byPath: indexes[2],
        byScope: indexes[3],
        bySignature: indexes[4],
      };
    };

    this.directoryIcons = read(data[0]);
    this.fileIcons = read(data[1]);
    this.binaryIcon = this.matchScope('source.asm');
    this.executableIcon = this.matchInterpreter('bash');
  }

  /**
   * Match an icon using a resource's basename.
   *
   * @param name - Name of filesystem entity
   * @param directory - Match folders instead of files
   */
  matchName(name: string, directory = false): Icon | null {
    const cachedIcons: Record<string, Icon> = directory
      ? cache.directoryName
      : cache.fileName;
    const icons = directory
      ? this.directoryIcons.byName
      : this.fileIcons.byName;

    if (cachedIcons[name]) {
      return cachedIcons[name];
    }

    for (let i = 0; i < icons.length; i += 1) {
      const icon = icons[i];
      if (icon.match.test(name)) {
        cachedIcons[name] = icon;
        return icon;
      }
    }

    return null;
  }

  /**
   * Match an icon using a resource's system path.
   *
   * @param path - Full pathname to check
   * @param directory - Match folders instead of files
   */
  matchPath(path: string, directory = false): Icon | null {
    const cachedIcons = directory ? cache.directoryName : cache.fileName;
    const icons = directory
      ? this.directoryIcons.byPath
      : this.fileIcons.byPath;

    if (cachedIcons[path]) {
      return cachedIcons[path];
    }

    for (let i = 0; i < icons.length; i += 1) {
      const icon = icons[i];
      if (icon.match.test(path)) {
        cachedIcons[path] = icon;
        return icon;
      }
    }

    return null;
  }

  /**
   * Match an icon using the human-readable form of its related language.
   *
   * Typically used for matching modelines and Linguist-language attributes.
   *
   * @example IconTables.matchLanguage("JavaScript")
   * @param name - Name/alias of language
   */
  matchLanguage(name: string) {
    if (cache.language[name]) {
      return cache.language[name];
    }

    for (let i = 0; i < this.fileIcons.byLanguage.length; i += 1) {
      const icon = this.fileIcons.byLanguage[i];
      if (icon.lang?.test(name)) {
        cache.language[name] = icon;
        return icon;
      }
    }

    return null;
  }

  /**
   * Match an icon using the grammar-scope assigned to it.
   *
   * @example IconTables.matchScope("source.js")
   * @param name - Name of scope
   */
  matchScope(name: string): Icon | null {
    if (cache.scope[name]) {
      return cache.scope[name];
    }

    for (let i = 0; i < this.fileIcons.byScope.length; i += 1) {
      const icon = this.fileIcons.byScope[i];
      if (icon.scope?.test(name)) {
        cache.scope[name] = icon;
        return icon;
      }
    }

    return null;
  }

  /**
   * Match an icon using the name of an interpreter which executes its language.
   *
   * Used for matching interpreter directives (a.k.a., "hashbangs").
   *
   * @example IconTables.matchInterpreter("bash")
   */
  matchInterpreter(name: string) {
    if (cache.interpreter[name]) {
      return cache.interpreter[name];
    }

    for (let i = 0; i < this.fileIcons.byInterpreter.length; i += 1) {
      const icon = this.fileIcons.byInterpreter[i];
      if (icon.interpreter?.test(name)) {
        cache.interpreter[name] = icon;
        return icon;
      }
    }

    return null;
  }
}
