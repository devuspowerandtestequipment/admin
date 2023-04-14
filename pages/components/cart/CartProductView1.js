import React from 'react'
import { connect } from 'react-redux'
import { Table, Popup } from 'semantic-ui-react';
import DynamicAmount from '../DynamicAmount';
import * as customFunctions from '../../../custom_functions/customFunctions';
import { TbReceiptTax } from "react-icons/tb";
import { AiOutlineCiCircle, AiOutlineInfoCircle } from 'react-icons/ai';


export const CartProductView1 = (props) => {


  return (
    <Table.Row>
        <Table.Cell>{props.product.product_name}</Table.Cell>
        {/* <Table.Cell><DynamicAmount amount={props.product.product_price} /></Table.Cell> */}
        <Table.Cell><DynamicAmount amount={props.product.product_price} />
        
        
        {props.product.parent_product_id.product_tax.length>0 &&
          <Popup
            trigger={
              <span className='text-primary' style={{fontSize:'15px',marginLeft:'5px', cursor:'pointer'}}>
                <AiOutlineInfoCircle />
              </span>
            }
          >
            <Popup.Header>Tax Info</Popup.Header>
            <Popup.Content>
                  {props.product.parent_product_id.product_tax.map((tx,keyt)=>{
                      return(
                          <>
                          <span key={keyt} className="fs-sm">
                              <span className="text-muted me-1"><b>{tx.name}:</b></span>{tx.type==='1'?`${tx.percentage}%`:<DynamicAmount amount={tx.amount} />}
                          </span> &nbsp;
                          </>
                      )
                  })}
            </Popup.Content>
          </Popup>

          
        }
        
        
        
        
        
        
        </Table.Cell>

        
        <Table.Cell>{props.product.quantity}</Table.Cell>


        {/* <Table.Cell><DynamicAmount amount={customFunctions.calculateTax(props.product)} /></Table.Cell> */}
        {/* <Table.Cell>
        {props.product.parent_product_id.product_tax.map((tx,keyt)=>{
            return(
                <>
                <span key={keyt} className="fs-sm">
                    <span className="text-muted me-1">{tx.name}:</span>{tx.type==='1'?`${tx.percentage}%`:<DynamicAmount amount={tx.amount} />}
                </span> &nbsp;
                </>
            )
        })}
        </Table.Cell> */}
        <Table.Cell  textAlign='right'>
        <DynamicAmount amount={(props.product.product_price*props.product.quantity).toFixed(2)} />
        </Table.Cell>

    </Table.Row>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CartProductView1)