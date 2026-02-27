import { CameraOutlined } from '@ant-design/icons';
import { Avatar,  Image } from "antd";
import { UTC_LocalDateTime_relative } from "../../common/localDate";
import {Tags} from "../../common/tags.js"

const Card = ({ id, status, role, title, user, picture, modifiedat,editUser }) => {
    return (
        <div key={id} className="bg-white rounded-xl shadow-sm p-4 flex gap-3 relative cursor-pointer hover:bg-gray-200 hover:shadow" >
            <div>
                {picture !== null ?
                    <Image width={72} height={72} src={picture} style={{ borderRadius: 20 }} /> :
                    <Avatar size={72} shape='square' style={{ backgroundColor: 'whitesmoke' }} icon={<CameraOutlined style={{ color: 'silver' }} />} />
                }
            </div>

            <div className="flex-1" onClick={() => editUser(id)}>
                <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                    <span className="uppercase tracking-wide">
                        {user}
                    </span>
                    <span>{UTC_LocalDateTime_relative(modifiedat, "MMM, DD YYYY - hh:mm A ")}</span>

                </div>

                <h3 className="font-semibold text-gray-800">{title}</h3>

                <div className="flex gap-2 items-center mt-2 text-xs text-gray-400">
                    <span>{Tags(status)}</span>
                    {role === 'Administrator' && <span>{Tags(role)}</span>}
                </div>
            </div>
        </div>
    );
};

export default Card