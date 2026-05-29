import { GetServerSideProps, NextPage } from 'next';

const CreatorKeypairVerificationPage: NextPage = () => null;

// eslint-disable-next-line require-await
export const getServerSideProps = (async () => ({
  redirect: {
    destination: '/creator/verification',
    permanent: false,
  },
})) satisfies GetServerSideProps;

export default CreatorKeypairVerificationPage;
