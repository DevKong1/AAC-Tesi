import * as FileSystem from "expo-file-system";

/**
 * Saves given date to given path
 *
 * @param file - Path to the file
 * @param data - Data to save
 */
export const saveToJSON = async (file: string, data: any) => {
  return await FileSystem.writeAsStringAsync(file, JSON.stringify(data));
};

/**
 * Checks if a JSON file exists, if not creates it with given data, otherwise reads it and returns Parsed data
 *
 * @param file - Path to the file
 * @param data - Data to save if the file doesnt exist
 * @returns - undefined if the file didnt exist, Parsed JSON data otherwise
 */
export const getJSONOrCreate = async (file: string, data: any) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(file);
    if (!fileInfo.exists) {
      console.log(`${file}: File doesnt exist, creating...`);
      await saveToJSON(file, data);
    } else {
      const result = await FileSystem.readAsStringAsync(file);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(result);
    }
  } catch (e) {
    console.log("Storage: ERROR");
    return undefined;
  }
};
