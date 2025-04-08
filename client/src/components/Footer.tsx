import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white mt-10 pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/*  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Business Account</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Business Pricing</a></li>
              <li><a href="#" className="hover:underline">Business Prime</a></li>
              <li><a href="#" className="hover:underline">Tax Exemption Program</a></li>
              <li><a href="#" className="hover:underline">Purchase Orders</a></li>
              <li><a href="#" className="hover:underline">Business Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">B2B Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Bulk Ordering</a></li>
              <li><a href="#" className="hover:underline">Business Discounts</a></li>
              <li><a href="#" className="hover:underline">Business Quotes</a></li>
              <li><a href="#" className="hover:underline">Integration Solutions</a></li>
              <li><a href="#" className="hover:underline">Industries Served</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Track Order</a></li>
              <li><a href="#" className="hover:underline">Return Policy</a></li>
              <li><a href="#" className="hover:underline">Shipping Information</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3">About Shopperr B2B</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press Releases</a></li>
              <li><a href="#" className="hover:underline">Investor Relations</a></li>
              <li><a href="#" className="hover:underline">Sustainability</a></li>
            </ul>
          </div>
        </div> */}

        {/* <div className="border-t border-gray-700 pt-6 text-center"> */}
        <div className="text-center">
          <Link href="/">
            <a className="text-2xl font-bold mb-4 inline-block">
              Shopperr<span className="text-[#febd69]">B2B</span>
            </a>
          </Link>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Shopperr B2B, Inc. All rights
            reserved. | Terms of Service | Privacy Policy | Cookie Settings
          </div>
        </div>
      </div>
    </footer>
  );
}
