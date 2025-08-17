import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AppLayout from './components/AppLayout';
import ErrorPage from './components/ErrorPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <TaskProvider>
        <RouterProvider router={router} />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
``