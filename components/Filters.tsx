import React from 'react';
import type { FilterOptions } from '../types';
import { motion } from 'framer-motion';

interface FiltersProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onFetchData: () => void;
  regions: string[];
  parameters: string[];
  years: number[];
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthMap: { [key: string]: number } = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};


const Filters: React.FC<FiltersProps> = ({ filters, setFilters, onFetchData, regions, parameters, years }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => {
      const newFilters = { ...prev, [name]: name.includes('Year') ? parseInt(value, 10) : value };

      const startDate = new Date(newFilters.startYear, monthMap[newFilters.startMonth]);
      const endDate = new Date(newFilters.endYear, monthMap[newFilters.endMonth]);

      if (endDate < startDate) {
        if (name === 'startYear' || name === 'startMonth') {
          // If start date is now after end date, pull end date up to match start date
          newFilters.endYear = newFilters.startYear;
          newFilters.endMonth = newFilters.startMonth;
        } else { // endYear or endMonth was changed
          // If end date is now before start date, pull start date back to match end date
          newFilters.startYear = newFilters.endYear;
          newFilters.startMonth = newFilters.endMonth;
        }
      }
      return newFilters;
    });
  };
  
  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-farmsetu-blue-500 focus:border-farmsetu-blue-500 outline-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-end">
        {/* Region */}
        <div className="lg:col-span-2 xl:col-span-1">
          <label htmlFor="region" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Region</label>
          <select id="region" name="region" value={filters.region} onChange={handleSelectChange} className={inputClass}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {/* Parameter */}
        <div className="lg:col-span-2 xl:col-span-1">
          <label htmlFor="parameter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parameter</label>
          <select id="parameter" name="parameter" value={filters.parameter} onChange={handleSelectChange} className={inputClass}>
            {parameters.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startYear" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Year</label>
          <select id="startYear" name="startYear" value={filters.startYear} onChange={handleSelectChange} className={inputClass}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startMonth" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Month</label>
          <select id="startMonth" name="startMonth" value={filters.startMonth} onChange={handleSelectChange} className={inputClass}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        
        {/* End Date */}
        <div>
          <label htmlFor="endYear" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Year</label>
          <select id="endYear" name="endYear" value={filters.endYear} onChange={handleSelectChange} className={inputClass}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="endMonth" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Month</label>
          <select id="endMonth" name="endMonth" value={filters.endMonth} onChange={handleSelectChange} className={inputClass}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        
        {/* Fetch Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFetchData}
          className="w-full bg-farmsetu-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-farmsetu-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farmsetu-blue-500 dark:focus:ring-offset-slate-800 transition-colors duration-300"
        >
          Fetch Data
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Filters;
