import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import type { UserRole } from '../types';
import axios from 'axios';

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
		<div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">

				{/* Logo */}
				<div className="flex flex-col items-center mb-8">
					<div className="w-16 h-16 bg-navy-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
						<span className="text-white font-bold text-2xl font-mono">H</span>
					</div>
					<h1 className="text-2xl font-semibold text-navy-800 dark:text-white">
						Hostolink <span className="text-brand-blue">Share</span>
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Plateforme de partage interne
					</p>
				</div>

				{/* Card */}
				<div className="card shadow-sm">
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
										? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20'
										: directeurInfo?.exists && directeurInfo.nom !== nom
											? 'border-gray-200 dark:border-navy-600 opacity-50 cursor-not-allowed'
											: 'border-gray-200 dark:border-navy-600 hover:border-gray-300'
								}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<div className="w-2 h-2 rounded-full bg-brand-orange" />
									<span className="text-sm font-medium capitalize dark:text-white">Directeur</span>
								</div>
								<p className="text-xs text-gray-400">
									{directeurInfo?.exists && directeurInfo.nom !== nom
										? `Pris par ${directeurInfo.nom}`
										: 'Diffusion + P2P'
									}
								</p>
							</button>

							{/* Collaborateur */}
							<button
								onClick={() => setRole('collaborateur')}
								className={`p-3 rounded-lg border text-left transition-all duration-200 ${
									role === 'collaborateur'
										? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20'
										: 'border-gray-200 dark:border-navy-600 hover:border-gray-300'
								}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<div className="w-2 h-2 rounded-full bg-brand-green" />
									<span className="text-sm font-medium capitalize dark:text-white">Collaborateur</span>
								</div>
								<p className="text-xs text-gray-400">Diffusion + P2P</p>
							</button>
						</div>
					</div>

					{/* Info directeur existant */}
					{directeurInfo?.exists && (
						<div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
							<p className="text-xs text-brand-orange">
								Un directeur existe deja : <strong>{directeurInfo.nom}</strong>
							</p>
						</div>
					)}

					{/* Erreur */}
					{error && (
						<div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
							<p className="text-xs text-brand-red">{error}</p>
						</div>
					)}

					{/* Bouton */}
					<button
						className="btn-primary w-full"
						onClick={handleLogin}
						disabled={loading || directeurDisabled}
					>
						{loading ? 'Connexion...' : 'Acceder !'}
					</button>
				</div>

				<p className="text-center text-xs text-gray-400 mt-4">
					Reseau interne Hostolink
				</p>
			</div>
		</div>
	);
}
