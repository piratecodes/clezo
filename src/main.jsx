import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import '@/style/global.css'

// 1. Guards & Layouts
import AuthGuard from '@/components/common/AuthGuard.jsx'
import GuestGuard from '@/components/common/GuestGuard.jsx'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import DashboardLayout from '@/layouts/DashboardLayout.jsx'
import { AuthProvider } from '@/contexts/AuthContext.jsx'
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'

// 2. The Pages!
import LoginPage from '@/pages/LoginPage.jsx'
import DashboardPage from '@/pages/DashboardPage.jsx'
import CrmPage from '@/pages/CrmPage.jsx'
import ServicesPage from '@/pages/ServicesPage.jsx'
import GalleryPage from '@/pages/GalleryPage.jsx'
import SettingsPage from '@/pages/SettingsPage.jsx'
import TeamPage from '@/pages/TeamPage.jsx'
import BlogsPage from '@/pages/BlogsPage.jsx'
import SupportCenterPage from '@/pages/SupportCenterPage.jsx'
import SeoPages from '@/pages/SeoPages.jsx'
import ServiceAreasPage from '@/pages/ServiceAreasPage.jsx'
import CommandCenterPage from '@/pages/CommandCenterPage.jsx'

const router = createBrowserRouter([
  {
    // --- THE GUEST ZONE ---
    // Only logged-out users can access these routes
    element: <GuestGuard />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password', 
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password/:token', 
        element: <ResetPassword />,
      }
    ]
  },
  {
    // --- THE PROTECTED ZONE ---
    // Only logged-in users can access these routes
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />, 
        children: [
          {
            path: '/sudo-su',
            element: <DashboardPage />, // Assembled from pages!
          },
          {
            path: '/',
            element: <CommandCenterPage />,
          },
          {
            path: '/crm-panel',
            element: <CrmPage />,       // Assembled from pages!
          },
          {
            path: '/seo-pages',
            element: <SeoPages />,
          },
          {
            path: '/blogs',
            element: <BlogsPage />,
          },
          {
            path: '/services',  // <-- ADD THIS ROUTE
            element: <ServicesPage />,
          },
          {
            path: '/gallery',   // <-- ADD THIS ROUTE
            element: <GalleryPage />,
          },
          {
            path: '/settings',   // <-- ADD THIS ROUTE
            element: <SettingsPage />,
          },
          {
            path: '/team',       // <-- ADD THIS ROUTE
            element: <TeamPage />,
          },
          {
            path: '/support-center',
            element: <SupportCenterPage />,
          },
          {
            path: '/network',
            element: <ServiceAreasPage />,
          },
          // Future pages: /cities, /services, /team, etc.
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)