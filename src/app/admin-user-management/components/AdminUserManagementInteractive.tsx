'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

interface User {
    id: string;
    _id?: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
    role: 'client' | 'admin' | 'livreur';
    status: 'active' | 'pending' | 'rejected';
    createdAt: string;
    readablePassword?: string;
    loginHistory?: { ip: string; timestamp: string }[];
    address?: string;
    city?: string;
    postalCode?: string;
}

const AdminUserManagementInteractive = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'client' | 'admin' | 'livreur'>('all');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== 'admin') {
                router.push('/homepage');
                return;
            }
            setCurrentUser(parsedUser);
            fetchUsers();
        } else {
            router.push('/login');
        }
    }, [router]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.users.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (id === currentUser?.id || id === currentUser?._id) {
            alert("Vous ne pouvez pas supprimer votre propre compte.");
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${name}" ? Cette action est irréversible.`)) {
            try {
                await api.users.delete(id);
                setUsers(users.filter(u => (u.id || u._id) !== id));
                alert("Utilisateur supprimé avec succès.");
            } catch (error) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPass = process.env.NEXT_PUBLIC_ADMIN_USER_PASS;


        if (adminPassword === correctPass) {
            setIsAuthorized(true);
            fetchUsers();
        } else {
            alert("Mot de passe incorrect.");
        }
    };

    const filteredUsers = users.filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const username = u.username?.toLowerCase() || '';
        const email = u.email.toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesSearch = fullName.includes(query) || username.includes(query) || email.includes(query);
        const matchesRole = filterRole === 'all' || u.role === filterRole;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card rounded-2xl shadow-premium border border-border p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="LockClosedIcon" size={32} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Accès Sécurisé</h2>
                    <p className="text-muted-foreground mb-8">Veuillez entrer le mot de passe administrateur pour accéder à la gestion des comptes.</p>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-center text-lg"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            Déverrouiller
                        </button>
                    </form>

                    <Link href="/admin-dashboard" className="inline-block mt-6 text-sm text-muted-foreground hover:text-primary transition-colors">
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/admin-dashboard" className="p-2 hover:bg-muted rounded-lg transition-smooth">
                                <Icon name="ArrowLeftIcon" size={20} className="text-muted-foreground" />
                            </Link>
                            <h1 className="font-heading text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
                        </div>
                        <p className="text-muted-foreground ml-10">Total: {users.length} utilisateurs | Filtrés: {filteredUsers.length}</p>
                    </div>
                </div>

                <div className="bg-card rounded-lg shadow-warm border border-border p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as any)}
                            className="px-4 py-2 bg-muted/20 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-w-[150px]"
                        >
                            <option value="all">Tous les rôles</option>
                            <option value="client">Clients</option>
                            <option value="livreur">Livreurs</option>
                            <option value="admin">Administrateurs</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-3 font-semibold text-sm uppercase text-muted-foreground">Utilisateur</th>
                                    <th className="pb-3 font-semibold text-sm uppercase text-muted-foreground">Rôle</th>
                                    <th className="pb-3 font-semibold text-sm uppercase text-muted-foreground">Statut</th>
                                    <th className="pb-3 font-semibold text-sm uppercase text-muted-foreground">Inscription</th>
                                    <th className="pb-3 font-semibold text-sm uppercase text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id || user._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Icon name="UserIcon" size={20} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-error/10 text-error border border-error/20' :
                                                user.role === 'livreur' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                    'bg-primary/10 text-primary border border-primary/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'active' ? 'text-success' :
                                                user.status === 'pending' ? 'text-warning' :
                                                    'text-error'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-success' :
                                                    user.status === 'pending' ? 'bg-warning' :
                                                        'bg-error'
                                                    }`} />
                                                {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-smooth"
                                                    title="Voir les détails"
                                                >
                                                    <Icon name="EyeIcon" size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser((user.id || user._id)!, `${user.firstName} ${user.lastName}`)}
                                                    className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-smooth"
                                                    title="Supprimer l'utilisateur"
                                                >
                                                    <Icon name="TrashIcon" size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Détails Utilisateur */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-premium border border-border animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                            <h3 className="text-xl font-bold text-foreground">Détails de l'utilisateur</h3>
                            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Icon name="XMarkIcon" size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Section Identité */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Informations Personnelles</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Nom Complet</p>
                                            <p className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-semibold">{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Téléphone</p>
                                            <p className="font-semibold">{selectedUser.phone || 'Non renseigné'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Mot de passe</p>
                                            <p className={`font-mono font-bold px-2 py-1 rounded inline-block mt-1 ${selectedUser.readablePassword ? 'text-primary bg-primary/5' : 'text-warning bg-warning/10'}`}>
                                                {selectedUser.readablePassword || 'Attente prochaine connexion'}
                                            </p>
                                            {!selectedUser.readablePassword && (
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    * Sera capturé automatiquement lors de sa prochaine connexion au site.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Adresse & Localisation</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Adresse</p>
                                            <p className="font-semibold">{selectedUser.address || 'Non spécifiée'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Ville</p>
                                            <p className="font-semibold">{selectedUser.city || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Code Postal</p>
                                            <p className="font-semibold">{selectedUser.postalCode || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Historique */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Historique des 5 dernières connexions</h4>
                                <div className="bg-muted/30 rounded-xl overflow-hidden border border-border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-muted/50 text-left">
                                                <th className="px-4 py-2 font-semibold">Date & Heure</th>
                                                <th className="px-4 py-2 font-semibold">Adresse IP</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {selectedUser.loginHistory && selectedUser.loginHistory.length > 0 ? (
                                                selectedUser.loginHistory.map((login, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {new Date(login.timestamp).toLocaleString('fr-FR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-xs">{login.ip}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={2} className="px-4 py-6 text-center text-muted-foreground italic">
                                                        Aucun historique disponible pour le moment
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="px-6 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagementInteractive;
