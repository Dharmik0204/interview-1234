import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Lightbulb, ChevronRight, ChevronLeft, StopCircle, RefreshCw } from 'lucide-react';
import api from '../utils/api';

const InterviewRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Web Speech API
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        fetchInterview();
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognizer = new SpeechRecognition();
            recognizer.continuous = true;
            recognizer.interimResults = true;
            recognizer.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setUserAnswer(transcript);
            };
            setRecognition(recognizer);
        }
    }, [id]);

    const fetchInterview = async () => {
        try {
            const res = await api.get('/interviews');
            const current = res.data.data.find(it => it._id === id);
            setInterview(current);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognition.stop();
        } else {
            setUserAnswer('');
            recognition.start();
        }
        setIsRecording(!isRecording);
    };

    const handleSubmitAnswer = async () => {
        if (!userAnswer) return;
        setLoading(true);
        try {
            const res = await api.post('/interviews/evaluate', {
                interviewId: id,
                questionId: interview.questions[currentIndex]._id,
                userAnswer
            });
            setFeedback(res.data.data);
            setIsSubmitted(true);
            await fetchInterview(); 
        } catch (err) {
            console.error(err);
            alert('Evaluation failed: ' + (err.response?.data?.message || 'Check console for details'));
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        try {
            await api.put(`/interviews/${id}/finish`, {});
            navigate(`/feedback/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    if (!interview) return <div className="flex items-center justify-center min-h-screen">Loading interview...</div>;

    const currentQuestion = interview.questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="w-full h-1 bg-gray-100 rounded-full mb-12 relative overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / interview.questions.length) * 100}%` }}
                    className="absolute top-0 left-0 h-full bg-black rounded-full"
                />
            </div>

            <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-2xl relative"
            >
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Question {currentIndex + 1} of {interview.questions.length}
                    </span>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">Technical</span>
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold uppercase rounded-md">{interview.difficulty}</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold font-display leading-snug mb-8">
                    {currentQuestion.question}
                </h2>

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 mb-8">
                    <Lightbulb className="text-orange-400" size={20} />
                    <p className="text-xs text-orange-900 leading-relaxed">
                        <span className="font-bold">Hint:</span> A good answer discusses real-world usage, performance trade-offs, and best practices relevant to the {interview.role} role.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        <textarea 
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Your answer will appear here as you speak..."
                            className="w-full min-h-[120px] p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm italic text-gray-500"
                        />
                    </div>

                    <button 
                        onClick={toggleRecording}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-black text-white hover:bg-gray-800'}`}
                    >
                        {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>

                    <div className="relative">
                        <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-4">Or type your answer here...</p>
                        {isSubmitted ? (
                            <div className="space-y-4">
                                <div className="p-6 bg-green-50 border border-green-100 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm font-bold text-green-800">Score: {feedback?.score}/10</div>
                                        <div className="text-[10px] font-bold uppercase text-green-600">Feedback Saved</div>
                                    </div>
                                    <p className="text-xs text-green-700 leading-relaxed italic">"{feedback?.strengths}"</p>
                                </div>
                                {currentIndex < interview.questions.length - 1 ? (
                                    <button 
                                        onClick={() => {
                                            setCurrentIndex(prev => prev + 1);
                                            setUserAnswer('');
                                            setFeedback(null);
                                            setIsSubmitted(false);
                                        }}
                                        className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                                    >
                                        Next Question <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleFinish}
                                        className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg"
                                    >
                                        Finish & View Full Report →
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={handleSubmitAnswer}
                                disabled={!userAnswer || loading}
                                className="w-full py-5 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-md"
                            >
                                {loading ? 'Evaluating...' : 'Submit Answer for Analysis →'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="flex items-center justify-between mt-10 px-4">
                <button 
                    disabled={currentIndex === 0}
                    onClick={() => {
                        setCurrentIndex(prev => prev - 1);
                        setUserAnswer('');
                        setFeedback(null);
                        setIsSubmitted(false);
                    }}
                    className="p-3 rounded-full border border-gray-100 bg-white text-gray-400 hover:text-black hover:border-black transition-all disabled:opacity-30"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                    {interview.questions.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-black' : 'bg-gray-200'}`} />
                    ))}
                </div>

                {currentIndex === interview.questions.length - 1 ? (
                    <button 
                        onClick={handleFinish}
                        className="px-6 py-3 bg-green-500 text-white rounded-full font-bold shadow-lg hover:bg-green-600 transition-all"
                    >
                        Finish Interview
                    </button>
                ) : (
                    <button 
                        onClick={() => {
                            setCurrentIndex(prev => prev + 1);
                            setUserAnswer('');
                            setFeedback(null);
                            setIsSubmitted(false);
                        }}
                        className="p-3 rounded-full border border-gray-100 bg-white text-gray-400 hover:text-black hover:border-black transition-all"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InterviewRoom;
