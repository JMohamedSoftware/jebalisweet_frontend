'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';
import { CATEGORY_ALL } from '@/constants';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  categoryName: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  alt: string;
  categoryName: string;
  brand: string;
  inStock: boolean;
  stockQuantity: string;
  isFeatured: boolean;
}

const AdminProductManagementInteractive = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isHydrated, setIsHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    alt: '',
    categoryName: '',
    brand: 'Jebali Sweet',
    inStock: true,
    stockQuantity: '0',
    isFeatured: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(CATEGORY_ALL);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        api.products.getAll(1, 1000), // Fetch all products for admin
        api.categories.getAll()
      ]);

      const productsArray = Array.isArray(productData) ? productData : (productData.products || []);
      const mappedProducts = productsArray.map((p: any) => ({
        id: p.id || p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        alt: p.alt || p.name,
        categoryName: p.categoryName || (p.category && p.category.name) || 'Divers',
        brand: p.brand || 'Jebali Sweet',
        inStock: p.inStock ?? (p.stockQuantity > 0),
        stockQuantity: p.stockQuantity || 0,
        isFeatured: p.isFeatured || false
      }));
      setProducts(mappedProducts);

      // Helper to normalize category names for comparison
      const normalize = (s: string) => s.toLowerCase().trim();

      // Get categories from API
      const apiCategories = Array.isArray(categoryData) ? categoryData.map((c: any) => c.name) : [];

      // Also include any categories currently used by products but not in API list (for backward compatibility)
      const usedCategories = Array.from(new Set(mappedProducts.map((p: any) => p.categoryName))) as string[];

      // Combine and deduplicate for FILTERING purposes
      const allFilterCategories = Array.from(new Set([...apiCategories, ...usedCategories]));

      setCategories(apiCategories); // Only official categories for the form
      setFilterOptions(allFilterCategories); // All categories for filtering

      if (!formData.categoryName && apiCategories.length > 0) {
        setFormData(prev => ({ ...prev, categoryName: apiCategories[0] }));
      }
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [router]);


  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        alt: product.alt,
        categoryName: product.categoryName,
        brand: product.brand,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity.toString(),
        isFeatured: product.isFeatured,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        alt: '',
        categoryName: categories[0] || '',
        brand: 'Jebali Sweet',
        inStock: true,
        stockQuantity: '0',
        isFeatured: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const response = await api.files.upload(file);
        setFormData(prev => ({ ...prev, image: response.url }));
      } catch (error) {
        console.error("Upload failed", error);
        alert("Erreur lors de l'upload de l'image. Veuillez réessayer.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      categoryName: formData.categoryName,
      brand: formData.brand,
      stockQuantity: parseInt(formData.stockQuantity),
      inStock: formData.inStock,
      isFeatured: formData.isFeatured
    };

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
      } else {
        await api.products.create(payload);
      }
      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Operation failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.confirmDelete') || 'Supprimer ?')) {
      try {
        await api.products.delete(id);
        await fetchProducts();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === CATEGORY_ALL || product.categoryName === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              {t('admin.productManagement.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('admin.productManagement.count', { count: products.length })}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
            >
              <Icon name="ArrowLeftIcon" size={20} />
              {t('common.return') || 'Retour'}
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium shadow-warm-md"
            >
              <Icon name="PlusIcon" size={20} />
              {t('admin.productManagement.addProduct')}
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder={t('admin.productManagement.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
            >
              <option value={CATEGORY_ALL}>{t('admin.productManagement.allCategories')}</option>
              {filterOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg shadow-warm-md overflow-hidden border border-border hover:shadow-warm-lg transition-smooth"
            >
              <div className="relative h-48">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full caption font-semibold ${product.inStock
                      ? 'bg-success text-success-foreground'
                      : 'bg-error text-error-foreground'
                      }`}
                  >
                    {product.inStock ? t('admin.productManagement.inStock') : t('admin.productManagement.outOfStock')}
                  </span>
                  {product.isFeatured && (
                    <span className="px-3 py-1 rounded-full caption font-semibold bg-accent text-accent-foreground">
                      {t('home.featured.title')}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="caption text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="caption text-muted-foreground">
                    {t('admin.productManagement.stock')}: {product.stockQuantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium"
                  >
                    <Icon name="PencilIcon" size={16} />
                    {t('admin.productManagement.modifier')}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-error text-error-foreground rounded-lg hover:opacity-90 transition-smooth font-medium"
                  >
                    <Icon name="TrashIcon" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Icon name="CubeIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t('admin.productManagement.noResults')}</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-lg shadow-warm-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                {editingProduct ? t('admin.productManagement.modal.editTitle') : t('admin.productManagement.modal.addTitle')}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="XMarkIcon" size={24} className="text-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block caption font-medium text-foreground">
                  {t('admin.productManagement.modal.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <label className="block caption font-medium text-foreground">
                  {t('admin.productManagement.modal.description')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block caption font-medium text-foreground">
                    {t('admin.productManagement.modal.price')}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block caption font-medium text-foreground">
                    {t('admin.productManagement.modal.stockQuantity')}
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block caption font-medium text-foreground">
                    {t('admin.productManagement.modal.category')}
                  </label>
                  <select
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                  >
                    {categories.length > 0 ? categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )) : (
                      <option value="">No categories available</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block caption font-medium text-foreground">
                    {t('admin.productManagement.modal.brand')}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block caption font-medium text-foreground">
                  {t('admin.productManagement.modal.imagePreview')}
                </label>
                <div className="relative h-48 w-full bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="caption text-primary font-medium">Upload en cours...</p>
                    </div>
                  ) : formData.image ? (
                    <>
                      <AppImage
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 p-2 bg-error text-error-foreground rounded-full shadow-lg hover:opacity-90 transition-smooth"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Icon name="PhotoIcon" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{t('admin.productManagement.modal.noImage')}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block caption font-medium text-foreground">
                    {t('admin.productManagement.modal.imageUrl')}
                  </label>
                  <div className="relative">
                    <Icon
                      name="LinkIcon"
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="url"
                      placeholder="https://exemple.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block caption font-medium text-foreground">
                    {t('admin.productManagement.modal.upload')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inStockForm"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-input text-primary focus:ring-3 focus:ring-ring"
                />
                <label htmlFor="inStockForm" className="caption font-medium text-foreground">
                  {t('admin.productManagement.modal.inStockCheck')}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeaturedForm"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-input text-primary focus:ring-3 focus:ring-ring"
                />
                <label htmlFor="isFeaturedForm" className="caption font-medium text-foreground">
                  {t('admin.productManagement.modal.isFeaturedCheck')}
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium shadow-warm-md"
                >
                  {editingProduct ? t('admin.productManagement.modal.submitEdit') : t('admin.productManagement.modal.submitAdd')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
                >
                  {t('admin.productManagement.modal.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagementInteractive;