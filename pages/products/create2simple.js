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
import { Layout, Breadcrumb,Button, message, notification, PageHeader, Popconfirm  } from "antd";
import { ApiFilled, DeleteOutlined, PlusOutlined, RetweetOutlined, SaveOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ImageUplaod from "../components/products/ImageUplaod";
import axios from "axios";
import Router from "next/router";
import { ReactSortable } from "react-sortablejs";
import _, { forEach, result } from 'lodash'
import {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands,fetchTaxes} from '../../store/actions'
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
import { data } from "jquery";
import CurrencyInput from 'react-currency-input';
import CurrencyFormat from 'react-currency-format';
import Link from "next/link";
import Head from "next/head";
import ProductReview from "./ProductReview";
const { Content } = Layout;

export class create2simple extends Component {

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
        this.props.fetchTaxes();

        this.fetchProductInformation(); 
        this.seenReviewsUnderthisProduct();         

    }


    seenReviewsUnderthisProduct(){
      axios.get(`${process.env.backendURL}/product/admin_seen_allreviews_under_product/${Router.router.query.codeid}`)
      .then(response=>{

      })
    }
    

    



    fetchProductInformation=(type)=>{

    
      axios.get(`${process.env.backendURL}/product/configproductlist_both_parent_child/${Router.router.query.codeid}`)
        .then(response=>{

            if(response.data.parentdata!==null){
              

              if(type===undefined){
                this.setState({
                  formLoading:false,
                  _id:Router.router.query.codeid,
                  data:response.data.parentdata,
                  childdata:_.orderBy(response.data.childdata, o => parseInt(o.order), 'asc'),
                  // childdata:[]                
                })
              }


              if(type==='images'){

                this.setState(prevState => ({
                  formLoading:false,
                  _id:Router.router.query.codeid,
                  data:{
                    ...prevState.data,
                    images:response.data.parentdata.images
                  }
                }))
              }

            }else{
                message.warning('Wrong product')
                Router.push('/products/create')
            }
        })
    }

    // fetchChildProductInformation=()=>{
      
    //   axios.get(`${process.env.backendURL}/product/configproductlist_both_parent_child/${Router.router.query.codeid}`)
    //     .then(response=>{

    //         if(response.data.parentdata!==null){
    //           this.setState({
    //               formLoading:false,
    //               _id:Router.router.query.codeid,
    //               childdata:_.orderBy(response.data.childdata, o => parseInt(o.order), 'asc'),
    //               // childdata:[]                
    //           })

    //         }else{
    //             message.warning('Wrong product')
    //             Router.push('/products/create')
    //         }
    //     })
    // }

    

    handleChnagePriceMain = e => {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          pricemain:[Number(e.target.value)],
          price_lowest:Number(e.target.value),
          price_heighest:Number(e.target.value),
          // pricemain:[Number(e.target.value).toFixed(2)],
          // price_lowest:Number(e.target.value.toFixed(2)),
          // price_heighest:Number(e.target.value.toFixed(2)),
        }
      }))

    }

    handleChnagePriceDisplay = (e,name) => {

      // this.setState(prevState => ({
      //   data: {
      //     ...prevState.data,
      //     [name]:Number(e),
      //     // [e.target.name]:Number(e.target.value).toFixed(2),
      //   }
      // }))

      console.log(e.target)
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          [e.target.name]:Number(e.target.value),
          // [e.target.name]:Number(e.target.value).toFixed(2),
        }
      }))

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
          type:'ConfigurableChild',
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

          console.log(response.data.data)

          var childdatasstate=this.state.childdata;
          childdatasstate.push(response.data.data);

          if(response.data.response){
            this.setState({modal:false,childdata:childdatasstate})
            message.success('Added');
            // this.fetchChildProductInformation();
          }
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

          if(this.state.childdata.length>1){
            this.setState({disabledImageDeleteOption:true})
            axios.get(`${process.env.backendURL}/product/delete_product/${e._id}`)
            .then(response=>{
              this.setState({disabledImageDeleteOption:false})
              message.success('Removed');
              this.fetchChildProductInformation();
            })
          }else{
            message.warning(`You can't delete all attribute data.`)
          }

          
          


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

      // console.log(data);
      // console.log(id);
      // console.log(name);


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



    // handleChangeConfigSingle=e=>{
    
    //   this.setState(prevState => ({
    //     data: {
    //       ...prevState.data,
    //         // myattributes:{
    //         //   ...prevState.data.myattributes,
    //           [e.target.name]:[e.target.value]
    //         // }
    //     },
    //   }));
    // }


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


    handleChangeConfigMultiple = (e,result) => {
      const { name, value } = result;

      this.setState(prevState => ({
        data: {
          ...prevState.data,
            myattributes:{
              ...prevState.data.myattributes,
              [name]:value
            }
        },
      }));

    }


    handleMultipleDropDownChange=(e, result)=>{

      const { name, value } = result;
          this.setState(prevState => ({
            data: {
                ...prevState.data,
                [name]:value
            },
          }));

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



    onChangeCheckbox = (evt, data, name, value) => {
      let checked = data.checked
      console.log(checked)
      console.log(name)
      console.log(value)


      var checks=this.state.data[name];
      if(checked){ //if checked

        if(checks.includes(value)){
        }else{
          checks.push(value)
        }

      }else{
        if(checks.includes(value)){
          var data_index=checks.indexOf(value);
          checks.splice(data_index,1)
        }else{
          
        }
      }

      

    this.setState(prevState => ({
      data: {
          ...prevState.data,
          [name]:checks
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

      console.log(collection)

      // childdata.forEach((element,key) => {
      //   if(element._id===id){
      //     element.images=collection
      //   }
      // });
      // this.setState({
      //   childdata
      // })



      var childdatasstate=this.state.childdata;
        childdatasstate.map((cdd,key)=>{
          if(cdd._id===id){
            childdatasstate[key].images=collection
          }
        })
        this.setState({
          childdata:childdatasstate,
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
      // alert(111)
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

       
        console.log(response.data.data)

        //UPDATE SINGLE PRODUCT IMAGES
        var childdatasstate=this.state.childdata;
        childdatasstate.map((cdd,key)=>{
          if(cdd._id===response.data.data._id){
            childdatasstate[key].images=response.data.data.images
          }
        })

        console.log(childdatasstate)

      
        this.setState({
          childdata:childdatasstate,
          disabledImageDeleteOption:false
        })






        // this.fetchChildProductInformation();
        message.success('Removed');
        // this.setState({
        //   childdata,
        //   disabledImageDeleteOption:false
        // })
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

      // this.configImageLoader(product_id);

      var totalfiles=[];
      
      if(files.length>5){
        // message.warning(`Max upload 5 files at a time`)
        notification.warning({
          duration:10,
          message:'Failed',
          description:`You can't upload more than 5 file at a time`
        })
      }else{
      this.configImageLoader(product_id);

       
        //==== STEP 1
        files.forEach(file => {
          // console.log(file)
        
          if(file.type==='image/jpg' || file.type==='image/jpeg' || file.type==='image/png' || file.type==='image/webp'){
            if (file.size >= 20971520){ //20mb
               
              message.warning(`${file.path} size is more than 20mb.`)

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
            // this.fetchChildProductInformation();



            //UPDATE SINGLE PRODUCT IMAGES
            var childdatasstate=this.state.childdata;
            childdatasstate.map((cdd,key)=>{
              if(cdd._id===response.data.data._id){
                childdatasstate[key].images=response.data.data.images
              }
            })

          
            this.setState({
              childdata:childdatasstate
            })
            
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
            this.fetchProductInformation('images');

            count=count+1
            if(count===totalfiles.length){
              this.setState({imageLoading:false})
            }
          })
  
        });
      }else{
        this.setState({
          imageLoading:false
        })
      }

    
    }


    handleSubmit=e=>{
      


      if (this.validator.allValid()) {

        var data=this.state.data;

        
        var temp_data={
          _id:this.state.data._id,
          data,
        }

        console.log(temp_data)
  
       axios.post(`${process.env.backendURL}/product/update_simple_product`, temp_data)
       .then(response=>{
          message.success('Success')
          Router.push('/products')

       })




      } else {
        this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
      }

    }


    handleDeleteProduct=e=>{
      // alert(this.state.data._id);
      this.setState({formLoading:true,})

      axios.get(`${process.env.backendURL}/product/delete_product/${this.state.data._id}`)
      .then(response=>{
        if(response.data.response){
          message.success('Success')
          Router.push('/products')
        }else{
          message.warning(response.data.message)
          this.setState({formLoading:false})
        }
      })


      
    }

   


  render() {
    const taxoptions = this.props.alltaxes.map((dta,key)  =>{
      return{
        key:key, text:dta.name, value:dta._id
      }
    })
    return (
      <Body>
        <Head><title>Edit Product</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link href='/products'>Products</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Edit</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Edit Product"
            onBack={() => Router.push('/products')}
            // breadcrumb={{ routes }}
            // subTitle="This is a subtitle"
            // extra={[
            //   <Button type="primary" onClick={()=>document.getElementById('submit_9098780').trigger('click')} icon={<SaveOutlined />}>Update</Button>,
            //   <Popconfirm
            //     placement="top"
            //     title={`Are you sure want to delete this product?`}
            //     onConfirm={this.handleDeleteProduct}
            //     okText="Yes"
            //     cancelText="No"
            //   >
            //     <Button type="primary" danger htmlType="submit" icon={<DeleteOutlined />}>Delete</Button>
            //   </Popconfirm>
            // ]}
          >
          </PageHeader>
          <br />
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
                <Form.Input fluid label="Name" placeholder="Product Name" name="name" value={this.state.data.name} onChange={this.handleChange} required
                />

                <Form.Input fluid label="SKU" placeholder="Product SKU" name="sku" value={this.state.data.sku}  required/>
              
                <Form.Field>
                <label>Description</label>
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
              </div>

                <br />
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
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.addYoutubeURL()}>Add</Button>


                <br />
                <br />

                
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


                </div>


              <br />

              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Price Information</h3>
                  <FormGroup widths="equal">
                  <Form.Input
                    fluid
                    type='number'
                    label="Display Price"
                    placeholder="Display Price"
                    name='pricedisplay'
                    // defaultValue={this.state.data.pricedisplay}
                    value={this.state.data.pricedisplay}
                    onChange={this.handleChnagePriceDisplay}
                    presicion={2}
                    // step='any'

                  />

{/* 
              <div className="field">
                <label>Display Price</label>
                <div className="ui fluid input">
                  <CurrencyFormat name='pricedisplay' placeholder="Display Price" value={this.state.data.pricedisplay} 
                  thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={2} onValueChange={(e)=>this.handleChnagePriceDisplay(e.value,'pricedisplay')}
                  />
                </div>

              </div> */}


                  <Form.Input
                    fluid
                    type='number'
                    label="Main Price"
                    placeholder="Main Price"
                    name='pricemain'
                    defaultValue={this.state.data.pricemain[0]}
                    onChange={this.handleChnagePriceMain}
                    step='any'
                    required
                  />

                  <Form.Input
                    fluid
                    type='number'
                    label="Stock"
                    placeholder="Stock"
                    name='stock'
                    value={this.state.data.stock}
                    onChange={this.handleChange}
                    required
                  />
                </FormGroup>
              </div>
              <br />


              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Advance Information</h3>
                  <Form.Group widths="equal">
                    <Form.Field label="Return Available?" control="select" name="return_available" value={this.state.data.return_available} onChange={this.handleChange} required>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Field>
                    <Form.Field label="Warranty Available?" control="select" name="warranty_available" value={this.state.data.warranty_available} onChange={this.handleChange} required>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Field>
                  </Form.Group>
                  {/* <FormGroup widths="equal">
                  <Form.Input
                    fluid
                    label="Minimum Order"
                    placeholder="Minimum Order"
                    type="number"
                    min={1}
                    name="minimum_order" value={this.state.data.minimum_order} onChange={this.handleChange} required
                  />
                  <Form.Input
                    fluid
                    label="Maximum Order"
                    placeholder="Maximum Order"
                    type="number"
                    min={1}
                    name="maximum_order" value={this.state.data.maximum_order} onChange={this.handleChange} required
                  />
                </FormGroup> */}
              </div>
              <br />

              <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">Custom Attributes</h3>
                
                  {this.props.allattributes.map((attr,key)=>{
                    // if(attr.isconfigproduct==='No'){

                      
                      //CHECK IF TEXT
                      if(attr.type==='Text'){
                        return(
                          <Form.Input fluid 
                            label={attr.name} 
                            placeholder={`Product ${attr.name}`} 
                            name={attr._id} 
                            value={this.state.data[attr._id]} 
                            onChange={this.handleChange} 
                            required={attr.isrequired==='Yes'?true:false} 
                            key={key}
                          />
                       
                        )
                      }


                      //CHECK IF SINGLE DROPDOWN
                      if(attr.type==='Single Dropdown'){
                        return(
                          <Form.Field key={key} label={attr.name} control="select" name={attr._id} value={this.state.data[attr._id]} onChange={this.handleChange}  required={attr.isrequired==='Yes'?true:false}>
                            <option value="">Select {attr.name}</option>
                            {attr.attrbutes_list.map((dta)=>{
                              return(
                                <option value={dta._id} key={dta._id}>{dta.name}</option>
                              )
                            })}
                          </Form.Field>
                        )
                      }


                      //CHECK IF MULTIPLE DROPDOWN
                      if(attr.type==='Multiple Dropdown'){
                        const options = attr.attrbutes_list.map((dta,key)  =>{
                          return{
                            key:key, text:dta.name, value:dta._id
                          }
                        })
                        return(
                          <div className="field" key={key}>
                            <label>{attr.name}</label>
                            <Dropdown fluid multiple selection options={options} name={attr._id} 
                            value={this.state.data[attr._id]} 
                            onChange={this.handleMultipleDropDownChange}
                            required={attr.isrequired==='Yes'?true:false}
                            />
                          </div>
                        )
                      }


    
                      //CHECK IF RADIO
                      // if(attr.type==='Radio'){
                      //   return(
                      //     <>
                      //     <Form.Group grouped>
                      //         <label>{attr.name}</label>
                      //         {attr.attrbutes_list.map((dta,key)=>{
                      //             return(
                      //               <Form.Field
                      //                 key={dta._id}
                      //                 control={Radio}
                      //                 label={dta.name}
                      //                 name={attr._id}
                      //                 checked={this.state.data[attr._id] === dta._id}
                      //                 onChange={()=>this.handleRadioChange(attr._id,dta._id)}
                      //                 required={attr.isrequired==='Yes'?true:false}
                      //               /> 
                      //             )
                      //       })}
                      //     </Form.Group>
                      //     </>
                      //   )
                      // }


                      // if(attr.type==='Checkbox'){
                      //   return(
                      //     <Form.Group grouped>
                      //         <label>{attr.name} </label>
                      //         {attr.attrbutes_list.map((dta,key)=>{
                      //             return(
                      //                 <Form.Field
                      //                     key={key}
                      //                     control={Checkbox}
                      //                     label={dta.name}
                      //                     value={this.state.data[attr._id]}
                      //                     name={attr._id}
                      //                     checked={
                      //                         this.state.data[attr._id]===undefined
                      //                         ?false
                      //                         :
                      //                         this.state.data[attr._id].includes(dta._id)
                      //                             ?true:false
                      //                     }
                      //                     onClick={(evt,data)=>this.handleCheckboxChange(data, attr._id, dta._id)}
                      //                     required={attr.isrequired==='Yes'?true:false}
                      //                 /> 
                      //             )
                      //         })}
                      //     </Form.Group>
                      //   )
                      // }

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
                  name='meta_title' value={this.state.data.meta_title} onChange={this.handleChange} required
                />
                {/* {this.validator.message(`meta title`, this.state.data.meta_title, 'required|min:2|max:70')} */}
                <Form.Field
                  fluid
                  label="Meta Description"
                  control="textarea"
                  rows="3"
                  name='meta_desc' value={this.state.data.meta_desc} onChange={this.handleChange} required
                />
                <Form.Input
                  fluid
                  label="Meta Key"
                  placeholder="Meta Key"
                  name='meta_key' value={this.state.data.meta_key} onChange={this.handleChange}
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

              <br />

              <ProductReview product_id={this.state.data._id} />



              </>
              }
              </div>

              </Grid.Column>

              
              <Grid.Column mobile={16} tablet={4} computer={4}>
              {this.state.data===null
              ?<></>
              :
              <div>
                  {/* <input type='submit' id='submit_9098780-0' /> */}
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Publish</h3>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Update</Button>
                        &nbsp;
                        <Popconfirm
                          placement="top"
                          title={`Are you sure want to delete ${this.state.data.name}`}
                          onConfirm={this.handleDeleteProduct}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" danger htmlType="submit" icon={<DeleteOutlined />}>Delete</Button>

                        </Popconfirm>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Status</h3>
                      <Form.Field control="select" name='status' value={this.state.data.status} onChange={this.handleChange}>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Brand</h3>
                      <Form.Field control="select" name='product_brand' value={this.state.data.product_brand} onChange={this.handleChange}>
                      <option value="">N/A</option>

                        {this.props.allbrands.map((brand,key)=>{
                          return(
                            <option value={brand._id} key={key}>{brand.name}</option>
                          )
                        })}
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Collections</h3>
                      <Form.Field control="select" name='product_collection' value={this.state.data.product_collection} onChange={this.handleChange}>
                      <option value="">N/A</option>
                        <option value="New Arrivals">New Arrivals</option>
                        {/* <option value="Special Offer">Special Offer</option> */}
                        <option value="Trending">Trending</option>
                        {/* <option value="Most Popular">Most Popular</option> */}
                        {/* <option value="Featured Products">Featured Products</option> */}
                        {/* <option value="Todays Deals">Todays Deals</option> */}

                        
                    
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Labels</h3>
                      <Form.Field control="select" name='product_labels' value={this.state.data.product_labels} onChange={this.handleChange}>
                      <option value="">N/A</option>
                      
                        <option value="New">New</option>
                        <option value="Hot">Hot</option>
                        <option value="Sale">Sale</option>
                      </Form.Field>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Tax</h3>
                      <div className="field">
                        <Dropdown fluid multiple selection 
                          options={this.props.alltaxes.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})} 
                          name={'product_tax'} 
                          value={this.state.data.product_tax} 
                          onChange={this.handleMultipleDropDownChange}  
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="site-layout-background" style={{ padding: 24 }}>
                    <div>
                      <h3 className="text-primary">Category</h3>
                      {this.props.allcategory.map((cat,ckey)=>{
                        return(
                          <div key={ckey}>
                            <Form.Field
                              control={Checkbox}
                              label={`${ckey+1}- ${cat.name}`}
                              checked={this.state.data.category.includes(cat._id)?true:false}
                              onClick={(evt, data)=>this.onChangeCheckbox(evt, data, 'category', cat._id)}
                            />
                            

                                {_.filter(this.props.allsubcategory,{ 'category_id': cat._id }).map((scat,sckey)=>{
                                  return(
                                    <div key={sckey} style={{marginLeft:'25px'}}>
                                      <Form.Field
                                        control={Checkbox}
                                        label={`${ckey+1}.${sckey+1}- ${scat.name}`}
                                        checked={this.state.data.subcategory.includes(scat._id)?true:false}
                                        onClick={(evts, datax)=>this.onChangeCheckbox(evts, datax, 'subcategory', scat._id)}
                                      />
  
                                        {_.filter(this.props.allchildcategory,{ 'category_id': cat._id,'subcategory_id':scat._id }).map((ccat,scckey)=>{
                                          return(
                                            <div key={scckey} style={{marginLeft:'45px'}}>
                                              <Form.Field
                                                control={Checkbox}
                                                label={`${ckey+1}.${sckey+1}.${scckey}- ${ccat.name}`}
                                                checked={this.state.data.childcategory.includes(ccat._id)?true:false}
                                                onClick={(evtss, datass)=>this.onChangeCheckbox(evtss, datass, 'childcategory', ccat._id)}
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
                  </div>
                   }
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
  allbrands:state.all_brands,
  alltaxes:state.all_taxes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands,fetchTaxes})(create2simple);
