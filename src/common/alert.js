import {  notification,Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const useAlert = () => {
const [api, contextHolder] = notification.useNotification();

const info = (header,description) => {
  api.info({
    title: header,
    description:description,
    placement:'topRight',
    showProgress: true,
    pauseOnHover:'true',
  });
};

const success = (description) => {
  api.success({
    title: 'Success',
    description:description,
    placement:'topRight',
    showProgress: true,
    pauseOnHover:'true',
  });
};
  
const error = (description) => {
api.error({
  title: 'Error',
  description:description,
  placement:'topRight',
  showProgress: true,
  pauseOnHover:'true',
});
};

const warning = (description) => {
  api.warning({
    title: 'Warning',
    description:description,
    placement:'topRight',
    showProgress: true,
    pauseOnHover:'true',
  });
};



  
return {contextHolder, info,success,error, warning}
};

export default useAlert;