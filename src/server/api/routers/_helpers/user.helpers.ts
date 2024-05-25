import { v4 as uuidv4 } from 'uuid';

// Generate a random id
export function generateRandomId(): string {
  return uuidv4();
}
