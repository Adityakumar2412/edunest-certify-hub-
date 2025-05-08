
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-auto">
      <div className="edu-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Education Centre</h3>
            <p className="text-gray-400">
              Providing free programming education for everyone. Learn at your pace and earn certificates.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Mail size={16} />
              <a href="mailto:adityakumar9523340408@gmail.com" className="hover:text-white transition-colors">adityakumar9523340408@gmail.com</a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={16} />
              <a href="tel:+919523340408" className="hover:text-white transition-colors">+91 9523340408</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Education Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
