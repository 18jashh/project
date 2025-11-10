import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import StatisticsCards from './components/StatisticsCards';
import ChartView from './components/ChartView';
import DataTable from './components/DataTable';
import About from './components/About';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherData, StatisticsData, FilterOptions } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
  
  // State for filters and displayed data
  const [filters, setFilters] = useState<FilterOptions>({
    region: 'UK',
    parameter: 'Tmax',
    startYear: 2023,
    endYear: 2023,
    startMonth: 'Jan',
    endMonth: 'Dec',
  });
  const [filteredData, setFilteredData] = useState<WeatherData[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  
  // State for loading indicators
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // State to hold all static data once loaded
  const [regions, setRegions] = useState<string[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);
  const [allWeatherData, setAllWeatherData] = useState<WeatherData[]>([]);
  const [years, setYears] = useState<number[]>([2023, 2024, 2025]);

  // Effect for theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  // Effect to load initial static data from JSON files
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [regionsRes, paramsRes, weatherRes] = await Promise.all([
          fetch('./data/regions.json'),
          fetch('./data/parameters.json'),
          fetch('./data/weather_data.json'),
        ]);
        
        setRegions(await regionsRes.json());
        setParameters(await paramsRes.json());
        const weatherData: WeatherData[] = await weatherRes.json();
        setAllWeatherData(weatherData);

        const availableYears = [...new Set(weatherData.map(d => d.year))].sort();
        setYears(availableYears);
        
      } catch (error) {
        console.error("Failed to load static data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadStaticData();
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFetchData = useCallback(() => {
    if (allWeatherData.length === 0) return; // Guard against fetching before data is loaded

    setIsFetching(true);
    setHasFetched(true);

    // Simulate API delay
    setTimeout(() => {
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };

      const startFilterDate = new Date(filters.startYear, monthMap[filters.startMonth]);
      const endFilterDate = new Date(filters.endYear, monthMap[filters.endMonth]);

      const newFilteredData = allWeatherData.filter(item => {
        const itemDate = new Date(item.year, monthMap[item.month]);
        return (
          item.region === filters.region &&
          item.parameter === filters.parameter &&
          itemDate >= startFilterDate &&
          itemDate <= endFilterDate
        );
      }).sort((a,b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return monthMap[a.month] - monthMap[b.month];
      });

      setFilteredData(newFilteredData);
      
      if (newFilteredData.length > 0) {
        const values = newFilteredData.map(d => d.value);
        const newStatistics = {
            average: values.reduce((a, b) => a + b, 0) / values.length,
            max: Math.max(...values),
            min: Math.min(...values),
        };
        setStatistics(newStatistics);
      } else {
          setStatistics(null);
      }
      
      setIsFetching(false);
    }, 500);
  }, [filters, allWeatherData]);

  const renderContent = () => {
    if (isFetching) {
      return (
         <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-farmsetu-blue-500"></div>
        </motion.div>
      );
    }
    
    if (hasFetched) {
      return (
        <motion.div
          key="data-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {filteredData.length > 0 ? (
            <>
              <StatisticsCards data={statistics} parameter={filters.parameter} />
              <ChartView data={filteredData} parameter={filters.parameter} />
              <DataTable data={filteredData} />
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md mt-6">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No Data Found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Please adjust your filters and try again.</p>
            </div>
          )}
        </motion.div>
      );
    }
    
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md mt-6">
        <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Welcome to the Dashboard</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Select your desired filters and click "Fetch Data" to begin.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {isInitialLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-farmsetu-blue-500"></div>
          </div>
        ) : (
          <>
            <Filters 
              filters={filters} 
              setFilters={setFilters} 
              onFetchData={handleFetchData} 
              regions={regions}
              parameters={parameters}
              years={years}
            />
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </>
        )}
        <About />
      </main>
    </div>
  );
};

export default App;
