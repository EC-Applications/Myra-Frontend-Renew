export interface iResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

