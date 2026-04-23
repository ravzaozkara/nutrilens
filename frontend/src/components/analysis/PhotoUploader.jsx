import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';
import {
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

export default function PhotoUploader({ onAnalyze, loading }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // Cleanup object URL on unmount or when preview changes to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      // Revoke previous preview URL before creating a new one
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleReset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file);
    }
  };

  if (preview) {
    return (
      <div className="space-y-6">
        {/* Preview */}
        <div className="relative max-w-md mx-auto">
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-2xl shadow-lg"
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* File info */}
        <p className="text-center text-gray-600">
          Seçilen dosya: <span className="font-medium">{file.name}</span>
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            Değiştir
          </Button>
          <Button onClick={handleAnalyze} loading={loading}>
            Analiz Et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <PhotoIcon className="w-16 h-16 text-primary-500 mb-4" />
          ) : (
            <CameraIcon className="w-16 h-16 text-gray-400 mb-4" />
          )}
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragActive ? 'Bırakın!' : 'Fotoğrafı buraya sürükleyin'}
          </p>
          <p className="text-gray-500">veya bilgisayarınızdan seçin</p>
          <p className="text-sm text-gray-400 mt-2">
            JPG, PNG veya WebP (max. 10MB)
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-2">İpuçları:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Yemeği yukarıdan çekin</li>
          <li>• İyi aydınlatılmış ortam seçin</li>
          <li>• Tek bir yemek türü çekin</li>
        </ul>
      </div>
    </div>
  );
}
