import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/discounts";

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

export const fetchDiscountSummary = createAsyncThunk(
  "personnelDiscount/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/summary`, authConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur serveur" },
      );
    }
  },
);

export const fetchDiscountProducts = createAsyncThunk(
  "personnelDiscount/fetchProducts",
  async ({ search = "", onlyDiscounted = false } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (onlyDiscounted) query.append("onlyDiscounted", "true");

      const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ""}`;
      const response = await axios.get(url, authConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur serveur" },
      );
    }
  },
);

export const applyProductDiscount = createAsyncThunk(
  "personnelDiscount/applyProductDiscount",
  async ({ productId, percentage }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/products/${productId}/apply`,
        { percentage },
        authConfig(),
      );

      await Promise.all([
        dispatch(fetchDiscountSummary()),
        dispatch(fetchDiscountProducts()),
      ]);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur serveur" },
      );
    }
  },
);

export const clearProductDiscount = createAsyncThunk(
  "personnelDiscount/clearProductDiscount",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/products/${productId}/clear`,
        {},
        authConfig(),
      );

      await Promise.all([
        dispatch(fetchDiscountSummary()),
        dispatch(fetchDiscountProducts()),
      ]);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur serveur" },
      );
    }
  },
);

export const applyBulkDiscount = createAsyncThunk(
  "personnelDiscount/applyBulkDiscount",
  async ({ field, value, percentage }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/bulk`,
        { field, value, percentage },
        authConfig(),
      );

      await Promise.all([
        dispatch(fetchDiscountSummary()),
        dispatch(fetchDiscountProducts()),
      ]);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Erreur serveur" },
      );
    }
  },
);

const personnelDiscountSlice = createSlice({
  name: "personnelDiscount",
  initialState: {
    summary: {
      totalProducts: 0,
      totalDiscountedProducts: 0,
      discountCoverage: 0,
      estimatedRevenue: 0,
      estimatedSavings: 0,
      byCategory: [],
    },
    products: [],
    loadingSummary: false,
    loadingProducts: false,
    loadingAction: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchDiscountSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchDiscountSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = action.payload?.message || "Erreur de chargement";
      })
      .addCase(fetchDiscountProducts.pending, (state) => {
        state.loadingProducts = true;
        state.error = null;
      })
      .addCase(fetchDiscountProducts.fulfilled, (state, action) => {
        state.loadingProducts = false;
        state.products = action.payload;
      })
      .addCase(fetchDiscountProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.error = action.payload?.message || "Erreur de chargement";
      })
      .addCase(applyProductDiscount.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(applyProductDiscount.fulfilled, (state) => {
        state.loadingAction = false;
      })
      .addCase(applyProductDiscount.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload?.message || "Erreur de mise a jour";
      })
      .addCase(clearProductDiscount.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(clearProductDiscount.fulfilled, (state) => {
        state.loadingAction = false;
      })
      .addCase(clearProductDiscount.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload?.message || "Erreur de mise a jour";
      })
      .addCase(applyBulkDiscount.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(applyBulkDiscount.fulfilled, (state) => {
        state.loadingAction = false;
      })
      .addCase(applyBulkDiscount.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload?.message || "Erreur de mise a jour";
      });
  },
});

export default personnelDiscountSlice.reducer;
