import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#06184b] text-white mt-10 pt-10 pb-6">
      <div className="container mx-auto px-4">
        

        {/* <div className="border-t border-gray-700 pt-6 text-center"> */}
        <div className="text-center">
          <Link href="/">
            <a className="text-2xl font-bold mb-4 inline-block">
              <img
                src="/Shopperr white logo.png"
                alt="ShopperrB2B Logo"
                className="h-8 w-auto"
              />
            </a>
          </Link>
          {/* Links to policy pages */}
          <div className="text-sm text-gray-300 space-x-4 mb-4">
             <Link href="/shipping-policy">
               <a className="hover:underline">Shipping Policy</a>
             </Link>
             <Link href="/returns-policy">
               <a className="hover:underline">Returns Policy</a>
             </Link>
             <Link href="/privacy-policy">
               <a className="hover:underline">Privacy Policy</a>
             </Link>
             <Link href="/terms-conditions">
               <a className="hover:underline">Terms & Conditions</a>
             </Link>
          </div>
          {/* Updated Copyright, Address and Contact */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              &copy; {currentYear} - Mar 2030 One Stop Fashions Pvt Ltd. All rights reserved.
            </p>
            <p>
              Building No. 225, Phase IV, Udyog Vihar, Gurugram. Haryana, India. 122001
            </p>
            <p>
              Contact us: <a href="mailto:B2BSupport@shopperr.in" className="hover:underline">B2BSupport@shopperr.in</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
