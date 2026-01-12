import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

const initialState = {
    products: [],
    product: null,
    featuredProducts: [],
    categories: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0
};

// Get all products
export const getProducts = createAsyncThunk(
    'products/getAll',
    async (params, { rejectWithValue }) => {
        try {
            const data = await productService.getProducts(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Get single product
export const getProduct = createAsyncThunk(
    'products/getOne',
    async (id, { rejectWithValue }) => {
        try {
            const data = await productService.getProduct(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
    'products/getFeatured',
    async (_, { rejectWithValue }) => {
        try {
            const data = await productService.getFeaturedProducts();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
        }
    }
);

// Get categories
export const getCategories = createAsyncThunk(
    'products/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await productService.getCategories();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProduct: (state) => {
            state.product = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get products
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.data || [];
                state.totalPages = action.payload?.totalPages || 0;
                state.currentPage = action.payload?.currentPage || 1;
                state.total = action.payload?.total || 0;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get single product
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get featured products
            .addCase(getFeaturedProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFeaturedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.featuredProducts = action.payload.data;
            })
            .addCase(getFeaturedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get categories
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data;
            });
    }
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
