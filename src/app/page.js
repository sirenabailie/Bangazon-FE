"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; 

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5283/api/products") 
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="product-container">
      <h1>Welcome to E-Lit!</h1>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} productObj={product} /> 
          ))}
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}
