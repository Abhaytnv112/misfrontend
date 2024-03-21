import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      // console.log(data,'response')
      const { token,role } = data;

      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("role", role);
      }
      return { token, role };
    } catch (error) {
      throw error;
    }
  }
);
export const registerReducer = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, role }) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
    role: typeof window !== 'undefined' ? localStorage.getItem('role') || null : null,
    isAuth: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
    isLoading: false,
    error: null,
  },
  reducers: {
    handleRegister: (state, action) => {
      // Your registration logic here
    },
    handleLogin: (state, action) => {
      // Your login logic here
    },
    handleLogout: (state, action) => {
      state.isAuth = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("role");
      }
      toast.success("User logged out successfully", {
        position: "top-right",
      });
      state.role = null
      state.token = null;
      state.isAuth = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.role = action.payload.role;
        state.isAuth = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = "Login failed. Please try again.";
        }
      }).addCase(registerReducer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerReducer.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerReducer.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload.error;
        } else {
          state.error = "Registration failed. Please try again.";
        }
      });
      
  },
});

export const { handleRegister, handleLogin, handleLogout } = authSlice.actions;
export default authSlice.reducer;
