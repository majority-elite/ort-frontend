import { v4 as uuidv4 } from 'uuid';

//이용자의 uuid를 받아옵니다.
const getUUID = () => {
  const getUserUUID = (): string => uuidv4();
  return getUserUUID;
};

export default getUUID;
