export type FormData = {
  email: string;
  password: string;
};

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
}
