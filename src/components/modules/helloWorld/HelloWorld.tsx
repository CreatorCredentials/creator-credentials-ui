import { useTranslation } from 'next-i18next';
import { useHelloWorldQuery } from '@/shared/queries/useHelloWorldQuery';
import { useSendHelloWorldMutation } from '@/shared/mutations/useSendHelloWorldMutation';

export const HelloWorld = () => {
  const { t } = useTranslation('common');
  const [getData, setGetData] = useState(null);
  const [postData, setPostData] = useState(null);

  const { data: getHelloWorldData, isLoading } = useHelloWorldQuery();
  const { mutateAsync, data: sendHelloWorldData } = useSendHelloWorldMutation();

  const handleButtonClick = async () => {
    await mutateAsync();
  };

  if (isLoading) return <div>Loading</div>;

  return (
    <div>
      <button onClick={handleButtonClick}>{t('hello-world')}</button>
      {getHelloWorldData && <div>{getHelloWorldData}</div>}
      {sendHelloWorldData && <div>{sendHelloWorldData}</div>}
    </div>
  );
};
