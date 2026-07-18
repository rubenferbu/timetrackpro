import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function ProtectedRoute ({children, allowedRoles}) {
    const { user, token } = useAuthStore();

    if (!token || !user) {
        return <Navigate to="/Login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return children;
}

export default ProtectedRoute;