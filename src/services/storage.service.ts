import { storageSecret } from "@/constants";
import { EncryptStorage } from "encrypt-storage";

export const storage = new EncryptStorage(storageSecret);
export const tempStorage = new EncryptStorage(storageSecret, {storageType: "sessionStorage"});
export function setItem<T>(key: string, value: T) {
  storage.setItem(key, value);
}
export function getItem<T>(key: string): T | undefined {
  return storage.getItem(key) as T | undefined;
}
export const clear = () => {
  storage.clear();
  sessionStorage.clear();
};
export const removeItem = (key: string) => {
  storage.removeItem(key);
};
export function encryptData<T>(value: T) {
  return storage.encryptValue(value);
}
export function decryptData<T>(value: string): T | null {
  if (value) return storage.decryptValue(value);
  else return null;
}
