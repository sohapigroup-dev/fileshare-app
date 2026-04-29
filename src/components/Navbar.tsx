import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
	const { user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700 px-4 py-3">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-navy-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-sm font-mono">H</span>
					</div>
					<span className="font-semibold text-navy-800 dark:text-white">
						Hostolink <span className="text-brand-blue">Share</span>
					</span>
				</div>

				{/* User info */}
				<div className="flex items-center gap-4">
					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
						title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
					>
						{theme === 'light' ? (
							<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
							</svg>
						) : (
							<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						)}
					</button>

					{/* User badge */}
					<div className="flex items-center gap-2">
						<div className={`w-2 h-2 rounded-full ${user?.role === 'directeur' ? 'bg-brand-orange' : 'bg-brand-green'}`} />
						<span className="text-sm font-medium dark:text-white">{user?.nom}</span>
						<span className="text-xs text-gray-400 capitalize">({user?.role})</span>
					</div>

					{/* Logout */}
					<button
						onClick={logout}
						className="text-sm text-gray-500 hover:text-brand-red transition-colors"
					>
						Quitter
					</button>
				</div>
			</div>
		</nav>
	);
}
