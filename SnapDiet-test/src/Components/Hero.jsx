import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./Hero.css";
import { uploadImage } from "../api.js";

const Hero = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          // Send image to FastAPI for classification
          const response = await uploadImage(file);

          if (response) {
            const imageData = {
              src: e.target.result, // Base64 Image preview
              name: file.name,
              classification: response.food_item, // Actual classification from API
              confidence: `${(response.confidence * 100).toFixed(2)}%`, // Confidence percentage
            };

            navigate("/result", { state: imageData }); // Navigate with result
          } else {
            alert("Error processing image. Please try again.");
          }
        } catch (error) {
          alert("Something went wrong! Try again.");
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-background" />
      <div className="hero-overlay" />
      <h1 className="hero-heading">Know Your Food</h1>

      <label htmlFor="file-input" className="upload-icon">
        {loading ? (
          <div className="loading-spinner"></div> // Spinner animation
        ) : (
          <FaCamera className="camera-icon" />
        )}
        <input
          id="file-input"
          type="file"
          accept="image/*"
          capture="camera"
          onChange={handleImageUpload}
          className="image-input"
          disabled={loading} // Disable button when loading
        />
      </label>
    </div>
  );
};

export default Hero;
