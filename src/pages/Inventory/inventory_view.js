import { Tabs } from 'antd';
import IsLoading from '../../common/isLoading';
import { useEffect, useState } from 'react';
import FetchData from '../../hook/fetchData';
import { getTabItems } from '../../common/general.js'
import { ContainerFilled } from '@ant-design/icons';
import Logs from '../Logs/logs.js';
import Card from './card.js';

const InventoryView = ({ id, reload, refresh, isLoading, setIsLoading, editInventory }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [unique, setUnique] = useState('');
    const [notes, setNotes] = useState('');
    
    const [instock, setInstock] = useState('1');
    const [user, setUser] = useState('');
    const [picture, setPicture] = useState(null);
    const [modifiedat, setModifiedat] = useState('');
    const [tabActiveKey, setTabActiveKey] = useState("1");

    useEffect(() => {
        id !== 0 && load();
    }, [reload, refresh])

    const load = async () => {
        setIsLoading(true)
        const response = await FetchData({
            method: 'GET',
            endPoint: 'inventory', //
            id: id
        })
        const editList = response.data[0];
        setName(editList.name);
        setDescription(editList.description);
        setUnique(editList.unique);
        setNotes(editList.notes);
        setPicture(editList.picture);
        setUser(editList.user)
         setInstock(editList.instock);
        setModifiedat(editList.modifiedat)
        setIsLoading(false)
    }
    const tabItems = [
        getTabItems('1', 'Logs', <ContainerFilled />, <Logs id={id} reload={reload} refresh={refresh} ltype={'Inventory'} />)
    ];
    return (
        <div class=''>
            <IsLoading isLoading={isLoading} rows={10} input={
                <>
                    <div class='w-full flex mb-6 '>
                   <Card
                        id={id} 
                        user={user}
                        title={name}
                        description={description}
                        modifiedat={modifiedat}
                        picture={picture}
                        instock={instock}
                        inventory={editInventory}
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

export default InventoryView