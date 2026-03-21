import { Link } from 'react-router-dom';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-[#fcfbf9] border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black flex items-center justify-center rounded-md">
                    <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="text-xl font-bold tracking-tight">InterviewIQ</span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <Link to="/dashboard" className="hover:text-black transition-colors">Practice</Link>
                <Link to="/history" className="hover:text-black transition-colors">History</Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-[10px] text-white font-bold">U</span>
                            </div>
                            <span className="text-yellow-800 text-xs font-semibold">{user.name}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-full transition-all"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black">Log in</Link>
                        <Link to="/signup" className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all">
                            Partner with us
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
