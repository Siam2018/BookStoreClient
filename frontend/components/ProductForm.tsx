import React, { useState } from 'react';

interface ProductFormProps {
  initialData?: {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    imageURL?: string;
    isActive?: boolean;
    author?: string;
    publisher?: string;
    isbn?: string;
    weight?: number;
  };
  onSubmit: (data: any) => void;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, submitLabel = 'Submit' }) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [price, setPrice] = useState(
    initialData && typeof initialData.price !== 'undefined' ? initialData.price : 0
  );
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [stock, setStock] = useState(
    typeof initialData?.stock === 'number' ? initialData.stock : 0
  );
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [imageURL, setImageURL] = useState(initialData?.imageURL ?? '');
  const [isActive, setIsActive] = useState(
    typeof initialData?.isActive === 'boolean' ? initialData.isActive : true
  );
  const [author, setAuthor] = useState(initialData?.author ?? '');
  const [publisher, setPublisher] = useState(initialData?.publisher ?? '');
  const [isbn, setIsbn] = useState(initialData?.isbn ?? '');
  const [weight, setWeight] = useState(
    typeof initialData?.weight === 'number' ? initialData.weight : 0
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
  if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!description) newErrors.description = 'Description is required';
    if (stock < 0) newErrors.stock = 'Stock must be 0 or greater';
    if (!category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      name,
      price,
      description,
      stock,
      category,
      imageURL,
      isActive,
      author,
      publisher,
      isbn,
      weight,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          className="border rounded w-full p-2 text-black"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          className="border rounded w-full p-2 text-black"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          className="border rounded w-full p-2 text-black"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Stock</label>
        <input
          type="number"
          className="border rounded w-full p-2 text-black"
          value={stock}
          onChange={e => setStock(Number(e.target.value))}
        />
        {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <input
          type="text"
          className="border rounded w-full p-2 text-black"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Image URL</label>
        <input
          type="text"
          className="border rounded w-full p-2 text-black"
          value={imageURL}
          onChange={e => setImageURL(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Is Active</label>
        <select
          className="border rounded w-full p-2 text-black"
          value={isActive ? "true" : "false"}
          onChange={e => setIsActive(e.target.value === "true")}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Author</label>
        <input
          type="text"
          className="border rounded w-full p-2 text-black"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Publisher</label>
        <input
          type="text"
          className="border rounded w-full p-2 text-black"
          value={publisher}
          onChange={e => setPublisher(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">ISBN</label>
        <input
          type="text"
          className="border rounded w-full p-2 text-black"
          value={isbn}
          onChange={e => setIsbn(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Weight</label>
        <input
          type="number"
          className="border rounded w-full p-2 text-black"
          value={weight}
          onChange={e => setWeight(Number(e.target.value))}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
