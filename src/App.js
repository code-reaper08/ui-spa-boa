import React, { useState } from 'react';
import './App.css'; // Tailwind should be imported

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!repoUrl) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setError(null); 

    try {
      const response = await fetch("https://autidocgenerateor.onrender.com/api/doc/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        },
        body: JSON.stringify({ url: repoUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ZIP file. Server error.");
      }

      const blob = await response.blob();
      const downloadLink = window.URL.createObjectURL(blob);
      setDownloadUrl(downloadLink);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-bg-blue p-4">
      <div className="bg-bg-grey p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl text-center font-semibold text-black mb-6">Auti Doc Generator 🚀</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="repoUrl" className="block text-gray-700 text-sm font-medium mb-2">Enter your project URL</label>
            <input
              type="text"
              id="repoUrl"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              placeholder="Enter project repository URL"
            />
          </div>
          <button type="submit" className="w-full bg-bg-red text-white p-3 rounded-md hover:bg-bg-red-hover focus:outline-none" disabled={loading}>
            {loading ? 'Loading...' : 'Generate Smart Documentation'}
          </button>
        </form>

        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

        {downloadUrl && (
          <div className="mt-6 text-center">
            <a href={downloadUrl} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" download="smartDoc.zip">
              Download Smart Documentation
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
