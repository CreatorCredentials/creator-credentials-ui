import { GetServerSideProps, NextPage } from 'next';

const AdminPage: NextPage = () => null;

// eslint-disable-next-line require-await
export const getServerSideProps = (async () => ({
  redirect: {
    destination: '/admin/credentials',
    permanent: false,
  },
})) satisfies GetServerSideProps;

export default AdminPage;
