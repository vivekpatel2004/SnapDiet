import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional for adding custom styles

const Navbar = () => {
  // Array of navbar links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '#about' },
    { name: 'Services', path: '#services' },
    { name: 'Contact', path: '#contact' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">SnapDiet</Link>
      </div>
      <ul className="navbar-links">
        {navLinks.map((link, index) => (
          <li key={index}>
            <a href={link.path} onClick={(e) => {
              if (link.path.startsWith("#")) {
                e.preventDefault();
                const section = document.getElementById(link.path.substring(1));
                if (section) {
                  section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }
            }}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
