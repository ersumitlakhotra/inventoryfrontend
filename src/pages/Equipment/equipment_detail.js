
import { Avatar, Button, Image, Input } from 'antd';
import IsLoading from '../../common/isLoading';
import { CameraOutlined, CloseOutlined, CloudUploadOutlined, CheckOutlined } from '@ant-design/icons';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import FetchData from '../../hook/fetchData';
import useAlert from '../../common/alert';
import { TextboxFlex } from '../../common/textbox.js';

const EquipmentDetail = ({ id,uid, reload, ref, setOpen, isLoading, setIsLoading, saveData,equipmentList }) => {
    let refimage = useRef();
    const { TextArea } = Input;
    const {contextHolder,  error, warning } = useAlert();
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

    useEffect(() => {
        if (id === 0) {
            setUnit(''); setPlate('');  setVin('');  setModel('');  setMake('');  setYear('');  setStatus('Active'); 
             setDescription(''); setNotes(''); setPicture(null);
        }
        else {
            load();
        }
    }, [reload])

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
        setIsLoading(false)
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Access the first selected file
        if (file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJpgOrPng) {
                error('You can only upload JPG/PNG file!');
            }
            else if (!isLt2M) {
                error('Image must smaller than 2MB!');
            }
            else {
                const reader = new FileReader();

                reader.onloadend = () => {
                    // reader.result will contain the data URL (e.g., data:image/jpeg;base64,...)
                    const base64String = reader.result;
                    setPicture(base64String);
                };

                reader.onerror = (error) => {
                    error("Error reading file:", error);
                };

                reader.readAsDataURL(file);
            }
        }
    };

    const save = async () => {
        if (unit !== '') {
            const isNotExist = equipmentList.filter(item =>  item.id !== id && item.unit.toLowerCase().trim().replace(/\s+/g, '') === unit.toLowerCase().trim().replace(/\s+/g, '')).length ===0;
            if(isNotExist)
            {
            const Body = JSON.stringify({
                unit: unit,
                plate: plate,
                vin: vin,
                model: model,
                make: make,
                year: year,
                status: status,
                description: description,
                notes: notes,
                picture: picture,
                uid:uid
            });
            saveData({
                label: "Equipment",
                method: id !== 0 ? 'PUT' : 'POST',
                endPoint: "equipment",
                id: id !== 0 ? id : null,
                body: Body
            });
            setOpen(false);
        }
        else
            error(`Equipment with ${unit} name already Exists!`)
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
                    <div class='w-full flex mb-6 items-center justify-center'>
                        <div class='flex flex-col items-center justify-center gap-2'>
                            {picture !== null ?
                                <Image width={128} height={128} src={picture} style={{ borderRadius: 10 }} /> :
                                <Avatar shape="square" size={128} style={{ backgroundColor: '#f9fafb', border: 'solid', width: 120, height: 120 }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                            }
                            <Button
                                type="primary" shape="default" icon={<CloudUploadOutlined />} size={24} style={{ width: '100px' }} onClick={() => {
                                    refimage.current.click();
                                }}>Change</Button>
                            <input type="file" ref={refimage} style={{ display: 'none' }} onChange={handleFileChange} />
                            <p class='text-gray-400 text-xs'>Allowed *.jpeg, *.jpg, *.png</p>
                        </div>
                    </div>

                    <div class='flex flex-col font-normal gap-3 '>
                        <TextboxFlex label={'Unit'} mandatory={true} input={
                            <Input placeholder="Unit" style={{ fontSize: 16 }}  status={unit === '' ? 'error' : ''} value={unit} onChange={(e) => setUnit(e.target.value)} />
                        } /> 
                        
                         <TextboxFlex label={'Plate'}  input={
                            <Input placeholder="Plate" style={{ fontSize: 16 }}  value={plate} onChange={(e) => setPlate(e.target.value)} />
                        } />
                         <TextboxFlex label={'Vin'}  input={
                            <Input placeholder="Vin" style={{ fontSize: 16 }}  value={vin} onChange={(e) => setVin(e.target.value)} />
                        } />

                         <TextboxFlex label={'Make'}  input={
                            <Input placeholder="Make" style={{ fontSize: 16 }}  value={make} onChange={(e) => setMake(e.target.value)} />
                        } />
                        
                         <TextboxFlex label={'Model'}  input={
                            <Input placeholder="Model" style={{ fontSize: 16 }}   value={model} onChange={(e) => setModel(e.target.value)} />
                        } />

                        
                         <TextboxFlex label={'Year'}  input={
                            <Input placeholder="Year" style={{ fontSize: 16 }}  value={year} onChange={(e) => setYear(e.target.value)} />
                        } />
                        <TextboxFlex label={'Description'} itemsCentre={false} input={
                            <TextArea placeholder="Description" style={{ fontSize: 16 }}  rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                        } />

                         <TextboxFlex label={'Notes'}  itemsCentre={false} input={
                            <TextArea placeholder="Notes" style={{ fontSize: 16 }}  rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                        } />
                        <TextboxFlex label={'Status'} input={
                            <div class='flex flex-row items-center gap-2 w-full'>
                                <Button color={`${status === 'Active' ? 'cyan' : 'default'}`} variant="outlined" icon={<CheckOutlined />} onClick={() => setStatus('Active')} >Active</Button>
                                <Button color={`${status === 'Inactive' ? 'danger' : 'default'}`} variant="outlined" icon={<CloseOutlined />} onClick={() => setStatus('Inactive')} >Inactive</Button>
                            </div>
                        } />
                    </div>
                </>
            } />
            {contextHolder}
        </div>
    )
}

export default EquipmentDetail