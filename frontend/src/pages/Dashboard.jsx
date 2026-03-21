import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [role, setRole] = useState('');
    const [questionsCount, setQuestionsCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const suggestedRoles = [
        "Java Backend Developer", "React Frontend Engineer", "DevOps Engineer",
        "Data Scientist", "Product Manager", "ML Engineer", "iOS Developer", "Full Stack Developer"
    ];

    const handleGenerate = async () => {
        if (!role) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://interview-ai-cr59.onrender.com/api/interviews/generate', {
                role,
                difficulty: 'Medium',
                count: questionsCount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/interview/${res.data.data._id}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to generate interview questions. Please check your API key and connection.');
            alert('Generation failed: ' + (err.response?.data?.message || 'Check console for details'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block">Step 1 — Setup</span>
                <h2 className="text-4xl font-bold font-display mb-2">What role are you <br /><span className="italic font-normal text-gray-400">interviewing for?</span></h2>
                <p className="text-gray-400 text-sm font-medium mb-10">AI will generate real questions based on actual job postings for this role.</p>

                <div className="space-y-10">
                    <div>
                        <input 
                            type="text" 
                            placeholder="e.g. Java Backend Developer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 text-lg"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Number of questions:</span>
                            {[3, 5, 7, 10].map(n => (
                                <button 
                                    key={n}
                                    onClick={() => setQuestionsCount(n)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all ${questionsCount === n ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {suggestedRoles.map(r => (
                            <button 
                                key={r}
                                onClick={() => setRole(r)}
                                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:border-gray-200 transition-all"
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={!role || loading}
                        className="w-full py-5 bg-gray-300 hover:bg-black text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Preparing Interview...' : 'Generate Interview Questions'} <ArrowRight size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
