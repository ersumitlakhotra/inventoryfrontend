import { useEffect, useState } from "react";
import DataTable from "../../common/datatable";
import IsLoading from "../../common/isLoading";
import { getTableItem } from "../../common/general";
import { UTC_LocalDateTime } from "../../common/localDate";
import FetchData from "../../hook/fetchData";
import { Tags } from "../../common/tags";

const RepairList = ({ id,reload, refresh,viewRepair }) => {
    const [filteredList, setFilteredList] = useState([]);
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        load();
    }, [reload, refresh])

    const load = async () => {
        setIsLoading(true)

        const response = await FetchData({
            method: 'GET',
            endPoint: 'repair/equipment', //
            id: id
        })
        setFilteredList(response.data);
        setList(response.data);
        setIsLoading(false)
    }

    const setPage = (page, pageSize, list = []) => {
        const indexOfLastItem = page * pageSize;
        const indexOfFirstItem = indexOfLastItem - pageSize;
        const searchedList = list.slice(indexOfFirstItem, indexOfLastItem);
        setFilteredList(searchedList);
    }


    const headerItems = [
        getTableItem('1', 'Status'),
        getTableItem('2', 'Order #'),
        getTableItem('3', 'Date'),
        getTableItem('4', 'Service'),
        getTableItem('5', 'Description'),
        getTableItem('6', 'User')
    ];
    return (
        <IsLoading isLoading={isLoading} rows={10} input={
            <DataTable headerItems={headerItems} current={currentPage} list={list}
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setItemsPerPage(pageSize);
                    setPage(page, pageSize, list)
                }}
                body={(
                    filteredList.map(item => (
                        <tr key={item.id} class="bg-white w-full border-b text-xs   whitespace-nowrap border-gray-200 cursor-pointer hover:bg-zinc-50 "
                        onClick={() => viewRepair(item.id)}
                        >
                            <td class="p-2 align-top w-1/12">{ Tags(item.status)}</td>
                            <td class="p-2 align-top w-1/12 ">{item.orderno}</td>
                            <td class="p-2 align-top w-2/12 ">{item.duedate}</td>
                            <td class="p-2 align-top w-2/12 ">{item.name}</td>
                            <td class="p-2 align-top w-4/12 whitespace-pre-line break-words">{item.description}</td>
                            <td class="p-2 align-top w-2/12 ">{item.user}</td>
                        </tr>
                    ))
                )} />
        } />
    )
}

export default RepairList