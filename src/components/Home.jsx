import { Link } from "react-scroll"

const Home = () => {
  return (
    <section id="home" className="section">
      <div className="home-content">
        <h2>Welcome to SecurePixel</h2>
        <p>
          Securely hide and encrypt your data within images. Explore the power of steganography with just a few clicks.
        </p>
        <Link to="steg-tool" smooth={true} duration={500}>
          <button className="cta-button">Get Started</button>
        </Link>
      </div>
    </section>
  )
}

export default Home

