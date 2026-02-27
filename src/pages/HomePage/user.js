import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getStorage } from "../../common/localStorage";
import IsLoading from "../../common/isLoading";
import { Avatar, Image } from "antd";
import { CameraOutlined } from '@ant-design/icons';

const Users = () => {
    const [filteredList, setFilteredList] = useState([]);
    const { refresh, isLoading, setIsLoading, getUser } = useOutletContext();

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const localStorage = await getStorage();
        const response = await getUser();
        setFilteredList(response.filter(items => items.id !== localStorage.uid));
        setIsLoading(false);
    }
    return (
        <div className="w-full mt-2">
          
            {/* Scroll Container */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide cursor-pointer ">
                 <IsLoading isLoading={isLoading} rows={10} input={
                     filteredList.length ===0 ? 
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>No data found</span>
                        
                    </div> :
                    filteredList.map((user) => (
                    <div key={user.id} className="flex flex-col items-center min-w-[70px]">

                        {/* Gradient Border */}
                        <div className="p-1 rounded-full bg-gradient-to-tr from-green-500 via-gray-500 to-yellow-400">
                            <div className="bg-white p-1 rounded-full">
                                {user.picture !== null ?
                                    <Image width={40}  height={40} shape='circle' src={user.picture} style={{ borderRadius: 20 }} /> :
                                    <Avatar size={44} shape='circle' style={{ backgroundColor: 'whitesmoke' }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                                }
                            </div>
                        </div>

                        {/* Name */}
                        <p className="text-xs mt-2 text-gray-700 font-medium">{user.fullname}</p>
                    </div>
                ))}/>
            </div>
        </div>
    );
}

export default Users
