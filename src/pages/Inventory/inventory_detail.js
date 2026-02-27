
import { Avatar, Button, Image, Input } from 'antd';
import IsLoading from '../../common/isLoading';
import { CameraOutlined, CloudUploadOutlined, LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import FetchData from '../../hook/fetchData';
import useAlert from '../../common/alert';
import { TextboxFlex } from '../../common/textbox.js';

const InventoryDetail = ({ id,uid, reload, ref, setOpen, isLoading, setIsLoading, saveData }) => {
    let refimage = useRef();
    const { TextArea } = Input;
    const {  error, warning } = useAlert();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [unique, setUnique] = useState('');
    const [notes, setNotes] = useState('');
    const [instock, setInstock] = useState('1');
    const [picture, setPicture] = useState(null);

    useEffect(() => {
        if (id === 0) {
            setName(''); setDescription(''); setUnique(''); setNotes(''); setInstock('1'); setPicture(null);
        }
        else {
            load();
        }
    }, [reload])

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
        setInstock(editList.instock);
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
        if (name !== '') {
            const Body = JSON.stringify({
                name: name,
                description: description,
                unique: unique,
                notes: notes,
                instock: instock,
                picture: picture,
                uid:uid
            });
            saveData({
                label: "Inventory",
                method: id !== 0 ? 'PUT' : 'POST',
                endPoint: "inventory",
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
                        <TextboxFlex label={'Item name'} mandatory={true} input={
                            <Input placeholder="Item name" status={name === '' ? 'error' : ''} value={name} onChange={(e) => setName(e.target.value)} />
                        } />

                        <TextboxFlex label={'Description'} itemsCentre={false} input={
                            <TextArea placeholder="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                        } />

                         <TextboxFlex label={'Serial #'} input={
                            <Input placeholder="Serial #"  value={unique} onChange={(e) => setUnique(e.target.value)} />
                        } />
                         <TextboxFlex label={'In Stock'} input={
                            <Input placeholder="In Stock"  value={instock} onChange={(e) => setInstock(e.target.value)} />
                        } />
                         <TextboxFlex label={'Notes'} input={
                            <TextArea placeholder="Notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                        } />
                    </div>
                </>
            } />
        </div>
    )
}

export default InventoryDetail