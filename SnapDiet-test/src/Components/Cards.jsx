import React from "react";
import "./Cards.css";
import foodData from "./foodData"; // Ensure this path is correct

const Cards = () => {
    return (
        <div className="cards-container">
            {foodData.map((food, index) => (
                <div className="card" key={index}>
                    <img src={food.image} alt={food.name} className="food-image" />
                    <h3>{food.name}</h3>
                    <p>{food.nutrition}</p>
                </div>
            ))}
        </div>
    );
};

export default Cards;
