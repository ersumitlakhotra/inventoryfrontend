
import { Avatar, Button, Image, Input } from 'antd';
import IsLoading from '../../common/isLoading';
import { CameraOutlined, CheckOutlined, CloseOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import FetchData from '../../hook/fetchData';
import useAlert from '../../common/alert';
import { TextboxFlex } from '../../common/textbox.js';

const UserDetail = ({ id,reload, ref, setOpen,userShowStatus, isLoading, setIsLoading, saveData ,userList}) => {
    let refimage = useRef();
    const { contextHolder, error, warning } = useAlert();
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [status, setStatus] = useState('Active');
    const [picture, setPicture] = useState(null);

    useEffect(() => {
        if (id === 0) {
            setFullname(''); setUsername(''); setPassword(''); setRole('User');setStatus('Active'); setPicture(null);
        }
        else {
            load();
        }
    }, [reload])

    const load = async () => {
        setIsLoading(true)
        const response = await FetchData({
            method: 'GET',
            endPoint: 'user', //
            id: id
        })
        const editList = response.data[0];
        setFullname(editList.fullname);
        setUsername(editList.username);
        setPassword(editList.password);
        setRole(editList.role);
        setStatus(editList.status);
        setPicture(editList.picture);
        setIsLoading(false)
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

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Access the first selected file
        if (file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJpgOrPng) {
                error('You can only upload JPG/PNG file!');
            }
            else if (!isLt2M) {
                error('Image must smaller than 2MB!');
            }
            else {
                const reader = new FileReader();

                reader.onloadend = () => {
                    // reader.result will contain the data URL (e.g., data:image/jpeg;base64,...)
                    const base64String = reader.result;
                    setPicture(base64String);
                };

                reader.onerror = (error) => {
                    error("Error reading file:", error);
                };

                reader.readAsDataURL(file);
            }
        }
    };

    const save = async () => {
       if (fullname !== '' &&  password !== ''  && username.length === 12 && username !== '' ) {
         const isNotExist = userList.filter(item => item.username === username && item.id !== id).length ===0;
            if(isNotExist)
            {
            const Body = JSON.stringify({
                fullname: fullname,
                username: username,
                password: password,
                role: role,
                status:status,
                profilepic: picture
            });
            saveData({
                label: "User",
                method: id !== 0 ? 'PUT' : 'POST',
                endPoint: "user",
                id: id !== 0 ? id : null,
                body: Body
            });
            setOpen(false);
        }
        else
            error(`User with ${username} number already Exists!`)
        }
        else {
            warning('Please, fill out the required fields !');
        }
    }

    useImperativeHandle(ref, () => {
        return {
            save,
        };
    })

    return (
        <div class='p-2'>
            <IsLoading isLoading={isLoading} rows={10} input={
                <>
                    <div class='w-full flex mb-6 items-center justify-center'>
                        <div class='flex flex-col items-center justify-center gap-2'>
                            {picture !== null ?
                                <Image width={128} height={128} src={picture} style={{ borderRadius: 10 }} /> :
                                <Avatar shape="square" size={128} style={{ backgroundColor: '#f9fafb', border: 'solid', width: 120, height: 120 }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                            }
                            <Button
                                type="primary" shape="default" icon={<CloudUploadOutlined />} size={24} style={{ width: '100px' }} onClick={() => {
                                    refimage.current.click();
                                }}>Change</Button>
                            <input type="file" ref={refimage} style={{ display: 'none' }} onChange={handleFileChange} />
                            <p class='text-gray-400 text-xs'>Allowed *.jpeg, *.jpg, *.png</p>
                        </div>
                    </div>

                    <div class='flex flex-col font-normal gap-3 '>

                        <TextboxFlex label={'Name'} mandatory={true} input={
                            <Input style={{ fontSize: 16 }} placeholder="Name" status={fullname === '' ? 'error' : ''} value={fullname} onChange={(e) => setFullname(e.target.value)} />
                        } />

                        <TextboxFlex label={'Cell #'} mandatory={true} input={
                            <Input style={{ fontSize: 16 }} placeholder="111-222-3333" value={username} status={username === '' ? 'error' : ''} onChange={(e) => setUsername(setCellFormat(e.target.value))} />
                        } />
                        <TextboxFlex label={'Password'} mandatory={true} input={
                            <Input style={{ fontSize: 16 }} placeholder="Password" status={password === '' ? 'error' : ''} value={password} onChange={(e) => setPassword(e.target.value)} />
                        } />

                       {userShowStatus && <TextboxFlex label={'Status'} input={
                            <div class='flex flex-row items-center gap-2 w-full'>
                                <Button color={`${status === 'Active' ? 'cyan' : 'default'}`} variant="outlined" icon={<CheckOutlined />} onClick={() => setStatus('Active')} >Active</Button>
                                <Button color={`${status === 'Inactive' ? 'danger' : 'default'}`} variant="outlined" icon={<CloseOutlined />} onClick={() => setStatus('Inactive')} >Inactive</Button>
                            </div>
                        } />
                    }
                    </div>
                </>
            } />

            {contextHolder}
        </div>
    )
}

export default UserDetail