import numeral from 'numeral'
import Moment from 'react-moment';
import { AiFillDelete } from 'react-icons/ai';
import {Popconfirm} from 'antd'

export function timelineShow(timeline,deleteSingleTimeline) {




    function deleteTimeline(data){
        return(
            <>
            <Popconfirm
                title="Are you sure to delete this?"
                onConfirm={()=>deleteSingleTimeline(data._id)}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <span className='timeline_8965 cursor-pointer float-right'><AiFillDelete /></span>
            </Popconfirm>
            
            
            </>
        )
    }


    if(timeline.name==='0'){
        return(
            <>
            <b>Order cancelled on</b> 
                <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
                {deleteTimeline(timeline)}
            </>
        );

    }else if(timeline.name==='1'){
        return(
            <>
            <b>Order placed on</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {/* {deleteTimeline(timeline)} */}
            </>
        );
    }else if(timeline.name==='2'){
        return(
            <>
            <b>Approved on</b>  <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else if(timeline.name==='3'){
        return(
            <>
            <b>Order is in progress</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else if(timeline.name==='4'){
        return(
            <>
            <b>Order is packing</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else if(timeline.name==='5'){
        return(
            <>
            P<b>icked up on</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else if(timeline.name==='6'){
        return(
            <>
            <b>Shipped on</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else if(timeline.name==='7'){
        return(
            <>
            <b>Order has been delivered on</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else if(timeline.name==='8'){
        return(
            <>
            <b>Courier information updated on</b> <span style={{fontSize:'11px',color:'gray'}}><Moment format="LLLL">{timeline.createdAt}</Moment></span>
            {deleteTimeline(timeline)}
            </>
        );
    }else{
        return(
            <>
            customTimeLineJS
            </>
        );
    }
    
}