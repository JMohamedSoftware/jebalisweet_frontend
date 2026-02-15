export const getUser = () => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch (error) {
        return null;
    }
};

export const isAdmin = () => {
    const user = getUser();
    return user?.role === 'admin';
};
