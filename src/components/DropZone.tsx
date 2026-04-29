import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { filesApi } from '../lib/api';
import { getSocket } from '../lib/socket';

interface DropZoneProps {
	destinataireId: string | null;
	onUploadComplete: () => void;
}

export default function DropZone({ destinataireId, onUploadComplete }: DropZoneProps) {
	const { user } = useAuth();
	const [isDragging, setIsDragging] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const uploadFile = async (file: File) => {
		if (!user || !destinataireId) return;

		const canal = destinataireId === 'broadcast' ? 'broadcast' : 'p2p';

		// Check permission
		if (user.role === 'collaborateur' && canal === 'broadcast') {
			alert('Les collaborateurs ne peuvent pas diffuser');
			return;
		}

		setUploading(true);
		setProgress(0);

		const formData = new FormData();
		formData.append('file', file);
		formData.append('expediteurId', user.id);
		formData.append('expediteurNom', user.nom);
		formData.append('destinataireId', destinataireId);
		formData.append('canal', canal);

		try {
			const res = await filesApi.upload(formData);

			// Notify via socket
			const socket = getSocket();
			socket?.emit('file:sent', {
				transferId: res.data.id,
				expediteurNom: user.nom,
				fichierNom: file.name,
				destinataireId,
				canal,
			});

			setProgress(100);
			onUploadComplete();
		} catch (error) {
			console.error('Erreur upload:', error);
			alert('Erreur lors de l\'envoi du fichier');
		} finally {
			setTimeout(() => {
				setUploading(false);
				setProgress(0);
			}, 1000);
		}
	};

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			uploadFile(files[0]);
		}
	}, [user, destinataireId]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			uploadFile(files[0]);
		}
		e.target.value = '';
	};

	const isDisabled = !destinataireId;

	return (
		<div className="card">
			<h3 className="text-sm font-medium text-navy-700 dark:text-gray-200 mb-3">
				Envoyer un fichier
			</h3>

			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`
					relative border-2 border-dashed rounded-xl p-8 text-center transition-all
					${isDisabled
						? 'border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700/50 cursor-not-allowed'
						: isDragging
							? 'border-brand-blue bg-brand-blue/5'
							: 'border-gray-300 dark:border-navy-600 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer'
					}
				`}
			>
				{uploading ? (
					<div className="space-y-3">
						<div className="w-12 h-12 mx-auto bg-brand-blue/10 rounded-full flex items-center justify-center">
							<svg className="w-6 h-6 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-300">Envoi en cours...</p>
						<div className="w-full bg-gray-200 dark:bg-navy-600 rounded-full h-2">
							<div
								className="bg-brand-blue h-2 rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				) : (
					<>
						<input
							type="file"
							onChange={handleFileSelect}
							disabled={isDisabled}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
						/>
						<div className="space-y-3">
							<div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
								isDisabled ? 'bg-gray-200 dark:bg-navy-600' : 'bg-brand-blue/10'
							}`}>
								<svg className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : 'text-brand-blue'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
							</div>
							{isDisabled ? (
								<p className="text-sm text-gray-400">
									Selectionnez un destinataire
								</p>
							) : (
								<>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Glissez un fichier ici ou <span className="text-brand-blue font-medium">parcourir</span>
									</p>
									<p className="text-xs text-gray-400">
										Envoi vers: {destinataireId === 'broadcast' ? 'Tous (diffusion)' : 'Utilisateur selectionne'}
									</p>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
