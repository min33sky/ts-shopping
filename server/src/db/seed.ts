import { DBField, writeDB } from './../DBController';
import { v4 as uuid } from 'uuid';

try {
  const db = Array.from({ length: 100 }).map((_, idx) => ({
    id: uuid(),
    title: `임시상품 ${idx}`,
    description: `임시상세내용 ${idx}`,
    imageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * idx * 3)}/200/200`,
    price: Math.floor(Math.random() * 90001) + 1000,
    createdAt: new Date().setMonth(0) + 1000 * 60 * 60 * 5 * idx,
  }));

  writeDB(DBField.PRODUCTS, db);
  console.log('DB Initialized');
} catch (error) {
  console.log('DB ERROR :<');
}
