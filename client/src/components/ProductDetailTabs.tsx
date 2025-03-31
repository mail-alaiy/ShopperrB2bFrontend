import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "documents", label: "Documents" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" }
];

interface ProductDetailTabsProps {
  product: any;
}

export default function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  
  return (
    <div className="border-t border-gray-200 mt-6 pt-4">
      <div className="mb-4">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={cn(
                "px-4 py-2 font-medium whitespace-nowrap",
                activeTab === tab.id 
                  ? "border-b-2 border-amber-400 text-gray-900" 
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Description Tab */}
        <div id="tab-content-description" className={`py-4 ${activeTab === "description" ? "block" : "hidden"}`}>
          <h2 className="text-xl font-bold mb-3">Product Description</h2>
          <div className="text-sm space-y-3">
            <p>{product.description}</p>
            
            <p>The keyboard features a full-size layout with a numeric keypad, function keys, and dedicated media controls. The low-profile keys provide a comfortable typing experience while minimizing noise - perfect for open office environments. The mouse offers precision tracking with adjustable DPI settings and an ergonomic design for all-day comfort.</p>
            
            <p>Both devices feature extended battery life, with the keyboard lasting up to 24 months and the mouse up to 12 months on a single set of batteries (included). The single USB receiver connects both devices, freeing up valuable ports on your computers.</p>
            
            <h3 className="font-bold mt-4 mb-2">Ideal for Business Deployment</h3>
            <p>For IT departments and procurement managers, this combo offers several business-friendly features:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Bulk packaging options to reduce waste</li>
              <li>Consistent model numbers for standardized deployment</li>
              <li>Enterprise-level encryption for secure data transmission</li>
              <li>Compatibility with all major operating systems</li>
              <li>Extended 3-year business warranty</li>
              <li>Volume discounts for larger orders</li>
            </ul>
          </div>
        </div>
        
        {/* Specifications Tab */}
        <div id="tab-content-specs" className={`py-4 ${activeTab === "specs" ? "block" : "hidden"}`}>
          <h2 className="text-xl font-bold mb-3">Technical Specifications</h2>
          <div className="text-sm">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium w-1/3">Brand</td>
                  <td className="py-2">{product.brand}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Model</td>
                  <td className="py-2">KM-2000</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Connectivity</td>
                  <td className="py-2">Wireless 2.4GHz with USB receiver</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Keyboard Layout</td>
                  <td className="py-2">Full-size with numeric keypad</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Battery Life (Keyboard)</td>
                  <td className="py-2">Up to 24 months</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Battery Life (Mouse)</td>
                  <td className="py-2">Up to 12 months</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Wireless Range</td>
                  <td className="py-2">33 feet (10 meters)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Mouse DPI</td>
                  <td className="py-2">1000/1600/2400 (adjustable)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">OS Compatibility</td>
                  <td className="py-2">Windows 7/8/10/11, macOS 10.15+, Chrome OS, Linux</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Warranty</td>
                  <td className="py-2">3-year business warranty</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Documents Tab */}
        <div id="tab-content-documents" className={`py-4 ${activeTab === "documents" ? "block" : "hidden"}`}>
          <h2 className="text-xl font-bold mb-3">Documents & Resources</h2>
          <div className="text-sm space-y-4">
            <div className="flex items-center p-3 border border-gray-200 rounded">
              <svg className="w-8 h-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2c3.301 0 6 2.699 6 6s-2.699 6-6 6-6-2.699-6-6 2.699-6 6-6z" />
                <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                <path d="M10 6a1 1 0 00-1 1v2a1 1 0 002 0V7a1 1 0 00-1-1z" />
              </svg>
              <div>
                <div className="font-medium">Product Specification Sheet</div>
                <a href="#" className="text-blue-600 hover:underline">Download PDF (1.2MB)</a>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2c3.301 0 6 2.699 6 6s-2.699 6-6 6-6-2.699-6-6 2.699-6 6-6z" />
                <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                <path d="M10 6a1 1 0 00-1 1v2a1 1 0 002 0V7a1 1 0 00-1-1z" />
              </svg>
              <div>
                <div className="font-medium">User Manual</div>
                <a href="#" className="text-blue-600 hover:underline">Download PDF (3.5MB)</a>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded">
              <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2c3.301 0 6 2.699 6 6s-2.699 6-6 6-6-2.699-6-6 2.699-6 6-6z" />
                <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                <path d="M10 6a1 1 0 00-1 1v2a1 1 0 002 0V7a1 1 0 00-1-1z" />
              </svg>
              <div>
                <div className="font-medium">Quick Start Guide</div>
                <a href="#" className="text-blue-600 hover:underline">Download PDF (0.8MB)</a>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded">
              <svg className="w-8 h-8 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2c3.301 0 6 2.699 6 6s-2.699 6-6 6-6-2.699-6-6 2.699-6 6-6z" />
                <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                <path d="M10 6a1 1 0 00-1 1v2a1 1 0 002 0V7a1 1 0 00-1-1z" />
              </svg>
              <div>
                <div className="font-medium">Driver Software</div>
                <a href="#" className="text-blue-600 hover:underline">Download ZIP (15.2MB)</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Tab */}
        <div id="tab-content-reviews" className={`py-4 ${activeTab === "reviews" ? "block" : "hidden"}`}>
          <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>
          <div className="text-sm">
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold">{product.rating} out of 5</span>
            </div>
            
            <div className="mb-6">
              <div className="text-gray-500 mb-2">{product.ratingCount} global business ratings</div>
              
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center mb-1">
                  <div className="w-24">{stars} star</div>
                  <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-amber-400 h-2.5 rounded-full" 
                      style={{ width: stars === 5 ? '65%' : stars === 4 ? '20%' : stars === 3 ? '10%' : stars === 2 ? '3%' : '2%' }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-xs ml-2">
                    {stars === 5 ? '65%' : stars === 4 ? '20%' : stars === 3 ? '10%' : stars === 2 ? '3%' : '2%'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold mb-2">Top Reviews</h3>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-1">
                    <div className="font-medium mr-2">John D., IT Manager</div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mb-2">Verified Business Purchase | May 15, 2023</div>
                  <p>We deployed 50 of these across our company and they've been incredibly reliable. The battery life is impressive and the wireless connection is stable even in our busy office environment. Our employees love them!</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-1">
                    <div className="font-medium mr-2">Sarah M., Office Manager</div>
                    <div className="flex text-amber-400">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mb-2">Verified Business Purchase | April 28, 2023</div>
                  <p>Good quality for the price. The volume discount was significant which helped with our budget. Only giving 4 stars because the mouse could be more ergonomic, but overall a solid choice.</p>
                </div>
              </div>
              
              <button className="text-blue-600 hover:underline font-medium mt-4">See all {product.ratingCount} reviews</button>
            </div>
          </div>
        </div>
        
        {/* FAQ Tab */}
        <div id="tab-content-faq" className={`py-4 ${activeTab === "faq" ? "block" : "hidden"}`}>
          <h2 className="text-xl font-bold mb-3">Frequently Asked Questions</h2>
          <div className="text-sm space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="font-medium mb-2">Q: Is this compatible with Mac computers?</div>
              <div>A: Yes, the keyboard and mouse combo is compatible with macOS 10.15 and newer. The function keys will work, though some special Mac-specific functions may require customization through the optional software.</div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <div className="font-medium mb-2">Q: Can I customize the buttons on the mouse?</div>
              <div>A: The mouse comes with standard button functionality out of the box. For advanced customization, you can download our optional Business Edition Software from the support website.</div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <div className="font-medium mb-2">Q: What is the maximum number of devices that can be ordered with the bulk discount?</div>
              <div>A: There is no maximum limit for bulk orders. Orders of 50+ units receive our maximum discount of 20% off the base price. For orders exceeding 250 units, please contact our business sales team for additional custom pricing.</div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <div className="font-medium mb-2">Q: Is there a difference between the Business Edition and the Standard version?</div>
              <div>A: Yes, the Business Edition includes several enhancements over the Standard version: longer warranty (3 years vs 1 year), reinforced construction for durability in office environments, enterprise-level encryption for the wireless signal, and access to priority business support.</div>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <div className="font-medium mb-2">Q: How do I claim warranty service if needed?</div>
              <div>A: Business customers have access to our dedicated support portal at support.shopperr.com/business. You'll need your order number and the product serial number to register a warranty claim. For bulk deployments, we offer simplified batch warranty processing.</div>
            </div>
            
            <a href="#" className="text-blue-600 hover:underline font-medium block mt-4">See more answered questions</a>
          </div>
        </div>
      </div>
    </div>
  );
}
