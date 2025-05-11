import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";
import videoLinks from "../data/videoLinks";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageData = location.state;
  const [classificationResult, setClassificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [recipeError, setRecipeError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  useEffect(() => {
    if (!imageData) return;

    fetch("http://127.0.0.1:8000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_name: imageData.name }),
    })
      .then((response) => response.json())
      .then((data) => {
        setClassificationResult(data);
        setLoading(false);

        // Format food name to match videoLinks keys
        const foodKey = data.food_name.toLowerCase().replace(/ /g, "_");
        setVideoUrl(videoLinks[foodKey] || null);
      })
      .catch(() => {
        setError("Failed to fetch classification data.");
        setLoading(false);
      });
  }, [imageData]);

  const fetchRecipe = async () => {
    if (!classificationResult?.food_name) return;

    setRecipe(null);
    setRecipeError(null);

    try {
      const query = classificationResult.food_name.replace(/_/g, " ");
      const searchRes = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=1&apiKey=7f2a20ce9ecf490e8ea5b9c3ea7f0dc3`
      );
      const searchData = await searchRes.json();

      if (searchData.results?.length > 0) {
        const recipeId = searchData.results[0].id;
        const recipeRes = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=7f2a20ce9ecf490e8ea5b9c3ea7f0dc3`
        );
        const recipeData = await recipeRes.json();
        setRecipe(recipeData);
      } else {
        setRecipeError("No recipe found.");
      }
    } catch (err) {
      setRecipeError("Failed to fetch recipe.");
    }
  };

  if (!imageData) {
    return (
      <div className="result-container">
        <h2 className="error-message">No Image Uploaded</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h1>Image Classification Result</h1>

      <div className="result-content">
        <div className="image-box">
          <img
            src={imageData.src}
            alt="Uploaded Preview"
            className="preview-img"
          />
        </div>

        <div className="result-data">
          {loading ? (
            <p>Loading classification result...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : classificationResult ? (
            <>
              <div className="nutrition-box">
                <p className="H">
                  <strong>Food Name:</strong> {classificationResult.food_name}
                </p>
                <p className="H">
                  <strong>Confidence:</strong>{" "}
                  {classificationResult.confidence.toFixed(2)}%
                </p>

                {/* Show Nutrition if no recipe/video is selected */}
                {!showRecipe && !showVideo && (
                  <>
                    <h3>Nutritional Information:</h3>
                    <p>
                      <strong>Calories:</strong>{" "}
                      {classificationResult.nutritional_value.Calories} kcal
                    </p>
                    <p>
                      <strong>Protein:</strong>{" "}
                      {classificationResult.nutritional_value.Protein} g
                    </p>
                    <p>
                      <strong>Carbs:</strong>{" "}
                      {classificationResult.nutritional_value.Carbs} g
                    </p>
                    <p>
                      <strong>Fat:</strong>{" "}
                      {classificationResult.nutritional_value.Fat} g
                    </p>
                  </>
                )}

                {/* Toggle Buttons */}
                <div
                  className="recipe-toggle-buttons"
                  style={{ marginTop: "15px" }}
                >
                  <button
                    onClick={() => {
                      fetchRecipe();
                      setShowRecipe(true);
                      setShowVideo(false);
                    }}
                    className="toggle-btn"
                  >
                    Text Recipe
                  </button>

                  <button
                    onClick={() => {
                      setShowVideo(true);
                      setShowRecipe(false);
                    }}
                    className="toggle-btn"
                    style={{ marginLeft: "10px" }}
                  >
                    Video Recipe
                  </button>
                </div>

                {/* Text Recipe */}
                {showRecipe && (
                  <div className="text-recipe-box">
                    {recipeError ? (
                      <p className="error-message">{recipeError}</p>
                    ) : recipe ? (
                      <>
                        <h3>Recipe Details:</h3>
                        <p>
                          <strong>{recipe.title}</strong>
                        </p>
                        <p
                          dangerouslySetInnerHTML={{ __html: recipe.summary }}
                          style={{ lineHeight: "1.6" }}
                        />
                      </>
                    ) : (
                      <p>Loading recipe...</p>
                    )}
                  </div>
                )}

                {showVideo && videoUrl && (
                  <div className="youtube-video-box">
                    <h3>{videoUrl.title}</h3>
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoUrl.videoId}`}
                      title={videoUrl.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>No classification data available.</p>
          )}
        </div>
      </div>

      <button onClick={() => navigate("/")} className="upload-again-btn">
        Upload Another
      </button>
    </div>
  );
};

export default Result;
