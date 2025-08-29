"use client";

/**
 * Converts a File object to a data URL string
 * @param file The File object to convert
 * @returns A Promise that resolves to the data URL string
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Gets the base64 part of a data URL
 * @param dataUrl The data URL
 * @returns The base64 string without the data URL prefix
 */
export const getBase64FromDataUrl = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

/**
 * Estimates the size of a base64 string in bytes
 * @param base64 The base64 string
 * @returns The estimated size in bytes
 */
export const estimateBase64Size = (base64: string): number => {
  return (base64.length * 3) / 4;
};
