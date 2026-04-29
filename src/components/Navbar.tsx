import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, LogoutIcon, CrownIcon, UserIcon } from './Icons';

export default function Navbar() {
	const { user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700 px-4 py-3 sticky top-0 z-40">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center shadow-md">
						<span className="text-white font-bold text-base font-mono">H</span>
					</div>
					<div className="hidden sm:block">
						<span className="font-semibold text-navy-800 dark:text-white">
							Hostolink <span className="text-brand-blue">Share</span>
						</span>
					</div>
				</div>

				{/* User info */}
				<div className="flex items-center gap-2 sm:gap-4">
					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
						title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
					>
						{theme === 'light' ? (
							<MoonIcon className="text-gray-600" size={20} />
						) : (
							<SunIcon className="text-yellow-400" size={20} />
						)}
					</button>

					{/* User badge */}
					<div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-navy-700 rounded-lg">
						{user?.role === 'directeur' ? (
							<CrownIcon className="text-brand-orange" size={16} />
						) : (
							<UserIcon className="text-brand-green" size={16} />
						)}
						<span className="text-sm font-medium dark:text-white">{user?.nom}</span>
						<span className="hidden sm:inline text-xs text-gray-400 capitalize">• {user?.role}</span>
					</div>

					{/* Logout */}
					<button
						onClick={logout}
						className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-brand-red transition-colors"
						title="Deconnexion"
					>
						<LogoutIcon size={20} />
					</button>
				</div>
			</div>
		</nav>
	);
}
