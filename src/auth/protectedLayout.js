/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import Footer from "../components/ProtectedLayout/footer";
import { getStorage } from "../common/localStorage";
import { Button, Drawer, Space, Spin } from "antd";
import { DeleteOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import useAlert from "../common/alert";
import SaveData from "../hook/saveData";
import FetchData from "../hook/fetchData";
import InventoryDetail from "../pages/Inventory/inventory_detail";
import UserDetail from "../pages/Users/user_detail";
import EquipmentDetail from "../pages/Equipment/equipment_detail";
import EquipmentView from "../pages/Equipment/equipment_view";
import RepairDetail from "../pages/Repair/repair_detail";
import RepairView from "../pages/Repair/repair_view";
import InventoryView from "../pages/Inventory/inventory_view";

const ProtectedLayout = () => {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();
    const ref = useRef();
    const { contextHolder, success, error, notifications } = useAlert();
    const [activeTab, setActiveTab] = useState("home");

    const [reload, setReload] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [uid, setUid] = useState(0);

    /*  Lists */
    const [inventoryList, setInventoryList] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [repairList, setRepairList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [itemsList, setItemsList] = useState([]);

    /* edit Inventory */
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('New');

    /* edit Equipment */
    const [openEquipmentView, setOpenEquipmentView] = useState(false);
    const [openEquipmentEdit, setOpenEquipmentEdit] = useState(false);
    const [equipmentid, setEquipmentId] = useState(0);
    const [EquipmentTitle, setEquipmentTitle] = useState('New');
    const [useEquipmentId, setUseEquipmentId] = useState(false);

    /* edit Repair */
    const [openRepairView, setOpenRepairView] = useState(false);
    const [openRepairEdit, setOpenRepairEdit] = useState(false);
    const [repairid, setRepairId] = useState(0);
    const [repairTitle, setRepairTitle] = useState('New');

    /* edit user */
    const [openUser, setOpenUser] = useState(false);
    const [userTitle, setUserTitle] = useState('New');
    const [userId, setUserId] = useState(0);
    const [userShowStatus, setUserShowStatus] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    useEffect(() => {
        if (navigationType === "POP") {
            setActiveTab(pathname.replace("/", ""))
        }
    }, [navigationType]);

    const btnSave = async () => {
        await ref.current?.save();
    }

    useEffect(() => {
        setActiveTab(pathname.replace("/", ""))
        Init()
    }, [])

    const Init = async () => {
        setIsLoading(true)
        const localStorage = await getStorage();
        setIsAdmin(localStorage.isAdmin);
        setUid(localStorage.uid);
        await getInventory();
        await getEquipment();
        await getRepair();
        await getUser();
        await getItems();
        setIsLoading(false)
    }
    const getInventory = async () => {
        const response = await FetchData({
            method: 'GET',
            endPoint: 'inventory'
        })
        setInventoryList(response.data)
        return response.data;
    }    
    const getEquipment = async () => {
        const response = await FetchData({
            method: 'GET',
            endPoint: 'equipment'
        })
        setEquipmentList(response.data)
        return response.data;
    }
    const getRepair = async () => {
        const response = await FetchData({
            method: 'GET',
            endPoint: 'repair'
        })
        setRepairList(response.data)
        return response.data;
    }
    const getUser = async () => {
        const response = await FetchData({
            method: 'GET',
            endPoint: 'user'
        })
        setUserList(response.data)
        return response.data;
    }
    const getItems = async () => {
        const response = await FetchData({
            method: 'GET',
            endPoint: 'items'
        })
        setItemsList(response.data)
        return response.data;
    }
    const saveData = async ({ label, method, endPoint, id = null, body = null, notify = true, logs = true, email = false, status = null, userList = [], servicesList = [] }) => {
        setIsLoading(true)
        const res = await SaveData({
            label: label,
            method: method,
            endPoint: endPoint,
            id: id,
            body: body
        })

        setIsLoading(false)

        if (res.isSuccess) {
            notify && success(res.message);
            setRefresh(refresh + 1);
        }
        else
            notify && error(res.message)
    }


    const editInventory = (id) => {
        setTitle(id === 0 ? `New` : `Edit`);
        setId(id);
        setOpenEdit(true);
        setReload(reload + 1);
    }    
    
    const viewInventory = (id) => {
        setId(id);
        setOpenView(true);
        setReload(reload + 1);
    } 
    
    const editEquipment = (id) => {
        setEquipmentTitle(id === 0 ? `New` : `Edit`);
        setEquipmentId(id);
        setOpenEquipmentEdit(true);
         setReload(reload + 1);
    } 
     const viewEquipment = (id) => {   
        setEquipmentId(id);
        setOpenEquipmentView(true);
         setReload(reload + 1);
    }

    const editRepair = (id,isEquipId=false) => {
        setRepairTitle(id === 0 ? `New` : `Edit`);    
        setRepairId(id);
        setUseEquipmentId(isEquipId);
        setOpenRepairEdit(true);
        setReload(reload + 1);
    } 
    const viewRepair = (id) => {     
        setRepairId(id);
        setOpenRepairView(true);
        setReload(reload + 1);
    } 

    const editUser = (id, customTitle = false,showStatus=true) => {
        setUserTitle(customTitle ? "Account" : (id === 0 ? `New User` : `Edit User`));  
        setUserId(id);
        setOpenUser(true);
        setUserShowStatus(showStatus);
        setReload(reload + 1);
    }
    return (
        <div class='min-h-screen w-full flex flex-col '>
            <main class="flex-1">
                <Outlet context={{
                    saveData, refresh,
                    isLoading, setIsLoading,
                    inventoryList, getInventory, editInventory, viewInventory,
                    equipmentList, getEquipment, editEquipment,viewEquipment,
                    repairList, getRepair, editRepair,viewRepair,
                    userList, getUser, editUser,
                    itemsList,getItems,
                    isAdmin, uid,setActiveTab
                }} />
            </main>
            <Footer activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

            {isLoading &&
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999, // Ensure it's on top
                    }}
                >
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </div>
            }

            {/* Drawer on Add/ Edit order*/}
            <Drawer title={title} placement='right' width={400} onClose={() => setOpenEdit(false)} open={openEdit} zIndex={999}
                extra={<Space><Button type="primary" icon={<SaveOutlined />} onClick={btnSave} >Save</Button></Space>}>
                <InventoryDetail id={id} uid={uid} reload={reload} ref={ref} setOpen={setOpenEdit} isLoading={isLoading} setIsLoading={setIsLoading} saveData={saveData} />
            </Drawer>
            {/* Drawer on View Inventory*/}
            <Drawer title={"Inventory"} placement='bottom' height={'90%'} style={{ backgroundColor: '#F9FAFB' }} onClose={() => setOpenView(false)} open={openView} zIndex={499}>
                <InventoryView id={id} reload={reload} refresh={refresh} setOpen={setOpenView} isLoading={isLoading} setIsLoading={setIsLoading} editInventory={editInventory}  />
            </Drawer>


            {/* Drawer on Add/ Edit Equipment*/}
            <Drawer title={EquipmentTitle} placement='right' width={400} onClose={() => setOpenEquipmentEdit(false)} open={openEquipmentEdit} zIndex={999}
                extra={<Space><Button type="primary" icon={<SaveOutlined />} onClick={btnSave} >Save</Button></Space>}>
                <EquipmentDetail id={equipmentid} uid={uid} reload={reload} ref={ref} setOpen={setOpenEquipmentEdit} isLoading={isLoading} setIsLoading={setIsLoading} saveData={saveData} />
            </Drawer>

            {/* Drawer on View Equipment*/}
            <Drawer title={"Equipment"} placement='bottom' height={'90%'} style={{ backgroundColor: '#F9FAFB' }} onClose={() => setOpenEquipmentView(false)} open={openEquipmentView} zIndex={499}
            extra={<Space><Button type="primary" icon={<PlusOutlined />} onClick={()=>editRepair(0,true)} >Add Repair</Button></Space>}> 
                 <EquipmentView id={equipmentid} reload={reload} refresh={refresh} setOpen={setOpenEquipmentView} isLoading={isLoading} setIsLoading={setIsLoading} editEquipment={editEquipment} viewRepair={viewRepair} />
            </Drawer>

            {/* Drawer on Add/ Edit Repair*/}
            <Drawer title={repairTitle} placement='right' width={400} onClose={() => setOpenRepairEdit(false)} open={openRepairEdit} zIndex={999}
                extra={<Space><Button type="primary" icon={<SaveOutlined />} onClick={btnSave} >Save</Button></Space>}>
                <RepairDetail id={repairid} uid={uid} reload={reload} ref={ref} setOpen={setOpenRepairEdit} isLoading={isLoading} setIsLoading={setIsLoading} saveData={saveData} equipmentList={equipmentList} itemsList={itemsList} equipmentId={equipmentid} useEquipmentId={useEquipmentId} />
            </Drawer>

              {/* Drawer on View Repair*/}
            <Drawer title={"Repair"} placement='bottom' height={'90%'} style={{ backgroundColor: '#F9FAFB' }} onClose={() => setOpenRepairView(false)} open={openRepairView}zIndex={499}>
                 <RepairView id={repairid} reload={reload} refresh={refresh} setOpen={setOpenRepairView} isLoading={isLoading} setIsLoading={setIsLoading} editRepair={editRepair} />
            </Drawer>

            {/* Drawer on Add/ Edit user*/}
            <Drawer title={userTitle} placement='right' width={400} onClose={() => setOpenUser(false)} open={openUser} zIndex={999}
                extra={<Space><Button type="primary" icon={<SaveOutlined />} onClick={btnSave} >Save</Button></Space>}>
                <UserDetail id={userId} reload={reload} ref={ref} setOpen={setOpenUser} userShowStatus={userShowStatus} isLoading={isLoading} setIsLoading={setIsLoading} saveData={saveData} />
            </Drawer>
            {contextHolder}
        </div>
    );
};

export default ProtectedLayout;