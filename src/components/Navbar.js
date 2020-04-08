import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = ({rootPath}) => {
  return (
    <nav id="Navbar">
      <Link to={rootPath} className="logo">Jacob Miller</Link>
      <Link to={rootPath} className="link">Home</Link>
      <NavLink to={rootPath + "/contact"} className="link">Contact</NavLink>
      <NavLink to={rootPath + "/resume"} className="link">Resume</NavLink>
    </nav>
  )
}

export default Navbar