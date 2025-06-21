import { useState, useRef } from 'react';
import { X, Upload, File, Image, FileText, Eye } from 'lucide-react';
import FilePreview from './FilePreview';

export default function UploadModal({ onClose, onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="w-12 h-12 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="w-12 h-12 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="w-12 h-12 text-blue-600" />;
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return <FileText className="w-12 h-12 text-green-600" />;
    } else {
      return <File className="w-12 h-12 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      onUploadComplete({
        id: Date.now(),
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type,
        modified: 'Just now',
        starred: false
      });
    }, 2000);
  };

  const handlePreview = () => {
    if (selectedFile) {
      setShowPreview(true);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Content */}
          <div className="p-6">
            {!selectedFile ? (
              // Upload Area
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload your file here
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag and drop your file here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleInputChange}
                  className="hidden"
                  accept="*/*"
                />
                <p className="text-sm text-gray-500 mt-4">
                  Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images, and more
                </p>
              </div>
            ) : (
              // File Selected
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  {getFileIcon(selectedFile.type)}
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreview}
                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="text-gray-600">Uploading file</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 animate-pulse"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedFile && !uploading
                  ? 'bg-sky-600 text-white hover:bg-sky-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {showPreview && selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}