import React from 'react';
import type { StatisticsData } from '../types';
import { motion } from 'framer-motion';

interface StatisticsCardsProps {
  data: StatisticsData | null;
  parameter: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: string | number; unit: string; icon: React.ReactNode }> = ({ title, value, unit, icon }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center space-x-4"
    >
      <div className="bg-farmsetu-blue-100 dark:bg-farmsetu-blue-900/50 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value} <span className="text-lg font-normal">{unit}</span></p>
      </div>
    </motion.div>
  );
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data, parameter }) => {
  if (!data) return null;

  const unit = parameter === 'Rainfall' ? 'mm' : parameter === 'Sunshine' ? 'hours' : '°C';
  const iconClass = "w-6 h-6 text-farmsetu-blue-600 dark:text-farmsetu-blue-300";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
    >
      <StatCard 
        title="Average" 
        value={data.average.toFixed(1)} 
        unit={unit} 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} 
      />
      <StatCard 
        title="Maximum" 
        value={data.max.toFixed(1)} 
        unit={unit}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
      />
      <StatCard 
        title="Minimum" 
        value={data.min.toFixed(1)} 
        unit={unit}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
      />
    </motion.div>
  );
};

export default StatisticsCards;
