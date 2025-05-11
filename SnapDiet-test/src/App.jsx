import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Cards from "./Components/Cards";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Result from "./Components/Result";

function App() {
  const location = useLocation();

  // Smooth scrolling to sections when a hash is present in the URL
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error("Element not found for ID:", location.hash.substring(1));
      }
    }
  }, [location]);

  return (
    <>
      {/* Render Navbar only if we are not on the /result page */}
      {location.pathname !== "/result" && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <div id="about">
                <About />
              </div>
              <div id="cards">
                <Cards />
              </div>
              <Footer />
            </main>
          }
        />
        <Route path="/result" element={<Result />} />
      </Routes>
    </>
  );
}

export default App;
