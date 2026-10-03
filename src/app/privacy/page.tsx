import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DocForge",
  description: "Privacy policy for DocForge. Learn how we handle your documents, data, and protect your privacy.",
  alternates: {
    canonical: '/privacy',
  }
};

export default function PrivacyPage() {
  return (
    <div className="container pt-12 pb-16 lg:pb-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">1. Introduction</h2>
          <p>Welcome to DocForge. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your files, collect information, and safeguard your data when you use our website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">2. How We Handle Your Files</h2>
          <p>Your privacy is our primary concern when dealing with your documents:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Processing:</strong> Many of our tools process files entirely within your browser without uploading them to any server.</li>
            <li><strong>Auto-Deletion:</strong> For tools that require server-side processing, files are automatically and permanently deleted from our servers within a few hours of processing.</li>
            <li><strong>No Viewing:</strong> We do not view, analyze, or extract data from the contents of your documents.</li>
            <li><strong>No Sharing:</strong> We never share or sell your documents to any third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">3. Information We Collect</h2>
          <p>When you visit DocForge, we may collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Usage Data:</strong> We use Google Analytics to collect standard internet log information and details of visitor behavior patterns. This includes pages visited, time spent on site, and basic geographical data. This data is entirely anonymized.</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your experience, serve personalized ads, and analyze our traffic. Please see our <a href="/cookie-policy" className="text-accent hover:underline">Cookie Policy</a> for more details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">4. Third-Party Services (Google AdSense & Analytics)</h2>
          <p>We use third-party services to keep DocForge free:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Google AdSense:</strong> We use Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google's Ads Settings</a>.</li>
            <li><strong>Google Analytics:</strong> We use this service to monitor and analyze web traffic. You can opt out by installing the Google Analytics opt-out browser add-on.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@docforge.com.</p>
        </section>
      </div>
    </div>
  );
}
