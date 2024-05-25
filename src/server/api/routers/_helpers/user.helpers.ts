import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Generate a random id
export function generateId(): string {
  return uuidv4();
}

// Generate salt and hash for secure passwords
export async function generateSaltHash(
  password: string,
): Promise<{ hashedPassword: string; salt: string }> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const salt = await bcrypt.genSalt(10);
  return { hashedPassword, salt };
}
