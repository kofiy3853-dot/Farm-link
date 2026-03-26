import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

export async function comparepassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
