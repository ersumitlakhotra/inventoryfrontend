import { Tabs } from 'antd';
import IsLoading from '../../common/isLoading';
import { useEffect, useState } from 'react';
import FetchData from '../../hook/fetchData';
import Card from './card.js';
import { getTabItems } from '../../common/general.js'

import { ToolFilled, ContainerFilled } from '@ant-design/icons';
import { LocalDate } from '../../common/localDate.js';
import Logs from '../Logs/logs.js';

const RepairView = ({ id, reload, refresh, isLoading, setIsLoading, editRepair }) => {
    const [orderno, setOrderNo] = useState('');
    const [unit, setUnit] = useState('');
    const [reftype, setReftype] = useState('Equipment');
    const [notes, setNotes] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expire, setExpire] = useState(LocalDate());
    const [duedate, setDuedate] = useState(LocalDate());
    const [status, setStatus] = useState('Pending');
    const [quantity, setQuantity] = useState('1');
    const [price, setPrice] = useState('0.00');
    const [kilometer, setKilometer] = useState('0.00');
    const [modifiedat, setModifiedat] = useState('');
    const [tabActiveKey, setTabActiveKey] = useState("1");

    useEffect(() => {
        id!==0 && load();
    }, [reload, refresh])

    const load = async () => {
        setIsLoading(true)
        const response = await FetchData({
            method: 'GET',
            endPoint: 'repair', //
            id: id
        })
        const editList = response.data[0];
        setOrderNo(editList.orderno);
        setUnit(editList.unit);
        setReftype(editList.reftype);
        setName(editList.name);
        setExpire(editList.expiry);
        setDuedate(editList.duedate);
        setQuantity(editList.quantity);
        setStatus(editList.status);
        setDescription(editList.description);
        setNotes(editList.notes);
        setPrice(editList.price);
        setKilometer(editList.kilometer);
        setModifiedat(editList.modifiedat)
        setIsLoading(false)
    }
    const tabItems = [
        getTabItems('1', 'Logs', <ContainerFilled />, <Logs id={id} reload={reload} refresh={refresh}  ltype={'Repair'}/>)
    ];
    return (
        <div class=''>
            <IsLoading isLoading={isLoading} rows={10} input={
                <>
                    <div class='w-full flex mb-6 '>
                        <Card
                            id={id}
                            color={status === "Pending" ? "bg-orange-300" :
                                status === "In progress" ? "bg-blue-400" :
                                    status === "Completed" ? "bg-green-400" :
                                        "bg-red-500"}
                            textcolor={status === "Pending" ? "text-orange-300" :
                                status === "In progress" ? "text-blue-400" :
                                    status === "Completed" ? "text-green-400" :
                                        "text-red-500"}
                            orderno={orderno}
                            tag={unit}
                            status={status}
                            title={name}
                            description={description}
                            notes={notes}
                             duedate={duedate}
                            equipment={editRepair}
                            isEdit={true}
                        />
                    </div>
                    <Tabs
                        defaultActiveKey="1"
                        items={tabItems}
                        activeKey={tabActiveKey}
                        onChange={(e) => { setTabActiveKey(e) }}
                    />
                </>
            } />
        </div>
    )
}

export default RepairView