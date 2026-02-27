import { Avatar, Button, Input, Tooltip } from "antd";
import { CarFilled, EditOutlined, EyeOutlined, ProductFilled, SearchOutlined, ToolFilled } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Tags } from "../../common/tags";
import { get_Date, UTC_LocalDateTime_relative } from "../../common/localDate";
import IsLoading from "../../common/isLoading";

const SearchHome = () => {
    const [searchInput, setSearchInput] = useState('');

    const [filteredList, setFilteredList] = useState([]);
    const { refresh, isLoading, setIsLoading, inventoryList, viewInventory, equipmentList, viewEquipment, repairList, viewRepair } = useOutletContext();

    useEffect(() => {
        let filter = [];
        searchEquipment(filter)
        searchInventory(filter)
        searchRepair(filter)

        setFilteredList(filter)
    }, [searchInput])

    const searchEquipment = (filter) => {
        const query = (searchInput || "").toLowerCase();
        let searchedList = equipmentList.filter(item =>
            (item.unit || "").toLowerCase().includes(query) ||
            (item.plate || "").toString().includes(query)
        );
        searchedList.map((item, index) =>
            setFilter({
                filter: filter,
                key: item.id + index,
                id: item.id,
                icon: <CarFilled />,
                name: item.unit,
                unit: item.plate ,
                user: item.user,
                status: item.status,
                modifiedat: item.modifiedat,
                backGround: '#60a5fa',
                onView: "Equipment"

            }))
    }
    const searchRepair = (filter) => {
        const query = (searchInput || "").toLowerCase();
        let searchedList = repairList.filter(item =>
            (item.name || "").toString().toLowerCase().includes(query) ||
            (item.unit || "").toString().toLowerCase().includes(query) ||
            (item.status || "").toString().toLowerCase().includes(query) ||
             (item.orderno || "").toString().toLowerCase().includes(query) ||
            (get_Date(item.duedate, 'MMM DD')).toString().toLowerCase().includes(query)
        );
        searchedList.map((item, index) =>
            setFilter({
                filter: filter,
                key: item.id + index,
                id: item.id,
                icon: <ToolFilled />,
                name: `${item.orderno} : ${item.name}`,
                unit: item.unit,
                user: item.user,
                status: item.status,
                modifiedat: item.modifiedat,
                backGround: '#22c55e',
                onView: "Repair"

            }))
    }
    const searchInventory = (filter) => {
        const query = (searchInput || "").toLowerCase();
        let searchedList = inventoryList.filter(item =>
            (item.name || "").toLowerCase().includes(query) ||
            (item.user || "").toString().includes(query)
        );
        searchedList.map((item, index) =>
            setFilter({
                filter: filter,
                key: item.id + index,
                id: item.id,
                icon: <ProductFilled />,
                name: item.name,
                unit: item.user ,
                user: item.user,
                status: item.status,
                modifiedat: item.modifiedat,
                backGround: '#fdba74',
                onView: "Inventory"

            }))
    }

    const setFilter = ({filter, key, id, icon, name, unit, user, status, modifiedat, backGround, onView} ) => {
        filter.push(
            {
                key: key,
                id: id,
                icon: icon,
                name: name,
                unit: unit,
                user: user,
                status: status,
                modifiedat: modifiedat,
                backGround: backGround,
                onView: onView

            }
        )
    }

    return (
        <div class='w-full flex flex-row items-center relative'>
            <Input size="large" placeholder="Search" prefix={<SearchOutlined />} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} allowClear />
            <div class={`w-full min-h-[350px] max-h-[350px] overflow-y-scroll border border-gray-400 z-50 bg-white rounded-lg shadow absolute top-10 ${searchInput === '' && 'hidden'} `}>
                <IsLoading isLoading={isLoading} rows={8} input=
                    {
                        filteredList.length === 0 ? <p class='text-left p-4 text-sm font-medium text-gray-400'> No match found </p> :
                            filteredList.map(item => (
                                <div key={item.key} class={`w-full flex  p-2 gap-2 border-b-2 cursor-pointer hover:bg-gray-100  hover:shadow `}
                                    onClick={() => item.onView === "Repair" ? viewRepair(item.id) : item.onView === "Inventory" ? viewInventory(item.id) : viewEquipment(item.id)} >
                                    <Avatar style={{ backgroundColor: item.backGround }} size="large">
                                        {item.icon}
                                    </Avatar>
                                    <div className="flex flex-col  w-full">
                                        <div class='flex justify-between items-center '>
                                            <span className="text-sm font-bold">{item.name}</span>
                                            {Tags(item.status || "")}
                                        </div>
                                        <div class='flex justify-between items-center text-xs'>
                                            <span >{item.unit}</span>
                                            <span>{UTC_LocalDateTime_relative(item.modifiedat, "MMM, DD YYYY - hh:mm A ")}</span>
                                        </div>

                                    </div>


                                </div>
                            ))
                    }
                />
            </div>
        </div>

    )
}

export default SearchHome