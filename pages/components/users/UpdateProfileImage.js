import React from 'react'
import { connect } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { useState } from 'react';
import axios from 'axios';
import {setAuthUser} from '../../../store/actions'
import { message } from 'antd';

export const UpdateProfileImage = (props) => {

  const [uploading,setUploading]=useState(false);



  const handleImageUpload = event => {

    let img = event.target.files[0];

    if(img.type==='image/jpg' || img.type==='image/jpeg' || img.type==='image/png' || img.type==='image/webp'|| img.type==='image/svg+xml'){
        if (img.size >= 3145728){
        //   toast.warning(`Image size is more than 3mb.`, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        // });
            message.warning('Image size is more than 3mb.')
        }else{
        //   totalfiles.push(file); 

        setUploading(true);
        var formData = new FormData();
        formData.append("image", img);
        formData.append("id", props.auth._id);

        axios.post(`${process.env.backendURL}/user/update_profile_picture`, formData,  {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            maxBodyLength: 104857600, //100mb
            maxContentLength: 104857600, //100mb
            emulateJSON: true 
        })
        .then(response=>{
            setUploading(false);
            console.log(response.data);
            // props.setData(response.data.data);
            props.getData();
            message.success('Success')
            // toast.success('Success', {
            //     position: "top-right",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            // });
        })

        }
      }else{
        message.warning(`${img.path} is not an image.`)
        // toast.warning(`${img.path} is not an image.`, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        // });
      }


    }

  return (
    <>
    {props.auth &&
      <> 
      <div>
        <center>
          {props.auth.image
            ?<img src={`${process.env.imagekiturl}/${props.auth.image.filePath}?tr=w-200,h-200`} style={{borderRadius:'50%'}} />
            :<img src={`${process.env.imagekiturl}/OTHER_IMAGES/blankprofilepic?tr=w-200`} style={{borderRadius:'50%'}} />
          }            
        </center>
      </div>
        {uploading
        ?
        <div className='account_image_update_icon8712'>
            <center><span style={{fontSize:'15px'}}>Uploading...</span></center>
        </div>
        :
        <>
        <div className='account_image_update_icon8712' onClick={()=>document.getElementById('image_upload89658745896').click()}>
            <center><span><AiFillEdit /></span></center>
        </div>
        <input type='file' accept='image/*' id='image_upload89658745896' onChange={(e) => handleImageUpload(e)} hidden />
        </>
        }

        </>
      }
    
    </>
  )
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, {setAuthUser})(UpdateProfileImage)