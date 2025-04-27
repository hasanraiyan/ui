import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/slices/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const signIn = (credentials) => {
    dispatch(login(credentials));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return { isAuthenticated, user, signIn, signOut };
}
