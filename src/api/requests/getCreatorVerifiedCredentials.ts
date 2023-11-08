import axios from '../axios';

export type GetCreatorVerifiedCredentialsResponse = {
  metaMask: string | null;
};

export const getCreatorVerifiedCredentials = () =>
  axios.get<GetCreatorVerifiedCredentialsResponse>('/users/vc');
