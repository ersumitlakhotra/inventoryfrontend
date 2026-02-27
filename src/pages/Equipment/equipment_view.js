import { Tabs } from 'antd';
import IsLoading from '../../common/isLoading';
import { useEffect, useState } from 'react';
import FetchData from '../../hook/fetchData';
import Card from './card.js';
import {getTabItems} from '../../common/general.js'

import { ToolFilled,ContainerFilled} from '@ant-design/icons';
import Logs from '../Logs/logs.js';
import RepairList from '../Repair/repair_list.js';

const EquipmentView = ({ id, reload,refresh, isLoading, setIsLoading, editEquipment, viewRepair }) => {
    const [unit, setUnit] = useState('');
    const [plate, setPlate] = useState('');
    const [vin, setVin] = useState('');
    const [model, setModel] = useState('');
    const [make, setMake] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('Active');
    const [picture, setPicture] = useState(null);
    const [user, setUser] = useState('');
    const [modifiedat, setModifiedat] = useState('');
    const [tabActiveKey, setTabActiveKey] = useState("1");

    useEffect(() => {
       id!==0 &&  load();
    }, [reload,refresh])

    const load = async () => {
        setIsLoading(true)
        const response = await FetchData({
            method: 'GET',
            endPoint: 'equipment', //
            id: id
        })
        const editList = response.data[0];
        setUnit(editList.unit);
        setPlate(editList.plate);
        setVin(editList.vin);
        setModel(editList.model);
        setMake(editList.make);
        setYear(editList.year);
        setStatus(editList.status);
        setDescription(editList.description);
        setNotes(editList.notes);
        setPicture(editList.picture);
        setUser(editList.user);
        setModifiedat(editList.modifiedat)
        setIsLoading(false)
    }
const tabItems = [
        getTabItems('1', 'Repairs', <ToolFilled/>, <RepairList id={id} reload={reload} refresh={refresh} viewRepair={viewRepair}/> ),
        getTabItems('2', 'Logs', <ContainerFilled/>, <Logs id={id} reload={reload} refresh={refresh} ltype={'Equipment'}/>)
    ];
    return (
        <div class=''>
            <IsLoading isLoading={isLoading} rows={10} input={
                <>
                    <div class='w-full flex mb-6 '>
                        <Card
                            id={id}
                            user={user}
                            title={unit}
                            description={plate}
                            make={make}
                            model={model}
                            year={year}
                            status={status}
                            notes={notes}
                            modifiedat={modifiedat}
                            picture={picture}
                            equipment={editEquipment}
                            isEdit={true}

                        />
                    </div>
 <Tabs
                defaultActiveKey="1"
                items={tabItems}  
                activeKey={tabActiveKey}
                onChange={(e) => { setTabActiveKey(e)}}
            />
                </>
            } />
        </div>
    )
}

export default EquipmentView