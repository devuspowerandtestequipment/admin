import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Grid, Table } from 'semantic-ui-react'
import _ from 'lodash'
import { Select, message, InputNumber,Input  } from 'antd';
import axios from 'axios';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link'
import LazyLoad from 'react-lazyload';
import DynamicAmount from '../components/DynamicAmount'

const { TextArea } = Input;

export const ListViewProducts = (props) => {

  const [products,setProducts]=useState(false);

  function getData(){
    axios.get(`${process.env.backendURL}/product/admin_list_view`)
    .then(response=>{
      setProducts(response.data.datas)
    })
  }

  useEffect(()=>{
    getData();
  },[])

  const handleChange = (value,product_id) => {
    axios.post(`${process.env.backendURL}/product/update_product_single_value`,{_id:product_id,product_collection:value===''?'':value})
    .then(response=>{
      if(response.data.response){
        getData();
        message.success('Success');
      }else{
        message.warning('Failed');
      }
    })
  };

  const handleChangeStock = (value,product_id) => {
    

    axios.post(`${process.env.backendURL}/product/update_product_single_value`,{_id:product_id,stock:value===''?0:value})
    .then(response=>{
      if(response.data.response){
        getData();
        message.success('Success');
      }else{
        message.warning('Failed');
      }
    })
  };


  const handleChangeName = (e,product_id) => {

    if(e.target.value){
      axios.post(`${process.env.backendURL}/product/update_product_single_value`,{_id:product_id,name:e.target.value==='No Name'?0:e.target.value})
      .then(response=>{
        if(response.data.response){
          getData();
          message.success('Success');
        }else{
          message.warning('Failed');
        }
      })
    }else{
      message.warning('Please enter some value..')
    }

  }


  function myFunctionTableFilter() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput872");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable9856");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }


  return (
    <div className="site-layout-background" style={{ padding: 24, backgroundColor:'white' }}>

{products
    ?
    <>
    <input type="text" id="myInput872" onKeyUp={myFunctionTableFilter} placeholder="Search for names.." title="Search" />
    <Table  basic='very' id="myTable9856">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Stock</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Collection</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {_.sortBy(products, 'name').map((data,key)=>{
        return(
          <Table.Row>
            <Table.Cell style={{maxWidth:'400px'}}>{key+1} {data.name}</Table.Cell>
            <Table.Cell style={{maxWidth:'150px'}}>{data.sku}</Table.Cell>
            <Table.Cell style={{maxWidth:'800px'}}>{data.type}</Table.Cell>
            <Table.Cell error={data.stock===0?true:false}  style={{maxWidth:'50px'}}>{data.stock}</Table.Cell>
            <Table.Cell style={{maxWidth:'200px'}}>
              {data.type==='Simple' && <DynamicAmount amount={data.price_lowest} />}
              {data.type==='Configurable' && <><DynamicAmount amount={data.price_lowest} /> - <DynamicAmount amount={data.price_heighest} /></>}
              {data.pricemain ? data.type==='ConfigurableChild' && <DynamicAmount amount={data.pricemain[0]} /> : '' }
            </Table.Cell>
            <Table.Cell style={{maxWidth:'100px'}}>{data.product_collection}</Table.Cell>
            <Table.Cell style={{maxWidth:'50px'}}>
              
              {data.step==='step2config'
              ?<a href={`/products/create2config?codeid=${data._id}`} target="_blank" rel="noopener" style={{color:'#307fe2'}}><EditOutlined /></a>
              :<></>}

              {data.step==='step3config'
              ?<a href={`/products/create3config?codeid=${data._id}`} target="_blank" rel="noopener" style={{color:'#307fe2'}}><EditOutlined /></a>
              :<></>}

              {data.step==='step2simple'
              ?<a href={`/products/create2simple?codeid=${data._id}`} target="_blank" rel="noopener" style={{color:'#307fe2'}}><EditOutlined /></a>
              :<></>}

            </Table.Cell>

          </Table.Row>
        )
        })}
          
        </Table.Body>
      </Table>

    {/* {_.sortBy(products, 'name').map((data,key)=>{
      return(
        <LazyLoad height={21} key={data._id}>
        <Grid>
          <Grid.Column mobile={16} computer={6}>
          {key+1} <TextArea defaultValue={data.name} autoSize style={{width:'100%'}} onBlur={(e)=>handleChangeName(e,data._id)} />
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            {data.sku}
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            {data.type}
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            <InputNumber min={0} max={99999} defaultValue={data.stock} onChange={(e)=>handleChangeStock(e,data._id,'stock')} />
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            {data.type==='ConfigurableChild'
              ?<></>
              :
              <Select
                defaultValue={data.product_collection}
                style={{ width: 160 }}
                onChange={(e)=>handleChange(e,data._id,'product_collection')}
                options={[
                  { value: '', label: 'N/A' },
                  { value: 'New Arrivals', label: 'New Arrivals' },
                  { value: 'Special Offer', label: 'Special Offer' },
                  { value: 'Trending', label: 'Trending' },
                  { value: 'Most Popular', label: 'Most Popular' },
                  { value: 'Featured products', label: 'Featured products' },
                  { value: 'Todays Deals', label: 'Todays Deals' },
                ]}
              />
            }
          </Grid.Column>
          <Grid.Column mobile={16} computer={1}>
            {data.step==='step2config'
            ?<Link href={`/products/create2config?codeid=${data._id}`}><EditOutlined />Edit</Link>
            :<></>}

            {data.step==='step3config'
            ?<Link href={`/products/create3config?codeid=${data._id}`}><EditOutlined />Edit</Link>
            :<></>}

            {data.step==='step2simple'
            ?<Link href={`/products/create2simple?codeid=${data._id}`}><EditOutlined />Edit</Link>
            :<></>}
          </Grid.Column>
        </Grid>
        </LazyLoad>
      )
    })} */}
    
    </>
    :
    <>
    <center>
      Loading...
    </center>
    </>}


    {/* {products
    ?
    <>
    {_.sortBy(products, 'name').map((data,key)=>{
      return(
        <LazyLoad height={21} key={data._id}>
        <Grid>
          <Grid.Column mobile={16} computer={6}>
          {key+1} <TextArea defaultValue={data.name} autoSize style={{width:'100%'}} onBlur={(e)=>handleChangeName(e,data._id)} />
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            {data.sku}
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            {data.type}
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            <InputNumber min={0} max={99999} defaultValue={data.stock} onChange={(e)=>handleChangeStock(e,data._id,'stock')} />
          </Grid.Column>
          <Grid.Column mobile={16} computer={2}>
            {data.type==='ConfigurableChild'
              ?<></>
              :
              <Select
                defaultValue={data.product_collection}
                style={{ width: 160 }}
                onChange={(e)=>handleChange(e,data._id,'product_collection')}
                options={[
                  { value: '', label: 'N/A' },
                  { value: 'New Arrivals', label: 'New Arrivals' },
                  { value: 'Special Offer', label: 'Special Offer' },
                  { value: 'Trending', label: 'Trending' },
                  { value: 'Most Popular', label: 'Most Popular' },
                  { value: 'Featured products', label: 'Featured products' },
                  { value: 'Todays Deals', label: 'Todays Deals' },
                ]}
              />
            }
          </Grid.Column>
          <Grid.Column mobile={16} computer={1}>
            {data.step==='step2config'
            ?<Link href={`/products/create2config?codeid=${data._id}`}><EditOutlined />Edit</Link>
            :<></>}

            {data.step==='step3config'
            ?<Link href={`/products/create3config?codeid=${data._id}`}><EditOutlined />Edit</Link>
            :<></>}

            {data.step==='step2simple'
            ?<Link href={`/products/create2simple?codeid=${data._id}`}><EditOutlined />Edit</Link>
            :<></>}
          </Grid.Column>
        </Grid>
        </LazyLoad>
      )
    })}
    
    </>
    :
    <>
    
    </>} */}


    
    
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ListViewProducts)