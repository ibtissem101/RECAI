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
} from "lucide-react";
import { ProcessingStep, Candidate, RankedCandidatesResult } from "../types";

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete: (result?: RankedCandidatesResult) => void;
  processingResult?: RankedCandidatesResult | null;
  isProcessingComplete?: boolean;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onComplete,
  processingResult,
  isProcessingComplete,
}) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 1,
      label: "Extracting text from PDFs...",
      status: "pending",
      detail: "Parsing document content",
    },
    {
      id: 2,
      label: "Validating documents...",
      status: "pending",
      detail: "Checking if files are resumes",
    },
    {
      id: 3,
      label: "Identifying key skills...",
      status: "pending",
      detail: "Analyzing technical competencies",
    },
    {
      id: 4,
      label: "Scoring candidates with AI...",
      status: "pending",
      detail: "Evaluating fit for role",
    },
    {
      id: 5,
      label: "Ranking candidates...",
      status: "pending",
      detail: "Sorting by score",
    },
    {
      id: 6,
      label: "Categorizing results...",
      status: "pending",
      detail: "Top 20% / Middle 60% / Bottom 20%",
    },
    {
      id: 7,
      label: "Generating personalized emails...",
      status: "pending",
      detail: "Creating notifications",
    },
    {
      id: 8,
      label: "Finalizing results...",
      status: "pending",
      detail: "Preparing candidate list",
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
    return (
      <div className="fixed inset-0 bg-[#BDDEF3]/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#BDDEF3]">
          <div className="bg-[#3f5ecc] px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Processing Complete
            </h3>
            <span className="text-[#eef2ff] text-sm">
              {processingResult.allRanked.length} Candidates Ranked
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Confirmed */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {processingResult.confirmed.length}
                </p>
                <p className="text-xs text-green-600 font-medium">CONFIRMED</p>
                <p className="text-[10px] text-green-500 mt-1">
                  Top 20% - Interview
                </p>
              </div>

              {/* Waitlist */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {processingResult.waitlist.length}
                </p>
                <p className="text-xs text-amber-600 font-medium">WAITLIST</p>
                <p className="text-[10px] text-amber-500 mt-1">Middle 60%</p>
              </div>

              {/* Rejected */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {processingResult.rejected.length}
                </p>
                <p className="text-xs text-red-600 font-medium">REJECTED</p>
                <p className="text-[10px] text-red-500 mt-1">Bottom 20%</p>
              </div>
            </div>

            {/* Candidate List Preview */}
            <div className="bg-[#F8FAFC] rounded-lg border border-[#eef2ff] max-h-60 overflow-y-auto">
              <div className="p-3 border-b border-[#eef2ff] bg-white sticky top-0">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ranked Candidates
                </h4>
              </div>
              <div className="divide-y divide-[#eef2ff]">
                {processingResult.allRanked.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className="px-3 py-2 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400 w-5">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {candidate.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          candidate.score >= 80
                            ? "text-green-600"
                            : candidate.score >= 50
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {candidate.score}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          candidate.applicationStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : candidate.applicationStatus === "waitlist"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {candidate.applicationStatus?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Status */}
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>
                <strong>{processingResult.allRanked.length}</strong>{" "}
                personalized emails generated and ready to send
              </span>
            </div>

            {/* Declined Files Section */}
            {processingResult.declined &&
              processingResult.declined.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-2 mb-3">
                    <FileWarning className="w-4 h-4" />
                    {processingResult.declined.length} File(s) Declined - Not
                    Resumes
                  </h4>
                  <div className="space-y-2">
                    {processingResult.declined.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-white rounded-lg p-3 border border-orange-100"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {file.reason}
                          </p>
                          {file.documentType &&
                            file.documentType !== "unknown" && (
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded">
                                Detected: {file.documentType}
                              </span>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-orange-600 mt-3">
                    These files were not recognized as resumes and were skipped
                    from processing.
                  </p>
                </div>
              )}
          </div>

          <div className="px-6 py-4 bg-[#f5f7ff] border-t border-[#eef2ff] flex justify-end">
            <button
              onClick={() => onComplete(processingResult)}
              className="px-6 py-2 bg-[#3f5ecc] hover:bg-[#3552b8] text-white font-medium rounded-lg transition-colors shadow-md shadow-[#3f5ecc]/20"
            >
              View All Candidates
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#BDDEF3]/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#BDDEF3]">
        <div className="bg-[#3f5ecc] px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            AI Analysis in Progress
          </h3>
          <span className="text-[#eef2ff] text-sm">TalentFlow Engine</span>
        </div>

        <div className="p-6 space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="mt-1">
                {step.status === "pending" && (
                  <div className="w-5 h-5 rounded-full border-2 border-[#eef2ff]" />
                )}
                {step.status === "processing" && (
                  <Loader2 className="w-5 h-5 text-[#3f5ecc] animate-spin" />
                )}
                {step.status === "completed" && (
                  <CheckCircle2 className="w-5 h-5 text-[#3f5ecc]" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    step.status === "pending"
                      ? "text-slate-400"
                      : "text-slate-800"
                  }`}
                >
                  {step.label}
                </p>
                {step.status !== "pending" && (
                  <p className="text-xs text-[#158c82] mt-0.5 animate-pulse">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-[#f5f7ff] border-t border-[#eef2ff] flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#3f5ecc]" />
            <span>4 Web Sources Consulted</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe className="w-4 h-4 text-[#E9C7DB]" />
            <span>Real-time Market Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
