import { Link } from "wouter"; // Import Link for internal navigation

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="text-sm text-gray-600 mb-8">Last Updated: 22nd Apr 2025</p>
      <div className="prose max-w-none">
        <p>
          Welcome to b2b.shopperr.in! These Terms and Conditions ("Terms") govern your use
          of our website b2b.shopperr.in, b2b.shopperr.in or
          www.shopperr.in (the "Site") and the purchase of products from our
          Site. By accessing or using our Site, you agree to be bound by these
          Terms. If you do not agree to these Terms, please do not use the Site.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. General</h2>
        <p>
          These Terms apply to all visitors, users, and customers of the Site.
          By using our Site and/or purchasing products from it, you agree to
          comply with and be bound by these Terms, which may be updated from
          time to time without prior notice. We encourage you to review the
          Terms periodically.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Use of the Site</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">Eligibility:</h3>
        <p>
          To use this Site and make purchases, you must be at least 18 years old
          or have the consent of a parent or legal guardian. By using this Site,
          you confirm that you meet these requirements.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">
          Account Registration:
        </h3>
        <p>
          To access certain features of the Site, such as placing an order, you
          may need to create an account. You agree to provide accurate, current,
          and complete information when registering and to keep your account
          details secure. You are responsible for any activity that occurs under
          your account.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          3. Products and Services
        </h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">
          Product Descriptions:
        </h3>
        <p>
          We strive to provide accurate descriptions of the products available
          on our Site. However, we do not warrant that product descriptions or
          any other content on the Site is accurate, complete, or error-free. If
          a product you purchase is not as described, your sole remedy is to
          return it in unused condition in accordance with our{" "}
          <Link href="/returns-policy">
            <a className="text-blue-600 hover:underline">Return Policy</a>
          </Link>
          .
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Pricing:</h3>
        <p>
          Prices for products are listed on the Site and are subject to change
          without notice. While we make every effort to ensure the accuracy of
          pricing, we reserve the right to correct any errors or discrepancies
          in pricing.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          4. Order Process and Payment
        </h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">Order Acceptance:</h3>
        <p>
          Once you place an order, you will receive an order confirmation via
          email. This email does not signify acceptance of your order but only
          confirms that we have received your order. We reserve the right to
          accept, modify, or cancel your order at any time for reasons
          including, but not limited to, product availability, errors in pricing
          or product information, or issues with payment processing.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Payment Methods:</h3>
        <p>
          We accept various payment methods, including credit cards, debit cards,
          and third-party payment gateways. All payments must be made at the time
          of purchase. Your order will not be processed until payment is
          successfully completed.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Taxes:</h3>
        <p>
          Prices listed on the Site are exclusive of taxes unless otherwise
          noted. You are responsible for paying any applicable taxes on your
          purchase.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          5. Shipping and Delivery
        </h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">Shipping Policy:</h3>
        <p>
          We offer shipping to specified locations as detailed in our{" "}
          <Link href="/shipping-policy">
            <a className="text-blue-600 hover:underline">Shipping Policy</a>
          </Link>
          . Estimated delivery times are provided for your reference and are not
          guaranteed. We are not responsible for any delays caused by shipping
          carriers or factors beyond our control.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Risk of Loss:</h3>
        <p>
          Once we hand over the product to the shipping carrier, the risk of
          loss or damage passes to you. Please refer to our{" "}
          <Link href="/shipping-policy">
            <a className="text-blue-600 hover:underline">Shipping Policy</a>
          </Link>{" "}
          for more information.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          6. Returns, Refunds, and Cancellations
        </h2>
        <p>
          Please refer to our{" "}
          <Link href="/returns-policy">
            <a className="text-blue-600 hover:underline">
              Returns, Refund, and Cancellation Policy
            </a>
          </Link>{" "}
          for information on how we handle returns, refunds, and order
          cancellations.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          7. Intellectual Property
        </h2>
        <p>
          All content on the Site, including text, graphics, logos, images, and
          software, is the property of b2b.shopperr.in,
          b2b.shopperr.in or www.shopperr.in or its content suppliers and is
          protected by intellectual property laws. You may not use, reproduce,
          modify, or distribute any content from the Site without our express
          written permission.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">8. User Conduct</h2>
        <p>
          You agree to use the Site only for lawful purposes and in a way that
          does not infringe the rights of others or restrict or inhibit their
          use of the Site. Prohibited activities include, but are not limited
          to:
        </p>
        <ul className="list-disc pl-6">
          <li>
            Posting or transmitting any material that is harmful, defamatory, or
            unlawful.
          </li>
          <li>Impersonating any person or entity.</li>
          <li>
            Using the Site to send unsolicited promotions, spam, or advertising.
          </li>
        </ul>
        <p>
          We reserve the right to terminate your account or access to the Site
          if you violate these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          9. Third-Party Links
        </h2>
        <p>
          Our Site may contain links to third-party websites or services that
          are not owned or controlled by b2b.shopperr.in,
          b2b.shopperr.in or www.shopperr.in. We have no control over and
          assume no responsibility for the content, privacy policies, or
          practices of any third-party websites or services. Your use of such
          websites is at your own risk, and we recommend that you review their
          terms and privacy policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          10. Disclaimer of Warranties
        </h2>
        <p>
          The Site and all products and services offered through it are provided
          on an "as-is" and "as-available" basis. We make no warranties, express
          or implied, regarding the Site or any products sold through it,
          including but not limited to warranties of merchantability, fitness
          for a particular purpose, or non-infringement. We do not guarantee
          that the Site will be error-free, secure, or uninterrupted.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          11. Limitation of Liability
        </h2>
        <p>
          In no event shall b2b.shopperr.in, b2b.shopperr.in,
          www.shopperr.in, its directors, employees, or affiliates be liable for
          any indirect, incidental, special, or consequential damages arising
          out of or in connection with your use of the Site or products
          purchased from it, whether based in contract, tort, strict liability,
          or otherwise, even if we have been advised of the possibility of such
          damages.
        </p>
        <p>
          Our total liability for any claim arising from or related to your use
          of the Site or products purchased from it shall not exceed the amount
          paid by you for the product in question.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          12. Indemnification
        </h2>
        <p>
          You agree to indemnify, defend, and hold harmless
          b2b.shopperr.in, b2b.shopperr.in, www.shopperr.in, its
          affiliates, and their respective directors, officers, employees, and
          agents from any claims, liabilities, damages, losses, or expenses
          arising out of your use of the Site or your violation of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          13. Governing Law
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of India, without regard to its conflict of law provisions. Any
          disputes arising from or relating to these Terms or your use of the
          Site shall be subject to the exclusive jurisdiction of the courts in
          Haryana.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          14. Changes to the Terms
        </h2>
        <p>
          We reserve the right to modify these Terms at any time without prior
          notice. Your continued use of the Site after any changes to the Terms
          constitutes your acceptance of the new Terms. We encourage you to
          review these Terms periodically for updates.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">15. Contact Us</h2>
        <p>
          If you have any questions or concerns about these Terms, please contact
          us at:
        </p>
        <ul className="list-none pl-0">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@shopperr.in">support@shopperr.in</a>
          </li>
        </ul>

        <hr className="my-6" />

        <p>
          By using b2b.shopperr.in you acknowledge that you have read,
          understood, and agree to these Terms and Conditions.
        </p>
      </div>
    </div>
  );
} 