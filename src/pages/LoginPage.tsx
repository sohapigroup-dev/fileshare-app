import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import type { UserRole } from '../types';
import axios from 'axios';
import { CrownIcon, UserIcon, ShareIcon, LoadingIcon } from '../components/Icons';

export default function LoginPage() {
	const [nom, setNom] = useState('');
	const [role, setRole] = useState<UserRole | ''>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [directeurInfo, setDirecteurInfo] = useState<{ exists: boolean; nom?: string } | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();

	// Vérifier s'il existe déjà un directeur
	useEffect(() => {
		authApi.checkDirecteur()
			.then(res => setDirecteurInfo(res.data))
			.catch(() => setDirecteurInfo(null));
	}, []);

	const handleLogin = async () => {
		if (!nom.trim() || !role) {
			setError('Veuillez remplir tous les champs');
			return;
		}
		setLoading(true);
		setError('');
		try {
			const res = await authApi.login(nom, role);
			login(res.data.user, res.data.token);
			navigate('/dashboard');
		} catch (err) {
			if (axios.isAxiosError(err) && err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError('Erreur de connexion, reessayez');
			}
		} finally {
			setLoading(false);
		}
	};

	const directeurDisabled = directeurInfo?.exists && role === 'directeur' && directeurInfo.nom !== nom;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-navy-900 dark:to-navy-950 flex items-center justify-center p-4">
			<div className="w-full max-w-md">

				{/* Logo */}
				<div className="flex flex-col items-center mb-8">
					<div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-navy-600/20">
						<ShareIcon className="text-white" size={28} />
					</div>
					<h1 className="text-2xl font-semibold text-navy-800 dark:text-white">
						Hostolink <span className="text-brand-blue">Share</span>
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Plateforme de partage interne
					</p>
				</div>

				{/* Card */}
				<div className="card shadow-lg shadow-gray-200/50 dark:shadow-none">
					<h2 className="text-base font-medium text-navy-700 dark:text-gray-200 mb-6">
						Acceder a l'espace
					</h2>

					{/* Nom */}
					<div className="mb-4">
						<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
							Votre nom complet
						</label>
						<input
							type="text"
							className="input"
							placeholder="Ex : Kone Amadou"
							value={nom}
							onChange={(e) => setNom(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
						/>
					</div>

					{/* Rôle */}
					<div className="mb-6">
						<label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
							Votre role
						</label>
						<div className="grid grid-cols-2 gap-3">
							{/* Directeur */}
							<button
								onClick={() => setRole('directeur')}
								disabled={directeurInfo?.exists && directeurInfo.nom !== nom}
								className={`p-3 rounded-lg border text-left transition-all duration-200 ${
									role === 'directeur'
										? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20 shadow-sm'
										: directeurInfo?.exists && directeurInfo.nom !== nom
											? 'border-gray-200 dark:border-navy-600 opacity-50 cursor-not-allowed'
											: 'border-gray-200 dark:border-navy-600 hover:border-brand-orange/50 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
								}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<CrownIcon className="text-brand-orange" size={16} />
									<span className="text-sm font-medium dark:text-white">Directeur</span>
								</div>
								<p className="text-xs text-gray-400">
									{directeurInfo?.exists && directeurInfo.nom !== nom
										? 'Non disponible'
										: 'Diffusion + P2P'
									}
								</p>
							</button>

							{/* Collaborateur */}
							<button
								onClick={() => setRole('collaborateur')}
								className={`p-3 rounded-lg border text-left transition-all duration-200 ${
									role === 'collaborateur'
										? 'border-brand-green bg-green-50 dark:bg-green-900/20 shadow-sm'
										: 'border-gray-200 dark:border-navy-600 hover:border-brand-green/50 hover:bg-green-50/50 dark:hover:bg-green-900/10'
								}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<UserIcon className="text-brand-green" size={16} />
									<span className="text-sm font-medium dark:text-white">Collaborateur</span>
								</div>
								<p className="text-xs text-gray-400">Reception + P2P</p>
							</button>
						</div>
					</div>

					{/* Erreur */}
					{error && (
						<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-xs text-brand-red">{error}</p>
						</div>
					)}

					{/* Bouton */}
					<button
						className="btn-primary w-full flex items-center justify-center gap-2"
						onClick={handleLogin}
						disabled={loading || directeurDisabled}
					>
						{loading ? (
							<>
								<LoadingIcon size={18} />
								<span>Connexion...</span>
							</>
						) : (
							'Acceder'
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
