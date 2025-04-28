


import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  clearErrors, 
  updateProduct, 
  getProductDetails 
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Sidebar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { id: productId } = useParams();

  const { error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop", "Footwear", "Bottom", "Tops", 
    "Attire", "Camera", "SmartPhones"
  ];

  useEffect(() => {
    // Fetch product details if not loaded
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else if (product) {
      // Populate form with existing product data
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setCategory(product.category || "");
      setStock(product.stock || 0);
      setOldImages(product.images || []);
    }

    // Handle errors
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
  
    // Handle successful update
    if (isUpdated) {
      alert.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });

      // Reset form
      resetForm();
    }
  }, [dispatch, alert, error, navigate, isUpdated, productId, product, updateError]);

  // Reset form method
  const resetForm = () => {
    setName("");
    setPrice(0);
    setDescription("");
    setCategory("");
    setStock(0);
    setImages([]);
    setOldImages([]);
    setImagesPreview([]);
  };

  // Image change handler
  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Reset previous selections
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(old => [...old, reader.result]);
          setImages(old => [...old, file]);
        }
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Form submission handler
  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!name || !price || !description || !category || !stock) {
      alert.error("Please fill all the fields");
      return;
    }
  
    // Create form data
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
  
    // Append new images
    images.forEach((image) => {
      myForm.append("images", image);
    });
  
    // Dispatch update action
    dispatch(updateProduct(productId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Update Product" />
      <div className="dashboard">
        <Sidebar/>
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>

            {/* Form fields */}
            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Price input */}
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>

            {/* Description textarea */}
            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            {/* Category selection */}
            <div>
              <AccountTreeIcon />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock input */}
            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
                value={stock}
              />
            </div>

            {/* Image upload */}
            <div id="createProductFormFile">
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            {/* Old images preview */}
            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>

            {/* New images preview */}
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            {/* Submit button */}
            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;