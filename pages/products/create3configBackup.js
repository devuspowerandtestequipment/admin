import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import { IKContext, IKUpload } from "imagekitio-react";
import {
  Checkbox,
  Form,
  FormGroup,
  Grid,
  Radio,
  Dropdown
} from "semantic-ui-react";
import { uuid } from 'uuidv4';
import { Layout, Breadcrumb,Button, message, notification, Switch, Popconfirm  } from "antd";
import { ApiFilled, DeleteOutlined } from '@ant-design/icons';
import ImageUplaod from "../components/products/ImageUplaod";
import axios from "axios";
import Router from "next/router";
import { ReactSortable } from "react-sortablejs";
import _, { forEach } from 'lodash'
import {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands} from '../../store/actions'
import ModalAddAttributes from "../components/products/ModalAddAttributes";
import SimpleReactValidator from 'simple-react-validator';
import YouTube from 'react-youtube';
// import { Editor } from '@tinymce/tinymce-react';
// import {Editor, EditorState} from 'draft-js';
import CKEditor from 'ckeditor4-react-advanced';
import Dropzone from 'react-dropzone';
import ImageSorting from "../components/products/ImageSorting";
import VideoSorting from "../components/products/VideoSorting";
import DrawerConfigProductImageView from "../components/products/DrawerConfigProductImageView";
const { Content } = Layout;

export class create3config extends Component {

    constructor(props){
        super(props)
        this.state={
            savingDivAttrProducts:false,
            enableSorting:false,
            modal:false,
            formLoading:true,
            imageLoading:false,
            configImageLoaderId:[],
            disabledImageDeleteOption:false,
            data:null,
            childdata:null,
            deleteddata:[],
            tempImages:null,
        }
        this.validator = new SimpleReactValidator();
    }

  setModal = (e) => this.setState({ modal: e });


    componentDidMount(){
        this.props.fetchAttributes();
        this.props.fetchCategories();
        this.props.fetchSubCategories();
        this.props.fetchChildCategories();
        this.props.fetchBrands();

        this.fetchProductInformation();
        
         
    }



    

    



    fetchProductInformation=()=>{
      axios.get(`${process.env.backendURL}/product/configproductlist_both_parent_child/${Router.router.query.codeid}`)
        .then(response=>{

            if(response.data.parentdata!==null){
              this.setState({
                  formLoading:false,
                  _id:Router.router.query.codeid,
                  data:response.data.parentdata,
                  childdata:_.orderBy(response.data.childdata, o => parseInt(o.order), 'asc'),
                  // childdata:[]                
              })

              console.log(_.orderBy(response.data.childdata, o => parseInt(o.order), 'asc'))

              var attributedata = response.data.parentdata.myattributes;
              attributedata.forEach(element => {
                console.log(element[Object.getOwnPropertyNames(element)])
                // console.log(Object.getOwnPropertyNames(element))
              });

            }else{
                message.warning('Wrong product')
                Router.push('/products/create')
            }
        })
    }

    fetchChildProductInformation=()=>{
      axios.get(`${process.env.backendURL}/product/configproductlist_both_parent_child/${Router.router.query.codeid}`)
        .then(response=>{

            if(response.data.parentdata!==null){
              this.setState({
                  formLoading:false,
                  _id:Router.router.query.codeid,
                  childdata:_.orderBy(response.data.childdata, o => parseInt(o.order), 'asc'),
                  // childdata:[]                
              })

            }else{
                message.warning('Wrong product')
                Router.push('/products/create')
            }
        })
    }

    


    addMoreAttribute=(configname, config, configmain)=>{

      var childdata=this.state.childdata
      var filterdata=_.filter(childdata, { 'totalconfigattribute': configname });

    

      if(filterdata.length===0){

        var parent = this.state.data;

        var dts={
          order:0,
          status:'Active',
          config_added_status:'upload_now',
          type:'Configurable',
          url:parent.url+'-'+configname.toLowerCase(),
          is_parent:'No',
          parent_id:parent._id,
          images:[],
          videos:[],
          sku:parent.sku+'-'+configname.toLowerCase(),
          name:parent.name+' '+config,
          stock:0,
          pricemain:[0],
          pricedisplay:0,
          pricetemp:0,
          totalconfigattribute:configname,
        }
        var totdata=Object.assign(dts,configmain)

        var temp_data={
          _id:this.state.data._id,
          totdata
        }

        axios.post(`${process.env.backendURL}/product/add_new_config_attribute`,temp_data)
        .then(response=>{
          this.setState({modal:false})
          message.success('Added');
          this.fetchProductInformation();
        })

    
        // childdata.push(totdata)

        // this.setState({
        //   childdata,
        //   modal:false,
        // })

    
      }else{
        message.warning('This attribute is already in your list.');
      }
    }




    updateMainAttribute=e=>{
      var myattributes=[];
      var dataattributes=this.state.data.myattributes;
      

      dataattributes.forEach((da,key) => {

        var d_attributename=[Object.getOwnPropertyNames(da)[0]];
        var d_attributevalue=[];

        this.state.childdata.forEach(el => {
          d_attributevalue.push(el[d_attributename])
        });


        var unique_values = [...new Set(d_attributevalue)];
        myattributes.push({[d_attributename]:unique_values})
      
        });
      

      this.setState(prevState=>({
        data:{
        ...prevState.data,
          myattributes:myattributes
        }
      }))
      // console.log(myattributes)

    
    }



    updateUplodImagesStatus=(showImagesInConfigProducts)=>{
      this.setState(prevState => ({
            data:{
              ...prevState.data,
              showImagesInConfigProducts
            }
      }))

      var temp_data={
        _id:this.state.data._id,
        showImagesInConfigProducts
      }

     axios.post(`${process.env.backendURL}/product/update_config_product_image_status`, temp_data)
     .then(response=>{
       console.log(response.data)
     })

      
    }


    handleConfigDeleteProduct = e => {

          // === OLD FILES === //
          // var updateddata=_.filter(this.state.childdata, function(o) { return o._id!==e._id; });
         

          // this.setState(prevState => ({
          //   ...prevState.childdata,
          //   childdata: updateddata
          // }),() => {
          //   this.updateMainAttribute(e);
          // });
          // === OLD FILES === //
          this.setState({disabledImageDeleteOption:true})
          axios.get(`${process.env.backendURL}/product/delete_product/${e._id}`)
          .then(response=>{
            this.setState({disabledImageDeleteOption:false})
            message.success('Removed');
            this.fetchChildProductInformation();
          })


    }

    //check youtube url is valid or not
    matchYoutubeUrl(url) {
      var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if(url.match(p)){
          return url.match(p)[1];
      }
      return false;
    }


    addYoutubeURL=()=>{
      var str=document.getElementById('idyoutube').value;
      
      if(str===''){
        message.warning('Please enter youtube URL');
      }else{

        if(this.matchYoutubeUrl(str)===false){
           message.warning('Invalid youtube url');

        }else{
          var res = str.split("=");
          var embeddedUrl = "https://www.youtube.com/embed/"+res[1];

          var videos=this.state.data.videos;
          videos.push({id:uuid(),url:embeddedUrl});

          this.setState(prevState => ({
            data:{
              ...prevState.data,
              videos
            }
          }))
          var str=document.getElementById('idyoutube').value='';
        } 
      }
    }



    handleConfigChange=(data,id,name)=>{
      var childdata=this.state.childdata;
      childdata.map((item)=>{
        if(item.sku===data.sku){
          item[name]= document.getElementById(id).value
        }
      })
      this.setState({
        childdata
      })
    }






    handleChange=e=>{
      this.setState(prevState=>({
        data:{
        ...prevState.data,
        [e.target.name]:e.target.value
        }
      }))
    }


    insertCheckedItem = (name,value) => {
      if(this.state.data[name]===undefined){
          var tempnamez=[];
          tempnamez.push(value)
          console.log(tempnamez)
          this.setState(prevState => ({
              data: {
                  ...prevState.data,
                  [name]:tempnamez
              },
          }));
      }else{
          var tempname=this.state.data[name];

          //check string or array
          if(typeof tempname === 'string'){
            var tempnamez=[];
            tempnamez.push(value)
            console.log(tempnamez)
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    [name]:tempnamez
                },
            }));
          }else{
            if (tempname.indexOf(value)===-1){
                tempname.push(value)
                
                console.log(tempname)

                this.setState(prevState => ({
                  data: {
                        ...prevState.data,
                        [name]:tempname
                    },
                }));
            }else{
              
              var upddata = tempname.indexOf(value);
              tempname.splice(upddata, 1);
              console.log(tempname)

              this.setState(prevState => ({
                data: {
                      ...prevState.data,
                      [name]:tempname
                  },
              }));
            }
          }
      }
    }

    handleCheckboxChange=(data,name,value)=>{

      
          if(data.checked){
            this.insertCheckedItem(name,value)
          }else{
            this.insertCheckedItem(name,value)
          }
    }


    handleMultipleDropDownChange=(e)=>{
      
      console.log(e.target.value)

      // var ss=this.state.data[e.target.name];
      // ss.push(e.target.value)
      // console.log(ss)

      // this.setState(prevState => ({
      //   data: {
      //       ...prevState.data,
      //       [e.target.name]:ss
      //   },
      // }));


    }



    handleRadioChange=(name,value)=>{
      this.setState(prevState => ({
        data: {
            ...prevState.data,
            [name]:value
        },
      }));
    }


    handleConfigChangepricemain=(data,id,name)=>{
      var childdata=this.state.childdata;
      childdata.map((item)=>{
        var amount=[document.getElementById(id).value];
        if(item.sku===data.sku){
          item[name]= amount
        }
      })
      this.setState({
        childdata
      })
    }
    

    onEditorChange=( evt )=>{
      this.setState({
          data:{
              ...this.state.data,
              description:evt.editor.getData()
          }
      });
    }



    onChangeCategoryCheckbox = (evt, data, name, value) => {

      let checked = data.checked
      console.log(checked)
      console.log(name)
      console.log(value)

      var datas=this.state.data[name];
      if(checked){ //if checked

        if(datas.includes(value)){
        }else{
          datas.push(value)
        }

      }else{
        if(datas.includes(value)){
          var data_index=datas.indexOf(value);
          datas.splice(data_index,1)
        }else{
          
        }
      }

      

    this.setState(prevState => ({
      data: {
          ...prevState.data,
          [name]:datas
      },
    }));

      



      
    }


    updateSortingImage=images=>{
      this.setState(prevState => ({
          data:{
            ...prevState.data,
            images
          }
      }))
    }


    updateSortingVideos=videos=>{
      this.setState(prevState => ({
        data:{
          ...prevState.data,
          videos
        }
      }))
    }



    //CHILD DATA IMAGE SORT
    childDataImageSort=(collection,id)=>{
      
      var childdata=this.state.childdata;
      childdata.forEach(element => {
        if(element._id===id){
          element.images=collection
        }
      });
      this.setState({
        childdata
      })

    }

    //SAVE SORTING PRODUCTS
    saveSortingProducts=()=>{
      
      this.setState({savingDivAttrProducts:true})
      axios.post(`${process.env.backendURL}/product/save_sorting_attribute_products`,{datas:this.state.childdata})
      .then(response=>{
        this.fetchChildProductInformation();
        this.setState({enableSorting:false,savingDivAttrProducts:false})
        message.success('Success')
      })

    }


    //DELETE CHILD DATA IMAGE
    handleDeleteChildDataImages=(fileId,product_id)=>{
      this.setState({disabledImageDeleteOption:true})

      var childdata=this.state.childdata;

      var temp_data={}
      childdata.forEach(element => {
        if(element._id===product_id){
          temp_data.product_id=product_id,
          temp_data.images=_.filter(element.images, function(o) { return o.fileId!==fileId; });
          temp_data.image=_.find(element.images, function(o) { return o.fileId===fileId; });
        }
      });

      axios.post(`${process.env.backendURL}/product/updateimagejson`,temp_data)
      .then(response=>{
        this.fetchChildProductInformation();
        message.success('Removed');
        this.setState({
          childdata,
          disabledImageDeleteOption:false
        })
      })

    }




    handleDeleteImage=image=>{
      this.setState({disabledImageDeleteOption:true})
      var images=_.filter(this.state.data.images, function(o) { return o.fileId!==image.fileId; });
      var temp_data={
        product_id:this.state.data._id,
        image,
        images
      }
      axios.post(`${process.env.backendURL}/product/updateimagejson`,temp_data)
      .then(response=>{
        message.success('Removed');
        this.updateSortingImage(images)
        this.setState({disabledImageDeleteOption:false})
      })
    }



    handleDeleteVideo=video=>{
      var videos=_.filter(this.state.data.videos, function(o) { return o.id!==video.id; });
      this.updateSortingVideos(videos);
    }



    handleConfigDataChange(e){
      console.log(e)
      alert(111)
    }


    //config product image upload loader
    configImageLoader=id=>{
      var configImageLoaderId=this.state.configImageLoaderId;
      configImageLoaderId.push(id)

      this.setState(prevState=>({
        ...prevState.configImageLoaderId,
        configImageLoaderId
      }))

    }

    //config product image upload
    configImageChange=(files,product_id)=>{

      this.configImageLoader(product_id);

      var totalfiles=[];
      
      if(files.length>5){
        // message.warning(`Max upload 5 files at a time`)
        notification.warning({
          duration:10,
          message:'Failed',
          description:`You can't upload more than 5 file at a time`
        })
      }else{
        console.log(files)

        files.forEach(file => {
          // console.log(file)
        
          if(file.type==='image/jpg' || file.type==='image/jpeg' || file.type==='image/png' || file.type==='image/webp'){
            if (file.size >= 5242880){
              message.warning(`${file.path} size is more than 5mb.`)

            }else{
              totalfiles.push(file); 
            }
          }else{
            message.warning(`${file.path} is not an image.`)
          }
        });
      }

    
      if(totalfiles.length>0){
      
        var count=0;
        totalfiles.forEach((file,key) => {

          var formData = new FormData();
          formData.append("product_id", product_id);
          formData.append("image", file);
          axios.post(`${process.env.backendURL}/product/productimage_add`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response=>{
            this.fetchChildProductInformation();

            count=count+1
            if(count===totalfiles.length){

              //REMOVE ID FROM STATE ARRAY
              var idarray = this.state.configImageLoaderId;
              var idIndex = idarray.indexOf(product_id);
              idarray.splice(idarray, 1);
              this.setState({configImageLoaderId:idarray})
            }
            
          })
  
        });
      }else{
        this.setState({
          imageLoading:false
        })
      }


      // var file=data[0];
      // if(file.type==='image/jpg' || file.type==='image/jpeg' || file.type==='image/png' || file.type==='image/webp'){
      //   if (file.size >= 5242880){
      //     message.warning(`${file.name} size is more than 5mb.`)
      //   }else{
      //     this.configImageLoader(product_id)

      //     console.log(file)

      //     // var formData = new FormData();
      //     // formData.append("product_id",product_id);
      //     // formData.append("image", file);
      //     // axios.post(`${process.env.backendURL}/product/product_single_image_add_config`, formData, {
      //     //   headers: {
      //     //     'Content-Type': 'multipart/form-data'
      //     //   }
      //     // })
      //     // .then(response=>{
      //     //   this.fetchProductInformation();
      //     //   console.log(response.data);
      //     // })


          
      //   }
      // }else{
      //   message.warning(`${file.name} is not an image.`)
      // }


    }


    


    //image drop uplaod
    onDrop = (files) => {

      var totalfiles=[];
      
      if(files.length>5){
        // message.warning(`Max upload 5 files at a time`)
        notification.warning({
          duration:10,
          message:'Failed',
          description:`You can't upload more than 5 file at a time`
        })
      }else{
        console.log(files)

        files.forEach(file => {
          // console.log(file)
        
          if(file.type==='image/jpg' || file.type==='image/jpeg' || file.type==='image/png' || file.type==='image/webp'){
            if (file.size >= 5242880){
              message.warning(`${file.path} size is more than 5mb.`)

            }else{
              totalfiles.push(file); 
            }
          }else{
            message.warning(`${file.path} is not an image.`)
          }
        });
      }

    
      if(totalfiles.length>0){
        
        this.setState({imageLoading:true})

        var count=0;
        totalfiles.forEach((file,key) => {

          var formData = new FormData();
          formData.append("product_id", this.state.data._id);
          formData.append("image", file);
          axios.post(`${process.env.backendURL}/product/productimage_add`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response=>{
            this.fetchProductInformation();

            count=count+1
            if(count===totalfiles.length){
              this.setState({imageLoading:false})
            }
            console.log(response.data)
            console.log(count)
          })
  
        });
      }else{
        this.setState({
          imageLoading:false
        })
      }

    
    }


    handleSubmit=e=>{
       data= this.state.data;


      if (this.validator.allValid()) {


        //pricing
        var pricemaintemp=[];
        this.state.childdata.forEach(element => {
          pricemaintemp.push(parseInt(element.pricemain[0]))
        });

        //remove duplicate from pricing
        var pricemain = [...new Set(pricemaintemp)];
        

        //update price
        data.pricemain=pricemain

        console.log(data)


        var temp_data={
          _id:this.state.data._id,
          data,
          childdata:this.state.childdata
        }
  
       axios.post(`${process.env.backendURL}/product/update_config_product_with_parent`, temp_data)
       .then(response=>{
         console.log(response.data)
       })


       console.log(this.state.data)


      } else {
        this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
      }

    }

   


  render() {
console.log(this.state.data)
    return (
      <Body>
        <ModalAddAttributes modalstatus={this.state.modal} data={this.state.data} closeModal={this.setModal} addMoreAttribute={this.addMoreAttribute} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Products</Breadcrumb.Item>
            <Breadcrumb.Item>Create</Breadcrumb.Item>
          </Breadcrumb>
          <div >
            <Form loading={this.state.formLoading} onSubmit={this.handleSubmit}>

              <Grid>
                <Grid.Column mobile={16} tablet={12} computer={12}>

                
              <div>

                

              {this.state.data===null
              ?<></>
              :
              <>
              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Basic Information</h3>
                <Form.Input fluid label="Name" placeholder="Product Name" name="name" value={this.state.data.name} onChange={this.handleChange} />
                {this.validator.message('product name', this.state.data.name, 'required')}


                <Form.Input fluid label="SKU" placeholder="Product SKU" name="sku" value={this.state.data.sku}  />
                {this.validator.message('product name', this.state.data.sku, 'required')}

                {/* <Form.Input fluid label="URL" placeholder="Product URL" name="url" value={this.state.data.url} onChange={this.handleChange} />
                {this.validator.message('product url', this.state.data.url, 'required')} */}

                <Form.Field>
                <label>Descripion</label>
                <CKEditor
                // editor={ ClassicEditor }
                                config={{
                                  
                                width: '100%',
                                height: '150px',
                                }}
                                onChange={this.onEditorChange}
                                data={this.state.data.description}
                            />
                            
                </Form.Field>
                {this.validator.message('product description', this.state.data.description, 'required')}
               



                {/* <Form.Group widths="equal">
                  <Form.Field label="Return Available?" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Warranty Available?" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Field label="Brand" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Category" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Sub Category" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                  <Form.Field label="Child Category" control="select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Field label="Type" control="select">
                    <option value="Simple">Simple</option>
                    <option value="Variable">Variable</option>
                  </Form.Field>
                  <Form.Field label="Status" control="select">
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Field>
                  <Form.Field label="Featured" control="select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Field>
                  <Form.Field label="Tax" control="select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Field>
                </Form.Group> */}
              </div>

                <br />
                {/* <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Overview</h3>
                  <Form.Group widths="equal">
                    <Form.Input fluid label="Main Price" placeholder="Product Name" name="name" value={this.state.data.name} onChange={this.handleChange} />
                    {this.validator.message('product name', this.state.data.name, 'required')}


                    <Form.Input fluid label="Price" placeholder="Product SKU" name="sku" value={this.state.data.sku}  />
                    {this.validator.message('product name', this.state.data.sku, 'required')}


                    <Form.Input fluid label="Stock" placeholder="Product SKU" name="sku" value={this.state.data.sku}  />
                    {this.validator.message('product name', this.state.data.sku, 'required')}
                  </Form.Group>
                </div> */}


              <br />

              <div className={this.state.savingDivAttrProducts?`site-layout-background stoppointerevents`:`site-layout-background`} style={{ padding: 24 }}>
                {this.state.savingDivAttrProducts
                ?
                <center>
                  <img src='https://thumbs.gfycat.com/LimpingWavyCoqui-max-1mb.gif' style={{height:'100px'}} />
                </center>
                :
                <></>}
                
                <h3 className="text-primary">Attributes ({this.state.childdata.length} products)
                  <span style={{float:'right'}} size='small'><Button type="primary" onClick={() => this.setModal(true)}>Add Variant</Button></span>
                  <span style={{float:'right',marginRight:'10px'}} size='small'><Button type="primary" onClick={this.saveSortingProducts}>Save</Button></span>
                  {this.state.enableSorting
                  ?<span style={{float:'right',marginRight:'10px'}} size='small'><Button type="primary" danger onClick={this.saveSortingProducts}>Save Sorting</Button></span>
                  :<span style={{float:'right',marginRight:'10px'}} size='small'><Button type="primary" onClick={() => this.setState({enableSorting:true})}>Sorting</Button></span>
                  }

                  {/* <span style={{float:'right',marginRight:'10px'}} size='small'><Button type="primary" onClick={() => this.setState({childdata:[]})}>Clear all config products</Button></span> */}
                  <Popconfirm
                    title="Are you sure? Your current attribute datas will be deleted."
                    onConfirm={()=>
                      Router.push({
                        pathname: '/products/create2config',
                        query: { codeid: Router.router.query.codeid },
                      })
                    }
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span style={{float:'right',marginRight:'10px'}} size='small'><Button type="primary">Regenerate</Button></span>
                  </Popconfirm>
                  
                  
                </h3> 
                <br />
                <div>
                  <p>Upload Images <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={this.state.data.showImagesInConfigProducts} 
                  // onChange={(e)=>this.setState(prevState => ({
                  //           data:{
                  //             ...prevState.data,
                  //             showImagesInConfigProducts:e
                  //           }
                  //         }))} 
                  onChange={(e)=>this.updateUplodImagesStatus(e)}
                  />
                          
                          </p>
                </div>
                <br/>
                <br />
                <br />

                {this.state.enableSorting
                ?
                <ReactSortable list={this.state.childdata} 
                  setList={collection => {
                    this.setState(prevState => ({
                        ...prevState.childdata,
                        childdata: collection
                    }))
                  }}
                  animation={200}
                  delayOnTouchStart={true}
                  delay={2}
                >



                  {this.state.childdata.map((configdata) => (
                      <div key={configdata.sku}   style={{cursor:'move'}}>

                        <FormGroup >
                          <Form.Field width={1}>
                            <br />
                            <br />

                            <label><img src="https://img.icons8.com/color/30/000000/resize-four-directions.png"/> </label>
                          </Form.Field>

                          

                          <Form.Field width={9} draggable={false}>
                            <br />
                            <label>Name ({configdata.totalconfigattribute})</label>
                            <input id={`id${configdata.sku}`} value={configdata.name} onChange={(e)=>this.handleConfigChange(configdata,`id${configdata.sku}`, 'name')}  required disabled/>
                            {/* <input type="text" value={configdata.name} onChange={this.handleConfigDataChange} style={{zIndex:'99999'}} required/> */}

                          </Form.Field>

                          <Form.Field width={2} draggable={false}>
                            <br />
                            <label>Main Price</label>
                            <input type="number" value={configdata.pricedisplay}  required disabled/>
                          </Form.Field>

                          <Form.Field width={2}>
                            <br />
                            <label>Price</label>
                            <input type="number" value={configdata.pricemain[0]}  required disabled/>
                          </Form.Field>

                          <Form.Field width={2}>
                            <br />
                            <label>Stock</label>
                            <input type="number" value={configdata.stock}  required disabled/>
                          </Form.Field>

                          {/* <Popconfirm
                            title={`Are you sure to delete ${configdata.totalconfigattribute}?`}
                            onConfirm={()=>this.handleConfigDeleteProduct(configdata)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button type="primary" danger icon={<DeleteOutlined />} style={{padding:'8px',marginTop:'46px'}}/>
                          </Popconfirm> */}
                          
                        </FormGroup>
                      </div>
                    ))}
                </ReactSortable>
                :
                <>
                
                  {this.state.childdata.map((configdata,key) => (
                      <div key={configdata.sku}>

                        <FormGroup >

                          <Form.Field width={2} hidden={this.state.data.showImagesInConfigProducts?false:true}>
                            
                              {this.state.configImageLoaderId.includes(configdata._id)
                              ?
                              <center>
                                <img src='https://www.effia.com/themes/custom/effia_theme/images/throbber.gif' style={{height:'53px', margin:'30px 0px'}} /> 
                              </center>
                              :
                              <>
                              <label for={configdata._id}>
                                <center>
                                  {configdata.images.length===0
                                  ?<img src="https://ik.imagekit.io/nextjsecommerce/OTHER_IMAGES/noimage" style={{width:'100px',border:'1px solid #cccccc'}}/>
                                  :<img src={`${configdata.images[0].url}?tr=w-100,h-100,q-10`}/>
                                  }
                                </center>
                              </label>
                              <center style={{color:'#4caf50'}}>{configdata.images.length} files 
                                {configdata.images.length===0
                                ?<></>
                                :<DrawerConfigProductImageView data={configdata} childDataImageSort={this.childDataImageSort} handleDeleteChildDataImages={this.handleDeleteChildDataImages} disabledImageDeleteOption={this.state.disabledImageDeleteOption} />
                                }
                                
                              </center>
                              <div className="ui input">
                                <input id={configdata._id} type="file" onChange={ (e) => this.configImageChange(e.target.files, configdata._id) } multiple={true} hidden />
                              </div>
                              </>
                              }
                              
                            
                            
                          </Form.Field>

                          <Form.Field width={this.state.data.showImagesInConfigProducts?8:10} draggable={false}>
                            <br />
                            <label>Name ({configdata.totalconfigattribute})</label>
                            <input id={`id${configdata.sku}`} value={configdata.name} onChange={(e)=>this.handleConfigChange(configdata,`id${configdata.sku}`, 'name')} required/>
                          </Form.Field>


                          <Form.Field width={2} draggable={false}>
                            <br />
                            <label>Display Price</label>
                            <input type="number" id={`iddp${configdata.sku}`} value={configdata.pricedisplay} onChange={(e)=>this.handleConfigChange(configdata,`iddp${configdata.sku}`, 'pricedisplay')}  required/>
                          </Form.Field>

                          <Form.Field width={2}>
                            <br />
                            <label>Main Price</label>
                            <input type="number" id={`idmainp${configdata.sku}`} value={configdata.pricemain[0]} onChange={(e)=>this.handleConfigChangepricemain(configdata,`idmainp${configdata.sku}`, 'pricemain')}  required/>
                          </Form.Field>

                          <Form.Field width={2}>
                            <br />
                            <label>Stock</label>
                            <input type="number" id={`idsto${configdata.stock}`} value={configdata.stock} onChange={(e)=>this.handleConfigChange(configdata,`idsto${configdata.sku}`, 'stock')}  required/>
                          </Form.Field>

                         
                          <Popconfirm
                            title={`Are you sure to delete ${configdata.totalconfigattribute}?`}
                            onConfirm={()=>this.handleConfigDeleteProduct(configdata)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button type="primary" danger icon={<DeleteOutlined />} style={{padding:'8px',marginTop:'46px'}}/>
                          </Popconfirm>
                        </FormGroup>
                      </div>
                    ))}
                </>
                }
                


                

                
              </div>
              
              <br />
                <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Images / Videos</h3>

                {this.state.imageLoading
                ?
                <center>
                  <img src='https://www.effia.com/themes/custom/effia_theme/images/throbber.gif' style={{height:'73px', margin:'60px'}} />
                </center>
                :
                <Dropzone 
                  onDrop={this.onDrop}
                >
                  {({getRootProps, getInputProps}) => (
                    <section className="dropzonecontainer">
                      <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} />
                        
                        <p>
                        <center>
                          <img src='https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Logo-Transparent-File.png' />
                        </center>
                        <br/>
                          Drag and drop images here, or click to select files</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
                }

                <br />
                <br />
                <br />


                <ReactSortable list={this.state.data.images} 
                  setList={collection => {
                    this.updateSortingImage(collection)
                  }}
                  animation={200}
                  delayOnTouchStart={true}
                  delay={2}
                >
                        {this.state.data.images.map((img)=>{
                          return(
                              <Grid key={img.fileId}   style={{cursor:'move'}}>
                                  <Grid.Column computer={1}>
                                      <br />
                                      <br />
                                      <label><img src="https://img.icons8.com/color/30/000000/resize-four-directions.png" style={{cursor:'move'}}/> </label>
                                  </Grid.Column>
                                  <Grid.Column computer={2} >
                                      <img src={`${img.url}?tr=w-100,h-100,q-10`}  />
                                  </Grid.Column>
                                  <Grid.Column computer={12} >
                                      <p style={{marginTop:'35px'}}><a href={img.url} target={'_blank'}>{img.url}</a> </p>
                                      
                                  
                                  </Grid.Column>
                                  <Grid.Column computer={1} >
                                      <br />
                                      <br />

                                      <Button type="primary"
                                          danger icon={<DeleteOutlined />}
                                          onClick={()=>this.handleDeleteImage(img)}
                                          disabled={this.state.disabledImageDeleteOption?true:false}
                                      />
                                  </Grid.Column>
                              </Grid>
                          )
                        })}
                </ReactSortable>



                  
                
                <br />
                <br />
                <br />


                <Form.Input id='idyoutube' fluid label="Youtube Video URL" placeholder="Enter youtube video URL and Click Enter" />
                <Button type="primary" onClick={()=>this.addYoutubeURL()}>Add</Button>


                <br />
                <br />

                {/* <VideoSorting videos={this.state.data.videos} updateSortingVideos={this.updateSortingVideos} /> */}

                {/* <ReactSortable list={this.state.data.videos} 
                  setList={collection => {
                    this.updateSortingVideos(collection)
                  }}
                      animation={200}
                      delayOnTouchStart={true}
                      delay={2}
                    > */}
                    <Grid >
                      {this.state.data.videos.map((video,key)=>{
                        return(
                            
                          <Grid.Column computer={8} key={key}>
                            <iframe
                                width={'100%'}
                                height={300}
                                src={video.url}
                                title="YouTube video "
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen={true}
                            />
                            <Button type="primary"
                              fluid
                              danger icon={<DeleteOutlined />}
                              onClick={()=>this.handleDeleteVideo(video)}
                            />
                          </Grid.Column>
                        )
                      })}
                      </Grid>

            {/* </ReactSortable> */}



            {/* <YouTube videoId="2g811Eo7K8U" opts={opts} /> */}

               
                    
                {/* {this.state.data!==null
                ?
                
                <ReactSortable list={this.state.data.images} 
                  setList={collection => {
                    this.setState(prevState => ({
                        ...prevState.data,
                        data:{
                          images: collection
                        }
                    }))
                  }}
                  animation={200}
                  delayOnTouchStart={true}
                  delay={2}
                >
                  {this.state.data.images.map((img) => (
                      <Grid key={img.fileId}   style={{cursor:'move'}}>
                        <Grid.Column computer={2} >
                          <img src={img.url}  />
                        </Grid.Column>
                        <Grid.Column computer={13} >
                          <p style={{lineHeight:'3px',marginTop:'10px'}}><b>Main Image:</b> <a href={img.url} target={'_blank'}>{img.url}</a> </p>
                          <p style={{lineHeight:'3px'}}><b>Thumbnail Image:</b> <a href={img.url} target={'_blank'}>{img.url}</a> </p>
                          <p style={{lineHeight:'3px'}}><b>Small Image:</b> <a href={img.url} target={'_blank'}>{img.url}</a> </p>
                        </Grid.Column>
                        <Grid.Column computer={1} >
                          <Button type="primary" danger icon={<DeleteOutlined />}  onClick={()=>this.handleConfigDeleteProduct(img)} />
                        </Grid.Column>
                      </Grid>
                    ))}
                </ReactSortable>
                :
                <></>} */}

                </div>


              <br />




              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Advance Information</h3>
                  <Form.Group widths="equal">
                    <Form.Field label="Return Available?" control="select">
                      <option value="Simple">Simple</option>
                      <option value="Variable">Variable</option>
                    </Form.Field>
                    <Form.Field label="Warranty Available?" control="select">
                      <option value="Simple">Simple</option>
                      <option value="Variable">Variable</option>
                    </Form.Field>
                    <Form.Field label="Tax" control="select">
                      <option value="Simple">Simple</option>
                      <option value="Variable">Variable</option>
                    </Form.Field>
                  </Form.Group>
                  <FormGroup widths="equal">
                  <Form.Input
                    fluid
                    label="Minimum Order"
                    placeholder="Product Name"
                  />
                  <Form.Input
                    fluid
                    label="Maximum Order"
                    placeholder="Product Name"
                  />
                </FormGroup>
              </div>
              <br />

              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Custom Attributes</h3>
                
                  {this.props.allattributes.map((attr,key)=>{
                    if(attr.isconfigproduct==='No'){

                      
                      //CHECK IF TEXT
                      if(attr.type==='Text'){
                        return(
                        <>
                          <Form.Input fluid label={attr.name} placeholder={`Product ${attr.name}`} name={attr.name} value={this.state.data[attr.name]} onChange={this.handleChange} />
                          {attr.isrequired==='Yes'
                          ?
                          <>
                          {this.validator.message(`Product ${attr.name}`, this.state.data[attr.name], 'required')}
                          </>
                          :<></>}
                        </>
                        )
                      }

                      
                      //CHECK IF SINGLE DROPDOWN
                      if(attr.type==='Single Dropdown'){
                        return(
                          <>
                          <Form.Field label={attr.name} control="select" name={attr.name} value={this.state.data[attr.name]} onChange={this.handleChange}>
                            <option value="">Select {attr.name}</option>
                            {attr.datasarray.map((dta,key)=>{
                              return(
                                <option value={dta} key={key}>{dta}</option>
                              )
                            })}
                          </Form.Field>
                          </>
                        )
                      }

                      


                      //CHECK IF MULTIPLE DROPDOWN
                      if(attr.type==='Multiple Dropdown'){

                     

                        return(
                          <>
                          <Form.Field label={attr.name} control="select" multiple name={attr.name}
                          // value={this.state.data[attr.name]} 
                          onChange={this.handleMultipleDropDownChange}>
                            <option value="">Select {attr.name}</option>
                            {attr.datasarray.map((dta,key)=>{
                              return(
                                <option value={dta} key={key}>{dta}</option>
                              )
                            })}
                          </Form.Field>

                         
                          </>
                        )
                      }


                      //CHECK IF RADIO
                      if(attr.type==='Radio'){
                        return(
                          <>
                          <Form.Group grouped>
                              <label>{attr.name}</label>
                              {attr.datasarray.map((dta,key)=>{
                                  return(
                                    <Form.Field
                                      key={key}
                                      control={Radio}
                                      label={dta}
                                      checked={this.state.data[attr.name] === dta}
                                      onChange={()=>this.handleRadioChange(attr.name,dta)}
                            
                                    /> 
                                  )
                            })}
                          </Form.Group>
                          </>
                        )
                      }


                      if(attr.type==='Checkbox'){
                        return(
                          <Form.Group grouped>
                              <label>{attr.name} </label>
                              {attr.datasarray.map((dta,key)=>{
                                  return(
                                      <Form.Field
                                          key={key}
                                          control={Checkbox}
                                          label={dta}
                                          value={this.state.data[attr.name]}
                                          name={attr.name}
                                          checked={
                                              this.state.data[attr.name]===undefined
                                              ?false
                                              :
                                              this.state.data[attr.name].includes(dta)
                                                  ?true:false
                                          }
                                          onClick={(evt,data)=>this.handleCheckboxChange(data, attr.name, dta)}
                                      /> 
                                  )
                              })}
                          </Form.Group>
                        )
                      }







                      
                    }
                  })}


              </div>
              

              <br />

              
              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">SEO Information</h3>
                <Form.Input fluid label="URL" placeholder="Product URL" name='url' value={this.state.data.url} />
                <Form.Input
                  fluid
                  label="Meta Title"
                  placeholder="Product Name"
                  name='meta_title' value={this.state.data.meta_title}
                />
                {this.validator.message(`meta title`, this.state.data.meta_title, 'required|min:2|max:70')}
                <Form.Field
                  fluid
                  label="Meta Descripion"
                  control="textarea"
                  rows="3"
                  name='meta_desc' value={this.state.data.meta_desc}
                />
                <Form.Input
                  fluid
                  label="Meta Title"
                  placeholder="Product Name"
                  name='meta_key' value={this.state.data.meta_key}
                />

                <br />
                <div className="googlesearchres">
                  <h6>www.kafesta.com/{this.state.data.url}</h6>
                  <h3>{this.state.data.meta_title}</h3>
                  <p>{this.state.data.meta_desc}</p>
                  <h5>{this.state.data.meta_key}</h5>

                </div>

                <br/>


              </div>
              </>
              }
              </div>

              </Grid.Column>
                <Grid.Column mobile={16} tablet={4} computer={4}>
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Publish</h3>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button type="primary" htmlType="submit">Delete</Button>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Status</h3>
                      <Form.Field control="select">
                        <option value="Simple">Active</option>
                        <option value="Variable">InActive</option>
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Brand</h3>
                      <Form.Field control="select">
                        <option value="">Select Brand</option>
                        {this.props.allbrands.map((brand,key)=>{
                          return(
                            <option value={brand._id} key={key}>{brand.brand_name}</option>
                          )
                        })}
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Collections</h3>
                      <Form.Field control="select">
                        <option value="New Arrival">New Arrival</option>
                        <option value="Best Sellers">Best Sellers</option>
                        <option value="Special Offer">Special Offer</option>
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Labels</h3>
                      <Form.Field control="select">
                        <option value="New Arrival">Hot</option>
                        <option value="Best Sellers">New</option>
                        <option value="Special Offer">Sale</option>
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Tax</h3>
                      <Form.Field control="select">
                        <option value="New Arrival">1</option>
                        <option value="Best Sellers">2</option>
                        <option value="Special Offer">3</option>
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3>Category</h3>
                      {this.props.allcategory.map((cat,ckey)=>{
                        return(
                          <div key={ckey}>
                            <Form.Field
                              control={Checkbox}
                              label={`${ckey+1}- ${cat.name}`}
                              // checked={true}
                              onClick={(evt, data)=>this.onChangeCategoryCheckbox(evt, data, 'category', cat.name)}
                            />
                            

                                {_.filter(this.props.allsubcategory,{ 'category': cat._id }).map((scat,sckey)=>{
                                  return(
                                    <div key={sckey} style={{marginLeft:'25px'}}>
                                      <Form.Field
                                        control={Checkbox}
                                        label={`${ckey+1}.${sckey+1}- ${scat.name}`}
                                      />
  
                                        {_.filter(this.props.allchildcategory,{ 'category': cat._id,'subcategory':scat._id }).map((ccat,scckey)=>{
                                          return(
                                            <div key={scckey} style={{marginLeft:'45px'}}>
                                              <Form.Field
                                                control={Checkbox}
                                                label={`${ckey+1}.${sckey+1}.${scckey}- ${ccat.name}`}
                                              />
                                                  <div style={{marginButtom:'1px'}}/>
                                            </div>
                                          )
                                        })}
                                        <div style={{marginButtom:'2px'}}/>
                                    </div>
                                  )
                                })}
                          <div style={{marginButtom:'10px'}}/>
                          </div>
                          
                        )
                      })}
                    </div>
                  </div>
                </Grid.Column>
              </Grid>

              
              
            </Form>
          </div>
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
  allattributes:state.all_attributes,
  allcategory:state.all_category,
  allsubcategory:state.all_subcategory,
  allchildcategory:state.all_childcategory,
  allbrands:state.all_brands
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands})(create3config);
