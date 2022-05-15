import fs from 'fs';
import path from 'path';

export enum DBField {
  CART = 'cart',
  PRODUCTS = 'products',
}

//! ES6에서는 __dirname을 사용할 수 없다. path.resolve()로 대체
const basePath = path.resolve();

const filenames = {
  [DBField.CART]: path.resolve(basePath, 'src/db/cart.json'),
  [DBField.PRODUCTS]: path.resolve(basePath, 'src/db/product.json'),
};

export const readDB = (target: DBField) => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'));
  } catch (error) {
    console.error(error);
  }
};

export const writeDB = (target: DBField, data: any) => {
  try {
    fs.writeFileSync(filenames[target], JSON.stringify(data, null, '  '));
  } catch (error) {
    console.error(error);
  }
};
