import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth'; // Import your useAuth hook
import useRole from '@/hooks/useRole'; // Import your useRole hook

const withAuthRole = (requiredRole) => (WrappedComponent) => {
  const WithAuthRole = (props) => {
    const isAuth = useAuth();
    const role = useRole();
    const router = useRouter();
    useEffect(() => {
      if (!isAuth || role !== requiredRole) {
        router.push('/analytics');
      }
    }, [isAuth, role]);

    if (!isAuth || role !== requiredRole) {
      return <div>Redirecting...</div>; // Or you can render a loading spinner or message
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthRole;
};

export default withAuthRole;
