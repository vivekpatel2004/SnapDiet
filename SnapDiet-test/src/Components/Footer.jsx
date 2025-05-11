import React from "react";
import "./Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>About Snapdiet</h2>
          <p>
            Snapdiet is your ultimate guide to healthy eating. Discover recipes
            tailored to your dietary needs.
          </p>
        </div>
        
        <div className="footer-section links">
          <h2>Useful Links</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p>Email: info@snapdiet.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Snapdiet. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
