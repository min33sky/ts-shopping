import { Product } from '../../graphql/products';

function CartItemData({
  imageUrl,
  price,
  title,
  createdAt,
}: Pick<Product, 'imageUrl' | 'price' | 'title' | 'createdAt'>) {
  return (
    <div className="cart-item-data">
      <img className="cart-item-data__image" src={imageUrl} alt="productImage" />
      {!createdAt && (
        <>
          <p>품절!</p>
        </>
      )}
      {createdAt && (
        <>
          <p className="cart-item-data__title">{title}</p>
          <p className="cart-item-data__price">${price}</p>
        </>
      )}
    </div>
  );
}

export default CartItemData;
