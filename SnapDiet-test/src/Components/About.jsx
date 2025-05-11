import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <h2>About SnapDiet</h2>
        <p>
          SnapDiet is your one-stop solution for managing your food journey. Whether you are tracking your meals, discovering delicious recipes, or finding out the nutritional value of your favorite foods, we’ve got you covered. Our mission is to help you lead a healthy lifestyle by providing all the information you need at your fingertips.
        </p>
        <p>
          With an easy-to-use interface and a wide range of features, SnapDiet ensures that you stay on top of your dietary goals while enjoying the best of Indian cuisine. Stay fit, stay healthy with SnapDiet!
        </p>
        <div className="about-features">
          <div className="feature">
            <h3>Track Your Meals</h3>
            <p>Keep track of what you eat and monitor your nutritional intake.</p>
          </div>
          <div className="feature">
            <h3>Discover Recipes</h3>
            <p>Explore a vast collection of delicious, healthy recipes to enjoy.</p>
          </div>
          <div className="feature">
            <h3>Nutrition Info</h3>
            <p>Get detailed nutritional information on your favorite foods.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
