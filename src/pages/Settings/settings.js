import { useOutletContext } from "react-router-dom";
import IsLoading from "../../common/isLoading"
import { Avatar, Button, Image, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, BlockOutlined, CameraOutlined, LockOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import FetchData from "../../hook/fetchData";
import { getStorage } from "../../common/localStorage";
import { useAuth } from '../../auth/authContext';

const Settings = () => {
    const { logout } = useAuth(); 
    const { refresh, uid, isLoading, setIsLoading, inventoryList, editUser, getInventory } = useOutletContext();
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [status, setStatus] = useState('Active');
    const [picture, setPicture] = useState(null);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true)
        const localStorage = await getStorage();
        const response = await FetchData({
            method: 'GET',
            endPoint: 'user', //
            id: localStorage.uid
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
    return (
        <div class="flex flex-col font-normal w-full h-screen bg-gray-100 relative">

            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-gray-400 p-5 text-white  rounded-b-2xl sticky top-0 z-50 ">
               

                {/* Stats Card */}
                <div className=" flex flex-row items-center gap-4 ">
                    <div>
                        {picture !== null ?
                            <Image width={44} height={44} src={picture} style={{ borderRadius: 20 }} /> :
                            <Avatar size={44} shape='circle' style={{ backgroundColor: 'whitesmoke' }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                        }
                    </div>
                    <div className="text-start">
                        <p className="font-bold  uppercase">{fullname}</p>
                        <p className="text-xs text-gray-300">{username}</p>
                    </div>

                </div>
            </div>


            {/* Content */}
            <IsLoading isLoading={isLoading} rows={10} input={
                <div className="p-4 flex flex-col  gap-4 w-full">
                    <div className=" bg-white p-4 flex justify-between items-center border rounded-xl cursor-pointer hover:shadow hover:bg-gray-200 "
                    onClick={() => {editUser(uid,true,false)}}>
                        <div className="flex gap-4 items-center">
                            <LockOutlined style={{color:'red', fontSize:24}} />
                            <h1 className=" text-sm text-start text-gray-600">
                                Profile settings
                            </h1>
                        </div>
                        <RightOutlined size={22} />
                    </div>
                    <Popconfirm
                    title={"Sign out"}
                    description="Are you sure you want to Sign out ? "
                    onConfirm={() => logout()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button color="danger" variant="outlined" size="large">Sign out</Button>
                </Popconfirm>
                </div>
            } />
        </div>
    )
}

export default Settings