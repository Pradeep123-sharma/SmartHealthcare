import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-gradient-to-r from-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          Healthcare Access for Every Village 🏥
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Connect patients in rural areas with doctors and health services instantly. Easy. Reliable. Smart.
        </p>
        <button 
          onClick={() => navigate('/auth')}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 dark:hover:bg-green-500 transition"
        >
          Get Started
        </button>
      </div>
      <img
        src="https://cdn-icons-png.flaticon.com/512/2966/2966488.png"
        alt="Healthcare Illustration"
        className="w-80 mt-6 md:mt-0"
      />
    </section>
  );
}
