import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

export default function App() {
  const {
    data: photos,
    loading,
    error,
  } = useFetch("https://jsonplaceholder.typicode.com/photos");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <h1 className="text-2xl font-semibold text-white">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <h1 className="text-2xl font-semibold text-red-500">
          Error: Failed to fetch
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <header className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-wider">
          Photos
        </h1>
      </header>
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* We slice the array to display a manageable number of photos */}
          {photos &&
            photos.slice(0, 20).map((photo) => {
              // Extract the hex color code from the end of the thumbnail URL
              const bgColor = photo.thumbnailUrl.slice(-6);
              return (
                <div
                  key={photo.id}
                  className="rounded-lg overflow-hidden flex flex-col group transition-transform duration-300 ease-in-out hover:scale-105"
                  style={{ border: `3px solid #${bgColor}` }}
                >
                  {/* Placeholder image using the extracted color */}
                  <img
                    src={`https://placehold.co/600x600/${bgColor}/FFFFFF?text=600x600`}
                    alt={photo.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4 flex-grow flex items-center bg-gray-900">
                    <p className="text-white text-sm capitalize leading-relaxed">
                      {photo.title}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

/**
 * A custom hook to fetch data from a given URL.
 * It manages loading and error states internally.
 * @param {string} url - The URL to fetch data from.
 * @returns {object} An object containing the fetched data, a loading state boolean, and an error object.
 */

// State for the fetched data
// State to track if the data is currently being loaded
// State to store any errors that occur during fetching
// useCallback memoizes the fetchData function so it's not recreated on every render,

// preventing unnecessary re-fetches in the useEffect hook.
// Set loading to true at the beginning of a fetch
// If the response is not 'ok' (e.g., 404 or 500), throw an error
// Clear any previous errors
// If an error occurs, set the error state
// Clear any previous data
// Set loading to false once the fetch is complete (either success or failure)
// The dependency array ensures this function is only recreated if the URL changes

// useEffect runs the fetchData function when the component mounts or when fetchData function changes.
// Return the stateful values for the component to use

// Main App component
// Use the custom hook to fetch photos from the dummy API
// Display a loading message while data is being fetched
// Display an error message if the fetch failed
// Render the photo gallery once data is successfully fetched
