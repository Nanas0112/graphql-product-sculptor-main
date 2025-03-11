
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFormProps {
  formData: {
    name: string;
    price: string;
    description: string;
    categoryId: string;
  };
  categories: Array<{ id: string; name: string }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string) => void;
  idPrefix?: string;
}

const ProductForm = ({ 
  formData, 
  categories, 
  handleInputChange, 
  handleSelectChange,
  idPrefix = '' 
}: ProductFormProps) => {
  const prefix = idPrefix ? `${idPrefix}-` : '';
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${prefix}name`} className="text-right">Name</Label>
        <Input
          id={`${prefix}name`}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${prefix}price`} className="text-right">Price</Label>
        <Input
          id={`${prefix}price`}
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${prefix}description`} className="text-right">Description</Label>
        <Textarea
          id={`${prefix}description`}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${prefix}category`} className="text-right">Category</Label>
        <Select onValueChange={handleSelectChange} value={formData.categoryId}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductForm;
