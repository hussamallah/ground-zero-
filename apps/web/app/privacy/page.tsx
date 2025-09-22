export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect minimal information necessary to provide our quiz services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Quiz responses and scores (stored locally in your browser)</li>
                <li>Basic usage analytics (anonymized)</li>
                <li>Technical information (IP address, browser type) for security purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and improve our quiz services</li>
                <li>To ensure platform security and prevent abuse</li>
                <li>To generate anonymous usage statistics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
              <p className="text-gray-700 mb-4">
                Your quiz data is primarily stored locally in your browser. We implement appropriate 
                security measures to protect any data we do collect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use minimal cookies for essential functionality. Analytics cookies are optional 
                and can be disabled in your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access your data</li>
                <li>Request data deletion</li>
                <li>Opt out of analytics</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                For privacy-related questions, contact us at: privacy@groundzero.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
