import { GetServerSideProps } from 'next';
import { HelloWorld } from '@/components/modules/helloWorld/HelloWorld';
import { getI18nProps } from '@/shared/utils/i18n';
import { axios } from '@/shared/utils/axios';

export default function Home() {
  return (
    <main>
      <HelloWorld />
    </main>
  );
}

export const getServerSideProps = (async (ctx) => {
  try {
    const response = await axios.get('/hello-world');
    console.info(response.data);
  } catch (err) {
    console.error('Could not fetch ....');
  }

  return {
    props: {
      ...(await getI18nProps(ctx.locale)),
    },
  };
}) satisfies GetServerSideProps;
