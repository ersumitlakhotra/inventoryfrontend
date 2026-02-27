import { Avatar, Button, Image, Tooltip } from "antd";
import { EditOutlined ,CameraOutlined} from '@ant-design/icons';
import { UTC_LocalDateTime_relative } from "../../common/localDate";

 const Card = ({id, description,  title, user,picture ,modifiedat, inventory, isEdit  }) => {
        return (
            <div key={id} className="bg-white w-full rounded-xl shadow-sm p-4 flex gap-3 relative cursor-pointer  hover:bg-gray-200 hover:shadow" >
                <div>
                    {picture !== null ?
                        <Image width={72} height={72} src={picture} style={{ borderRadius: 20 }} /> :
                        <Avatar size={72} shape='square' style={{ backgroundColor: 'whitesmoke' }} icon={<CameraOutlined style={{color:'silver'}}/>} />
                    }
                </div>

                <div className="flex-1" onClick={() => inventory(id)}> 
                    <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                        <span className="uppercase tracking-wide">
                            By {user}
                        </span>
                        {isEdit ?
                        <Tooltip placement="top" title={'Edit'} >
                            <Button type="link" size='small' icon={<EditOutlined />} onClick={() => inventory(id)} >Edit</Button>
                        </Tooltip> :
                         <span>{UTC_LocalDateTime_relative(modifiedat, "MMM, DD YYYY - hh:mm A ")}</span>
                    }
                       
                        
                    </div>

                    <h3 className="font-semibold text-gray-800">{title}</h3>

                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>{description}</span>
                        
                    </div>
                </div>
            </div>
        );
    };
export default Card;