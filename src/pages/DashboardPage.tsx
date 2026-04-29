import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../lib/socket';
import { filesApi } from '../lib/api';
import Navbar from '../components/Navbar';
import UserList from '../components/UserList';
import DropZone from '../components/DropZone';
import Inbox from '../components/Inbox';
import SentFiles from '../components/SentFiles';
import type { User, FileTransfer } from '../types';

export default function DashboardPage() {
	const { user } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [transfers, setTransfers] = useState<FileTransfer[]>([]);
	const [notification, setNotification] = useState<string | null>(null);

	useEffect(() => {
		const socket = getSocket();
		if (!socket) return;

		// Listen for user updates
		socket.on('users:updated', (updatedUsers: User[]) => {
			setUsers(updatedUsers);
		});

		// Listen for new files
		socket.on('file:received', (data: { expediteurNom: string; fichierNom: string }) => {
			setNotification(`${data.expediteurNom} a envoye: ${data.fichierNom}`);
			loadTransfers();

			// Auto-hide notification
			setTimeout(() => setNotification(null), 5000);
		});

		return () => {
			socket.off('users:updated');
			socket.off('file:received');
		};
	}, []);

	// Load transfers on mount
	useEffect(() => {
		loadTransfers();
	}, []);

	const loadTransfers = async () => {
		try {
			const res = await filesApi.all();
			console.log('Transfers loaded:', res.data);
			setTransfers(res.data);
		} catch (error) {
			console.error('Erreur chargement transferts:', error);
		}
	};

	// Selection handler
	const handleSelectUser = (userId: string | null) => {
		setSelectedUserId(userId);
	};

	if (!user) return null;

	// Calculs pour les stats - utiliser les variables
	// Note: readReceipts peut être un objet vide {} au lieu de [] quand il n'y a pas de receipts
	const sentCount = transfers.filter(t => t.expediteurId === user.id).length;
	const receivedTransfers = transfers.filter(t =>
		(t.destinataireId === null || t.destinataireId === user.id) &&
		t.expediteurId !== user.id
	);
	const receivedCount = receivedTransfers.length;
	const unreadCount = receivedTransfers.filter(t => {
		const receipts = t.readReceipts;
		// Vérifier si c'est un tableau valide (pas un objet vide)
		const isRead = Array.isArray(receipts) && receipts.some(r => r.userId === user.id);
		return !isRead;
	}).length;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-navy-900">
			<Navbar />

			{/* Notification */}
			{notification && (
				<div className="fixed top-20 right-4 z-50 animate-slide-in">
					<div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg shadow-lg p-4 max-w-sm">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center">
								<svg className="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
								</svg>
							</div>
							<p className="text-sm dark:text-white">{notification}</p>
							<button
								onClick={() => setNotification(null)}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Main content */}
			<div className="max-w-7xl mx-auto p-4">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
					{/* Left sidebar - Users */}
					<div className="lg:col-span-3">
						<UserList
							users={users}
							currentUserId={user.id}
							selectedUserId={selectedUserId}
							onSelectUser={handleSelectUser}
						/>
					</div>

					{/* Center - Drop zone + Sent files */}
					<div className="lg:col-span-5 space-y-4">
						<DropZone
							destinataireId={selectedUserId}
							onUploadComplete={loadTransfers}
						/>

						{/* Quick stats */}
						<div className="grid grid-cols-2 gap-4">
							<div className="card">
								<p className="text-xs text-gray-400 mb-1">Fichiers envoyes</p>
								<p className="text-2xl font-semibold dark:text-white">
									{sentCount}
								</p>
							</div>
							<div className="card">
								<div className="flex items-center justify-between">
									<p className="text-xs text-gray-400 mb-1">Fichiers recus</p>
									{unreadCount > 0 && (
										<span className="px-1.5 py-0.5 text-xs font-medium bg-brand-blue text-white rounded-full">
											{unreadCount}
										</span>
									)}
								</div>
								<p className="text-2xl font-semibold dark:text-white">
									{receivedCount}
								</p>
							</div>
						</div>

						{/* Sent files */}
						<SentFiles
							transfers={transfers}
							currentUserId={user.id}
							onRefresh={loadTransfers}
						/>
					</div>

					{/* Right sidebar - Inbox */}
					<div className="lg:col-span-4">
						<Inbox
							transfers={transfers}
							currentUserId={user.id}
							onRefresh={loadTransfers}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
