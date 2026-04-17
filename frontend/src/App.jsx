import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
import FeaturesPage from "./pages/FeaturesPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import PersonnelLayout from "./components/Personnel/PersonnelLayout";
import PersonnelDiscountPage from "./pages/PersonnelDiscountPage";
import { Provider } from "react-redux";

import store from "./redux/store";
import ProtectedRoutes from "./components/ProtectedRoutes";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />

            <Route path="collection/:collection" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="my-favorites" element={<MyFavoritesPage />} />
            <Route path="nous-contacter" element={<ContactPage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="fonctionnalites" element={<FeaturesPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoutes role="admin">
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/new" element={<EditProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>

          <Route
            path="/personnel"
            element={
              <ProtectedRoutes roles={["personnel", "admin"]}>
                <PersonnelLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<PersonnelDiscountPage />} />
            <Route path="discounts" element={<PersonnelDiscountPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
