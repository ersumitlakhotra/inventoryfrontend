import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getStorage } from "../../common/localStorage";
import IsLoading from "../../common/isLoading";
import { Avatar, Image } from "antd";
import { CameraOutlined, RightOutlined } from '@ant-design/icons';

const Equipments = () => {
    const [filteredList, setFilteredList] = useState([]);
    const { refresh, isLoading, setActiveTab,setIsLoading,  getEquipment,  viewEquipment } = useOutletContext();

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const response = await getEquipment();
        setFilteredList(response);
        setIsLoading(false);
    }

    return (
        <div className="w-full mt-4 ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold ">Equipment List</h2>
                <h2 className="text-xs text-blue-400 italic underline cursor-pointer " onClick={()=> setActiveTab('equipment')}>see all</h2>
              
            </div>
            {/* Scroll Container */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide cursor-pointer ">
                <IsLoading isLoading={isLoading} rows={10} input={
                    filteredList.length === 0 ?
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                            <span>No data found</span>

                        </div> :
                        filteredList.map((item) => (
                            <div key={item.id} className="flex flex-col p-3 items-center min-w-[180px] bg-blue-300 rounded-xl"
                            onClick={()=> viewEquipment(item.id)}>

                                {/* Gradient Border */}

                                {item.picture !== null ?
                                    <Image width={100} height={100} shape='circle' src={item.picture} style={{ borderRadius: 20 }} /> :
                                    <Avatar size={100}  style={{ backgroundColor: 'whitesmoke',borderRadius: 20 }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                                }

                                {/* Name */}
                                <div className="p-2 w-full bg-white rounded-lg flex flex-col items-center justify-center mt-4">

                                    <p className=" text-lg text-gray-900 font-bold">{item.unit}</p>
                                    <p className="text-xs text-gray-700 ">{item.plate}</p>

                                </div>
                            </div>
                        ))} />
            </div>
        </div>
    );
}

export default Equipments
