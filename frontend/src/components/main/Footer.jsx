import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="flex items-center text-white text-lg font-bold mb-3">
            🚗 RideShare
          </h2>
          <p className="text-sm">
            Making travel sustainable, affordable, and social.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                How it Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Safety
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Connect With Us</h3>
          <div className="flex space-x-4 text-white text-lg">
            <a href="https://github.com/KumarRoushan9234">
              <FaGithub />
            </a>
            <a href="https://x.com/singh_Roushan89">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com/in/kumar-roushan-9870b425b/">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
        © 2025 Carma.By Kumar Roushan
      </div>
    </footer>
  );
};

export default Footer;
