// apiClient.ts
export interface ApiResponse<T = any> {
  data: T;
}

export interface ApiClient {
  get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
  post<T = any>(url: string, body?: any, config?: any): Promise<ApiResponse<T>>;
  put<T = any>(url: string, body?: any, config?: any): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, body?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
}
