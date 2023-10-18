export class Util {
  /**
   * Generate a random string of characters.
   * @param characters The number of characters to generate.
   * @returns A string of random characters.
   */
  static generateId(characters: number): string {
    const CHARS =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let autoId = '';

    for (let i = 0; i < characters; i++) {
      autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
  }
}
