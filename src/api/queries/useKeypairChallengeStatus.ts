import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { QueryKeys } from '@/api/queryKeys';
import {
  getKeypairChallengeStatus,
  GetKeypairChallengeStatusResponse,
} from '../requests/getKeypairChallengeStatus';

export const useKeypairChallengeStatus = () => {
  const auth = useAuth();
  return useQuery<GetKeypairChallengeStatusResponse>({
    queryKey: [QueryKeys.keypairChallengeStatus],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token)
        throw new Error('Unauthorised useKeypairChallengeStatus call');
      return getKeypairChallengeStatus(token).then((res) => res.data);
    },
  });
};
