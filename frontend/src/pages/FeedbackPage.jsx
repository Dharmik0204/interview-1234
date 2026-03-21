import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Target, Award, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const FeedbackPage = () => {
    const { id } = useParams();
    const [interview, setInterview] = useState(null);

    useEffect(() => {
        fetchInterview();
    }, [id]);

    const fetchInterview = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`http://localhost:5000/api/interviews`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const current = res.data.data.find(it => it._id === id);
            setInterview(current);
        } catch (err) {
            console.error(err);
        }
    };

    if (!interview) return <div className="flex items-center justify-center min-h-screen">Loading feedback...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-black transition-all mb-8 text-sm font-medium">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="mb-12">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 inline-block">Analysis Complete</span>
                <h1 className="text-5xl font-bold font-display leading-tight">
                    Interview <span className="italic font-normal text-gray-400">Feedback</span>
                </h1>
                <p className="text-gray-500 mt-4 font-medium text-lg">
                    Good job! Here is how you performed in your {interview.role} interview.
                </p>
            </div>

            {/* Overall Score */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black text-white p-8 rounded-[32px] flex flex-col justify-between h-48 shadow-xl">
                    <Award size={24} className="text-yellow-400" />
                    <div>
                        <div className="text-4xl font-bold font-display">{interview.totalScore.toFixed(1)}/10</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Overall Score</div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-8 rounded-[32px] flex flex-col justify-between h-48 shadow-lg">
                    <Target size={24} className="text-blue-500" />
                    <div>
                        <div className="text-3xl font-bold font-display">{interview.questions.length}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Questions Attempted</div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 p-8 rounded-[32px] flex flex-col justify-between h-48 shadow-lg">
                    <TrendingUp size={24} className="text-green-500" />
                    <div>
                        <div className="text-3xl font-bold font-display">
                            {interview.totalScore > 7 ? 'Excellent' : interview.totalScore > 5 ? 'Good' : 'Needs Work'}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Performance Status</div>
                    </div>
                </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold font-display">Detailed Breakdown</h3>
                {interview.questions.map((q, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-md"
                    >
                        <div className="p-8 border-b border-gray-50 flex items-start justify-between">
                            <div className="max-w-2xl">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Question {i + 1}</span>
                                <h4 className="text-lg font-bold leading-snug">{q.question}</h4>
                            </div>
                            <div className={`px-4 py-2 rounded-xl font-bold text-lg ${q.feedback?.score >= 8 ? 'bg-green-50 text-green-600' : q.feedback?.score >= 5 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                                {q.feedback?.score}/10
                            </div>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-8 bg-gray-50/30">
                            <div>
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Strengths & Improvements</h5>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="mt-1"><CheckCircle2 size={16} className="text-green-500" /></div>
                                        <p className="text-sm text-gray-600 leading-relaxed italic">"{q.feedback?.strengths}"</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1 text-orange-400"><TrendingUp size={16} /></div>
                                        <p className="text-sm text-gray-600 leading-relaxed italic">"{q.feedback?.improvements}"</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Sample Answer</h5>
                                <div className="p-5 bg-white border border-gray-100 rounded-2xl text-xs text-gray-500 leading-relaxed font-medium">
                                    {q.feedback?.sampleAnswer}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackPage;
