import { Button, Tooltip } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { get_Date } from "../../common/localDate";

const Card = ({ id, color,orderno, textcolor, tag, status, title, description,duedate, notes = "", equipment, isEdit }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 flex gap-3 relative cursor-pointer w-full hover:bg-gray-200 hover:shadow">
            <div className={`w-1 rounded-full ${color}`}></div>

            <div className="flex-1" onClick={() => equipment(id)}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                        Order # {orderno}
                    </span>

                    {isEdit ?
                        <Tooltip placement="top" title={'Edit'} >
                            <Button type="link" size='small' icon={<EditOutlined />} onClick={() => equipment(id)} >Edit</Button>
                        </Tooltip> :
                        <span className={`text-xs ${textcolor} font-medium`}> ● {status}</span>
                    }
                </div>
                <div className="flex justify-between items-center mb-1">
                   <h3 className="font-semibold text-gray-800">{tag} - {title}</h3>
                 <span className={`text-xs  font-medium`}>{ get_Date(duedate,'MMM DD, YYYY')}</span>
                    
                </div>
                

                <div className="flex  items-center mt-1 text-xs text-gray-400">
                    <span>{description}</span>
                </div>

                {notes != '' && <div className="flex  items-center mt-1 text-xs text-red-400">
                    <span>Note : {notes}</span>
                </div>
                }
            </div>
        </div>
    );
};

export default Card;