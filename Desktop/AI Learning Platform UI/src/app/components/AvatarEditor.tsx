/**
 * Avatar Editor Modal
 * Professional image editor like LeetCode with zoom, rotate, and crop controls
 */

import { useRef, useState } from 'react';
import { X, RotateCcw, RotateCw } from 'lucide-react';

interface AvatarEditorProps {
  isOpen: boolean;
  imagePreview: string;
  onSave: (editedImage: File) => Promise<void>;
  onCancel: () => void;
  error?: string;
  isUploading?: boolean;
}

export const AvatarEditor = ({
  isOpen,
  imagePreview,
  onSave,
  onCancel,
  error = '',
  isUploading = false,
}: AvatarEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Math.max(100, Math.min(200, Number(e.target.value))));
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas size
      canvas.width = 512;
      canvas.height = 512;

      // Clear canvas
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Move to center
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply zoom and draw image centered
      const scale = zoom / 100;
      const drawSize = (canvas.width / scale) * 0.8;
      ctx.drawImage(
        image,
        -drawSize / 2,
        -drawSize / 2,
        drawSize,
        drawSize
      );

      ctx.restore();

      // Convert to File and wait for upload to complete
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          try {
            if (blob) {
              const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
              await onSave(file);
              resolve();
            } else {
              reject(new Error('Failed to create image blob'));
            }
          } catch (err) {
            reject(err);
          }
        }, 'image/jpeg', 0.95);
      });
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Avatar
          </h2>
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Section */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Canvas - Hidden, for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Image Preview */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-lg flex items-center justify-center">
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
                    transition: 'transform 0.2s ease-out',
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-6">
              {/* Zoom Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">
                    Zoom
                  </label>
                  <span className="text-sm font-semibold text-purple-600">
                    {zoom}%
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={zoom}
                  onChange={handleZoomChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex gap-2 justify-between text-xs text-gray-500">
                  <span>100%</span>
                  <span>200%</span>
                </div>
              </div>

              {/* Rotation Controls */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">Rotation</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRotateLeft}
                    disabled={isUploading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={handleRotateRight}
                    disabled={isUploading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Right
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reset & Rotation Value */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  Rotation: <span className="font-semibold">{rotation}°</span>
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isUploading}
                  className="text-xs font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              'Save Avatar'
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};
