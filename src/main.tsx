import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Session from './Session.tsx';
import Home from './pages/Home.tsx';
import Chat from './pages/Chat.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: 's/:sessionId',
    element: <Session />,
  },
  {
    path: 's/:sessionId/:rejoined',
    element: <Session />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
