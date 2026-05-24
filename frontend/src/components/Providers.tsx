'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { initSocket, disconnectSocket } from '../lib/socket';

import { setCredentials, logout, setInitialized } from '../store/authSlice';
import api from '../lib/api';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          store.dispatch(setCredentials({ user: res.data, token }));
          
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.sub) {
            initSocket(payload.sub);
          }
        } catch (e) {
          store.dispatch(logout());
        }
      }
      store.dispatch(setInitialized(true));
    };

    initAuth();

    return () => {
      disconnectSocket();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
