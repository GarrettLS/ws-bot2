import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export default class Utils {
  static randomPercent(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  static randomArr(arr: unknown[]): unknown {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static encrypt(input: string): string {
    const cipher = createCipheriv(
      'aes-128-ecb',
      createHash('md5').update(String(process.env.ENCRYPT_KEY)).digest(),
      null
    );

    return Buffer.concat([cipher.update(input), cipher.final()]).toString('base64');
  }
  
  static decrypt(cipher: string): string {
    const decipher = createDecipheriv(
      'aes-128-ecb',
      createHash('md5').update(String(process.env.ENCRYPT_KEY)).digest(),
      null
    );
  
    return Buffer.concat([decipher.update(Buffer.from(cipher, 'base64')), decipher.final()]).toString('utf8');
  }
}
