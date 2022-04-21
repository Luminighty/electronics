import { promisify } from "util";
import crypto from 'crypto';

export async function hashPassword(password: string) {
    const hash  = await promisify(crypto.pbkdf2)(password, process.env.PASSWORD_SALT, 10000, 64, 'sha512');
    return hash.toString('hex');
}