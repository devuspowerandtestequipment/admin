import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Popconfirm, message } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import DrawerRoleCreate from './DrawerRoleCreate'
import DrawerRoleEdit from './DrawerRoleEdit'
import axios from 'axios'
import {fetchAllRoles} from '../../../store/actions'

export const SettingsAdminRoles = (props) => {


  const handleDeleteRole=id=>{
    axios.get(`${process.env.backendURL}/rolesadmin/deletefile/${id}`)
    .then((response) => {
      if (response.data.response) {
        props.fetchAllRoles();
        message.success('Success');
      }
    });
  }

  return (
    <div>
        <div className='admin_roles'>
          {props.roles &&
            props.roles.map((role)=>{
              return(
                <div className={role._id}>
                  <span style={{fontSize:'16px'}}>{role.name}</span>
                  &nbsp;<DrawerRoleEdit role={role} key={role._id} />
                  &nbsp;
                  <Popconfirm
                    title="Are you sure to delete?"
                    onConfirm={()=>handleDeleteRole(role._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span className='text-danger cursor-pointer'><DeleteOutlined /></span>
                  </Popconfirm>
                  
                  <br />
                  <br />
                </div>
              )
            })
          }
          <br />
          <DrawerRoleCreate />
        </div>
        <br />
          <br />
          <p>User - Edit - Roles  </p>
    </div>
  )
}

const mapStateToProps = (state) => ({
  roles:state.all_roles
})

export default connect(mapStateToProps, {fetchAllRoles})(SettingsAdminRoles)