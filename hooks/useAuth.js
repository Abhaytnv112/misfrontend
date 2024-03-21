import { useSelector } from 'react-redux';

const useAuth = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  return isAuth;
};

export default useAuth;
