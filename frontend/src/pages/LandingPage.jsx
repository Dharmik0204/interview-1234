import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const roles = [
        "Java Backend Developer", "React Frontend Engineer", "DevOps Engineer",
        "Data Scientist", "Product Manager", "ML Engineer"
    ];

    const stats = [
        { label: "Role Templates", value: "500+" },
        { label: "Questions Generated", value: "10k+" },
        { label: "Satisfaction Rate", value: "98%" },
        { label: "Interview Success", value: "3x" }
    ];

    const steps = [
        { id: "01", title: "Choose Role", desc: "Tell us the role you're targeting and we'll tailor everything to it." },
        { id: "02", title: "Get Questions", desc: "AI generates real interview questions pulled from actual job postings." },
        { id: "03", title: "Answer Aloud", desc: "Speak your answers. We transcribe and record every word." },
        { id: "04", title: "Get Coached", desc: "Receive detailed AI feedback with specific improvements." }
    ];

    return (
        <div className="premium-gradient">
            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="px-4 py-1.5 bg-gray-100/80 text-gray-500 text-[11px] font-bold tracking-widest rounded-full uppercase mb-8 inline-block border border-gray-200/50">
                        AI-Powered Interview Coach
                    </span>
                    <h1 className="text-6xl md:text-7xl font-bold font-display tracking-tight text-gray-900 mb-6">
                        Practice interviews
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                        Real questions. Real feedback. Land the role you deserve.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                            Begin Practice <ArrowRight size={18} />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all">
                            See how it works
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {roles.map((role, i) => (
                            <span key={i} className="px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-500 bg-white/50">
                                {role}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-t border-b border-gray-100 bg-white/30 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center p-6 border-r last:border-0 border-gray-100">
                            <div className="text-4xl font-bold font-display mb-2">{stat.value}</div>
                            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
                <div className="mb-16">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 inline-block">Process</span>
                    <h2 className="text-4xl font-bold font-display leading-tight">
                        Four steps to <br />
                        <span className="italic font-normal text-gray-400">interview confidence</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {steps.map((step, i) => (
                        <div key={i} className="p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                            <div className="w-8 h-8 rounded-md bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs mb-6 group-hover:scale-110 transition-transform">
                                {step.id}
                            </div>
                            <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto p-12 bg-black rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
                    <div className="z-10">
                        <h2 className="text-4xl font-bold font-display mb-4">Ready to ace your next interview?</h2>
                    </div>
                    <Link to="/signup" className="z-10 bg-transparent text-white border-none text-lg font-medium hover:underline flex items-center gap-2">
                        Start for free <ArrowRight size={20} />
                    </Link>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
