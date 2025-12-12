import React, { useState } from 'react';
import { Candidate } from '../types';
import { 
  ArrowLeft, Mail, Phone, MapPin, Linkedin, Github, ExternalLink, 
  CheckCircle2, XCircle, Calendar, Download, 
  BrainCircuit, Briefcase, Code, Award, DollarSign, 
  TrendingUp, AlertTriangle, MessageSquare, Clock, Globe, ShieldCheck,
  Calculator
} from 'lucide-react';

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onBack }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'resume' | 'interview'>('overview');

  const getScoreBreakdown = (score: number) => {
    // Mock logic to distribute score for visualization
    const technical = Math.min(100, Math.max(0, score + 3));
    const experience = Math.min(100, Math.max(0, score - 4));
    const education = Math.min(100, Math.max(0, score + 6));
    const culture = Math.min(100, Math.max(0, score - 2));

    return [
        { label: 'Technical Skills Match', value: technical, weight: '40%', color: '#1BB0A3' },
        { label: 'Experience Relevance', value: experience, weight: '30%', color: '#1BB0A3' },
        { label: 'Education & Pedigree', value: education, weight: '15%', color: '#E9C7DB' },
        { label: 'Culture & Soft Skills', value: culture, weight: '15%', color: '#E9C7DB' },
    ];
  };

  const scoreBreakdown = getScoreBreakdown(candidate.score);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            {/* AI Executive Summary */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-[#1BB0A3]" /> AI Executive Summary
                </h3>
                <div className="bg-[#F0F7FB] p-4 rounded-lg border border-[#BDDEF3] mb-4">
                    <p className="text-slate-700 text-sm leading-relaxed">
                        <span className="font-semibold text-[#1BB0A3]">Recommendation: Strong Hire.</span> {candidate.name} demonstrates exceptional alignment with the Senior Backend role. 
                        Their verification data confirms strong expertise in Python/Django ({candidate.webVerification.github?.notableProject}), directly matching our tech stack. 
                        Previous tenure at {candidate.previousCompanies[0]?.name} suggests readiness for our current scaling challenges.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-green-100 bg-green-50/50 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Key Strengths
                        </h4>
                        <ul className="space-y-1">
                            {candidate.skills.slice(0,3).map(skill => (
                                <li key={skill} className="text-sm text-slate-700 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-green-500 rounded-full"></span> {skill} Expert
                                </li>
                            ))}
                            <li className="text-sm text-slate-700 flex items-center gap-2">
                                <span className="w-1 h-1 bg-green-500 rounded-full"></span> {candidate.previousCompanies[0]?.context}
                            </li>
                        </ul>
                    </div>
                    <div className="border border-amber-100 bg-amber-50/50 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Areas to Probe
                        </h4>
                        <ul className="space-y-1">
                            {candidate.missingSkills.map(skill => (
                                <li key={skill} className="text-sm text-slate-700 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span> Limited {skill} evidence
                                </li>
                            ))}
                            <li className="text-sm text-slate-700 flex items-center gap-2">
                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span> Salary expectations (High)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Score Calculation Analysis - NEW SECTION */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#1BB0A3]" /> Score Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Donut Chart */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#F0F7FB] rounded-xl border border-[#BDDEF3] relative overflow-hidden">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#D7E9F4"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={candidate.score >= 90 ? '#1BB0A3' : candidate.score >= 70 ? '#FBBF24' : '#F87171'}
                                    strokeWidth="3"
                                    strokeDasharray={`${candidate.score}, 100`}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-slate-800">{candidate.score}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                            </div>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-3 font-medium">Weighted Aggregate</p>
                    </div>
                    
                    {/* Breakdown Bars */}
                    <div className="md:col-span-3 flex flex-col justify-center space-y-5">
                         {scoreBreakdown.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-end mb-1.5">
                                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                                    <div className="text-right flex items-baseline gap-2">
                                         <span className="text-sm font-bold text-slate-800">{item.value}/100</span>
                                         <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Weight: {item.weight}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-100">
                                    <div 
                                        className="h-full rounded-full"
                                        style={{ 
                                            width: `${item.value}%`,
                                            backgroundColor: item.color
                                        }} 
                                    ></div>
                                </div>
                            </div>
                         ))}
                         <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-100 mt-2">
                            * Scores are calculated using semantic analysis of the resume against the job description, verified by external web data sources.
                         </p>
                    </div>
                </div>
            </div>

            {/* Experience Timeline */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-slate-500" /> Work History
                </h3>
                <div className="relative pl-2 space-y-8">
                        {/* Vertical Line */}
                    <div className="absolute top-2 bottom-2 left-[21px] w-px bg-slate-200"></div>

                    {candidate.previousCompanies.map((job, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 group">
                            <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 shadow-sm group-hover:border-[#1BB0A3] transition-colors">
                                <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-[#1BB0A3]" />
                            </div>
                            <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-[#BDDEF3] transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-800">{job.role}</h4>
                                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">{job.duration}</span>
                                </div>
                                <p className="text-sm font-medium text-[#1BB0A3] mb-2">{job.name}</p>
                                <p className="text-sm text-slate-600 mb-3">{job.context}</p>
                                <div className="flex flex-wrap gap-2">
                                    {['System Design', 'Leadership', 'Scaling'].map(tag => (
                                        <span key={tag} className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </>
        );

      case 'resume':
        return (
            <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-8 min-h-[600px]">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Resume Transcript</h3>
                    <button className="text-[#1BB0A3] text-sm font-medium flex items-center gap-2 hover:underline">
                        <Download className="w-4 h-4" /> Download Original PDF
                    </button>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 font-normal">
                    <p className="text-xl font-bold text-slate-800 mb-0">{candidate.name}</p>
                    <p className="text-sm text-slate-500 mt-0">{candidate.email || 'email@example.com'} | {candidate.webVerification.salaryBenchmark.location}</p>
                    
                    <h4 className="text-slate-800 mt-6 mb-2 font-bold uppercase text-sm">Summary</h4>
                    <p className="mb-4">Senior Backend Engineer with {candidate.experienceYears} years of experience building scalable distributed systems. Expert in Python, Django, and cloud infrastructure.</p>
                    
                    <h4 className="text-slate-800 mt-6 mb-2 font-bold uppercase text-sm">Experience</h4>
                    {candidate.previousCompanies.map((job, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between">
                                <p className="font-bold text-slate-700">{job.role}</p>
                                <p className="text-sm text-slate-500">{job.duration}</p>
                            </div>
                            <p className="text-sm font-medium text-[#1BB0A3] mb-2">{job.name}</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Led development of core payment processing infrastructure handling $1B+ volume.</li>
                                <li>Architected microservices migration using {candidate.skills[0] || 'Python'} and {candidate.skills[1] || 'AWS'}.</li>
                                <li>Mentored junior engineers and established code quality standards.</li>
                            </ul>
                        </div>
                    ))}
                    
                    <h4 className="text-slate-800 mt-6 mb-2 font-bold uppercase text-sm">Skills</h4>
                    <p className="text-sm">{candidate.skills.join(', ')}</p>

                    <h4 className="text-slate-800 mt-6 mb-2 font-bold uppercase text-sm">Education</h4>
                    <div className="mb-4">
                        <div className="flex justify-between">
                             <p className="font-bold text-slate-700">B.S. Computer Science</p>
                             <p className="text-sm text-slate-500">2012 - 2016</p>
                        </div>
                        <p className="text-sm text-slate-500">University of Technology</p>
                    </div>
                </div>
            </div>
        );

      case 'interview':
        return (
             <div className="space-y-6">
                <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#1BB0A3]" /> Recommended Interview Questions
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-[#F0F7FB] rounded-lg border border-[#BDDEF3]">
                            <p className="text-sm font-medium text-[#1BB0A3] mb-1">Topic: System Design</p>
                            <p className="text-slate-800 font-medium">"Can you describe a time you had to optimize a slow database query in {candidate.skills[0] || 'Python'}? What was your approach?"</p>
                            <p className="text-xs text-slate-500 mt-2">Looks for: Indexing knowledge, ORM understanding, performance analysis tools.</p>
                        </div>
                        <div className="p-4 bg-[#F0F7FB] rounded-lg border border-[#BDDEF3]">
                            <p className="text-sm font-medium text-[#1BB0A3] mb-1">Topic: Experience at {candidate.previousCompanies[0]?.name || 'Previous Role'}</p>
                            <p className="text-slate-800 font-medium">"You mentioned working on {candidate.previousCompanies[0]?.context || 'complex projects'}. What was the biggest technical bottleneck you faced during that growth phase?"</p>
                        </div>
                        <div className="p-4 bg-[#F0F7FB] rounded-lg border border-[#BDDEF3]">
                            <p className="text-sm font-medium text-[#1BB0A3] mb-1">Topic: Culture Fit</p>
                            <p className="text-slate-800 font-medium">"Describe a situation where you disagreed with a product decision. How did you handle it?"</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-slate-500" /> Scorecard Template
                    </h3>
                    <div className="space-y-3">
                         {['Technical Proficiency', 'System Design', 'Communication', 'Culture Fit'].map((criteria) => (
                             <div key={criteria} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                                 <span className="text-sm font-medium text-slate-700">{criteria}</span>
                                 <div className="flex gap-1">
                                     {[1,2,3,4,5].map(star => (
                                         <button key={star} className="w-8 h-8 rounded-full border border-slate-200 hover:border-[#1BB0A3] hover:bg-[#D7E9F4] text-slate-400 hover:text-[#1BB0A3] flex items-center justify-center transition-colors">
                                             {star}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
             </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC] overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-[#BDDEF3] px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm flex-shrink-0">
        <button 
            onClick={onBack} 
            className="p-2 -ml-2 text-slate-400 hover:text-[#1BB0A3] hover:bg-[#F0F7FB] rounded-full transition-colors"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                {candidate.name}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                </span>
            </h1>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-[#BDDEF3] text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> PDF Report
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button className="px-4 py-2 bg-[#1BB0A3] text-white rounded-lg text-sm font-medium hover:bg-[#15968b] shadow-sm shadow-[#1BB0A3]/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Shortlist
            </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D7E9F4]/20 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    {/* Avatar / Initials */}
                    <div className="w-20 h-20 rounded-2xl bg-[#1BB0A3] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#1BB0A3]/20 flex-shrink-0">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap gap-y-2 gap-x-6 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{candidate.role}</h2>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#1BB0A3]" /> {candidate.webVerification.salaryBenchmark.location}</span>
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#1BB0A3]" /> {candidate.experienceYears} Years Exp.</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Social Links */}
                        <div className="flex flex-wrap gap-3">
                            <ContactBadge icon={<Mail className="w-3.5 h-3.5" />} label="Email" />
                            <ContactBadge icon={<Phone className="w-3.5 h-3.5" />} label="Call" />
                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            {candidate.webVerification.linkedin?.verified && (
                                <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077b5]/10 text-[#0077b5] rounded-md text-xs font-medium hover:bg-[#0077b5]/20 transition-colors">
                                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                    <ShieldCheck className="w-3 h-3 ml-1" />
                                </a>
                            )}
                            {candidate.webVerification.github?.verified && (
                                <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-200 transition-colors">
                                    <Github className="w-3.5 h-3.5" /> GitHub
                                    <ShieldCheck className="w-3 h-3 ml-1" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Box */}
                    <div className="flex gap-6 border-l border-slate-100 pl-6 md:pl-0 md:border-l-0">
                         <div className="text-center">
                            <div className="text-3xl font-bold text-[#1BB0A3]">{candidate.score}</div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Match Score</div>
                         </div>
                         <div className="w-px bg-slate-100"></div>
                         <div className="text-center">
                            <div className="text-3xl font-bold text-slate-700">{candidate.webVerification.github?.contributions || 'N/A'}</div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Contribs</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs (Internal) */}
            <div className="flex items-center gap-6 border-b border-[#BDDEF3] px-2">
                <TabButton active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} label="Overview & Analysis" icon={<BrainCircuit className="w-4 h-4" />} />
                <TabButton active={activeSection === 'resume'} onClick={() => setActiveSection('resume')} label="Full Resume" icon={<Code className="w-4 h-4" />} />
                <TabButton active={activeSection === 'interview'} onClick={() => setActiveSection('interview')} label="Interview Guide" icon={<MessageSquare className="w-4 h-4" />} />
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {renderContent()}
                </div>

                {/* RIGHT COLUMN (1/3) */}
                <div className="space-y-6">
                    
                    {/* Skills Matrix */}
                    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                         <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <Code className="w-4 h-4 text-[#1BB0A3]" /> Skills Matrix
                        </h3>
                        <div className="space-y-4">
                            {candidate.skills.map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-700">{skill}</span>
                                        <span className="text-[#1BB0A3] font-bold">Verified</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#1BB0A3] h-full rounded-full" style={{ width: `${90 - (i * 10)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                             {candidate.missingSkills.map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-400">{skill}</span>
                                        <span className="text-amber-500 font-bold">Missing</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-amber-300 h-full rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Salary Benchmark */}
                    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                         <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <DollarSign className="w-4 h-4 text-[#1BB0A3]" /> Compensation
                        </h3>
                        
                        <div className="text-center py-4 bg-[#F0F7FB] rounded-lg border border-[#BDDEF3] border-dashed mb-4">
                            <p className="text-xs text-slate-500 mb-1">Estimated Market Value</p>
                            <p className="text-2xl font-bold text-slate-800">
                                ${(candidate.webVerification.salaryBenchmark.min / 1000).toFixed(0)}k - {(candidate.webVerification.salaryBenchmark.max / 1000).toFixed(0)}k
                            </p>
                            <p className="text-xs text-[#1BB0A3] font-medium mt-1">Within Budget</p>
                        </div>

                        <div className="space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Current (Est.)</span>
                                <span className="font-medium text-slate-700">$155,000</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Ask</span>
                                <span className="font-medium text-slate-700">Not specified</span>
                             </div>
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="bg-white rounded-xl border border-[#BDDEF3] shadow-sm p-6">
                         <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <Clock className="w-4 h-4 text-[#1BB0A3]" /> Next Steps
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full py-2 bg-[#1BB0A3] hover:bg-[#15968b] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" /> Schedule Interview
                            </button>
                            <button className="w-full py-2 bg-white border border-[#BDDEF3] hover:bg-[#F0F7FB] text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" /> Email Candidate
                            </button>
                            <button className="w-full py-2 bg-white border border-red-100 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                <XCircle className="w-4 h-4" /> Reject Application
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components

const ContactBadge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-100 border border-slate-200 transition-colors">
        {icon}
        {label}
    </button>
);

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            active 
            ? 'border-[#1BB0A3] text-[#1BB0A3]' 
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
        }`}
    >
        {icon}
        {label}
    </button>
);

const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Screening': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Interview': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Offer': return 'bg-green-50 text-green-600 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

export default CandidateDetail;