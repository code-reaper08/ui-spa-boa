import React, { useState } from 'react';
import './App.css';

function App() {
  const [repoUrl, setRepoUrl] = useState("");      // State for GitHub repository URL
  const [downloadUrl, setDownloadUrl] = useState(null); // State for download URL
  const [loading, setLoading] = useState(false);   // State to manage loading state
  const [error, setError] = useState(null);        // State to manage error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no URL is entered, show error
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    // Clear previous download link and error when the user submits a new URL
    setDownloadUrl(null);
    setError(null);
    setLoading(true);

    try {
      // Make the POST request to the API
      const response = await fetch("https://autidocgenerateor.onrender.com/api/doc/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        },
        body: JSON.stringify({ url: repoUrl }),
      });

      // If the response is not okay, throw an error
      if (!response.ok) {
        throw new Error("Failed to fetch ZIP file. Server error.");
      }

      // Process the response as a Blob
      const blob = await response.blob();
      const downloadLink = window.URL.createObjectURL(blob);
      setDownloadUrl(downloadLink); // Set the download link for the user
    } catch (error) {
      setError(error.message); // Set any errors that occurred during the request
    } finally {
      setLoading(false); // Stop the loading state once the request is complete
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <h1 className='text-6xl font-bold mb-6 text-white'>Bank of API Hackathon</h1>
      <div className="bg-bg-grey p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl text-center font-semibold text-black mb-6">Auto Doc Generator 🚀</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="repoUrl" className="block text-gray-700 text-sm font-medium mb-2">Enter your project URL</label>
            <input
              type="text"
              id="repoUrl"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}  // Update repoUrl as user types
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              placeholder="Enter project repository URL"
            />
          </div>
          <button type="submit" className="w-full bg-purple-950 text-white p-3 rounded-3xl hover:bg-purple-900 focus:outline-none" disabled={loading}>
          {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-4 border-t-4 border-gray-50 border-solid rounded-full animate-spin border-t-transparent"></div>
              </div>
            ) : (
              'Generate Smart Documentation'
            )}
          </button>
        </form>


        {/* Show error message if any */}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

        {/* Show download link if available */}
        {downloadUrl && (
          <div className="mt-6 text-center">
            <a
              href={downloadUrl}
              className="bg-bg-grey text-purple-900 py-2 px-4 rounded-3xl border-2 border-solid border-purple-950 hover:border-purple-900 hover:bg-gray-50"
              download="smartDoc.zip"
            >
              Download Smart Documentation
            </a>
          </div>
        )}
      </div>
      <footer className='mt-3 text-white'>
        Built & Presented by team <span className='font-semibold underline'>BOA H-25</span>
      </footer>
    </div>
  );
}

export default App;
