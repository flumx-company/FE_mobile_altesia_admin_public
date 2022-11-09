export function updateDefSortOrGet (headers, orderedBy) {
  if(!orderedBy) {
    return headers;
  }
  const sortField = orderedBy.split(' ')[0];
  const sortType = orderedBy.split(' ')[1];
  
  const newHeaders = headers.map(item => {
    if (item.value === sortField) {
     item.defaultSort = sortType
    } 
    return item;
  })
  
  return newHeaders;
}