import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Form,
  Icon, Label
} from "semantic-ui-react";
import { Layout, Breadcrumb,Button, message } from "antd";
import SimpleReactValidator from 'simple-react-validator';
import axios from "axios";
import Router from 'next/router'
import {fetchAttributes} from '../../store/actions'
import _ from 'lodash'
const { Content } = Layout;

export class create2 extends Component {


  constructor(props){
    super(props)
    this.state={
      formLoading:true,
      _id:null,
      attributedata:null,
    }
    this.validator = new SimpleReactValidator();
  }

  handleChnage=e=>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }


  componentDidMount(){
      this.props.fetchAttributes();
      axios.get(`${process.env.backendURL}/product/check_product_id/${Router.router.query.codeid}`)
      .then(response=>{
          console.log(response.data)
          if(response.data.response){
            axios.get(`${process.env.backendURL}/attribute`)
            .then(response1=>{
              if(response1.data.response){

                console.log(response1.data.datas)

                var tempattributedata=[];
                response1.data.datas.forEach(attr => {

                  if(attr.isconfigproduct==='Yes'){
                    tempattributedata.push({
                      _id:attr._id,
                      name:attr.name,
                      values:attr.attrbutes_list,
                    })
                  }

                  
                });

                this.setState({
                  formLoading:false,
                  _id:Router.router.query.codeid,
                  attributedata:tempattributedata,                
              })
              }else{
                message.warning('Failed')
                Router.push('/products/create')
              }
            })
          }else{
              message.warning('Wrong product')
              Router.push('/products/create')
          }
      })   
  }



  handleSelectClick = (id,dataname) => {
    var jsondata = this.state.attributedata;

    //filter single json data
    var filterjson=_.filter(jsondata,{'_id':id})[0];


    // //filter array
    var attrbutes_list=filterjson.values;


    if(attrbutes_list.length>1){
      _.remove(attrbutes_list, function(c) {
        return (c.name === dataname); //remove data from array
      });
    }else{
      message.warning(`Can't delete all datas`)
    }

    console.log(attrbutes_list)


    //update json   
    jsondata.forEach(element => {
      if(element._id===filterjson._id){
        element.values=attrbutes_list
      }
    });
    this.setState({
      attributedata:jsondata
    })


    
  }


  handleMainClick = (id) => {

    var jsondata = this.state.attributedata;
    if(jsondata.length>1){
      let filtered_array = _.filter(
        jsondata, function(o) {
           return o._id!==id;
        }
      );
      this.setState({
        attributedata:filtered_array
      })
    }else{
      message.warning(`Can't delete all datas`)
    }

   

  }


  reloadData = () => {
    this.setState({
      formLoading:true,
    })

    axios.get(`${process.env.backendURL}/attribute`)
    .then(response=>{

      var tempattributedata=[];
      response.data.datas.forEach(attr => {
        if(attr.isconfigproduct==='Yes'){
          tempattributedata.push({
            _id:attr._id,
            name:attr.name,
            values:attr.attrbutes_list,
          })
        }
      });
      
      this.setState({
        attributedata:tempattributedata,
        formLoading:false               
      })

    })



    // this.setState({
    //   formLoading:true,
    // })
    // axios.get(`${process.env.backendURL}/product/check_product_id/${Router.router.query.codeid}`)
    //   .then(response=>{
    //       console.log(response.data)
    //       if(response.data.response){
    //         this.setState({
    //             formLoading:false,
    //             _id:Router.router.query.codeid,
    //             attributedata:response.data.data.attributedata                
    //         })
    //       }else{
    //           message.warning('Wrong product')
    //           Router.push('/products/create')
    //       }
    //   })
  }




  handleSubmit = () => {
    console.log(this.state)

    var main_datas=this.state.attributedata;
    var attributedata=[];

    main_datas.map((ad1)=>{
      var values=[];
      var valuesnames=[];

      ad1.values.map((va2)=>{
        valuesnames.push(va2.name)
        // values.push(va2.name) //*** !!TESTING */
        values.push(va2._id) //*** ORIGINAL */ 
      })
      attributedata.push({name:ad1._id,values,valuesnames}) //*** ORIGINAL */
      // attributedata.push({name:ad1.name,values,valuesnames}) //*** !!TESTING */
    })

    
    var temp_datas={
      _id:this.state._id,
      attributedata
    }

    this.setState({
      formLoading:true,
    })
    axios.post(`${process.env.backendURL}/product/create2config`,temp_datas)
    .then(response=>{
      if(response.data.response){
        Router.push({
          pathname: '/products/create3config',
          query: { codeid: Router.router.query.codeid },
        })
      }
    })
  }

  render() {
    return (
      <Body>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Products</Breadcrumb.Item>
            <Breadcrumb.Item>Create</Breadcrumb.Item>
            <Breadcrumb.Item>Configurable Product</Breadcrumb.Item>

          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Form onSubmit={this.handleSubmit} loading={this.state.formLoading}>
              <div>
                <h4>Configurable Attributes <Button type="primary" size='small' onClick={()=>this.reloadData()}>
                        Reload
                    </Button></h4>

                    {this.state.attributedata===null
                    ?<>Loading...</>
                    :
                    <>
                    {this.state.attributedata.map((attr,key)=>{
                      console.log(attr)
                        return(
                          <>
                          <h5 key={key}>{attr.name} <span onClick={()=>this.handleMainClick(attr._id)} style={{cursor:'pointer'}}><Icon name='trash' /></span> </h5>

                            {/* BACKUP */}
                            {/* {attr.values.map((ad,kexy)=>{
                              return(
                                <Label as='a' key={kexy}>
                                  {ad}
                                  <Icon name='delete' onClick={()=>this.handleSelectClick(attr._id, ad)}key={key} />
                                </Label>
                              )
                            })} */}


                            {attr.values.map((ad,kexy)=>{
                              return(
                                <Label as='a' key={kexy}>
                                  {ad.name}
                                  <Icon name='delete' onClick={()=>this.handleSelectClick(attr._id, ad.name)}key={key} />
                                </Label>
                              )
                            })}
                            
                          </>
                        )
                      
                    })}
                    
                    </>
                    }

                    
                    <br />
                    <br />
                    <br />

                    <Button type="primary" htmlType="submit" >
                        Save and Next
                    </Button>
              </div>

              
            </Form>
          </div>
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
    allattributes: state.all_attributes,
});


export default connect(mapStateToProps, {fetchAttributes})(create2);
