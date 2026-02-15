import { API_ENDPOINT } from '@/config/api';
const API_BASE_URL = API_ENDPOINT;
console.log('--- API DEBUG INFO ---');
console.log('API_BASE_URL being used:', API_BASE_URL);
console.log('Environment NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('----------------------');

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgiwx2p7n';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'JSweet';
import { CATEGORY_ALL } from '@/constants';

const getPublicHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response: Response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChanged'));
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Erreur API');
    }
    return response.json();
};

export const api = {
    products: {
        getAll: (page: number = 1, limit: number = 8, filters?: any) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (filters) {
                if (filters.category && filters.category !== CATEGORY_ALL) params.append('category', filters.category);
                if (filters.brands && filters.brands.length > 0) {
                    filters.brands.forEach((b: string) => params.append('brand', b));
                }
                if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
                if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
                if (filters.inStock) params.append('inStock', 'true');
                if (filters.featured) params.append('featured', 'true');
                if (filters.sortBy) params.append('sortBy', filters.sortBy);
                if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
                if (filters.search) params.append('search', filters.search);
            }

            return fetch(`${API_BASE_URL}/products?${params.toString()}`, { headers: getPublicHeaders() }).then(handleResponse);
        },
        getById: (id: string | number) => fetch(`${API_BASE_URL}/products/${id}`, { headers: getPublicHeaders() }).then(handleResponse),
        getFeatured: () => fetch(`${API_BASE_URL}/products?featured=true`, { headers: getPublicHeaders() }).then(handleResponse), // Assuming backend supports filtering or we filter clientside
        create: (data: any) => fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(handleResponse),
        update: (id: string | number, data: any) => fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: string | number) => fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
        getMetadata: () => fetch(`${API_BASE_URL}/products/metadata`, { headers: getPublicHeaders() }).then(handleResponse),
    },
    categories: {
        getAll: () => fetch(`${API_BASE_URL}/categories`, { headers: getPublicHeaders() }).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: string | number) => fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
    },
    cart: {
        get: () => fetch(`${API_BASE_URL}/cart`, {
            headers: getAuthHeaders()
        }).then(handleResponse),
        add: (productId: string | number, quantity: number, customOptions?: any, comment?: string, customImage?: string, isAbsolute: boolean = false) =>
            fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ productId, quantity, customOptions, comment, customImage, isAbsolute })
            }).then(handleResponse),
        remove: (productId: string | number, customOptions?: any, customImage?: string) =>
            fetch(`${API_BASE_URL}/cart`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ productId, customOptions, customImage })
            }).then(handleResponse),
    },
    orders: {
        create: (orderData: any) =>
            fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData)
            }).then(handleResponse),
        getAll: () =>
            fetch(`${API_BASE_URL}/orders`, {
                method: 'GET',
                headers: getAuthHeaders()
            }).then(handleResponse),
        updateStatus: (orderId: string | number, status: string) =>
            fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            }).then(handleResponse),
        assignDriver: (orderId: string | number, driverId: string, estimatedDeliveryTime?: string) =>
            fetch(`${API_BASE_URL}/orders/${orderId}/assign-driver`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ driverId, estimatedDeliveryTime })
            }).then(handleResponse),
        updateItems: (orderId: string | number, items: any[]) =>
            fetch(`${API_BASE_URL}/orders/${orderId}/items`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ items })
            }).then(handleResponse),
    },
    users: {
        getProfile: (userId: string | number) =>
            fetch(`${API_BASE_URL}/users/${userId}`, {
                headers: getAuthHeaders()
            }).then(handleResponse),
        updateProfile: (userId: string | number, data: any) =>
            fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            }).then(handleResponse),
        getPreferences: (userId: string | number) =>
            fetch(`${API_BASE_URL}/users/${userId}/preferences`, {
                headers: getAuthHeaders()
            }).then(handleResponse),
        updatePreferences: (userId: string | number, preferences: any) =>
            fetch(`${API_BASE_URL}/users/${userId}/preferences`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(preferences)
            }).then(handleResponse),
        getDrivers: () =>
            fetch(`${API_BASE_URL}/users/role/drivers`, {
                headers: getAuthHeaders()
            }).then(handleResponse),
        getPendingDrivers: () =>
            fetch(`${API_BASE_URL}/users/pending-drivers`, {
                headers: getAuthHeaders()
            }).then(handleResponse),
        updateStatus: (userId: string, status: 'active' | 'rejected') =>
            fetch(`${API_BASE_URL}/users/${userId}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            }).then(handleResponse),
        getAll: () =>
            fetch(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders()
            }).then(handleResponse),
        delete: (userId: string | number) =>
            fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            }).then(handleResponse),
    },
    files: {
        upload: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erreur lors de l\'upload vers Cloudinary');
            }

            const data = await response.json();
            return { url: data.secure_url };
        }
    },
    stats: {
        getSummary: () => fetch(`${API_BASE_URL}/stats/summary`, {
            headers: getAuthHeaders()
        }).then(handleResponse),
    },
    ai: {
        generateCake: (config: any) =>
            fetch(`${API_BASE_URL}/ai/generate-cake`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(config)
            }).then(handleResponse),
    },
    testimonials: {
        getAll: () => fetch(`${API_BASE_URL}/testimonials`, { headers: getPublicHeaders() }).then(handleResponse),
        create: (data: any) => fetch(`${API_BASE_URL}/testimonials`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(handleResponse),
        delete: (id: string | number) => fetch(`${API_BASE_URL}/testimonials/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
    },
    promotions: {
        getActive: () => fetch(`${API_BASE_URL}/promotions/active`, { headers: getPublicHeaders() }).then(handleResponse),
        getLatest: () => fetch(`${API_BASE_URL}/promotions/latest`, { headers: getAuthHeaders() }).then(handleResponse),
        update: (data: any) => fetch(`${API_BASE_URL}/promotions/update`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(handleResponse),
    }
};
