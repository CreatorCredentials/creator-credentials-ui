import axios, { AxiosResponse } from '@/api/axios';

export type SignupIssuerPayload = {
  domain: string;
  companyName: string;
  email: string;
  termsAndConditions: boolean;
};

export type SignupIssuerResponse = never;

export const signupIssuer = (payload: SignupIssuerPayload) =>
  axios.post<
    SignupIssuerPayload,
    AxiosResponse<SignupIssuerResponse, SignupIssuerPayload>
  >('/auth/signup/issuer', payload);
