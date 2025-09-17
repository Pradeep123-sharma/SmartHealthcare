import React from "react";

const About = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
    <div className="max-w-4xl mx-auto px-6 py-10 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 dark:text-blue-500">About Us</h1>
      <p className="text-gray-700 dark:text-gray-300  leading-relaxed">
        Smart Healthcare is a platform built to provide accessible healthcare 
        solutions for rural India. Our mission is to bridge the gap between 
        healthcare providers and patients by leveraging modern web technologies.
      </p>
      <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
        This project is designed with scalability and accessibility in mind, 
        making sure healthcare resources are available to those who need them most.
      </p>
    </div>
    </div>
  );
};

export default About;
