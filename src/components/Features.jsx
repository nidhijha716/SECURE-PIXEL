import { Lock, ImageIcon, UserCheck, Download, Globe } from "lucide-react"

const Features = () => {
  return (
    <section id="features" className="section">
      <div className="features-content">
        <h2>Features</h2>
        <ul className="features-list">
          <li>
            <ImageIcon className="feature-icon" />
            <div>
              <strong>Steganography</strong>: Hide your messages within images seamlessly.
            </div>
          </li>
          <li>
            <Lock className="feature-icon" />
            <div>
              <strong>Encryption</strong>: Keep your data secure with advanced encryption algorithms.
            </div>
          </li>
          <li>
            <UserCheck className="feature-icon" />
            <div>
              <strong>User-Friendly Interface</strong>: Easily upload images, input keys, and perform actions.
            </div>
          </li>
          <li>
            <Download className="feature-icon" />
            <div>
              <strong>Downloadable Output</strong>: Retrieve and save your encoded/decoded images.
            </div>
          </li>
          <li>
            <Globe className="feature-icon" />
            <div>
              <strong>Cross-Platform Compatibility</strong>: Works on all major operating systems.
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Features
