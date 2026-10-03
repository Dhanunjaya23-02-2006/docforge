import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DocForge",
  description: "Terms of Service and usage conditions for DocForge.",
  alternates: {
    canonical: '/terms',
  }
};

export default function TermsPage() {
  return (
    <div className="container pt-12 pb-16 lg:pb-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using DocForge ("the Website"), you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">2. Use License</h2>
          <p>DocForge provides free online document processing tools. You may use these tools for personal and commercial purposes. However, you may not:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Attempt to reverse engineer any software contained on the Website.</li>
            <li>Use the tools for any illegal or unauthorized purpose.</li>
            <li>Use automated scripts or bots to access or process files in bulk without explicit permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">3. Disclaimer of Warranties</h2>
          <p>The materials on DocForge's website are provided on an 'as is' basis. DocForge makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">4. Limitations of Liability</h2>
          <p>In no event shall DocForge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DocForge's website, even if DocForge or a DocForge authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text mb-3">5. Document Legality</h2>
          <p>You are solely responsible for the documents you process using our tools. You agree not to upload or process any files that contain illegal content, malware, or infringe on the copyrights of third parties.</p>
        </section>
      </div>
    </div>
  );
}
