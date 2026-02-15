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
}

const AdminUserManagementInteractive = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'client' | 'admin' | 'livreur'>('all');
    const [currentUser, setCurrentUser] = useState<any>(null);

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
                                            <button
                                                onClick={() => handleDeleteUser((user.id || user._id)!, `${user.firstName} ${user.lastName}`)}
                                                className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-smooth"
                                                title="Supprimer l'utilisateur"
                                            >
                                                <Icon name="TrashIcon" size={20} />
                                            </button>
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
        </div>
    );
};

export default AdminUserManagementInteractive;
