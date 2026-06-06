import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/tests/pages/DashboardPage';
import { TestTrackingPage } from '@/features/tests/pages/TestTrackingPage';
import { TestFormPage } from '@/features/tests/pages/TestFormPage';
import { QuestionsPage } from '@/features/questions/pages/QuestionsPage';
import { PreviewPage } from '@/features/tests/pages/PreviewPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'test-tracking',
        element: <TestTrackingPage />,
      },
      {
        path: 'tests/create',
        element: <TestFormPage />,
      },
      {
        path: 'tests/:testId/edit',
        element: <TestFormPage />,
      },
      {
        path: 'tests/:testId/questions',
        element: <QuestionsPage />,
      },
      {
        path: 'tests/:testId/preview',
        element: <PreviewPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
