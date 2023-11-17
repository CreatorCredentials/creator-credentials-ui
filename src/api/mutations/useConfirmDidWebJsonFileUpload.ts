import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from '@/api/axios';
import {
  confirmDidWebJsonFileUpload,
  ConfirmDidWebJsonFileUploadResponse,
} from '../requests/confirmDidWebJsonFileUpload';

export const useConfirmDidWebJsonFileUpload = (
  options?: Omit<
    UseMutationOptions<ConfirmDidWebJsonFileUploadResponse, AxiosError, void>,
    'mutationFn'
  >,
) =>
  useMutation({
    mutationFn: () => confirmDidWebJsonFileUpload().then((res) => res.data),
    ...options,
  });
