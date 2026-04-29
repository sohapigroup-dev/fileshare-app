import { filesApi } from '../lib/api';
import type { FileTransfer } from '../types';

interface InboxProps {
	transfers: FileTransfer[];
	currentUserId: string;
	onRefresh: () => void;
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return bytes + ' B';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	});
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

export default function Inbox({ transfers, currentUserId, onRefresh }: InboxProps) {
	// Filter transfers for this user (broadcast or direct)
	const myTransfers = transfers.filter(
		t => t.destinataireId === null || t.destinataireId === currentUserId
	).filter(t => t.expediteurId !== currentUserId);

	// Vérifier si un fichier est lu
	// Note: readReceipts peut être un objet vide {} au lieu de [] quand il n'y a pas de receipts
	const isRead = (transfer: FileTransfer) => {
		const receipts = transfer.readReceipts;
		return Array.isArray(receipts) && receipts.some(r => r.userId === currentUserId);
	};

	const unreadCount = myTransfers.filter(t => !isRead(t)).length;

	const handleDownload = async (transfer: FileTransfer) => {
		// Marquer comme lu au téléchargement
		if (!isRead(transfer)) {
			await filesApi.markAsRead(transfer.id, currentUserId);
			onRefresh();
		}
		filesApi.download(transfer.id, transfer.fichierNom);
	};

	const handleToggleRead = async (transfer: FileTransfer) => {
		if (isRead(transfer)) {
			await filesApi.markAsUnread(transfer.id, currentUserId);
		} else {
			await filesApi.markAsRead(transfer.id, currentUserId);
		}
		onRefresh();
	};

	return (
		<div className="card h-full">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-sm font-medium text-navy-700 dark:text-gray-200">
					Fichiers recus ({myTransfers.length})
				</h3>
				{unreadCount > 0 && (
					<span className="px-2 py-0.5 text-xs font-medium bg-brand-blue text-white rounded-full">
						{unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
					</span>
				)}
			</div>

			{myTransfers.length === 0 ? (
				<div className="text-center py-8">
					<div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-navy-700 rounded-full flex items-center justify-center mb-3">
						<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
						</svg>
					</div>
					<p className="text-sm text-gray-400">Aucun fichier recu</p>
				</div>
			) : (
				<div className="space-y-2 max-h-96 overflow-y-auto">
					{myTransfers.map(transfer => {
						const read = isRead(transfer);
						return (
							<div
								key={transfer.id}
								className={`p-3 rounded-lg transition-colors ${
									read
										? 'bg-gray-50 dark:bg-navy-700'
										: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-brand-blue'
								}`}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-start gap-3 min-w-0 flex-1">
										<span className="text-2xl">{getFileIcon(transfer.fichierType)}</span>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className={`text-sm truncate ${read ? 'font-medium dark:text-white' : 'font-bold dark:text-white'}`}>
													{transfer.fichierNom}
												</p>
												{!read && (
													<span className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full" />
												)}
											</div>
											<p className="text-xs text-gray-400">
												De: {transfer.expediteur?.nom || 'Inconnu'}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<span className="text-xs text-gray-400">
													{formatFileSize(transfer.fichierTaille)}
												</span>
												<span className="text-xs text-gray-300">•</span>
												<span className="text-xs text-gray-400">
													{formatDate(transfer.createdAt)}
												</span>
												{transfer.canal === 'broadcast' && (
													<>
														<span className="text-xs text-gray-300">•</span>
														<span className="text-xs text-brand-blue">Diffusion</span>
													</>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-1">
										{/* Toggle lu/non-lu */}
										<button
											onClick={() => handleToggleRead(transfer)}
											className={`p-1.5 rounded-lg transition-colors ${
												read
													? 'text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-600'
													: 'text-brand-blue hover:bg-brand-blue/10'
											}`}
											title={read ? 'Marquer non lu' : 'Marquer lu'}
										>
											{read ? (
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
												</svg>
											) : (
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
													<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
												</svg>
											)}
										</button>
										{/* Télécharger */}
										<button
											onClick={() => handleDownload(transfer)}
											className="p-1.5 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
											title="Telecharger"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
