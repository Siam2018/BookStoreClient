import React, { useState } from 'react';

interface ProductFormProps {
  initialData?: {
    name: string;
    price: number;
    description: string;
    imageURL?: string;
  };
  onSubmit: (data: any) => void;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, submitLabel = 'Submit' }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageURL, setImageURL] = useState(initialData?.imageURL || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!description) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ name, price, description, imageURL });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          className="border rounded w-full p-2"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          className="border rounded w-full p-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Image URL</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={imageURL}
          onChange={e => setImageURL(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
