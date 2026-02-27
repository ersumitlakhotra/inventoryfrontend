
import { Avatar, Badge, Button, DatePicker, Image, Input, Modal, Select, Tooltip } from 'antd';
import IsLoading from '../../common/isLoading';
import { CameraOutlined, CloseOutlined, CloudUploadOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import FetchData from '../../hook/fetchData';
import useAlert from '../../common/alert';
import { TextboxFlex } from '../../common/textbox.js';
import { LocalDate } from '../../common/localDate.js';
import dayjs from 'dayjs';

const RepairDetail = ({ id, uid, reload, ref, setOpen, isLoading, setIsLoading, saveData, equipmentList, itemsList, equipmentId, useEquipmentId = false }) => {
    const { TextArea } = Input;
    const {contextHolder,  warning } = useAlert();
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
    const [servicesItem, setServicesItem] = useState([]);
    
    const [newService, setNewService] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id === 0) {

            if (useEquipmentId)
                setRefid(equipmentId)
            else
                setRefid('');

            setUnit(''); setReftype('Equipment'); setName(''); setExpire(LocalDate()); setDuedate(LocalDate()); setStatus('Pending');
            setQuantity('1'); setPrice('0.00'); setKilometer('0.00');
            setDescription(''); setNotes(''); setServicesItem([]);
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
        setServicesItem(editList.itemsinfo);
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
        if (unit !== '' && servicesItem.length !==0 ) {
            const Body = JSON.stringify({
                refid: refid,
                reftype: reftype,
                itemsinfo: servicesItem,
                description: description,
                expire: expire,
                duedate: duedate,
                status: status,
                quantity: quantity,
                notes: notes,
                price: price,
                kilometer: kilometer,
                unit: unit,
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

    const handleOk = async () => {
        if (newService !== '') {
            const Body = JSON.stringify({
               type :'Service', 
               title :newService
            });
            saveData({
                label: "Service",
                method: 'POST',
                endPoint: "items",
                id:null,
                body: Body
            });
            setIsModalOpen(false);
        }
        else {
            warning('Please, fill out the required fields !');
        }
    }

    return (
        <div class='p-2'>
            <IsLoading isLoading={isLoading} rows={10} input={
                <>
                    <div class='flex flex-col font-normal gap-3 '>
                        <TextboxFlex label={'Status'} input={
                            <Select
                                value={status}
                                style={{ width: '100%',fontSize: 16  }}
                                onChange={(value) => { setStatus(value); }}
                                options={[
                                    { value: 'Pending', label: <Badge color={'yellow'} text={'Pending'} /> },
                                    { value: 'In progress', label: <Badge color={'blue'} text={'In progress'} /> },
                                    { value: 'Completed', label: <Badge color={'green'} text={'Completed'} /> },
                                    { value: 'Cancelled', label: <Badge color={'red'} text={'Cancelled'} /> },
                                ]}
                            />
                        } />

                        <TextboxFlex label={'Equipment'} mandatory={true} input={
                            <Select
                                value={refid}
                                status={refid === '' ? 'error' : ''}
                                style={{ width: '100%',fontSize: 16  }}
                                onChange={(value, option) => { setRefid(value); setUnit(option.label) }}
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
                                style={{ width: '100%',fontSize: 16  }}
                                allowClear={false}
                                value={duedate === '' ? duedate : dayjs(duedate, 'YYYY-MM-DD')}
                                onChange={(date, dateString) => { setDuedate(dateString); }} />
                        } />

                        <TextboxFlex label={'Services'} mandatory={true} input={
                            <div className='flex gap-1 w-full'>
                            <Select
                                status={servicesItem.length === 0 ? 'error' : ''}
                                placeholder='Select services'
                                mode="multiple"
                                value={servicesItem}
                                style={{ width: '100%',fontSize: 16  }}
                                onChange={(value) => { setServicesItem(value);  }}
                                options={itemsList.map(item => ({
                                    value: item.id,
                                    label: item.title
                                }))}
                                optionFilterProp="label"
                                filterSort={(optionA, optionB) => {
                                    var _a, _b;
                                    return (
                                        (_a = optionA === null || optionA === void 0 ? void 0 : optionA.label) !== null &&
                                            _a !== void 0
                                            ? _a
                                            : ''
                                    )
                                        .toLowerCase()
                                        .localeCompare(
                                            ((_b = optionB === null || optionB === void 0 ? void 0 : optionB.label) !== null &&
                                                _b !== void 0
                                                ? _b
                                                : ''
                                            ).toLowerCase(),
                                        );
                                }}
                            />
                             <Tooltip placement="top" title={'Add services'} >
                            <Button type="primary" shape='circle' icon={<PlusOutlined />} size='middle' onClick={()=> {setNewService('');setIsModalOpen(true)}} />
                            </Tooltip>
                            </div>
                        } />

                        <TextboxFlex label={'Description'} itemsCentre={false} input={
                            <TextArea style={{ fontSize: 16 }}  placeholder="Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                        } />


                        <TextboxFlex label={'Kilometer'} input={
                            <Input style={{ fontSize: 16 }}  placeholder="Kilometer" value={kilometer} onChange={(e) => setKilometer(e.target.value)} />
                        } />
                        {false && <TextboxFlex label={'Quantity'} input={
                            <Input style={{ fontSize: 16 }}  placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        } />}

                        <TextboxFlex label={'Price'} input={
                            <Input style={{ fontSize: 16 }}  placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        } />

                        <TextboxFlex label={'Notes'} itemsCentre={false} input={
                            <TextArea style={{ fontSize: 16 }}  placeholder="Notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                        } />

                        <Modal
                            title="Add Services"
                            closable={{ 'aria-label': 'Custom Close Button' }}
                            open={isModalOpen}
                            onOk={handleOk}
                            okText='Save'
                            onCancel={() => setIsModalOpen(false)}
                        >
                            <TextboxFlex label={'Title'} mandatory={true} input={
                                <Input style={{ fontSize: 16 }}  placeholder="Title" value={newService} onChange={(e) => setNewService(e.target.value)} />
                            } />
                        </Modal>
                    </div>
                </>
            } />
            {contextHolder}
        </div>
    )
}

export default RepairDetail