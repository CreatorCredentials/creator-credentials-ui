import axios, { AxiosResponse } from '@/api/axios';
import { UserRole } from '@/shared/typings/UserRole';

export type LoginPayload = {
  email: string;
  userRole: UserRole;
};

export type LoginResponse = never;

export const logIn = (payload: LoginPayload) =>
  axios.post<LoginPayload, AxiosResponse<LoginResponse, LoginPayload>>(
    '/auth/login',
    payload,
  );
