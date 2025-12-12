import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Search, FileText, Globe, BrainCircuit, ShieldCheck } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({ isOpen, onComplete }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Extracting text from PDF...', status: 'pending', detail: 'Found 847 words' },
    { id: 2, label: 'Identifying key skills...', status: 'pending', detail: 'Detected: Python, AWS, PostgreSQL, Docker' },
    { id: 3, label: 'Searching web for verification...', status: 'pending', detail: 'Found LinkedIn & GitHub (@sarahchen)' },
    { id: 4, label: 'Researching market intelligence...', status: 'pending', detail: 'Salary data: $145K–$175K range' },
    { id: 5, label: 'Analyzing experience relevance...', status: 'pending', detail: '8 years backend vs 7 required' },
    { id: 6, label: 'Scoring candidate...', status: 'pending', detail: 'Score calculated: 94/100' },
    { id: 7, label: 'Generating interview prep...', status: 'pending', detail: 'Created 6 personalized questions' },
  ]);

  useEffect(() => {
    if (!isOpen) return;

    let currentStep = 0;
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
        return;
      }

      setSteps(prev => prev.map((step, index) => {
        if (index === currentStep) return { ...step, status: 'processing' };
        if (index < currentStep) return { ...step, status: 'completed' };
        return step;
      }));

      // Fast forward the "processing" to "completed" quickly for effect
      setTimeout(() => {
         setSteps(prev => prev.map((step, index) => {
          if (index === currentStep) return { ...step, status: 'completed' };
          return step;
        }));
        currentStep++;
      }, 800); // Step duration

    }, 1000); 

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#BDDEF3]/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#BDDEF3]">
        <div className="bg-[#1BB0A3] px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                AI Analysis in Progress
            </h3>
            <span className="text-[#D7E9F4] text-sm">TalentFlow Engine</span>
        </div>
        
        <div className="p-6 space-y-4">
            {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                    <div className="mt-1">
                        {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-[#D7E9F4]" />}
                        {step.status === 'processing' && <Loader2 className="w-5 h-5 text-[#1BB0A3] animate-spin" />}
                        {step.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#1BB0A3]" />}
                    </div>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                            {step.label}
                        </p>
                        {step.status !== 'pending' && (
                            <p className="text-xs text-[#158c82] mt-0.5 animate-pulse">
                                {step.detail}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <div className="px-6 py-4 bg-[#F0F7FB] border-t border-[#D7E9F4] flex justify-between items-center">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#1BB0A3]" />
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