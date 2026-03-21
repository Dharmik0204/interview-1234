import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Error creating account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold font-display mb-2">Create account</h2>
                    <p className="text-gray-400 font-medium">Start practicing for free today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={20} />
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-gray-400">
                    Already have an account? <Link to="/login" className="text-black hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
