import { Resolver } from '../types/resolver';

const productResolver: Resolver = {
  Query: {
    products: (parent, args, context, info) => {
      return context.db.products;
    },
    product: (parent, { id }, { db }, info) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
};

export default productResolver;
