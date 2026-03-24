import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import apiClient from "../../config/apiClient";
import axios from "axios";
import { resolveImageUrl } from "../../utils/common";

export default function FileInput({
  label,
  name = "image",
  accept = "image/*,.pdf,.jpeg",
  maxSizeMB = 2,
  multiple = false,
  onChange,
  value,
  disabled = false,
  error,
  helperText,
  className = "",
  showPreview = true,
  compressionQuality = 0.8,
  existingFile,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(existingFile || "");
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(existingFile || "");
  const fileInputRef = useRef(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Update preview when existingFile changes
  useEffect(() => {
    if (existingFile && !file) {
      setPreview(existingFile);
      setUploadedUrl(existingFile);
    }
  }, [existingFile, file]);

  // ===============================
  // IMAGE COMPRESSION LOGIC
  // ===============================
  const compressImage = (file, targetSizeBytes) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const scale = Math.sqrt(targetSizeBytes / file.size);
          if (scale < 1) {
            width *= scale;
            height *= scale;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let quality = compressionQuality;
          const attemptCompression = (q) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Compression failed"));
                  return;
                }

                if (blob.size > targetSizeBytes && q > 0.1) {
                  attemptCompression(q - 0.1);
                } else {
                  const compressedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              },
              file.type,
              q,
            );
          };

          attemptCompression(quality);
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // ===============================
  // UPLOAD FILE TO S3
  // ===============================
  const uploadToS3 = async (file) => {
    try {
      setIsUploading(true);
      setUploadError("");
      setUploadProgress(0);

      // Step 1: Get presigned URL from backend
      const { data } = await apiClient.post("/common/presigned-url", {
        fileType: file.type,
      });

      if (!data.success) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fileUrl } = data;

      // Step 2: Upload file to S3 using presigned URL
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(progress);
        },
      });

      console.log("✅ File uploaded successfully:", fileUrl);
      return new URL(fileUrl).pathname.slice(1);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setUploadError(err.response?.data?.message || "Failed to upload file");
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ===============================
  // PROCESS FILES
  // ===============================
  const processFile = async (selectedFile) => {
    setIsCompressing(true);
    setUploadError("");

    try {
      let processedFile = selectedFile;

      // Compress if needed
      if (selectedFile.size > maxSizeBytes) {
        if (selectedFile.type.startsWith("image/")) {
          processedFile = await compressImage(selectedFile, maxSizeBytes);
          console.log(
            `Image compressed: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB → ${(
              processedFile.size /
              1024 /
              1024
            ).toFixed(2)}MB`,
          );
        }
      }

      setFile(processedFile);

      // Generate local preview for images
      if (showPreview && processedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(processedFile);
      }

      setIsCompressing(false);

      // Upload to S3
      const fileUrl = await uploadToS3(processedFile);
      setUploadedUrl(fileUrl);

      // Update preview with uploaded URL
      if (processedFile.type.startsWith("image/")) {
        setPreview(fileUrl);
      }

      // Call onChange with S3 URL
      if (onChange) {
        onChange({
          target: {
            name: name,
            value: fileUrl,
          },
        });
      }
    } catch (err) {
      console.error("File processing error:", err);
      setUploadError(err.message || "Failed to process file");
    } finally {
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  // ===============================
  // FILE SELECTION HANDLER
  // ===============================
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // ===============================
  // DRAG & DROP HANDLERS
  // ===============================
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  // ===============================
  // REMOVE FILE
  // ===============================
  const removeFile = () => {
    setFile(null);
    setPreview("");
    setUploadedUrl("");
    setUploadError("");

    if (onChange) {
      onChange({
        target: {
          name: name,
          value: "",
        },
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ===============================
  // FORMAT FILE SIZE
  // ===============================
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const isProcessing = isCompressing || isUploading;
  const hasFile = file || uploadedUrl;

  return (
    <div className={`w-full ${className}`}>
      {/* LABEL */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* FILE INPUT AREA */}
      <div
        onClick={() =>
          !disabled && !isProcessing && fileInputRef.current?.click()
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? "border-blue-500 bg-blue-50"
            : error || uploadError
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }
          ${disabled || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || isProcessing}
          className="hidden"
        />

        {isCompressing ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
            <p className="text-sm text-gray-600">Compressing image...</p>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-2">Uploading to cloud...</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        ) : hasFile ? (
          <div className="flex flex-col items-center justify-center">
            {/* Image Preview */}
            {preview && (
              <div className="relative mb-3">
                <img
                  src={resolveImageUrl(preview)}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* File Info */}
            {file && (
              <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ImageIcon
                      size={16}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {uploadedUrl && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Check size={12} />
                            Uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">Click to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="text-gray-400 mb-3" size={40} />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {accept.includes("image") && accept.includes("pdf")
                ? "Images or PDF files"
                : accept.includes("image")
                  ? "Image files"
                  : "PDF files"}{" "}
              (max {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {/* HELPER TEXT */}
      {helperText && !error && !uploadError && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}

      {/* ERROR MESSAGE */}
      {(error || uploadError) && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={12} />
          <span>{error || uploadError}</span>
        </div>
      )}
    </div>
  );
}
