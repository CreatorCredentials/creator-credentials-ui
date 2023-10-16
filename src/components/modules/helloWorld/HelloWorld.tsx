import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { axios } from '@/shared/utils/axios';

export const HelloWorld = () => {
  const { t } = useTranslation('common');
  const [getData, setGetData] = useState(null);
  const [postData, setPostData] = useState(null);

  const handleButtonClick = async () => {
    const response = await axios.post('/hello-world', {
      hello: 'world',
    });
    setPostData(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/hello-world');
        setGetData(response.data);
      } catch (error) {
        console.error('Could not fetch ....');
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <button onClick={handleButtonClick}>{t('hello-world')}</button>
      {getData && <div>{getData}</div>}
      {postData && <div>{postData}</div>}
    </div>
  );
};
