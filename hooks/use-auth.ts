// hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Using sonner since it appears to be in your codebase
import Cookies from 'js-cookie';
import axios from 'axios';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Base API URL (update with your actual API URL)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      // Make API request to backend authentication endpoint
      const response = await axios.post(`${API_URL}/api/Auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      if (data.token) {
        // Store the token in a cookie
        Cookies.set('admin_token', data.token, { expires: 1 }); // Expires in 1 day

        // Store user data in localStorage for easy access
        localStorage.setItem(
          'admin_user',
          JSON.stringify({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
          })
        );

        // Show success message
        toast.success('Đăng nhập thành công');

        // Redirect to admin dashboard
        router.push('/admin');
        return { success: true, user: data };
      } else {
        toast.error('Đăng nhập thất bại: Token không hợp lệ');
        return { success: false, error: 'Invalid token' };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Đăng nhập thất bại';
        toast.error(`Đăng nhập thất bại: ${errorMessage}`);
        return { success: false, error: errorMessage };
      } else {
        toast.error('Đăng nhập thất bại: Lỗi kết nối máy chủ');
        return { success: false, error: 'Server connection error' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Remove the authentication cookie
      Cookies.remove('admin_token');

      // Clear user data from localStorage
      localStorage.removeItem('admin_user');

      // Show success message
      toast.success('Đăng xuất thành công');

      // Redirect to login page
      router.push('/login');
      return { success: true };
    } catch (error) {
      toast.error('Đăng xuất thất bại');
      return { success: false };
    }
  };

  const isAuthenticated = () => {
    const token = Cookies.get('admin_token');
    return !!token;
  };

  const getUser = () => {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  };

  return {
    login,
    logout,
    isLoading,
    isAuthenticated,
    getUser,
  };
}
