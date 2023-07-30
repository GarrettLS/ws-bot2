export default class Utils {
  static randomPercent(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  static randomArr(arr: unknown[]): unknown {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
