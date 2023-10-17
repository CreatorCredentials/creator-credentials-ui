import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axios } from '@/shared/utils/axios';

const sendHelloWorldRequest = async (): Promise<string> => {
  const response = await axios.post<string>('/hello-world');
  return response.data;
};

const sendHelloWorldMutationOptions: UseMutationOptions<string> = {
  mutationFn: sendHelloWorldRequest,
};

const useSendHelloWorldMutation = () =>
  useMutation(sendHelloWorldMutationOptions);

export {
  sendHelloWorldRequest,
  useSendHelloWorldMutation,
  sendHelloWorldMutationOptions,
};
