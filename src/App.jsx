import { useState } from 'react';
import FileTypeSelector from './components/FileTypeSelector';
import SizeSlider from './components/SizeSlider';
import Loader from './components/Loader';
import { generateZip } from './utils/fileGenerator';

function App() {
  const [fileType, setFileType] = useState('pdf');
  const [fileSize, setFileSize] = useState(1024); // in KB
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Allow React to render the loader before starting heavy computation
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const blob = await generateZip(fileType, fileSize, 1, setProgress);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dummy.${fileType}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating files:', error);
      alert('Error generating files. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Free Online Dummy File Generator
          </h1>
          <p className="text-gray-600 mb-3">
            Create test files instantly in your browser - PDF, DOCX, CSV, JSON, TXT, JPG
          </p>
          <p className="text-sm text-gray-500">
            Generate sample files for testing • No registration required • 100% free and secure
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Privacy Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-sm mb-6 border border-green-200">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Privacy-focused: All files generated locally in your browser</span>
          </div>

          {/* File Type Selector */}
          <FileTypeSelector selectedType={fileType} onTypeChange={setFileType} />

          {/* Size Slider */}
          <SizeSlider size={fileSize} onSizeChange={setFileSize} />

          {/* Loader */}
          <Loader progress={progress} isVisible={isGenerating} />

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{isGenerating ? 'Generating...' : 'Generate & Download'}</span>
          </button>

          {/* CTA Section */}
          {/* <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">Looking for bulk file generation or custom file formats?</p>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Join waitlist for Pro features
            </button>
          </div> */}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Coming Soon:</span> More file formats including audio files (MP3, WAV), video files (MP4, AVI), and archive formats (ZIP, RAR)!
          </p>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Use Our Dummy File Generator?</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Perfect for Testing</h3>
              <p>Generate dummy files for software testing, application development, and quality assurance. Test file upload features, storage systems, and data processing with realistic sample files.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Multiple File Formats</h3>
              <p>Create test files in popular formats: PDF documents, DOCX Word files, CSV spreadsheets, JSON data files, TXT text files, and JPG images. All generated instantly without downloads.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Flexible File Sizes</h3>
              <p>Generate files from 10KB to 50MB to test different scenarios. Perfect for testing file size limits, upload restrictions, and storage capacity in your applications.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">100% Secure & Private</h3>
              <p>All file generation happens locally in your browser using JavaScript. No data is uploaded to any server, ensuring complete privacy and security for your testing needs.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">© 2025 Dummy File Generator - Free online tool for generating test files</p>
          <p>All files generated client-side • No uploads • No tracking • Open source</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
