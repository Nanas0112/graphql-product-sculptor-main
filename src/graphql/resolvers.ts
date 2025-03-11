
import { mockProducts, mockCategories } from './mockData';

// In-memory storage (mock database)
let products = [...mockProducts];
let categories = [...mockCategories];

// Helper to generate a new ID
const getNewId = (items) => {
  const maxId = Math.max(...items.map(item => parseInt(item.id, 10)), 0);
  return (maxId + 1).toString();
};

export const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => products.find(product => product.id === id),
    categories: () => categories,
    category: (_, { id }) => categories.find(category => category.id === id),
  },
  
  Product: {
    category: (product) => categories.find(category => category.id === product.categoryId),
  },
  
  Category: {
    products: (category) => products.filter(product => product.categoryId === category.id),
  },
  
  Mutation: {
    addProduct: (_, { name, price, description, categoryId }) => {
      const newProduct = {
        id: getNewId(products),
        name,
        price,
        description,
        categoryId,
      };
      products.push(newProduct);
      return newProduct;
    },
    
    updateProduct: (_, { id, name, price, description, categoryId }) => {
      const index = products.findIndex(product => product.id === id);
      if (index === -1) return null;
      
      const updatedProduct = {
        ...products[index],
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
      };
      
      products[index] = updatedProduct;
      return updatedProduct;
    },
    
    deleteProduct: (_, { id }) => {
      const initialLength = products.length;
      products = products.filter(product => product.id !== id);
      return initialLength > products.length ? id : null;
    },
    
    addCategory: (_, { name }) => {
      const newCategory = {
        id: getNewId(categories),
        name,
      };
      categories.push(newCategory);
      return newCategory;
    },
    
    updateCategory: (_, { id, name }) => {
      const index = categories.findIndex(category => category.id === id);
      if (index === -1) return null;
      
      categories[index] = {
        ...categories[index],
        name,
      };
      
      return categories[index];
    },
    
    deleteCategory: (_, { id }) => {
      // Check if any products use this category
      const hasProducts = products.some(product => product.categoryId === id);
      if (hasProducts) {
        throw new Error("Cannot delete category that has products");
      }
      
      const initialLength = categories.length;
      categories = categories.filter(category => category.id !== id);
      return initialLength > categories.length ? id : null;
    },
  },
};
