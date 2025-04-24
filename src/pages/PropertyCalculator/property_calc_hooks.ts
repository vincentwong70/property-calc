import { useCallback, useEffect, useState } from "react";
import { Property } from "../../configs/properties";

const user_properties_key = "USER_PROPERTIES";

export const useStoreProperties = () => {
  const [userProperties, setUserProperties] = useState<Property[]>([]);

  useEffect(() => {
    const properties = getFromLocalStorage<Property[]>(user_properties_key);
    if (Array.isArray(properties)) {
      setUserProperties(properties);
    }
  }, []);

  const saveProperties = useCallback(() => {
    setLocalStorage<Property[]>(user_properties_key, userProperties);
  }, [userProperties]);

  return {
    userProperties,
    setUserProperties,
    saveProperties,
  };
};

const setLocalStorage = <T>(key: string, data: T) => {
  try {
    const jsonValue = JSON.stringify(data); // Convert to JSON string
    localStorage.setItem(key, jsonValue); // Store in localStorage
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const jsonValue = localStorage.getItem(key); // Get the JSON string
    return jsonValue !== null ? JSON.parse(jsonValue) : null; // Convert to object
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};
