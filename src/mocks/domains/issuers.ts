import { rest } from 'msw';
import { GetCreatorIssuersResponse } from '@/api/requests/getCreatorIssuers';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';
import { MOCK_API_URL } from '../config';

export const issuersHandlers = [
  rest.get<GetCreatorIssuersResponse>(
    `${MOCK_API_URL}/creator/issuers`,
    (_req, res, ctx) => {
      const delay = ctx.delay(500);

      return res(
        delay,
        ctx.status(200),
        ctx.json<GetCreatorIssuersResponse>({
          issuers: [
            {
              id: '1',
              name: 'Creator Credentials B.V.',
              description:
                'Based in the Netherlands, supporting creators credentials worldwide',
              imageUrl: '/images/brand.svg',
              data: {
                domain: 'creatorcredentials.com',
                requirements: 'Info about requirements',
              },
              fees: true,
              status: IssuerConnectionStatus.Connected,
              vcs: [],
            },
            {
              id: '2',
              name: 'Posth Werk B.V.',
              description:
                'Based in the Netherlands, supporting creators in the music industry',
              imageUrl: '/images/posth-werk.svg',
              data: {
                domain: 'posth.me',
                requirements: 'Info about requirements',
              },
              fees: true,
              status: IssuerConnectionStatus.Connected,
              vcs: [],
            },
            {
              id: '3',
              name: 'Liccium',
              description: `Liccium helps creators to inseparably bind public and verifiable claims to their content.`,
              imageUrl: '/images/liccium.svg',
              data: {
                domain: 'liccium.com',
                requirements: 'Info about requirements',
              },
              fees: false,
              status: IssuerConnectionStatus.Pending,
              vcs: [],
            },
            {
              id: '4',
              name: 'Alternative Artists Association',
              description: `The AAA is supporting alternative artists worldwide`,
              imageUrl: '/images/icons/schedule.svg',
              data: {
                domain: 'aaa.com',
                requirements: 'Info about requirements',
              },
              fees: true,
              status: IssuerConnectionStatus.NotStarted,
              vcs: [],
            },
            {
              id: '5',
              name: 'News Credential Service',
              description: `The NCS is a NGO, supporting news journalists and photographers worldwide`,
              imageUrl: '/images/icons/caption-filled.svg',
              data: {
                domain: 'NCS-credentials.com',
                requirements: 'Info about requirements',
              },
              fees: true,
              status: IssuerConnectionStatus.NotStarted,
              vcs: [],
            },
            {
              id: '6',
              name: 'Videographic Trust',
              description: `This trust service works with vloggers, film makers and documentarists `,
              imageUrl: '/images/icons/verified-filled.svg',
              data: {
                domain: 'trust.video',
                requirements: 'Info about requirements',
              },
              fees: true,
              status: IssuerConnectionStatus.NotStarted,
              vcs: [],
              additionalVerificationSteps: true,
            },
          ],
        }),
      );
    },
  ),
];
