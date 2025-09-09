import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Protected({
  children,
}: {
  children: React.ReactElement;
}) {
  const token = localStorage.getItem('authToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
