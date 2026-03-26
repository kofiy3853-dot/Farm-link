'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Leaf, Package, Loader2, BrainCircuit } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ProfitEstimator() {
    const [crop, setCrop] = useState('Maize');
    const [acres, setAcres] = useState(5);
    const [yieldPerAcre, setYieldPerAcre] = useState(2500); // kg
    const [costs, setCosts] = useState({
        seeds: 500,
        fertilizer: 1200,
        labor: 800,
        transport: 300
    });

    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    const handleCalculate = async () => {
        setIsCalculating(true);
        try {
            // Fetch AI predicted price for the crop
            const res = await api.get(`/insights/predict/prices?crop=${crop}`);
            const futurePriceArr = res.data.forecast;

            // Take the average of the 14-day forecast for a stable projection
            const avgPredictedPrice = futurePriceArr.reduce((sum: number, day: any) => sum + day.predictedPrice, 0) / futurePriceArr.length; // eslint-disable-line @typescript-eslint/no-explicit-any

            const totalYieldKg = acres * yieldPerAcre;
            const projectedRevenue = totalYieldKg * avgPredictedPrice;
            const totalCosts = costs.seeds + costs.fertilizer + costs.labor + costs.transport;
            const netProfit = projectedRevenue - totalCosts;
            const roi = (netProfit / totalCosts) * 100;

            setResult({
                avgPredictedPrice: avgPredictedPrice.toFixed(2),
                totalYield: totalYieldKg,
                projectedRevenue,
                totalCosts,
                netProfit,
                roi: roi.toFixed(1),
                aiAnalysis: res.data.analysis
            });

        } catch (error) {
            console.error("Calculation failed", error);
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto animate-fade-in">

                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mb-4">
                        <Calculator size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Yield & Profit Estimator
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Calculate your potential earnings. We use real-time AI market forecasting
                        to predict the selling price of your harvest.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Input Form */}
                    <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-border">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Leaf className="text-green-500" />
                            Farm Variables
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="targetCrop" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Crop</label>
                                <select
                                    id="targetCrop"
                                    title="Target Crop"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                >
                                    <option value="Maize">Maize</option>
                                    <option value="Soybeans">Soybeans</option>
                                    <option value="Cocoa">Cocoa</option>
                                    <option value="Cassava">Cassava</option>
                                    <option value="Rice">Rice</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="acres" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Farm Size (Acres)</label>
                                    <input
                                        id="acres"
                                        type="number"
                                        min="1"
                                        placeholder="Number of acres"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        value={acres}
                                        onChange={(e) => setAcres(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="yield" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Est. Yield (kg/acre)</label>
                                    <input
                                        id="yield"
                                        type="number"
                                        placeholder="Predicted yield"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        value={yieldPerAcre}
                                        onChange={(e) => setYieldPerAcre(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-700 my-4" />
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                <DollarSign size={18} className="text-orange-500" />
                                Estimated Expenses (₵)
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="seeds" className="block text-xs text-slate-500 mb-1">Seeds / Saplings</label>
                                    <input id="seeds" type="number" title="Seeds Cost" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" value={costs.seeds} onChange={(e) => setCosts({ ...costs, seeds: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label htmlFor="fertilizer" className="block text-xs text-slate-500 mb-1">Fertilizer / Chems</label>
                                    <input id="fertilizer" type="number" title="Fertilizer Cost" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" value={costs.fertilizer} onChange={(e) => setCosts({ ...costs, fertilizer: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label htmlFor="labor" className="block text-xs text-slate-500 mb-1">Labor / Machinery</label>
                                    <input id="labor" type="number" title="Labor Cost" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" value={costs.labor} onChange={(e) => setCosts({ ...costs, labor: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label htmlFor="transport" className="block text-xs text-slate-500 mb-1">Logistics / Transport</label>
                                    <input id="transport" type="number" title="Transport Cost" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" value={costs.transport} onChange={(e) => setCosts({ ...costs, transport: Number(e.target.value) })} />
                                </div>
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={isCalculating}
                                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCalculating ? <Loader2 className="animate-spin" /> : <Calculator />}
                                {isCalculating ? 'Computing Forecast...' : 'Calculate AI Projection'}
                            </button>
                        </div>
                    </div>

                    {/* Results Dashboard */}
                    <div className="lg:col-span-7">
                        {!result ? (
                            <div className="h-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                <TrendingUp size={48} className="mb-4 opacity-50" />
                                <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-2">Awaiting Parameters</h3>
                                <p className="max-w-md text-sm">Fill in your farm variables and expenses to generate a real-time revenue projection backed by our market intelligence engines.</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-border h-full flex flex-col animate-fade-in">
                                <h2 className="text-2xl font-bold mb-6">Projection Report: {crop}</h2>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
                                            <Package size={16} /> Total Projected Yield
                                        </div>
                                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{result.totalYield.toLocaleString()} kg</div>
                                        <div className="text-xs font-semibold text-green-600 mt-1">Based on {acres} acres</div>
                                    </div>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                        <div className="text-sm font-medium text-blue-600 mb-1 flex items-center gap-2">
                                            <TrendingUp size={16} /> AI Predicted Future Price
                                        </div>
                                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">₵ {result.avgPredictedPrice} <span className="text-sm font-normal text-blue-500">/kg</span></div>
                                        <div className="text-xs font-semibold text-blue-500 mt-1">14-Day Trailing Average</div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                        <span className="font-semibold text-red-600">Total Capital Outlay</span>
                                        <span className="font-bold text-red-700 dark:text-red-400">- ₵ {result.totalCosts.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                                        <span className="font-semibold text-green-600">Estimated Gross Revenue</span>
                                        <span className="font-bold text-green-700 dark:text-green-400">+ ₵ {result.projectedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-green-500/30">
                                        <div>
                                            <span className="block text-green-100 text-sm font-medium mb-1">Estimated Net Profit</span>
                                            <span className="text-3xl font-extrabold">₵ {result.netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-green-100 text-sm font-medium mb-1">ROI</span>
                                            <span className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-lg">+{result.roi}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        <BrainCircuit size={16} className="text-purple-500" />
                                        Market Intelligence Note
                                    </h4>
                                    <p className="text-sm text-slate-500 italic">&quot;{result.aiAnalysis}&quot;</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
