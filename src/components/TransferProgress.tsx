interface TransferProgressProps {
	filename: string;
	progress: number;
	status: 'uploading' | 'complete' | 'error';
}

export default function TransferProgress({ filename, progress, status }: TransferProgressProps) {
	return (
		<div className="card">
			<div className="flex items-center gap-3">
				{/* Icon */}
				<div className={`w-10 h-10 rounded-full flex items-center justify-center ${
					status === 'complete'
						? 'bg-brand-green/10'
						: status === 'error'
							? 'bg-brand-red/10'
							: 'bg-brand-blue/10'
				}`}>
					{status === 'complete' ? (
						<svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					) : status === 'error' ? (
						<svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg className="w-5 h-5 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
						</svg>
					)}
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium dark:text-white truncate">{filename}</p>
					<p className={`text-xs ${
						status === 'complete'
							? 'text-brand-green'
							: status === 'error'
								? 'text-brand-red'
								: 'text-gray-400'
					}`}>
						{status === 'complete'
							? 'Envoi termine'
							: status === 'error'
								? 'Echec de l\'envoi'
								: 'Envoi en cours...'}
					</p>
				</div>

				{/* Progress */}
				{status === 'uploading' && (
					<span className="text-sm font-medium text-brand-blue">{progress}%</span>
				)}
			</div>

			{/* Progress bar */}
			{status === 'uploading' && (
				<div className="mt-3 w-full bg-gray-200 dark:bg-navy-600 rounded-full h-1.5">
					<div
						className="bg-brand-blue h-1.5 rounded-full transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}
		</div>
	);
}
