import { useState, useEffect } from 'react';
import { X, FileText, Image, File, Download, ZoomIn, ZoomOut } from 'lucide-react';

export default function FilePreview({ file, onClose }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const isImage = file?.type.startsWith('image/');
  const isPDF = file?.type === 'application/pdf';
  const isText = file?.type.startsWith('text/');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 overflow-auto">
          <img
            src={fileUrl}
            alt={file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <FileText className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Document</h3>
            <p className="text-gray-600 mb-4">
              PDF preview is not available in this demo
            </p>
            <p className="text-sm text-gray-500">
              Click download to view the full document
            </p>
          </div>
        </div>
      );
    }

    if (isText) {
      return (
        <div className="h-full bg-white overflow-auto">
          <div className="p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {/* In a real app, you'd read the file content here */}
              Loading text content...
            </pre>
          </div>
        </div>
      );
    }

    // Default preview for unsupported file types
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <File className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {file.type || 'Unknown File Type'}
          </h3>
          <p className="text-gray-600 mb-4">
            Preview not available for this file type
          </p>
          <p className="text-sm text-gray-500">
            Click download to access the file
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isImage && <Image className="w-5 h-5 text-blue-500" />}
              {isPDF && <FileText className="w-5 h-5 text-red-500" />}
              {!isImage && !isPDF && <File className="w-5 h-5 text-gray-500" />}
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {file.name}
              </h2>
            </div>
            <div className="text-sm text-gray-500 ml-2">
              {formatFileSize(file.size)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
              <div className="flex items-center gap-1 mr-4">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
            
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative overflow-hidden">
          {renderPreview()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            File type: {file.type || 'Unknown'} • Size: {formatFileSize(file.size)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}