import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

// Mock user data for demo — replace with real auth data
const mockUsers = {
  owner: { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'owner', avatar: 'S' },
  tenant: { name: 'Ahmed Khan', email: 'ahmed@example.com', role: 'tenant', avatar: 'A' },
  company: { name: 'CleanPro Co.', email: 'cleanpro@example.com', role: 'company', avatar: 'C' },
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(mockUsers.owner);

  const switchRole = (role) => setUser(mockUsers[role]);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, switchRole, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
