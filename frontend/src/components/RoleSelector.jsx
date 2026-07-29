import React from 'react';

const roles = [
  { id: 'tenant', title: 'Tenant', icon: '🏠' },
  { id: 'owner', title: 'Owner', icon: '🔑' },
  { id: 'company', title: 'Company', icon: '🛠️' }
];

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
      <div className="grid grid-cols-3 gap-3">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium select-none
              ${selectedRole === role.id
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-500 hover:border-green-300'
              }`}
          >
            <span className="text-2xl mb-1">{role.icon}</span>
            <span>{role.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
