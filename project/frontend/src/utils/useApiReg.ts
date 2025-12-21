import {useState} from "react";
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {toast} from "react-toastify";

// setup API with
const API = axios.create({
    baseURL: 'http://localhost:4000',
});

API.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // token expired error
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const {data} = await API.post('/auth/refresh', {
                    jwt_token: localStorage.getItem('access_token'),
                    refresh_token: localStorage.getItem("refresh_token"),
                });

                localStorage.setItem("access_token", data.jwt);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("jitsi_jwt", data.jitsi_jwt)

                API.defaults.headers["Authorization"] = `Bearer ${data.jwt}`;
                originalRequest.headers["Authorization"] = `Bearer ${data.jwt}`;

                return API(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login"; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export type UseApiReqParams = {
    url: string;
    requestMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    isLoadingByDefault?: boolean; // isLoading will be set to true initially if this param is true
    isRawData?: boolean; // "data" will contains full AxiosResponse instead of AxiosResponse.data
    isResponseBlob?: boolean;
    skipDefaultErrorHandling?: boolean;
}

export function useApiReq<RequestParamGT, ResponseDataGT>(params: UseApiReqParams) {
    const {url, requestMethod, isLoadingByDefault, isRawData, isResponseBlob, skipDefaultErrorHandling} = params;
    const [isLoading, setIsLoading] = useState(!!isLoadingByDefault);
    const [error, setError] = useState<AxiosError<unknown> | null>(null);
    const [data, setData] = useState<UseApiReqParams['isRawData'] extends true ? AxiosResponse<ResponseDataGT> : ResponseDataGT | null>(null);

    const run = async (requestParams?: RequestParamGT) => {
        const requestConfig: AxiosRequestConfig = {
            baseURL: import.meta.env.VITE_HOST,
            url,
            method: requestMethod,
            params: !!requestParams && (requestMethod === 'GET' || requestMethod === 'DELETE') ? requestParams : undefined,
            data: !!requestParams && (requestMethod === 'PUT' || requestMethod === 'POST' || requestMethod === 'PATCH') ? requestParams : undefined,
            responseType: isResponseBlob ? 'blob' : 'json',
        }
        setIsLoading(true);
        try {
            const response = await API.request(requestConfig);
            setData(isRawData ? response : response.data);
            setError(null);
            return isRawData ? response : response.data;
        } catch (error) {
            console.error(error);
            if (!skipDefaultErrorHandling) {
                toast.error("Произошла ошибка! Пожалуйста, попробуйте повторить позже", {position: 'bottom-right'});
            }
            setError(error as AxiosError<unknown>);
            return Promise.reject(error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        data,
        run
    }
}