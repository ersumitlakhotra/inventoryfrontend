
import { Avatar, Badge, Button, DatePicker, Image, Input, Select } from 'antd';
import IsLoading from '../../common/isLoading';
import { CameraOutlined, CloseOutlined, CloudUploadOutlined, CheckOutlined } from '@ant-design/icons';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import FetchData from '../../hook/fetchData';
import useAlert from '../../common/alert';
import { TextboxFlex } from '../../common/textbox.js';
import { LocalDate } from '../../common/localDate.js';
import dayjs from 'dayjs';

const RepairDetail = ({ id, uid, reload, ref, setOpen, isLoading, setIsLoading, saveData,  equipmentList,itemsList, equipmentId,useEquipmentId=false }) => {
    let refimage = useRef();
    const { TextArea } = Input;
    const { error, warning } = useAlert();
    const [unit, setUnit] = useState('');
    const [refid, setRefid] = useState('');
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

    useEffect(() => {
        if (id === 0) {
            
         if(useEquipmentId)
            setRefid(equipmentId)
        else
            setRefid('');
        
        setUnit('');setReftype('Equipment'); setName(''); setExpire(LocalDate()); setDuedate(LocalDate()); setStatus('Pending');
            setQuantity('1'); setPrice('0.00'); setKilometer('0.00');
            setDescription(''); setNotes(''); 
        }
        else {
            load();
        }
    }, [reload])

    const load = async () => {
        setIsLoading(true)
        const response = await FetchData({
            method: 'GET',
            endPoint: 'repair', //
            id: id
        })
        const editList = response.data[0];
        setRefid(editList.refid);
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

        setIsLoading(false)
    }

    const save = async () => {
        if (name !== '') {
            const Body = JSON.stringify({
                refid: refid,
                reftype: reftype,
                name: name,
                description: description,
                expire: expire,
                duedate: duedate,
                status: status,
                quantity: quantity,
                notes: notes,
                price: price,
                kilometer: kilometer,
                unit:unit,
                uid: uid
            });
            saveData({
                label: "Repair",
                method: id !== 0 ? 'PUT' : 'POST',
                endPoint: "repair",
                id: id !== 0 ? id : null,
                body: Body
            });
            setOpen(false);
        }
        else {
            warning('Please, fill out the required fields !');
        }
    }
    useImperativeHandle(ref, () => {
        return {
            save,
        };
    })

    return (
        <div class='p-2'>
            <IsLoading isLoading={isLoading} rows={10} input={
                <>
                    <div class='flex flex-col font-normal gap-3 '>
                        <TextboxFlex label={'Status'} input={
                            <Select
                                value={status}
                                style={{ width: '100%' }}
                                onChange={(value) => { setStatus(value); }}
                                options={[
                                    { value: 'Pending', label: <Badge color={'yellow'} text={'Pending'} /> },
                                    { value: 'In progress', label: <Badge color={'blue'} text={'In progress'} /> },
                                    { value: 'Completed', label: <Badge color={'green'} text={'Completed'} /> },
                                    { value: 'Cancelled', label: <Badge color={'red'} text={'Cancelled'} /> },
                                ]}
                            />
                        } />
                       {false && <TextboxFlex label={'Category'} input={
                            <Select
                                value={reftype}
                                style={{ width: '100%' }}
                                onChange={(value) => { setReftype(value);}}
                                options={[
                                    { value: 'Equipment', label: 'Equipment' },
                                    { value: 'Inventory', label: 'Inventory' },
                                ]}
                            />
                        } />
                    }

                       <TextboxFlex label={'Equipment'} mandatory={true} input={
                            <Select
                                value={refid}
                                status={refid === '' ? 'error' : ''}
                                style={{ width: '100%' }}
                                onChange={(value,option) => { setRefid(value); setUnit(option.label) }}
                                options={[
                                    { value: '', label: '' },
                                    ...equipmentList.map(item => ({
                                        value: item.id,
                                        label: item.unit
                                    })),

                                ]}
                                showSearch={{ optionFilterProp: 'label' }}
                            />
                        } />
                        <TextboxFlex label={'Due Date'} mandatory={true} input={
                            <DatePicker
                                style={{ width: '100%' }}
                                allowClear={false}
                                value={duedate === '' ? duedate : dayjs(duedate, 'YYYY-MM-DD')}
                                onChange={(date, dateString) => { setDuedate(dateString); }} />
                        } />

                        <TextboxFlex label={'Service'} mandatory={true} input={
                            <Select
                                mode="tags"
                                value={name}
                                status={name === '' ? 'error' : ''}
                                style={{ width: '100%' }}
                                showSearch
                                optionFilterProp="label"
                                onChange={(value) => {
                                    // value will be array in tags mode
                                        setName(value[value.length - 1]);
                                   
                                }}
                                options={[
                                    ...itemsList.map(item => ({
                                        value:  item.title,   // IMPORTANT: use title as value
                                        label: item.title
                                    })),
                                ]}
                            />
                        } />

                        <TextboxFlex label={'Description'} itemsCentre={false} input={
                            <TextArea placeholder="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                        } />


                        <TextboxFlex label={'Kilometer'} input={
                            <Input placeholder="Kilometer" value={kilometer} onChange={(e) => setKilometer(e.target.value)} />
                        } />
                        <TextboxFlex label={'Quantity'} input={
                            <Input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        } />

                        <TextboxFlex label={'Price'} input={
                            <Input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        } />

                        <TextboxFlex label={'Notes'} itemsCentre={false} input={
                            <TextArea placeholder="Notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                        } />
                    </div>
                </>
            } />
        </div>
    )
}

export default RepairDetail