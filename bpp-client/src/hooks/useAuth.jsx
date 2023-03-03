import React, {
  createContext, useContext, useMemo
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { showNotification } from '@mantine/notifications';
import { userRequest } from '../utils/requests';
import { useLocalStorage } from './useLocalStorage';
import { useLoading } from './useLoading';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();
  const { request } = useLoading();

  const value = useMemo(
    () => ({
      user,
      login: async () => {
        try {
          const response = await request(userRequest);
          if (response.status === 200) {
            setUser(response.data);
            showNotification({
              title: 'Login successful'
            });
            navigate('/home');
          } else {
            showNotification({
              color: 'red',
              title: 'Login failed',
              message: response.data.message
            });
          }
        } catch (error) {
          showNotification({
            color: 'red',
            title: 'Login failed',
            message: error.response.data
              && error.response.data.message ? error.response.data.message : error.message
          });
        }
      }
    }),
    [user, setUser, navigate, request]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);
