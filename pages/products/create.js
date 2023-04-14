import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Form,
  FormGroup,
  Input,
  Radio,
  Select,
  TextArea,
} from "semantic-ui-react";
import { Layout, Breadcrumb,Button, message,PageHeader } from "antd";
import SimpleReactValidator from 'simple-react-validator';
import axios from "axios";
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ArrowRightOutlined } from "@ant-design/icons";
const { Content } = Layout;

export class create1 extends Component {


  constructor(props){
    super(props)
    this.state={
      formLoading:false,
      sku:'',
      name:'',
      url:'',
      type:'Simple',
      status:'Pending',
      issubtype:'No',
    }
    this.validator = new SimpleReactValidator();
  }


  toSeoUrl(url) {
    // make the url lowercase
    var encodedUrl = url.toString().toLowerCase();
    // replace & with and
    encodedUrl = encodedUrl.split(/\&+/).join("-and-")
    // remove invalid characters
    encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");
    // remove duplicates
    encodedUrl = encodedUrl.split(/-+/).join("-");
    // trim leading & trailing characters
    encodedUrl = encodedUrl.trim('-');
    return encodedUrl;
  }


  handleChnage=e=>{

    if(e.target.name==='name'){
      this.setState({
        [e.target.name]:e.target.value,
        url:this.toSeoUrl(e.target.value)
      })
    }else{
      this.setState({
        [e.target.name]:e.target.value
      })
    }


    
  }


  componentDidMount(){
    let attributes = {
      color: ['Red', 'Blue'],
      sizes: ['Small', 'Medium', 'Large'],
      // material: ['Cotton', 'Wool'],
      // gender: ['Men', 'Women'],
      // type: ['Casual', 'Sport']
    };
    
    
    let attrs = [];
    
    for (const [attr, values] of Object.entries(attributes))
      attrs.push(values.map(v => ({id:122,[attr]:v})));
    
    attrs = attrs.reduce((a, b) => a.flatMap(d => b.map(e => ({...d, ...e}))));
    
    console.log(attrs);
  }



  handleSubmit = () => {

    if (this.validator.allValid()) {
      this.setState({formLoading:true})

      var datas=this.state;
      if(datas.type==='Simple'){
        datas.step='step2simple'
      }

      if(datas.type==='Configurable'){
        datas.step='step2config'
      }



      axios.post(`${process.env.backendURL}/product/create1`,datas)
      .then(response=>{
        console.log(response.data)
        if(response.data.response){
          if(this.state.type==='Configurable'){
            Router.push({
              pathname: '/products/create2config',
              query: { codeid: response.data.data._id },
            })
          }
          if(this.state.type==='Simple'){
            Router.push({
              pathname: '/products/create2simple',
              query: { codeid: response.data.data._id },
            })
          }


        }else{
          this.setState({formLoading:false})

          if(response.data.message==='url_available'){
            message.warning('Please try with diffrent URL')
          }

          if(response.data.message==='sku_available'){
            message.warning('Please try with diffrent SKU')
          }
          
        }
      })


      // this.setState({
      //   formLoading:true
      // })
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
    
  }

  render() {
    return (
      <Body>
        <Head><title>Create Product</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link href='/products'>Products</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Create</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Add New Product"
            onBack={() => Router.push('/products')}
            // breadcrumb={{ routes }}
            // subTitle="This is a subtitle"
            // extra={[<Link href='/products/create'><Button type='primary' icon={<PlusOutlined />}>Create Product</Button></Link>]}
          >
          </PageHeader>
          <br />
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Form onSubmit={this.handleSubmit} loading={this.state.formLoading}>
              <div>
                <h4 className="text-primary">Basic Information</h4>

                  <Form.Input fluid label="Product Name" placeholder="Product Name" onChange={this.handleChnage} name='name' value={this.state.name} />
                  <span className="myerrormessage">
                    {this.validator.message('product name', this.state.name, 'required|min:2|max:500')}
                  </span>


                  <Form.Input fluid label="Product URL" placeholder="Product URL" onChange={this.handleChnage} name='url' value={this.state.url} />
                  <span className="myerrormessage">
                    {this.validator.message('product url', this.state.url, 'required|min:5|max:500')}
                  </span>
                  
                  <Form.Input fluid label="Product SKU" placeholder="Product SKU" onChange={this.handleChnage} name='sku' value={this.state.sku} />
                  <span className="myerrormessage">
                    {this.validator.message('product sku', this.state.sku, 'required|min:5')}
                  </span>
                
                  <Form.Field label="Product Type" control="select" onChange={this.handleChnage} name='type' value={this.state.type}>
                    <option value="Simple">Simple</option>
                    <option value="Configurable">Configurable</option>
                  </Form.Field>
                  <span className="myerrormessage">
                    {this.validator.message('product type', this.state.type, 'required')}
                  </span>
                
                <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} >
                    Next
                </Button>
              </div>

              
            </Form>
          </div>
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(create1);
