export interface IHttpResponse<T = any> {
  data?: T;
  error?: {
    status: number;
    name: string;
    error: string;
    messages: any;
    path: string;
    timestamp: string;
    stack?: string;
  };
}
