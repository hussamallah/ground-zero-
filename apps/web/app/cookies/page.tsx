export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files stored on your device when you visit our website. 
                They help us provide a better user experience and understand how our service is used.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies are necessary for the website to function properly. They cannot be disabled.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Session management</li>
                  <li>Security features</li>
                  <li>Quiz progress tracking</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Page views and user behavior</li>
                  <li>Performance metrics</li>
                  <li>Error tracking</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services that set their own cookies:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Analytics providers (when enabled)</li>
                <li>Error monitoring services</li>
                <li>Content delivery networks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                For questions about our cookie policy, contact us at: privacy@groundzero.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
