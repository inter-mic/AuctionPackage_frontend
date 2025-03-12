import { texts } from '@/config/texts';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios, { AxiosRequestConfig, AxiosProgressEvent } from "axios";

export const useApiRequest = () => {
  const router = useRouter();

  const getBaseUrl = (endPointKbn: string) => {
    switch (endPointKbn) {
      case 'admin':
        return process.env.NEXT_PUBLIC_ADMIN_API_URL;
      case 'member':
        return process.env.NEXT_PUBLIC_MEMBER_API_URL;
      case 'public':
        return process.env.NEXT_PUBLIC_API_URL;
      default:
        throw new Error('無効なエンドポイント区分です');
    }
  };
  const apiRequest = async (
    endPointKbn : string,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' ,
    body: object | null = null,
    successMessage: string ,
    returnJson: boolean = false ,
    headers?:  Record<string, string> ,
    config?: AxiosRequestConfig
  ): Promise<{ status: number; data: any } | undefined> => {
    const toastId = toast.loading('Loading...');
    try {
      
      const baseUrl = getBaseUrl(endPointKbn);
      const fetchHeaders: Record<string, string> = headers || {};
        // FormData の場合、Content-Type ヘッダーを設定しない
      if (!(body instanceof FormData)) {
        fetchHeaders['Content-Type'] = 'application/json';
      }
      const axiosConfig: AxiosRequestConfig = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: fetchHeaders,
        withCredentials: true,
        data: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
        validateStatus: (status) => status < 500, 
        ...config, // `onUploadProgress` などを受け取る
      };
      const res = await axios(axiosConfig);
      
      if (res.status === 401) {
        if (endPointKbn === 'admin') {
          router.push('/admin/login');
        } else if (endPointKbn === 'member') {
          router.push('/login');
        }
        toast.update(toastId, { 
          render: texts.message.redirect, 
          type: 'warning', 
          isLoading: false,
          autoClose: 3000 
        });
        return { status: res.status, data: false };
      }else if (res.status === 404) {
        toast.update(toastId, { 
          render: texts.message.noResult, 
          type: 'warning', 
          isLoading: false,
          autoClose: 3000 
        });
        return { status: res.status, data: false };
      
      }

      if (res.status === 200) {
        const responseData = returnJson ? res.data : true;

        if (successMessage) {
          toast.update(toastId, { 
            render: successMessage, 
            type: 'success', 
            isLoading: false,
            autoClose: 3000 
          });
        } else {
          toast.dismiss(toastId);
        }

        return { status: res.status, data: responseData };
      } else if (res.status === 400) {
        const responseData = returnJson ? res.data : true;
        toast.update(toastId!, { 
          render: texts.message.error400, 
          type: 'error', 
          isLoading: false,
          autoClose: 3000 
        });
        return { status: res.status, data: responseData.data };
      }
    } catch (error) {
      toast.update(toastId, { 
        render: '通信エラーが発生しました', 
        type: 'error', 
        isLoading: false,
        autoClose: 3000
      });
      return { status: 500, data: false };
    }
  };

  return { apiRequest };
};