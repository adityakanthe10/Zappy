// useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/auth/authslice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, status, error } = useSelector((state: RootState) => state.auth);

  const logoutUser = () => {
    dispatch(logout());
  };

  return { token, user, status, error, logoutUser };
};
