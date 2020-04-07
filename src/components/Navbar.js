import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './style/Navbar.scss'

const Navbar = ({rootPath}) => {
  return (
    <nav className="Navbar">
      <Link to="/" className="logo">Jacob Miller</Link>
      <Link to="/" className="link">Home</Link>
      <NavLink to="/contact" className="link">Contact</NavLink>
      <NavLink to="/resume" className="link">Resume</NavLink>
    </nav>
  )
}

export default Navbar