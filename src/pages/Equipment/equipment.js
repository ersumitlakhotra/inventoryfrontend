import { useEffect, useRef, useState } from "react";
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Input } from "antd";
import { useOutletContext } from "react-router-dom";
import IsLoading from "../../common/isLoading";
import Card from "./card";

const Equipment = () => {
    const divRef = useRef(null);
    const [filteredList, setFilteredList] = useState([]);
    const { refresh, isLoading, setIsLoading, equipmentList, getEquipment, editEquipment, viewEquipment } = useOutletContext();
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        Init();
        if (divRef.current) {
            divRef.current.scrollTop = 0;
        }
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const response = await getEquipment();
        setFilteredList(response);
        setIsLoading(false);
    }

    useEffect(() => {
        const query = (searchInput || "").toLowerCase();
        let searchedList = equipmentList.filter(item =>
            (item.unit || "").toString().toLowerCase().includes(query) ||
            (item.plate || "").toString().toLowerCase().includes(query)
            //(item.vin || "").toString().toLowerCase().includes(query)
        );
        setFilteredList(searchedList);

    }, [searchInput])

    return (
        <div class="flex flex-col font-normal w-full h-screen bg-gray-100 relative">

            {/* Header */}
            <div className="bg-blue-500 p-5 text-white  rounded-b-2xl sticky top-0 z-50 ">
                <div className="flex justify-between items-center mb-4">
                    <span> </span>
                    <h1 className="font-semibold text-lg">
                        Equipment List
                    </h1>
                    <PlusOutlined size={22} className="cursor-pointer" onClick={() => editEquipment(0)} />
                </div>

                <Input size="large" placeholder="Search" prefix={<SearchOutlined />} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} allowClear />
            </div>

            {/* Content */}
            <IsLoading isLoading={isLoading} rows={10} input={
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-180px)]" ref={divRef}>
                    {
                        filteredList.length === 0 ?
                            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                <span>No data found</span>

                            </div> :
                            filteredList.map((item) => (
                                <Card
                                    id={item.id}
                                    user={item.user}
                                    title={item.unit}
                                    description={item.plate}
                                    make={item.make}
                                    model={item.model}
                                    year={item.year}
                                    status={item.status}
                                    notes={item.notes}
                                    modifiedat={item.modifiedat}
                                    picture={item.picture}
                                    equipment={viewEquipment}
                                    isEdit={false}

                                />
                            ))}

                </div>
            } />
        </div>
    )
}

export default Equipment