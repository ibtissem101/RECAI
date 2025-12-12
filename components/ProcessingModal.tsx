import React, { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  Search,
  FileText,
  Globe,
  BrainCircuit,
  ShieldCheck,
  Mail,
  Users,
  Trophy,
  Clock,
  XCircle,
  FileWarning,
  AlertTriangle,
  X,
  Sparkles,
  Target,
  BarChart3,
  Layers,
} from "lucide-react";
import { Candidate, RankedCandidatesResult } from "../types";

// Extended ProcessingStep with icon support
interface ProcessingStepWithIcon {
  id: number;
  label: string;
  status: "pending" | "processing" | "completed";
  detail?: string;
  icon?: string;
}

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete: (result?: RankedCandidatesResult) => void;
  onCancel?: () => void;
  processingResult?: RankedCandidatesResult | null;
  isProcessingComplete?: boolean;
  fileCount?: number;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onComplete,
  onCancel,
  processingResult,
  isProcessingComplete,
  fileCount = 0,
}) => {
  const [steps, setSteps] = useState<ProcessingStepWithIcon[]>([
    {
      id: 1,
      label: "Extracting text from PDFs",
      status: "pending",
      detail: "Reading and parsing document content from uploaded files",
      icon: "FileText",
    },
    {
      id: 2,
      label: "Validating documents",
      status: "pending",
      detail: "Checking each file to confirm it's a valid resume/CV",
      icon: "ShieldCheck",
    },
    {
      id: 3,
      label: "Identifying key skills & experience",
      status: "pending",
      detail:
        "AI is analyzing technical competencies, education, and work history",
      icon: "Search",
    },
    {
      id: 4,
      label: "Scoring candidates with AI",
      status: "pending",
      detail:
        "Evaluating fit for role based on requirements and qualifications",
      icon: "Sparkles",
    },
    {
      id: 5,
      label: "Ranking candidates",
      status: "pending",
      detail: "Sorting all candidates by match score from highest to lowest",
      icon: "BarChart3",
    },
    {
      id: 6,
      label: "Categorizing results",
      status: "pending",
      detail:
        "Grouping into Confirmed (top 20%), Waitlist (60%), Rejected (20%)",
      icon: "Layers",
    },
    {
      id: 7,
      label: "Generating personalized emails",
      status: "pending",
      detail:
        "Creating custom interview invites, waitlist, and rejection notices",
      icon: "Mail",
    },
    {
      id: 8,
      label: "Finalizing results",
      status: "pending",
      detail: "Preparing candidate dashboard with all processed data",
      icon: "Target",
    },
  ]);

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowResults(false);
      return;
    }

    let currentStep = 0;

    // Reset steps
    setSteps((prev) => prev.map((s) => ({ ...s, status: "pending" })));
    setShowResults(false);

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        // Show results view before completing
        setShowResults(true);
        return;
      }

      setSteps((prev) =>
        prev.map((step, index) => {
          if (index === currentStep) return { ...step, status: "processing" };
          if (index < currentStep) return { ...step, status: "completed" };
          return step;
        })
      );

      // Fast forward the "processing" to "completed" quickly for effect
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, index) => {
            if (index === currentStep) return { ...step, status: "completed" };
            return step;
          })
        );
        currentStep++;
      }, 800); // Step duration
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // Results view after processing
  if (showResults && processingResult) {
    const totalProcessed = processingResult.allRanked.length;
    const declinedCount = processingResult.declined?.length || 0;

    // No valid resumes processed - show simple message
    if (totalProcessed === 0) {
      return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#eef2ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileWarning className="w-8 h-8 text-[#3f5ecc]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No Resumes Found
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {declinedCount > 0
                  ? `${declinedCount} file${
                      declinedCount !== 1 ? "s were" : " was"
                    } uploaded but none were valid resumes.`
                  : "No valid resume files were detected in your upload."}
              </p>
              <button
                onClick={() => onComplete(processingResult)}
                className="w-full py-3 bg-[#3f5ecc] hover:bg-[#3552b8] text-white font-medium rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Success - show simple results
    return (
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[#eef2ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#3f5ecc]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Analysis Complete
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {totalProcessed} candidate{totalProcessed !== 1 ? "s" : ""}{" "}
              processed and ranked
            </p>

            {/* Simple stats row */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3f5ecc]">
                  {processingResult.confirmed.length}
                </p>
                <p className="text-slate-500">Confirmed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3f5ecc]">
                  {processingResult.waitlist.length}
                </p>
                <p className="text-slate-500">Waitlist</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3f5ecc]">
                  {processingResult.rejected.length}
                </p>
                <p className="text-slate-500">Rejected</p>
              </div>
            </div>

            {declinedCount > 0 && (
              <p className="text-xs text-slate-400 mb-4">
                {declinedCount} file{declinedCount !== 1 ? "s" : ""} skipped
                (not resumes)
              </p>
            )}

            <button
              onClick={() => onComplete(processingResult)}
              className="w-full py-3 bg-[#3f5ecc] hover:bg-[#3552b8] text-white font-medium rounded-xl transition-colors"
            >
              View Candidates
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#BDDEF3]">
        <div className="bg-[#3f5ecc] px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            AI Analysis in Progress
          </h3>
          <div className="flex items-center gap-3">
            {fileCount > 0 && (
              <span className="text-[#eef2ff] text-sm bg-white/20 px-2 py-0.5 rounded">
                {fileCount} file{fileCount !== 1 ? "s" : ""}
              </span>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded transition-colors"
                title="Cancel processing"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {steps.map((step) => {
            const StepIcon =
              step.icon === "FileText"
                ? FileText
                : step.icon === "ShieldCheck"
                ? ShieldCheck
                : step.icon === "Search"
                ? Search
                : step.icon === "Sparkles"
                ? Sparkles
                : step.icon === "BarChart3"
                ? BarChart3
                : step.icon === "Layers"
                ? Layers
                : step.icon === "Mail"
                ? Mail
                : step.icon === "Target"
                ? Target
                : FileText;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
                  step.status === "processing"
                    ? "bg-[#eef2ff] border border-[#3f5ecc]/30"
                    : step.status === "completed"
                    ? "bg-green-50/50"
                    : "bg-slate-50/50"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {step.status === "pending" && (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
                      <StepIcon className="w-3 h-3 text-slate-300" />
                    </div>
                  )}
                  {step.status === "processing" && (
                    <div className="w-6 h-6 rounded-full bg-[#3f5ecc] flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                  {step.status === "completed" && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-medium ${
                        step.status === "pending"
                          ? "text-slate-400"
                          : step.status === "processing"
                          ? "text-[#3f5ecc]"
                          : "text-slate-700"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.status === "processing" && (
                      <span className="text-xs text-[#3f5ecc] bg-[#3f5ecc]/10 px-2 py-0.5 rounded animate-pulse">
                        In Progress
                      </span>
                    )}
                    {step.status === "completed" && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                        Done
                      </span>
                    )}
                  </div>
                  {step.status !== "pending" && (
                    <p className="text-xs text-slate-500 mt-1">{step.detail}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-[#f5f7ff] border-t border-[#eef2ff]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#3f5ecc]" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Globe className="w-4 h-4 text-[#E9C7DB]" />
                <span>Real-time Processing</span>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
