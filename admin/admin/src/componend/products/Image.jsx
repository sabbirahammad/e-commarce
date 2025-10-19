import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const HeroNavbarImageUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fetch current HeroNavbar image and image data
  useEffect(() => {
    const fetchCurrentImage = async () => {
      try {
        // First get the image metadata
        const metadataRes = await axios.get(
          "http://localhost:5000/api/v1/hero-navbar"
        );
        if (metadataRes.data.success && metadataRes.data.heroNavbar) {
          setCurrentImage(metadataRes.data.heroNavbar);

          // Then get the image data as base64
          try {
            const imageDataRes = await axios.get(
              "http://localhost:5000/api/v1/hero-navbar/image-data"
            );
            if (imageDataRes.data.success) {
              setCurrentImage(prev => ({
                ...prev,
                imageData: imageDataRes.data.image
              }));
            }
          } catch (imageErr) {
            console.error("Error fetching image data:", imageErr);
          }
        }
      } catch (err) {
        console.error("Error fetching current HeroNavbar image:", err);
      }
    };

    fetchCurrentImage();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/hero-navbar/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      setResponse(res.data);

      // Refresh current image after successful upload
      if (res.data.success) {
        // Add a small delay to ensure the image is saved to disk
        setTimeout(async () => {
          setCurrentImage(res.data.heroNavbar);

          // Also refresh the base64 image data
          try {
            const imageDataRes = await axios.get(
              "http://localhost:5000/api/v1/hero-navbar/image-data"
            );
            if (imageDataRes.data.success) {
              setCurrentImage(prev => ({
                ...prev,
                imageData: imageDataRes.data.image
              }));
            }
          } catch (imageErr) {
            console.error("Error refreshing image data:", imageErr);
          }
        }, 500);
        setFile(null); // Reset file input
      }
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">HeroNavbar Image Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Upload and manage the hero banner image for your website</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Image Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current HeroNavbar Image</h3>
            {currentImage ? (
              <div className="relative">
                <img
                  src={currentImage.imageData || '/no-image.svg'}
                  alt="Current HeroNavbar"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    console.error('Failed to load image:', e.target.src);
                    // Fallback to no-image.svg
                    e.target.src = '/no-image.svg';
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  Active
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No HeroNavbar image uploaded yet</p>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Upload New Image</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Uploading..." : "Upload HeroNavbar Image"}
              </button>
            </div>
          </div>

          {/* Response Display */}
          {response && (
            <div className={`mt-4 p-4 border rounded-lg ${response.success ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
              <h3 className={`font-semibold ${response.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {response.success ? '✅ Success' : '❌ Error'}
              </h3>
              <p className={`${response.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {response.message || response.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroNavbarImageUpload;
