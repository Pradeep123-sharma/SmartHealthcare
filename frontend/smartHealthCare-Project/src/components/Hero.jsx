import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium">
              🚀 AI-Powered Healthcare Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Healthcare for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                {" "}Every Village
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Revolutionary healthcare platform bringing AI-powered diagnostics,
              telemedicine, and emergency services to rural communities across India.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400">🤖</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">AI Diagnosis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">💻</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Telemedicine</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400">🚨</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Emergency SOS</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400">📱</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">SMS/IVR Support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold text-lg"
            >
              Start Free Consultation
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-semibold text-lg"
            >
              Learn More
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative">
         <div className="relative z-10">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Healthcare Professional"
              className="rounded-2xl shadow-2xl"
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 dark:bg-green-800 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full animate-bounce"></div>

          {/* Stats Cards */}
          <div className="absolute -top-11 -left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online Doctors</span>
            </div>
          </div>

          <div className="absolute -bottom-15 -right-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏥</span>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">150+</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Hospitals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
