import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | DocForge",
  description: "Learn how DocForge uses cookies to improve your experience and serve personalized content.",
  alternates: {
    canonical: '/cookie-policy',
  }
};

export default function CookiePolicyPage() {
  return (
    <div className="container pt-12 pb-16 lg:pb-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">What are cookies?</h2>
          <p>Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">How DocForge uses cookies</h2>
          <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Essential cookies:</strong> We use essential cookies to authenticate users and prevent fraudulent use of user accounts. We also use these to remember your tool preferences.</li>
            <li><strong>Analytics cookies:</strong> We use Google Analytics to track information on how the Service is used so that we can make improvements. We may also use analytics cookies to test new pages, features or new functionality of the Service to see how our users react to them.</li>
            <li><strong>Advertising cookies:</strong> We use Google AdSense to serve advertisements on the Website. Google uses cookies to help serve the ads it displays. When users visit our website, a cookie may be dropped on that end user's browser to serve personalized ads based on their visits to this and other sites on the Internet.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">Your choices regarding cookies</h2>
          <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
          <p>Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
        </section>
      </div>
    </div>
  );
}
