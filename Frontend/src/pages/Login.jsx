import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">This is Login Page</h1>
      <p className="text-slate-400 mb-6">User login component will be implemented here.</p>
      
      <Link 
        to="/login" 
        className="text-orange-500 underline hover:text-orange-400"
      >
        Go to Register Page
      </Link>
    </div>
  );
};

export default Login;