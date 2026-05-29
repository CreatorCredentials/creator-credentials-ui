import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { QueryKeys } from '@/api/queryKeys';
import {
  getCertChallengeStatus,
  GetCertChallengeStatusResponse,
} from '../requests/getCertChallengeStatus';

export const useCertChallengeStatus = () => {
  const auth = useAuth();

  return useQuery<GetCertChallengeStatusResponse>({
    queryKey: [QueryKeys.certChallengeStatus],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) throw new Error('Unauthorised useCertChallengeStatus call');
      return getCertChallengeStatus(token).then((res) => res.data);
    },
  });
};
