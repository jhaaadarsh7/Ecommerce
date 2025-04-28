// import React, { useEffect } from "react";
// import "./App.css";
// import Header from "./component/layout/Header/Header.js";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import WebFont from "webfontloader";
// import Footer from "./component/layout/Footer/Footer.js";
// import Home from "./component/Home/Home.js";
// import ProductDetails from "./component/Product/ProductDetails.js";
// import Products from "./component/Product/Products.js";
// import Search from "./component/Product/Search.js";
// import LoginSignUp from "./component/User/LoginSignUp.js";
// import { loaduser } from "./actions/userAction.js";
// import store from "./store";
// import UserOptions from "./component/layout/Header/UserOptions.js";
// import { useSelector } from "react-redux";
// import Profile from "./component/User/Profile.js";
// import ProtectedRoute from "./component/Route/ProtectedRoute.js";
// import UpdateProfile from "./component/User/UpdatedProfile.js";
// import UpdatePassword from "./component/User/UpdatePassword.js";
// import Cart from "./component/cart/Cart.js";
// import Shipping from "./component/cart/Shipping.js";
// import ConfirmOrder from "./component/cart/confirmOrder.js";
// import OrderSucess from "./component/cart/OrderSucess.js";
// import MyOrders from "./component/Order/MyOrders.js";
// import OrderDetails from "./component/Order/OrderDetails.js";
// import Dashboard from "./component/admin/Dashboard.js";
// import ProductList from "./component/admin/ProductList.js";
// import NewProduct from "./component/admin/NewProduct.js";
// import UpdateProduct from "./component/admin/UpdateProduct.js";
// import OrderList from "./component/admin/orderList.js";
// import ProcessOrder from "./component/admin/ProcessOrder.js";
// import UsersList from "./component/admin/UsersList.js";
// import UpdateUser from "./component/admin/UpdateUser.js";
// import ProductReviews from "./component/admin/ProductReviews.js";
// import ForgotPassword from "./component/User/ForgotPassword.js";
// import ResetPassword from "./component/User/ResetPassword";



// function App() {
//   const { isAuthenticated, user } = useSelector((state) => state.user);

//   useEffect(() => {
//     WebFont.load({
//       google: {
//         families: ["Roboto", "Droid Sans", "Chilanka"],
//       },
//     });

//     store.dispatch(loaduser());
//   }, []);

//   return (
//     <Router>
//       <Header />
//       {isAuthenticated && <UserOptions user={user} />}

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:keyword" element={<Products />} />
//         <Route path="/search" element={<Search />} />
//         <Route path="/login" element={<LoginSignUp />} />
//         <Route path="/password/forgot" element={<ForgotPassword />} />
//         <Route path="/password/reset/:token" element={<ResetPassword />} />

//         {/* Protected User Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/account" element={<Profile />} />
//           <Route path="/me/update" element={<UpdateProfile />} />
//           <Route path="/password/update" element={<UpdatePassword />} />
//           <Route path="/shipping" element={<Shipping />} />
//           <Route path="/success" element={<OrderSucess />} />
//           <Route path="/orders" element={<MyOrders />} />
//           <Route path="/order/confirm" element={<ConfirmOrder />} />
//           <Route path="/order/:id" element={<OrderDetails />} />
//           <Route path="/cart" element={<Cart />} />
//         </Route>

//         {/* Protected Admin Routes */}
//         <Route element={<ProtectedRoute isAdmin={true} />}>
//           <Route path="/admin/dashboard" element={<Dashboard />} />
//           <Route path="/admin/products" element={<ProductList />} />
//           <Route path="/admin/product" element={<NewProduct />} />
//           <Route path="/admin/product/:id" element={<UpdateProduct />} />
//           <Route path="/admin/orders" element={<OrderList />} />
//           <Route path="/admin/order/:id" element={<ProcessOrder />} />
//           <Route path="/admin/users" element={<UsersList />} />
//           <Route path="/admin/user/:id" element={<UpdateUser />} />
//           <Route path="/admin/reviews" element={<ProductReviews />} />
//         </Route>
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// import React, { useEffect } from "react";
// import "./App.css";
// import Header from "./component/layout/Header/Header.js";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import WebFont from "webfontloader";
// import Footer from "./component/layout/Footer/Footer.js";
// import Home from "./component/Home/Home.js";
// import ProductDetails from "./component/Product/ProductDetails.js";
// import Products from "./component/Product/Products.js";
// import Search from "./component/Product/Search.js";
// import LoginSignUp from "./component/User/LoginSignUp.js";
// import { loaduser } from "./actions/userAction.js";
// import store from "./store";
// import UserOptions from "./component/layout/Header/UserOptions.js";
// import { useSelector } from "react-redux";
// import Profile from "./component/User/Profile.js";
// import ProtectedRoute from "./component/Route/ProtectedRoute.js";
// import UpdateProfile from "./component/User/UpdatedProfile.js";
// import UpdatePassword from "./component/User/UpdatePassword.js";
// import Cart from "./component/cart/Cart.js";
// import Shipping from "./component/cart/Shipping.js";
// import ConfirmOrder from "./component/cart/confirmOrder.js";
// import OrderSucess from "./component/cart/OrderSucess.js";
// import MyOrders from "./component/Order/MyOrders.js";
// import OrderDetails from "./component/Order/OrderDetails.js";
// import Dashboard from "./component/admin/Dashboard.js";
// import ProductList from "./component/admin/ProductList.js";
// import NewProduct from "./component/admin/NewProduct.js";
// import UpdateProduct from "./component/admin/UpdateProduct.js";
// import OrderList from "./component/admin/orderList.js";
// import ProcessOrder from "./component/admin/ProcessOrder.js";
// import UsersList from "./component/admin/UsersList.js";
// import UpdateUser from "./component/admin/UpdateUser.js";
// import ProductReviews from "./component/admin/ProductReviews.js";
// import ForgotPassword from "./component/User/ForgotPassword.js";
// import ResetPassword from "./component/User/ResetPassword";

// function App() {
//   const { isAuthenticated, user } = useSelector((state) => state.user);

//   // Check for user session on page reload
//   useEffect(() => {
//     WebFont.load({
//       google: {
//         families: ["Roboto", "Droid Sans", "Chilanka"],
//       },
//     });

//     // Check localStorage for authentication token
//     const token = localStorage.getItem("authToken"); // or sessionStorage.getItem("authToken")
//     if (token && !isAuthenticated) {
//       store.dispatch(loaduser()); // Dispatch loaduser action to re-authenticate the user
//     }

//     // Avoid loading user info on the login page
//     if (!isAuthenticated && window.location.pathname !== "/login") {
//       store.dispatch(loaduser());
//     }
//   }, [isAuthenticated]);

//   return (
//     <Router>
//       <Header />
//       {isAuthenticated && <UserOptions user={user} />}

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:keyword" element={<Products />} />
//         <Route path="/search" element={<Search />} />
//         <Route path="/login" element={<LoginSignUp />} />
//         <Route path="/password/forgot" element={<ForgotPassword />} />
//         <Route path="/password/reset/:token" element={<ResetPassword />} />

//         {/* Protected User Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/account" element={<Profile />} />
//           <Route path="/me/update" element={<UpdateProfile />} />
//           <Route path="/password/update" element={<UpdatePassword />} />
//           <Route path="/shipping" element={<Shipping />} />
//           <Route path="/success" element={<OrderSucess />} />
//           <Route path="/orders" element={<MyOrders />} />
//           <Route path="/order/confirm" element={<ConfirmOrder />} />
//           <Route path="/order/:id" element={<OrderDetails />} />
//           <Route path="/cart" element={<Cart />} />
//         </Route>

//         {/* Protected Admin Routes */}
//         <Route element={<ProtectedRoute isAdmin={true} />}>
//           <Route path="/admin/dashboard" element={<Dashboard />} />
//           <Route path="/admin/products" element={<ProductList />} />
//           <Route path="/admin/product" element={<NewProduct />} />
//           <Route path="/admin/product/:id" element={<UpdateProduct />} />
//           <Route path="/admin/orders" element={<OrderList />} />
//           <Route path="/admin/order/:id" element={<ProcessOrder />} />
//           <Route path="/admin/users" element={<UsersList />} />
//           <Route path="/admin/user/:id" element={<UpdateUser />} />
//           <Route path="/admin/reviews" element={<ProductReviews />} />
//         </Route>
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import { loaduser } from "./actions/userAction.js";
import store from "./store";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import UpdateProfile from "./component/User/UpdatedProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import Cart from "./component/cart/Cart.js";
import Shipping from "./component/cart/Shipping.js";
import ConfirmOrder from "./component/cart/confirmOrder.js";
import OrderSucess from "./component/cart/OrderSucess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/admin/Dashboard.js";
import ProductList from "./component/admin/ProductList.js";
import NewProduct from "./component/admin/NewProduct.js";
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/orderList.js";
import ProcessOrder from "./component/admin/ProcessOrder.js";
import UsersList from "./component/admin/UsersList.js";
import UpdateUser from "./component/admin/UpdateUser.js";
import ProductReviews from "./component/admin/ProductReviews.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword";

// Wrapper component to handle auth-related navigation
const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.user);
  
  useEffect(() => {
    // If there's an authentication error, clear token and redirect to login
    if (error === "Token is expired" || error === "Invalid Token" || error === "jwt expired") {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  return children;
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token && !isAuthenticated) {
          await store.dispatch(loaduser());
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <Router>
      <AuthWrapper>
        <div>
          <Header />
          {isAuthenticated && <UserOptions user={user} />}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<LoginSignUp />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Profile />} />
              <Route path="/me/update" element={<UpdateProfile />} />
              <Route path="/password/update" element={<UpdatePassword />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/success" element={<OrderSucess />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/order/confirm" element={<ConfirmOrder />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute isAdmin={true} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/product" element={<NewProduct />} />
              <Route path="/admin/product/:id" element={<UpdateProduct />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/order/:id" element={<ProcessOrder />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/user/:id" element={<UpdateUser />} />
              <Route path="/admin/reviews" element={<ProductReviews />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </AuthWrapper>
    </Router>
  );
}

export default App;