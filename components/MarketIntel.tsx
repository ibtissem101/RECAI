import React from 'react';
import { DollarSign, TrendingUp, Building, MapPin } from 'lucide-react';

const MarketIntel: React.FC = () => {
  return (
    <div className="p-8 overflow-y-auto h-full space-y-8">
       <div className="flex justify-between items-end border-b border-[#BDDEF3] pb-6">
            <div>
                <p className="text-sm text-slate-500 mb-1">Market Analysis</p>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Java Developers <span className="text-slate-400 font-normal">in</span> SF Bay Area
                </h2>
            </div>
            <div className="flex gap-2">
                 <button className="px-4 py-2 bg-white border border-[#BDDEF3] text-slate-600 rounded-lg text-sm font-medium">Export Report</button>
            </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Salary Benchmarks */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#1BB0A3]" /> Salary Benchmarks
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2 text-sm">
                            <span className="text-slate-500">Market Average</span>
                            <span className="font-bold text-slate-800">$145,000</span>
                        </div>
                        <div className="w-full bg-[#F0F7FB] h-2 rounded-full relative">
                            <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-[#D7E9F4] rounded-full"></div>
                            <div className="absolute left-[45%] w-1 h-4 -top-1 bg-slate-400 rounded"></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-slate-400">
                            <span>$120k</span>
                            <span>$180k</span>
                        </div>
                    </div>

                    <div className="p-4 bg-[#F0F7FB] rounded-lg border border-[#BDDEF3]">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">Your Offer</span>
                            <span className="text-[#1BB0A3] font-bold">$150,000</span>
                        </div>
                         <p className="text-xs text-[#1BB0A3]">65th Percentile (Competitive)</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase">Competitor Offers</p>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Google</span>
                            <span className="font-medium">$160,000</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Meta</span>
                            <span className="font-medium">$155,000</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demand Trends */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#E9C7DB]" /> Demand Trends
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#E9C7DB]/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-[#E9C7DB]" />
                        </div>
                        <div>
                             <h4 className="text-2xl font-bold text-slate-800">+12% <span className="text-sm font-normal text-slate-500">MoM</span></h4>
                             <p className="text-sm text-slate-500">Increase in Java roles</p>
                        </div>
                    </div>

                    <div className="border-t border-[#F0F7FB] pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                <span className="text-sm text-slate-700">Spring Boot</span>
                            </div>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">+18% (Hot)</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#1BB0A3]"></span>
                                <span className="text-sm text-slate-700">Remote Roles</span>
                            </div>
                            <span className="text-xs font-bold text-[#1BB0A3] bg-[#D7E9F4] px-2 py-0.5 rounded">+25%</span>
                        </div>
                    </div>
                </div>
            </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Competitor Activity */}
            <div className="bg-white rounded-xl border border-[#BDDEF3] p-6 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Building className="w-5 h-5 text-slate-600" /> Competitor Activity
                </h3>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between p-3 bg-[#F0F7FB] rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white border border-[#BDDEF3] flex items-center justify-center font-bold text-slate-700">G</div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Google</p>
                                <p className="text-xs text-slate-500">24 Open Roles</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-slate-600">~ $160k</span>
                    </li>
                     <li className="flex items-center justify-between p-3 bg-[#F0F7FB] rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white border border-[#BDDEF3] flex items-center justify-center font-bold text-slate-700">A</div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Amazon</p>
                                <p className="text-xs text-slate-500">18 Open Roles</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-slate-600">~ $148k</span>
                    </li>
                </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-[#1BB0A3] rounded-xl p-6 shadow-md text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    Recommendations
                </h3>
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                        <p className="text-sm leading-relaxed text-white/90">Increase offer by <span className="font-bold text-white">5%</span> to match Google's base comp for Senior levels.</p>
                    </li>
                     <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                        <p className="text-sm leading-relaxed text-white/90">Explicitly highlight <span className="font-bold text-white">Spring Boot</span> in Job Description to attract niche talent.</p>
                    </li>
                     <li className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                        <p className="text-sm leading-relaxed text-white/90">Consider offering <span className="font-bold text-white">Remote</span> options to widen the talent pool by 40%.</p>
                    </li>
                </ul>
            </div>
       </div>
    </div>
  );
};

export default MarketIntel;