import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS_STORAGE = {
  PROVINCES: "Provinces"
}

function useAsyncStorage<T>(key: string, initialValue: T | null = null) {
  const [storedValue, setStoredValue] = useState<T | null>(initialValue);

  useEffect(() => {
    const getData = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item != null) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error("Error reading AsyncStorage key:", key, error);
        setStoredValue(initialValue);
      }
    };

    getData();
  }, [key, initialValue]);

  const setValue = async (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to AsyncStorage key:", key, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useAsyncStorage;
