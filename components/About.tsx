
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
        About This Project
      </h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
        This interactive dashboard is a frontend-only simulation of a full-stack project originally built with a Django REST Framework backend. The goal is to visually represent the functionality of the backend's weather data APIs without requiring a live server.
      </p>
      <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        All data presented here is static JSON, designed to mimic responses from the original API endpoints which parsed and served climate data from the UK MetOffice. This demonstration showcases skills in frontend development, data visualization, and UI/UX design using React, TypeScript, Tailwind CSS, Recharts, and Framer Motion.
      </p>
    </div>
  );
};

export default About;
