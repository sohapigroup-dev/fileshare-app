import { useState } from 'react';
import { filesApi } from '../lib/api';
import type { FileTransfer } from '../types';

interface SentFilesProps {
	transfers: FileTransfer[];
	currentUserId: string;
	onRefresh: () => void;
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return bytes + ' B';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type: string): string {
	if (type.startsWith('image/')) return '🖼️';
	if (type.startsWith('video/')) return '🎬';
	if (type.startsWith('audio/')) return '🎵';
	if (type.includes('pdf')) return '📄';
	if (type.includes('word') || type.includes('document')) return '📝';
	if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
	if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return '📦';
	return '📎';
}

export default function SentFiles({ transfers, currentUserId, onRefresh }: SentFilesProps) {
	const [deleting, setDeleting] = useState<string | null>(null);

	// Fichiers envoyés par l'utilisateur
	const myFiles = transfers.filter(t => t.expediteurId === currentUserId);

	const handleDownload = (transfer: FileTransfer) => {
		filesApi.download(transfer.id, transfer.fichierNom);
	};

	const handleDelete = async (transfer: FileTransfer) => {
		if (!confirm(`Supprimer "${transfer.fichierNom}" ?`)) return;

		setDeleting(transfer.id);
		try {
			await filesApi.delete(transfer.id, currentUserId);
			onRefresh();
		} catch (error) {
			alert('Erreur lors de la suppression');
		} finally {
			setDeleting(null);
		}
	};

	return (
		<div className="card">
			<h3 className="text-sm font-medium text-navy-700 dark:text-gray-200 mb-3">
				Mes fichiers envoyes ({myFiles.length})
			</h3>

			{myFiles.length === 0 ? (
				<div className="text-center py-6">
					<div className="w-10 h-10 mx-auto bg-gray-100 dark:bg-navy-700 rounded-full flex items-center justify-center mb-2">
						<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
					</div>
					<p className="text-xs text-gray-400">Aucun fichier envoye</p>
				</div>
			) : (
				<div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin pr-1">
					{myFiles.map(transfer => (
						<div
							key={transfer.id}
							className="p-2 bg-gray-50 dark:bg-navy-700 rounded-lg group"
						>
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<span className="text-lg">{getFileIcon(transfer.fichierType)}</span>
									<div className="min-w-0 flex-1">
										<p className="text-xs font-medium dark:text-white truncate">
											{transfer.fichierNom}
										</p>
										<div className="flex items-center gap-1.5 text-xs text-gray-400">
											<span>{formatFileSize(transfer.fichierTaille)}</span>
											<span>•</span>
											<span>
												{transfer.canal === 'broadcast'
													? 'Diffusion'
													: `→ ${transfer.destinataire?.nom || 'Utilisateur'}`
												}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									{/* Télécharger */}
									<button
										onClick={() => handleDownload(transfer)}
										className="p-1 text-brand-blue hover:bg-brand-blue/10 rounded transition-colors"
										title="Telecharger"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
										</svg>
									</button>
									{/* Supprimer */}
									<button
										onClick={() => handleDelete(transfer)}
										disabled={deleting === transfer.id}
										className="p-1 text-brand-red hover:bg-brand-red/10 rounded transition-colors disabled:opacity-50"
										title="Supprimer"
									>
										{deleting === transfer.id ? (
											<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
											</svg>
										) : (
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										)}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
