const features = [
  { title: "Remote Consultation", desc: "Video call with certified doctors", icon: "💻" },
  { title: "Health Records", desc: "Secure and easy access to reports", icon: "📑" },
  { title: "Medicine Delivery", desc: "Order prescribed medicines online", icon: "💊" },
];

export default function Features() {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Why Choose Us?</h3>
      <div className="grid md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="p-6 shadow-lg rounded-xl bg-green-50 dark:bg-gray-800 hover:shadow-xl transition">
            <div className="text-4xl">{f.icon}</div>
            <h4 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">{f.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
