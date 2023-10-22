import { BackendTokens } from '@/shared/typings/BackendTokens';
import { BaseUserData } from '@/shared/typings/BaseUserData';
import axios, { AxiosResponse } from '../axios';

export type SignInWithEmailCodePayload = {
  code: string;
};

export type SignInWithEmailCodeResponse = {
  user: BaseUserData;
  backendTokens: BackendTokens;
};

export const signInWithEmailCode = (code: string) =>
  axios.post<
    SignInWithEmailCodePayload,
    AxiosResponse<SignInWithEmailCodeResponse, SignInWithEmailCodePayload>
  >('/auth/signin/code', {
    code: code,
  });
