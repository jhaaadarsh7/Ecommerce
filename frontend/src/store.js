import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; // Correct import of thunk
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productsReducer,
  productdetailsReducer,
  newReviewReducer,
  newProductReducer,
  productReducer,
  productReviewsReducer,
  reviewReducer,
} from "./reducers/productReducer";
import { userReducer, profileReducer,  allUsersReducer, userDetailsReducer, forgotPasswordReducer,} from "./reducers/userReducer"; // Import profileReducer
import { cartReducer } from "./reducers/cartReducer";
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, OrderReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productdetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotpassword:forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  product:productReducer,
  allOrders:allOrdersReducer,
  order:OrderReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,

});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
