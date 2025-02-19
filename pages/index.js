

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-lightGray to-background min-h-screen">
      <main className="container mx-auto px-6 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-text mb-4">AI Smart Healthcare for All</h1>
          <p className="text-lg text-gray-600 mb-8">
            Revolutionizing healthcare through AI-powered biomarker prediction and patient management.
          </p>
          <a
            href="/login"
            className="bg-highlight text-white py-3 px-6 rounded text-lg hover:bg-secondary transition"
          >
            Get Started
          </a>
        </section>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-xl font-bold text-text mb-2">Biomarker Prediction</h3>
            <p className="text-gray-600">
              Leverage AI to analyze retinal fundus images for accurate biomarker detection.
            </p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-xl font-bold text-text mb-2">Patient Management</h3>
            <p className="text-gray-600">
              Easily manage patient data and track their medical history over time.
            </p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-xl font-bold text-text mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Built with security and reliability to ensure your data is always safe.
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2025 Eyesha. All rights reserved.</p>
          <a href="/terms" className="text-highlight hover:underline mx-2">Terms</a>
          <a href="/privacy" className="text-highlight hover:underline mx-2">Privacy</a>
          <a href="/contact" className="text-highlight hover:underline mx-2">Contact</a>
        </div>
      </footer>
    </div>
  );
}