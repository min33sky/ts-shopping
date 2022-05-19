/**
 * 배열을 객체로 리턴하는 함수
 * @param arr
 * @returns
 */
export function arrayToObj(arr: [string, any][]) {
  return arr.reduce<{ [key: string]: any }>((acc, [key, value]) => {
    acc[key] = key === 'price' ? parseInt(value) : value;
    return acc;
  }, {});
}
