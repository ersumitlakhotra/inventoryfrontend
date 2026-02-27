
import { useEffect, useState } from "react";
import {  PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useOutletContext } from "react-router-dom";
import IsLoading from "../../common/isLoading";
import Card from "./card";
import dayjs from 'dayjs';
import { firstDateOfMonth, get_Date, lastDateOfMonth } from "../../common/localDate.js";
import { Input } from "antd";

const Repair = () => {
  const [filteredList, setFilteredList] = useState([]);
  const { refresh, isLoading, setIsLoading, repairList, getRepair, editRepair, viewRepair, getItems } = useOutletContext();
  const [searchInput, setSearchInput] = useState('');
  const [fromDate, setFromDate] = useState(dayjs(firstDateOfMonth(new Date())).format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs(lastDateOfMonth(new Date())).format("YYYY-MM-DD"));
  const [header, setHeader] = useState('due month');
  const [searchList,setSearchList]= useState([])

  useEffect(() => {
    Init();
  }, [refresh])

  const Init = async () => {
    setIsLoading(true);
    const response = await getRepair();
    await getItems();
    setHeader('due month')
    filterData(response);
    setSearchList(response);
    setIsLoading(false);
  }
  const filterData = (value) => {
     let searchedList = getList(value)
    setFilteredList(searchedList);
  }

  useEffect(() => {
    let searchedList = getList(searchList)
    filterData(searchedList);

  }, [searchInput])

  const getList = (list) => {
     const query = (searchInput || "").toLowerCase();
    let searchedList = list.filter(item =>
      (item.name || "").toString().toLowerCase().includes(query) ||
      (item.unit || "").toString().toLowerCase().includes(query) ||
      (item.status || "").toString().toLowerCase().includes(query) ||
      (item.orderno || "").toString().toLowerCase().includes(query) ||
      (get_Date(item.duedate,'MMM DD')).toString().toLowerCase().includes(query) 
    );
    return searchedList;
  }




  const HeaderItem = ({ title, value }) => {
    return (
      <div className={`text-center cursor-pointer   group `} onClick={() => {filterData(value); setSearchList(value); setHeader(title)} } >
        <p className={`font-bold text-lg ${title === header && 'text-green-500'} group-hover:text-green-500`}>{value.length}</p>
        <p className={`text-xs ${title === header ? 'text-green-500' : 'text-gray-400'} group-hover:text-green-500`}>{title}</p>
      </div>
    )
  }

  return (
    <div class="flex flex-col font-normal w-full h-screen bg-gray-100 relative">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-5 text-white  rounded-b-2xl sticky top-0 z-50 ">
        <div className="flex justify-between items-center mb-4">
          <span></span>
          <h1 className="font-semibold text-lg">
            Repair
          </h1>
          <PlusOutlined size={22} className="cursor-pointer" onClick={() => editRepair(0)} />
        </div>

        {/* Stats Card */}
        <div className="bg-white text-gray-800 rounded-2xl shadow-md p-4 flex justify-between">
          <HeaderItem title={'overall'} value={repairList} />
          <HeaderItem title={'to do'} value={repairList.filter(item => item.status === 'Pending')} />
          <HeaderItem title={'in progress'} value={repairList.filter(item => item.status === 'In progress')} />
          <HeaderItem title={'due month'} value={repairList.filter(item => (item.status === 'Pending' || item.status === 'In progress') && get_Date(item.duedate, 'YYYY-MM-DD') >= fromDate && get_Date(item.duedate, 'YYYY-MM-DD') <= toDate)} />

        </div>
      </div>

      <div className="p-4 flex justify-between items-center text-gray-500 text-sm  sticky top-0 z-50">
        <Input size="large" placeholder="Search" prefix={<SearchOutlined />} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} allowClear/>
      </div>

      {/* Content */}
      <IsLoading isLoading={isLoading} rows={10} input={
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-270px)]">
          {
            filteredList.length === 0 ?
              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                <span>No data found</span>

              </div> :
              filteredList.map((item) => (
                <Card
                  id={item.id}
                  color={item.status === "Pending" ? "bg-orange-300" :
                    item.status === "In progress" ? "bg-blue-400" :
                      item.status === "Completed" ? "bg-green-400" :
                        "bg-red:300"}
                  textcolor={item.status === "Pending" ? "text-orange-300" :
                    item.status === "In progress" ? "text-blue-400" :
                      item.status === "Completed" ? "text-green-400" :
                        "text-red:300"}
                  orderno={item.orderno}
                  tag={item.unit}
                  status={item.status}
                  title={item.name}
                  description={item.description}
                  notes={item.notes}
                  duedate={item.duedate}
                  equipment={viewRepair}
                  isEdit={false}
                />
              ))}

        </div>
      } />
    </div>
  );
}

export default Repair
