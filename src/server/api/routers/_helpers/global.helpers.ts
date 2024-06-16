import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
