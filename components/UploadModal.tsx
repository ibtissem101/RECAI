import React, { useState, useRef, DragEvent } from "react";
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle,
  Briefcase,
  MapPin,
} from "lucide-react";

interface JobPostingSimple {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  skills: string[];
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  selectedJob?: JobPostingSimple | null;
}

// Check if filename suggests it's a CV/Resume
const isLikelyCVFilename = (filename: string): boolean => {
  const lowerName = filename.toLowerCase();
  const cvKeywords = [
    "cv",
    "resume",
    "curriculum",
    "vitae",
    "application",
    "candidate",
  ];
  return cvKeywords.some((keyword) => lowerName.includes(keyword));
};

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  selectedJob,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const newWarnings: string[] = [];

    for (const file of newFiles) {
      // Check if it's a PDF
      if (file.type !== "application/pdf") {
        newWarnings.push(`${file.name}: Only PDF files are accepted`);
        continue;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        newWarnings.push(`${file.name}: File exceeds 10MB limit`);
        continue;
      }

      // Warn if filename doesn't suggest it's a CV (but still allow it)
      if (!isLikelyCVFilename(file.name)) {
        newWarnings.push(
          `${file.name}: Filename doesn't contain CV/Resume keywords - make sure this is a CV`
        );
      }

      validFiles.push(file);
    }

    setWarnings((prev) => [...prev, ...newWarnings]);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearWarnings = () => {
    setWarnings([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Upload Resumes
              </h2>
              {selectedJob && (
                <div className="mt-2 p-3 bg-gradient-to-r from-[#eef2ff] to-[#f5f7ff] rounded-xl border border-[#BDDEF3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3f5ecc] to-[#5a73d6] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {selectedJob.title}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {selectedJob.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedJob.location}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                    ${
                      dragActive
                        ? "border-[#3f5ecc] bg-[#f5f7ff]"
                        : "border-slate-300 hover:border-[#3f5ecc] hover:bg-slate-50"
                    }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleChange}
            />

            <div className="w-16 h-16 bg-[#eef2ff] rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-[#3f5ecc]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              Upload CV/Resume Files
            </h3>
            <p className="text-slate-500 mt-1">
              PDF files only • Max 10MB per file
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Files should contain: CV, Resume, or Curriculum Vitae
            </p>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Warnings
                    </p>
                    <ul className="text-xs text-amber-700 mt-1 space-y-1">
                      {warnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={clearWarnings}
                  className="text-amber-500 hover:text-amber-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                CVs Ready to process ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length === 0 && (
            <div className="mt-8 text-center py-8">
              <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                <AlertCircle size={16} /> No files selected yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#F8FAFC] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpload(files)}
            disabled={files.length === 0}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-all flex items-center gap-2
                    ${
                      files.length > 0
                        ? "bg-[#3f5ecc] hover:bg-[#3552b8] shadow-lg shadow-[#3f5ecc]/20"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
          >
            <UploadCloud size={18} />
            {files.length > 0
              ? `Process ${files.length} Resumes`
              : "Process Resumes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
