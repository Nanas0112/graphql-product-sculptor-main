
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import ProductCard from '@/components/product/ProductCard';
import AddProductDialog from '@/components/product/AddProductDialog';
import EditProductDialog from '@/components/product/EditProductDialog';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
      categoryId
      category {
        id
        name
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $price: Float!, $description: String, $categoryId: ID!) {
    addProduct(name: $name, price: $price, description: $description, categoryId: $categoryId) {
      id
      name
      price
      description
      categoryId
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $price: Float, $description: String, $categoryId: ID) {
    updateProduct(id: $id, name: $name, price: $price, description: $description, categoryId: $categoryId) {
      id
      name
      price
      description
      categoryId
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const Products = () => {
  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
  const { loading: categoriesLoading, data: categoriesData } = useQuery(GET_CATEGORIES);
  
  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });
  
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });
  
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoryId: value });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      categoryId: '',
    });
  };
  
  const handleAddProduct = async () => {
    try {
      await addProduct({
        variables: {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          categoryId: formData.categoryId,
        },
      });
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. " + error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      categoryId: product.categoryId,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProduct = async () => {
    try {
      await updateProduct({
        variables: {
          id: selectedProduct.id,
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          categoryId: formData.categoryId,
        },
      });
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. " + error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({
          variables: { id },
        });
        
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product. " + error.message,
          variant: "destructive",
        });
      }
    }
  };

  if (productsLoading) return <p className="text-center py-4">Loading products...</p>;
  if (productsError) return <p className="text-center py-4 text-red-500">Error loading products: {productsError.message}</p>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <AddProductDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          formData={formData}
          categories={categoriesData?.categories || []}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleAddProduct={handleAddProduct}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsData?.products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEditClick}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>

      <EditProductDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        categories={categoriesData?.categories || []}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
};

export default Products;
