import React, { useEffect, useState } from "react";
import videoLinks from "../data/videoLinks";  // Make sure path is correct

const RecipeDetails = ({ foodName }) => {
  const [recipe, setRecipe] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch("/predict/", {
          method: "POST",
          body: JSON.stringify({ food_name: foodName }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setRecipe(data);
        setNutrition(data.nutritional_value);

        // Fetch video URL from local data
        const lowerName = foodName.toLowerCase();
        const link = videoLinks[lowerName];

        if (link) {
          setVideoUrl(link);
        } else {
          setVideoUrl(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    if (foodName) {
      fetchRecipe();
    }
  }, [foodName]);

  return (
    <div>
      <h2>Recipe Details for {foodName}</h2>

      {/* Show YouTube video section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>YouTube Recipe Video</h3>
        {videoUrl ? (
          <iframe
            width="100%"
            height="315"
            src={videoUrl}
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "315px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed gray",
            }}
          >
            <p style={{ color: "#555" }}>YouTube video not available for this recipe</p>
          </div>
        )}
      </div>

      {/* Show Recipe and Nutrition */}
      {recipe && (
        <div>
          <h4>Ingredients:</h4>
          <ul>
            {recipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Instructions:</h4>
          <p>{recipe.instructions}</p>

          {nutrition && (
            <div>
              <h4>Nutritional Information:</h4>
              <ul>
                <li>Calories: {nutrition.Calories}</li>
                <li>Protein: {nutrition.Protein}g</li>
                <li>Carbs: {nutrition.Carbs}g</li>
                <li>Fat: {nutrition.Fat}g</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
