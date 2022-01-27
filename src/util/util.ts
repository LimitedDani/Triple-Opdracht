export class Util {
      /**
     * @param { string } str
     * @return { boolean } true if the string is empty, false otherwise
     */
  static isStringEmpty(str: string): boolean {
    switch (str) {
      case "":
      case null:
      case "undefined":
      case undefined:
        return true;
      default:
        return false;
    }
  }
}