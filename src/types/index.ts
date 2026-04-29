export type UserRole = 'directeur' | 'collaborateur';

export interface User {
	id: string;
	nom: string;
	role: UserRole;
	socketId?: string | null;
	online: boolean;
}

export interface FileReadReceipt {
	id: string;
	userId: string;
	fileId: string;
	readAt: string;
}

export interface FileTransfer {
	id: string;
	expediteurId: string;
	expediteur?: User;
	destinataireId: string | null;
	destinataire?: User | null;
	canal: 'broadcast' | 'p2p';
	fichierNom: string;
	fichierTaille: number;
	fichierType: string;
	cheminLocal: string;
	createdAt: string;
	readReceipts?: FileReadReceipt[];
}

export interface AuthResponse {
	token: string;
	user: User;
}
