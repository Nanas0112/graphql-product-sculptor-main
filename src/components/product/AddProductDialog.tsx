
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProductForm from './ProductForm';

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    price: string;
    description: string;
    categoryId: string;
  };
  categories: Array<{ id: string; name: string }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string) => void;
  handleAddProduct: () => void;
}

const AddProductDialog = ({
  isOpen,
  onOpenChange,
  formData,
  categories,
  handleInputChange,
  handleSelectChange,
  handleAddProduct
}: AddProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          formData={formData}
          categories={categories}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
