import { v4 } from 'uuid';

export const generateId = () => v4();

export const capitalizeWords = (str: string) =>
  str.replace(/\b\w/g, char => char.toUpperCase());
