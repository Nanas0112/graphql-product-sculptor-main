
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      products {
        id
        name
      }
    }
  }
`;

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

const Categories = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  
  const [addCategory] = useMutation(ADD_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });
  
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });
  
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addCategory({
        variables: { name: categoryName.trim() },
      });
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      
      setCategoryName('');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateCategory({
        variables: {
          id: selectedCategory.id,
          name: categoryName.trim(),
        },
      });
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      setCategoryName('');
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory({
          variables: { id },
        });
        
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category. " + error.message,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) return <p className="text-center py-4">Loading categories...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Error loading categories: {error.message}</p>;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Enter a name for the new category.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.categories.map((category: any) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.products?.length} Products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.products && category.products.length > 0 ? (
                <div>
                  <p className="text-sm font-medium mb-2">Products in this category:</p>
                  <ul className="list-disc pl-5">
                    {category.products.slice(0, 5).map((product: any) => (
                      <li key={product.id} className="text-sm text-gray-600">{product.name}</li>
                    ))}
                    {category.products.length > 5 && (
                      <li className="text-sm text-gray-600">...and {category.products.length - 5} more</li>
                    )}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No products in this category</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleEditClick(category)}>Edit</Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteCategory(category.id)}
                disabled={category.products && category.products.length > 0}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
