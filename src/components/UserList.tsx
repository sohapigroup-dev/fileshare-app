import { useState } from 'react';
import type { User } from '../types';

interface UserListProps {
	users: User[];
	currentUserId: string;
	selectedUserId: string | null;
	onSelectUser: (userId: string | null) => void;
}

export default function UserList({ users, currentUserId, selectedUserId, onSelectUser }: UserListProps) {
	const [search, setSearch] = useState('');

	const otherUsers = users.filter(u => u.id !== currentUserId);

	// Filtrer par recherche
	const filteredUsers = otherUsers.filter(u =>
		u.nom.toLowerCase().includes(search.toLowerCase())
	);

	// Séparer directeur et autres
	const directeur = filteredUsers.find(u => u.role === 'directeur');
	const collaborateurs = filteredUsers.filter(u => u.role === 'collaborateur');

	// Séparer en ligne / hors ligne
	const onlineCollabs = collaborateurs.filter(u => u.online);
	const offlineCollabs = collaborateurs.filter(u => !u.online);

	// Fonction pour désélectionner
	const handleSelect = (userId: string) => {
		if (selectedUserId === userId) {
			onSelectUser(null); // Désélectionner
		} else {
			onSelectUser(userId);
		}
	};

	return (
		<div className="card h-full">
			<h3 className="text-sm font-medium text-navy-700 dark:text-gray-200 mb-3">
				Utilisateurs ({otherUsers.filter(u => u.online).length} en ligne)
			</h3>

			{/* Barre de recherche */}
			<div className="relative mb-3">
				<input
					type="text"
					placeholder="Rechercher..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue"
				/>
				<svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>

			<div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
				{/* Broadcast option */}
				<button
					onClick={() => handleSelect('broadcast')}
					className={`w-full p-2 rounded-lg text-left transition-all ${
						selectedUserId === 'broadcast'
							? 'bg-brand-blue/10 border border-brand-blue'
							: 'hover:bg-gray-50 dark:hover:bg-navy-700 border border-transparent'
					}`}
				>
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-brand-blue/20 rounded-full flex items-center justify-center">
							<svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium dark:text-white">Diffusion</p>
							<p className="text-xs text-gray-400">Envoyer a tous</p>
						</div>
					</div>
				</button>

				{/* Directeur (toujours en haut et bien visible) */}
				{directeur && (
					<>
						<div className="text-xs text-brand-orange font-medium mt-3 mb-1 flex items-center gap-1">
							<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
							DIRECTEUR
						</div>
						<button
							onClick={() => handleSelect(directeur.id)}
							className={`w-full p-2 rounded-lg text-left transition-all ${
								selectedUserId === directeur.id
									? 'bg-brand-orange/10 border border-brand-orange'
									: 'hover:bg-gray-50 dark:hover:bg-navy-700 border border-transparent'
							}`}
						>
							<div className="flex items-center gap-2">
								<div className="relative">
									<div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-orange-600 rounded-full flex items-center justify-center shadow-md">
										<span className="text-sm font-bold text-white">
											{directeur.nom.charAt(0).toUpperCase()}
										</span>
									</div>
									{directeur.online && (
										<div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-green rounded-full border-2 border-white dark:border-navy-800" />
									)}
								</div>
								<div>
									<p className="text-sm font-semibold dark:text-white">{directeur.nom}</p>
									<p className="text-xs text-brand-orange">Directeur</p>
								</div>
								{!directeur.online && (
									<span className="ml-auto text-xs text-gray-400">Hors ligne</span>
								)}
							</div>
						</button>
					</>
				)}

				{/* Collaborateurs en ligne */}
				{onlineCollabs.length > 0 && (
					<>
						<div className="text-xs text-gray-400 mt-3 mb-1">En ligne ({onlineCollabs.length})</div>
						{onlineCollabs.map(user => (
							<button
								key={user.id}
								onClick={() => handleSelect(user.id)}
								className={`w-full p-2 rounded-lg text-left transition-all ${
									selectedUserId === user.id
										? 'bg-brand-green/10 border border-brand-green'
										: 'hover:bg-gray-50 dark:hover:bg-navy-700 border border-transparent'
								}`}
							>
								<div className="flex items-center gap-2">
									<div className="relative">
										<div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center">
											<span className="text-xs font-medium text-brand-green">
												{user.nom.charAt(0).toUpperCase()}
											</span>
										</div>
										<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-white dark:border-navy-800" />
									</div>
									<div>
										<p className="text-sm font-medium dark:text-white">{user.nom}</p>
										<p className="text-xs text-gray-400">Collaborateur</p>
									</div>
								</div>
							</button>
						))}
					</>
				)}

				{/* Collaborateurs hors ligne */}
				{offlineCollabs.length > 0 && (
					<>
						<div className="text-xs text-gray-400 mt-3 mb-1">Hors ligne ({offlineCollabs.length})</div>
						{offlineCollabs.map(user => (
							<div
								key={user.id}
								className="w-full p-2 rounded-lg opacity-50"
							>
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-gray-200 dark:bg-navy-600 rounded-full flex items-center justify-center">
										<span className="text-xs font-medium text-gray-500">
											{user.nom.charAt(0).toUpperCase()}
										</span>
									</div>
									<div>
										<p className="text-sm font-medium dark:text-gray-400">{user.nom}</p>
										<p className="text-xs text-gray-400">Collaborateur</p>
									</div>
								</div>
							</div>
						))}
					</>
				)}

				{filteredUsers.length === 0 && (
					<p className="text-sm text-gray-400 text-center py-4">
						{search ? 'Aucun resultat' : 'Aucun autre utilisateur'}
					</p>
				)}
			</div>

			{/* Indication de sélection */}
			{selectedUserId && (
				<div className="mt-3 pt-3 border-t border-gray-200 dark:border-navy-600">
					<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
						Cliquez a nouveau pour deselectionner
					</p>
				</div>
			)}
		</div>
	);
}
