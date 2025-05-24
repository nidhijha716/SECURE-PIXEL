import { Link } from "react-scroll"

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="home" smooth={true} duration={500}>
        Home
      </Link>
      <Link to="about" smooth={true} duration={500}>
        About
      </Link>
      <Link to="features" smooth={true} duration={500}>
        Features
      </Link>
      <Link to="steg-tool" smooth={true} duration={500}>
        Get Started
      </Link>
      <Link to="contact" smooth={true} duration={500}>
        Contact Us
      </Link>
    </nav>
  )
}

export default Navbar
