// Give an array of objects and a key, return an array of unique keys from the array of objects
// Useful when on AutoComplete or Any searchable component to filter on all objects keys when you type
import { matchSorter } from "match-sorter";

const getAllObjectKeys = (arrayOfObjects: any):Array<string> => {
  console.log(arrayOfObjects);
  return Object.keys(arrayOfObjects[0]);
}

// Give an array of objects, and get return the array filtered by the value at the given key
const filterListByKeyValue = (arrayOfObjects: any, key: string, value: string):Array<any> => {
  return arrayOfObjects.filter((item: any) => item[key] === value);
}

const matchSearchFilter = (options: Array<any>, inputValue: string, filterKeys: Array<string>) =>
  matchSorter(options, inputValue, { keys: filterKeys });

export {
  getAllObjectKeys,
  filterListByKeyValue,
  matchSearchFilter
};