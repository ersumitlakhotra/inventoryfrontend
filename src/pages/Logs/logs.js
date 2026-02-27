import { useEffect, useState } from "react";
import DataTable from "../../common/datatable";
import IsLoading from "../../common/isLoading";
import { getTableItem } from "../../common/general";
import { UTC_LocalDateTime } from "../../common/localDate";
import FetchData from "../../hook/fetchData";

const Logs = ({ id,reload, refresh, ltype }) => {
    const [logsList, setLogsList] = useState([]);
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
            method: 'POST',
            endPoint: 'logs', //
            id: id,
            body: JSON.stringify({
                ltype: ltype
            })
        })
        setLogsList(response.data);
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
        getTableItem('1', 'Date'),
        getTableItem('3', 'Message'),
        getTableItem('4', 'User')
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
                        <tr key={item.id} class="bg-white w-full border-b text-xs   whitespace-nowrap border-gray-200 hover:bg-zinc-50 ">

                            <td class="p-2 align-top w-1/5">{UTC_LocalDateTime(item.createdat, 'DD MMM YYYY h:mm A')}</td>
                            <td class="p-2 align-top w-3/5 whitespace-pre-line break-words">{item.message}</td>
                            <td class="p-2 align-top w-1/5 ">{item.user}</td>

                        </tr>
                    ))
                )} />
        } />
    )
}

export default Logs