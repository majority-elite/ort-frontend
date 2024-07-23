import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => [
  { title: 'ORT - 동아리 플랫폼' },
  {
    name: 'description',
    content:
      '동아리를 찾고, 동아리에 들어가, 동아리에서 활동하는 모든 과정에 함께합니다.',
  },
];

const Index = () => (
  <div>
    <h1>Ort</h1>
  </div>
);

export default Index;
