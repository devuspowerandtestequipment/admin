import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Checkbox,Form,Button } from 'semantic-ui-react'
import { Pagination } from 'antd'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';
import _ from 'lodash'
import {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands,fetchTaxes} from '../store/actions'


export class webtypesearch extends Component {


    constructor(props){
        super(props)
        this.state={
            search:{
                category:null,
                subcategory:null,
                childcategory:null,
                size:null,
                color:null,
                group:null,
            },
            page_number: 1,
            total_pages: 1,
            total_datas:1,
            datas_per_page:1,
            datas: null,
            attributes:[],
            myattributes:[],
            defaultattributes:[]
        }
    }

    componentDidMount(){
        // this.getDatas(1,2)
        this.getDatasPagination(this.state)
        this.props.fetchCategories();
        this.props.fetchAttributes();
    }


    getDatasPagination(datas){
        axios.post(`${process.env.backendURL}/product/productsearch/`,datas)
        .then(response=>{
            this.setState({
                datas:response.data.datas,
                page_number:response.data.page_number,
                total_pages:response.data.total_pages,
                total_datas:response.data.total_datas,
                datas_per_page:response.data.datas_per_page,
                attributes:response.data.attributes,
                search:response.data.attributes
            })

            console.log(response.data)
        })
    }


    handleChange = (value) => {
        console.log(value);
    };


    onChangePagination = (pagenum) => {
        var datas=this.state;
        datas.page_number=pagenum;
        this.getDatasPagination(datas)
    }


    handleCheckBoxChange=(e,datacheck,type,name)=>{
        //check if true
        if(datacheck.checked){

            //check available in state myattributes or not
            if(this.state.myattributes[type]===undefined){ //if not available
                this.setState({
                    myattributes:{
                        ...this.state.myattributes,
                        [type]:[name]
                    }
                })
            }else{  //if not available insert new one
                var pushdatas = this.state.myattributes[type];
                pushdatas.push(name);
                this.setState({
                    myattributes:{
                        ...this.state.myattributes,
                        [type]:pushdatas
                    }
                })
            }

            
        }else{

            var pushdatas = this.state.myattributes[type];
            var indexData = pushdatas.indexOf(name);
            pushdatas.splice(indexData,1)

            this.setState({
                myattributes:{
                    ...this.state.myattributes,
                    [type]:pushdatas
                }
            })
        }
    }


    findMinMax(key) {
        const arr=this.state.datas;
        const datas = arr.map((node) => node[key]);


        return {
          min: Math.min(...datas),
          max: Math.max(...datas),
        }
      }


    handleFilterFormSubmit=(e)=>{
        this.getDatasPagination(this.state)
    }


    



    render() {
        console.log(this.props)
        
        return (
            <div style={{padding:'30px'}}>

                <Grid>
                    <Grid.Column mobile={16} tablet={8} computer={4}>
                        <div style={{backgroundColor:'#fff', padding:'10px', margin:'16px'}}>
                        <Form onSubmit={this.handleFilterFormSubmit}>
                            {/* <Form.Group grouped>
                                <h4>HTML checkboxes</h4>
                                {this.props.allcategory.map((cat)=>{
                                return(
                                    
                                            <p>
                                            <Checkbox 
                                                label={cat.name} 
                                                // onClick={(e)=>this.handleCheckBoxChange(e,'category',cat.name)} 
                                                onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, 'category', cat.name)}
                                            />
                                            </p>
                                        
                                )
                                })}
                             </Form.Group>*/}

                             {this.props.allattributes.map((attr,key)=>{
                                if(attr.type==='Checkbox'){
                                    return(
                                        <Form.Group grouped key={key}>
                                        <h4>{attr.name}</h4>
                                            {attr.datasarray.map((dt,key)=>{
                                            return(
                                                <p>
                                                    <Checkbox 
                                                        label={dt}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, attr.name, dt)}
                                                    />
                                                </p> 
                                                )
                                            })}
                                    </Form.Group>
                                    )
                                }
                             })} 


                            {this.state.datas===null
                            ?
                            <center>Loading...</center>
                            :
                            <>
                            {Object.entries(this.state.attributes).map((attribute,key)=>{
                                return(
                                    <Form.Group grouped key={key}>
                                    <h4>{attribute[0]}</h4>
                                        {attribute[1].map((dt,keyxsa)=>{
                                        return(
                                            <p key={keyxsa}>
                                                <Checkbox 
                                                    label={dt}
                                                    onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, attribute[0], dt)}
                                                />
                                            </p> 
                                            )
                                        })}
                                </Form.Group>
                                )
                            })}
                            </>
                            }

                            <Form.Field control={Button}>Submit</Form.Field>
                            </Form>

                            <hr />
                            {this.state.datas===null
                            ?
                            <center>Loading...</center>
                            :
                            <>
                            <Slider
                                range
                                allowCross={false}
                                min={this.findMinMax('price_lowest').min}
                                max={this.findMinMax('price_heighest').max}
                                defaultValue={[this.findMinMax('price_lowest').min, this.findMinMax('price_heighest').max]}
                                onChange={this.handleChange}
                            />
                            </>
                            }

{/* <p>{} - {this.findMinMax('price_heighest').max}</p> */}

                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={12}>
                        <div style={{padding:'10px', margin:'10px'}}>
                            {this.state.datas===null
                            ?
                            <center>Loading...</center>
                            :
                            <>
                            <h3>Total: {this.state.datas.length}</h3>
                            <Grid>
                                {this.state.datas.map((data)=>{
                                    return(
                                        <Grid.Column computer={4} style={{backgroundColor:'#fff', padding:'10px', margin:'10px'}}>
                                            <h3>{data.name}</h3>
                                            <p>

                                                ₹{data.price_lowest}
                                                -
                                                ₹{data.price_heighest} 
                                                
                                                
                                            </p>

                                            {this.props.allattributes.map((attr,key)=>{
                                               
                                                // return(
                                                //     <p><b>{data.myattributes.Size}</b></p>
                                                // )
                                            })}

                                            {data.myattributes.map((ss)=>{
                                              
                                                return(
                                                    <p>{Object.keys(ss)}: {Object.values(ss).join(', ')}</p>
                                                )
                                            })}


                                        </Grid.Column>
                                    )
                                })}
                                
                            </Grid>
                            <br />
                            <br />
                            <br />
                                <Pagination 
                                    defaultCurrent={this.state.page_number} 
                                    pageSize={this.state.datas_per_page}
                                    total={this.state.total_pages} 
                                    onChange={this.onChangePagination} 
                                    showSizeChanger={false} 
                                    showQuickJumper={false} 
                                />

                            <br />
                            <br />
                            <p>{this.findMinMax('price_lowest').min} - {this.findMinMax('price_heighest').max}</p>
                            </>
                            }


                            
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        )
  }
}

const mapStateToProps = (state) => ({
    allattributes:state.all_attributes,
    allcategory:state.all_category,
    allsubcategory:state.all_subcategory,
    allchildcategory:state.all_childcategory,
    allbrands:state.all_brands,
    alltaxes:state.all_taxes,
    allattributes:state.all_attributes
})





export default connect(mapStateToProps, {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands,fetchTaxes})(webtypesearch)