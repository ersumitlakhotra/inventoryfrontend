/* eslint-disable jsx-a11y/anchor-is-valid */
import {  useState } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import useAlert from "../../common/alert.js";
import { Input, Spin } from 'antd';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext.js";

export const Login = ({ logo }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { contextHolder, error } = useAlert();
  const { login, isAuthenticated } = useAuth();

 if (isAuthenticated) {
   navigate("/home");
 }

  const onSubmit = async () => {
    setLoading(true);
    const res = await login(username, password);
    if (res.status) {
      navigate("/home"); //success('Login Successfully'); 
      
    }
    else
      error(res.message);

    setLoading(false);
  }

  const setCellFormat = (cellValue) => {
    let phoneNumber = cellValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (phoneNumber.length > 3) {
      phoneNumber = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3);
    }
    if (phoneNumber.length > 7) {
      phoneNumber = phoneNumber.substring(0, 7) + '-' + phoneNumber.substring(7);
    }
    if (phoneNumber.length < 13)
      return phoneNumber;
    else
      return phoneNumber.substring(0, 12);
  }

  return (
    <div class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-screen py-4">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img class="w-20 h-20 mb-4" src={logo} alt="logo" />
        <div class="w-full  bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
              <div>
              <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cell #</label>
              <Input
                placeholder="111-222-3333"
                size="large"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={username} onChange={(e) => setUsername(setCellFormat(e.target.value))} />

            </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} value={password}
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required />
              </div>
              <button type="submit" onClick={() => onSubmit()} class="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
            <div>
              
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Ensure it's on top
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      )}
      {contextHolder}
    </div>
  );
};


export default Login;