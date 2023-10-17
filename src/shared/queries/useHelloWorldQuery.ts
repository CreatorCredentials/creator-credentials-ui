import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axios } from '@/shared/utils/axios';

const fetchHelloWorldRequest = async (): Promise<string> => {
  const response = await axios.get<string>('/hello-world');
  return response.data;
};

const helloWorldQueryOptions: UseQueryOptions<string> = {
  queryKey: ['hello-world'],
  queryFn: () => fetchHelloWorldRequest(),
  staleTime: 1000 * 5 * 1, // 5 seconds
};

const useHelloWorldQuery = () => useQuery(helloWorldQueryOptions);

export { fetchHelloWorldRequest, useHelloWorldQuery, helloWorldQueryOptions };
