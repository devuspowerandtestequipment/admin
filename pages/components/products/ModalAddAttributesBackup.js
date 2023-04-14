import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Header, Form } from "semantic-ui-react";
import { Button } from "antd";
import _ from 'lodash'

export const ModalAddAttributes = (props) => {

    const [data,setData]=useState({})


    
  
    useEffect(()=>{
        if(props.data!==null){
        }
    },[props])

    function handleChange(e){
      setData({
        ...data,
        [e.target.name]:e.target.value
      })
    }

    function handleDropDown(name){
        const tempData=_.filter(props.attributedata,{name:name})[0];        
        if(tempData!==undefined){
          return (
            <Form.Field label={name} name={name} onChange={handleChange} control="select" key={name} required>
              <option value="">Select {name}</option>
              {tempData.datasarray.map((dta)=>{
                return(
                  <option value={dta} key={dta}>{dta}</option>
                )
              })}
            </Form.Field>
          );
        }else{
          return (
            <Form.Field label={name} name={name} onChange={handleChange} control="select" key={name} required>
              <option value="">Select {name}</option>
            </Form.Field>
          );
        }
    }


    function objectValues(obj) {
      let vals = [];
      for (const prop in obj) {
          vals.push(obj[prop]);
      }
      return vals;
    }


    const handleSubmit=()=>{
      // console.log(data)

      
      // console.log(Object.keys(data))

      // for (const [key, value] of Object.entries(data)) {
      //   console.log(`${key}: ${value}`);
      // }


      props.addMoreAttribute(objectValues(data).join('-'));
    }

  return (
        <Modal
          open={props.modalstatus}
          size={"mini"}
        >
          {/* <Modal.Header>Add Variant</Modal.Header> */}
          <Modal.Content>
            <Modal.Description>
              <Header>Add Variant</Header>
              <Form onSubmit={handleSubmit}>
                {props.data === null ? (
                  <>Loading...</>
                ) : (
                  props.data.attributedata.map((ats, key8) => {
                    return(
                      <>
                        {handleDropDown(ats.name)}
                      </>
                    )
                  })
                )}
                <br />
                <Button type="primary" danger onClick={() => props.closeModal(false)}>
                  Close
                </Button>
                &nbsp;
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form>
              
            </Modal.Description>
          </Modal.Content>
        </Modal>
  )
}

const mapStateToProps = (state) => ({
  attributedata:state.all_attributes
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddAttributes)




// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { Modal, Header, Form } from "semantic-ui-react";
// import { Button } from "antd";

// export class ModalAddAttributes extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modal: props.modalstatus,
//       data:props.data
//     };
//   }

//   setModal = (e) => this.setState({ modal: e });

  

  

//   render() {
//     return (
//       <>
//         <Modal
//           onClose={() => this.setModal(false)}
//           onOpen={() => this.setModal(true)}
//           open={this.state.modal}
//           size={"mini"}
//         >
//           {/* <Modal.Header>Add Variant</Modal.Header> */}
//           <Modal.Content>
//             <Modal.Description>
//               <Header>Add Variant</Header>
//               <Form>
//                 {this.state.data === null ? (
//                   <>Loading...</>
//                 ) : (
//                   this.state.data.attributedata.map((ats, key8) => {
//                     return (
//                       <Form.Field label={ats.name} control="select" key={key8}>
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                       </Form.Field>
//                     );
//                   })
//                 )}
//               </Form>
//             </Modal.Description>
//           </Modal.Content>
//           <Modal.Actions>
//             <Button type="primary" danger onClick={() => this.setModal(false)}>
//               Close
//             </Button>
//             {/* <Button type="primary" onClick={() => this.setOpen(false)}>
//                           Nope
//                         </Button> */}
//           </Modal.Actions>
//         </Modal>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(ModalAddAttributes);
