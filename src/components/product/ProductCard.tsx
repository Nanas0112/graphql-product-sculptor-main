
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    category?: {
      id: string;
      name: string;
    };
  };
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">{product.description}</p>
        <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {product.category?.name || 'No Category'}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(product)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(product.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
