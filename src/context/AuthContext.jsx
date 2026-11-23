import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setLoading(false);
          return;
        }
      } catch {
        console.warn('Backend server offline. Checking local demo session.');
      }
      const saved = localStorage.getItem('rtx_shop_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (parseErr) {
          console.warn('Saved RTX Shop session was unreadable.', parseErr);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      console.warn('Backend server offline. Entering RTX Shop Offline Demo Mode.', err);
      const demoUser = {
        id: 'demo_rtx_user_001',
        name: email.split('@')[0] || 'Cyber Customer',
        email: email,
        role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER',
        avatar: '/images/avatars/cyber1.png'
      };
      localStorage.setItem('rtx_shop_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { user: demoUser };
    }
    
    if (!res.ok) {
      let errorMessage = 'Erro ao realizar login';
      let errorCause;
      try {
        const data = await res.json();
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(e => e.message).join(' | ');
        } else if (data.error) {
          errorMessage = data.error;
        }
      } catch (e) {
        errorCause = e;
        errorMessage = `Servidor offline ou indisponível (Status ${res.status}). Certifique-se de que o backend está rodando na porta 5000.`;
      }
      throw new Error(errorMessage, { cause: errorCause });
    }
    
    try {
      const data = await res.json();
      setUser(data.user);
      return data;
    } catch (err) {
      throw new Error('Formato de resposta inválido do servidor.', { cause: err });
    }
  };

  const register = async (name, email, password) => {
    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
    } catch (err) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.', { cause: err });
    }
    
    if (!res.ok) {
      let errorMessage = 'Erro ao registrar';
      let errorCause;
      try {
        const data = await res.json();
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(e => e.message).join(' | ');
        } else if (data.error) {
          errorMessage = data.error;
        }
      } catch (e) {
        errorCause = e;
        errorMessage = `Servidor offline ou indisponível (Status ${res.status}). Certifique-se de que o backend está rodando na porta 5000.`;
      }
      throw new Error(errorMessage, { cause: errorCause });
    }
    
    try {
      return await res.json();
    } catch (err) {
      throw new Error('Formato de resposta inválido do servidor.', { cause: err });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const updateProfile = async (name, avatar) => {
    let res;
    try {
      res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar })
      });
    } catch (err) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.', { cause: err });
    }
    
    if (!res.ok) {
      let errorMessage = 'Erro ao atualizar perfil';
      let errorCause;
      try {
        const data = await res.json();
        if (data.error) {
          errorMessage = data.error;
        }
      } catch (e) {
        errorCause = e;
        errorMessage = `Servidor offline ou indisponível (Status ${res.status}). Certifique-se de que o backend está rodando na porta 5000.`;
      }
      throw new Error(errorMessage, { cause: errorCause });
    }
    
    try {
      const data = await res.json();
      setUser(data.user);
      return data;
    } catch (err) {
      throw new Error('Formato de resposta inválido do servidor.', { cause: err });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
