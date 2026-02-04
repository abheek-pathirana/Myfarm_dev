import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold">My Farm</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Premium fresh vegetables delivered directly from our sustainable farm to your doorstep. Experience the difference of truly fresh produce.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/process" className="opacity-80 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block duration-200">
                  Our Process
                </Link>
              </li>
              <li>
                <Link to="/products" className="opacity-80 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block duration-200">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <span>myfarm.agro@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span>(+94) 77 893 2123</span>
              </li>
              <li className="pt-2">
                123 Farm Road<br />
                colombo, sri lanka
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Newsletter</h4>
            <p className="text-sm opacity-90 mb-4">
              Subscribe to receive seasonal updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-primary-foreground/10 border border-primary-foreground/20 rounded px-3 py-2 text-sm w-full placeholder:text-primary-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary-foreground/50"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-60">
          <p>&copy; {new Date().getFullYear()} My Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};