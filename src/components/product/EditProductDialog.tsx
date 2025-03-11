
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from './ProductForm';

interface EditProductDialogProps {
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
  handleUpdateProduct: () => void;
}

const EditProductDialog = ({
  isOpen,
  onOpenChange,
  formData,
  categories,
  handleInputChange,
  handleSelectChange,
  handleUpdateProduct
}: EditProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          formData={formData}
          categories={categories}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          idPrefix="edit"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdateProduct}>Update Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
