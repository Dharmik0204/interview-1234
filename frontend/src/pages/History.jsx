import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Clock, FileText, BarChart2, Briefcase } from 'lucide-react';
import api from '../utils/api';

const History = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/interviews');
            setInterviews(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: "Total Sessions", value: interviews.length, icon: <Clock size={16}/> },
        { label: "Completed", value: interviews.filter(it => it.status === 'Completed').length, icon: <FileText size={16}/> },
        { label: "Avg Score", value: (interviews.reduce((acc, it) => acc + (it.totalScore || 0), 0) / (interviews.length || 1)).toFixed(1), icon: <BarChart2 size={16}/> },
        { label: "Roles Practiced", value: new Set(interviews.map(it => it.role)).size, icon: <Briefcase size={16}/> }
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 bg-[#fcfbf9] min-h-screen">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Your Progress</span>
                    <h1 className="text-4xl font-bold font-display">Interview <span className="italic font-normal text-gray-400">History</span></h1>
                    <p className="text-xs text-gray-400 font-medium mt-1">Track your improvement over time.</p>
                </div>
                <Link to="/dashboard" className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all">
                    + New Interview
                </Link>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm overflow-hidden">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center border-r last:border-0 border-gray-50 py-4 px-2">
                        <div className="text-2xl font-bold font-display mb-1">{stat.value}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading your history...</div>
            ) : interviews.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-[40px]">
                    <p className="text-gray-400 font-medium mb-6">No interview sessions found.</p>
                    <Link to="/dashboard" className="inline-block px-8 py-3 bg-black text-white rounded-full font-bold">Start your first session</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {interviews.map((interview, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-bold font-display">{interview.role}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${interview.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                        {interview.status === 'In Progress' ? '⌛ In Progress' : '✓ Completed'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-8">
                                    <span>{new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{interview.questions.filter(q => q.userAnswer).length} answers</span>
                                    {interview.status === 'Completed' && (
                                        <>
                                            <span>•</span>
                                            <span className="text-black font-bold">Score: {interview.totalScore.toFixed(1)}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Link to={interview.status === 'Completed' ? `/feedback/${interview._id}` : `/interview/${interview._id}`} className="text-xs font-bold text-gray-400 hover:text-black transition-all flex items-center gap-1">
                                {interview.status === 'Completed' ? 'View Details →' : 'Continue Interview →'}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
