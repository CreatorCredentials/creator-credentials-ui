import axios, { AxiosResponse } from '@/api/axios';

export type SignupCreatorPayload = {
  email: string;
  termsAndConditions: boolean;
};

export type SignupCreatorResponse = never;

export const signupCreator = (payload: SignupCreatorPayload) =>
  axios.post<
    SignupCreatorPayload,
    AxiosResponse<SignupCreatorResponse, SignupCreatorPayload>
  >('/creator/signup', payload);
