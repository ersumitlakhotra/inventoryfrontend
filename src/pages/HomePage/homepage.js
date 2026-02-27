
import Users from "./user"
import { useEffect, useState } from "react";
import { Avatar, Button, Image, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, BlockOutlined, CameraOutlined, LockOutlined, RightOutlined, LogoutOutlined, ToolFilled } from '@ant-design/icons';
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import { getStorage } from "../../common/localStorage";
import FetchData from "../../hook/fetchData";
import { get_Date, LocalDate, firstDateOfMonth, lastDateOfMonth } from "../../common/localDate";
import Equipments from "./equipments";
import dayjs from 'dayjs';
import SearchHome from "./search";

const HomePage = () => {

    const { logout } = useAuth();
    const { refresh, setActiveTab, isLoading, setIsLoading, repairList, editUser, getInventory } = useOutletContext();

    const [fromDate, setFromDate] = useState(dayjs(firstDateOfMonth(new Date())).format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(dayjs(lastDateOfMonth(new Date())).format("YYYY-MM-DD"));
    const [fullname, setFullname] = useState('');
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
        setPicture(editList.picture);

        setIsLoading(false)
    }

    return (
        <div class="flex flex-col gap-4 p-4 font-normal w-full overflow-y-auto h-screen bg-white relative">

            {/* Header */}
            <div className="flex justify-between items-center ">
                {/* Header*/}
                <div className=" flex flex-row items-center gap-4 ">
                    <div>
                        {picture !== null ?
                            <Image width={60} height={60} src={picture} style={{ borderRadius: 30 }} /> :
                            <Avatar size={60} shape='circle' style={{ backgroundColor: 'whitesmoke' }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                        }
                    </div>
                    <div className="text-start align-middle">
                        <p className="font-bold text-lg text-black uppercase">{fullname}</p>
                        <p className="text-xs font-medium  text-gray-400">Good Day : {get_Date(LocalDate(), 'MMM DD, YYYY')}</p>
                    </div>

                </div>
                <Popconfirm
                    title={"Sign out"}
                    description="Are you sure you want to Sign out ? "
                    onConfirm={() => logout()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger shape="circle" icon={<LogoutOutlined />} size='large' />
                </Popconfirm>

            </div>

         <SearchHome/>
            {/* Repairs */}
            <div className="p-4 w-full flex justify-between bg-green-200 rounded-lg shadow cursor-pointer" onClick={() => setActiveTab('repair')}>
                <div className="flex flex-col gap-1 w-3/4">
                    <h2 className=" font-bold text-green-800">Repair to do</h2>
                    <span className="text-xs font-medium text-green-500 mb-2">
                        {`${repairList.filter(item => (item.status === 'Pending' || item.status === 'In progress') && get_Date(item.duedate, 'YYYY-MM-DD') >= fromDate && get_Date(item.duedate, 'YYYY-MM-DD') <= toDate).length}
                          due between ${get_Date(fromDate, 'MMM DD, YYYY')} to ${get_Date(toDate, 'MMM DD, YYYY')}`}
                    </span>
                    <Button color="green" variant="solid" size='medium' style={{ width: '100px' }} >View List <RightOutlined size={12} /></Button>
                </div>
                <ToolFilled style={{ fontSize: 64, color: 'green' }} onClick={() => setActiveTab('repair')} />
            </div>

            <Users />
            <Equipments />


        </div>
    )
}

export default HomePage