import { CameraOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Image, Tag, Tooltip } from "antd";
import { UTC_LocalDateTime_relative } from "../../common/localDate";
import { Tags } from "../../common/tags";

const Card = ({ id, description,notes, title, user, picture, modifiedat, make, model, year, status, equipment, isEdit }) => {
    return (
        <div key={id} className="bg-white w-full rounded-xl shadow-sm p-4 flex gap-3 relative cursor-pointer hover:bg-gray-200 hover:shadow" >
            <div>
                {picture !== null ?
                    <Image width={72} height={72} src={picture} style={{ borderRadius: 20 }} /> :
                    <Avatar size={72} shape='square' style={{ backgroundColor: 'whitesmoke' }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                }
            </div>

            <div className="flex-1" onClick={() => equipment(id)}>
                <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                    <span className="uppercase tracking-wide">
                        By {user}
                    </span>
                    {isEdit ?
                        <Tooltip placement="top" title={'Edit'} >
                            <Button type="link" size='small' icon={<EditOutlined />} onClick={() => equipment(id)} >Edit</Button>
                        </Tooltip> :
                        <span>{UTC_LocalDateTime_relative(modifiedat, "MMM, DD YYYY - hh:mm A ")}</span>
                    }

                </div>

                <h3 className="font-semibold text-gray-800">{title}
                    <span className="text-xs font-normal text-gray-400"> ({description})</span>
                </h3>
                <div class='flex gap-3 mt-2'>
                    <Tag color='blue'>{make}</Tag>
                    <Tag color='blue'>{model}</Tag>
                    <Tag color='blue'>{year}</Tag>
                    {Tags(status)}
                </div>
                 {notes != '' && <div className="flex  items-center mt-2 text-xs text-red-400">
                <span>Note : {notes}</span>
            </div>
            }
            </div>
           
        </div>
    );
};


export default Card