import { GetServerSideProps } from 'next';
import { getI18nProps } from '@/shared/utils/i18n';
import { HelloWorld } from '@/components/modules/helloWorld/HelloWorld';

export default function Home() {
  return (
    <main>
      <HelloWorld />
    </main>
  );
}

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale)),
    },
  };
}) satisfies GetServerSideProps;
