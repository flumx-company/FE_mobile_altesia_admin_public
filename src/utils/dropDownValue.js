import { reactive } from "vue";

export function dropdownValue (sortBy, arr) {
  let [, ...sortedElement] = sortBy 
    ? sortBy.split(' ')
    : [];

  sortedElement = sortedElement.length > 1
    ? sortedElement.join(' ') 
    : sortedElement.join('')

  const selectedStatusObject = arr.find(item => item.value === sortedElement) 
  return reactive(selectedStatusObject
    ? selectedStatusObject
    : arr[0]
  );
   
}