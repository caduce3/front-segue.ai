import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './pages/_layouts/app'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { SignIn } from './pages/auth/sign-in'
import { AuthLayout } from './pages/_layouts/auth'
import { SignUp } from './pages/auth/sign-up'
import { NotFound } from './pages/404'
import { Users } from './pages/app/users/users'
import Apresentation from './pages/auth/apresentation'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <NotFound />,
        children: [
            {path: '/', element: <Dashboard />},
            {path: '/users', element: <Users />},
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {path: '/apresentation', element: <Apresentation />},
            {path: '/sign-in', element: <SignIn />},
            {path: '/sign-up', element: <SignUp />}
        ]
    },
])