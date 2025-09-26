import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4  dark:bg-indigo-950">
      <p className="text-sm">
        © {new Date().getFullYear()} Smart Healthcare. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
