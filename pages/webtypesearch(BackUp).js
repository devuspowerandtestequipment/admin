import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Checkbox,Form,Button, Dropdown } from 'semantic-ui-react'
import { Pagination } from 'antd'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';
import _ from 'lodash'
import {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands,fetchTaxes} from '../store/actions'
import { withRouter  } from 'next/router'
import InputRange from 'react-input-range';
import ReactPaginate from 'react-paginate';

{/*=======NOTES
    
    
    
NOTES========*/}



export class webtypesearch extends Component {

    constructor(props){
        super(props)
        this.state={
            loadingBoxes:true,
            sidebar_attributes:[], //store 1st time all sidebar attributes
            sidebar_attributes_selected:[],
            result_count_attributes:{},
            search_main_attributes:{ //please add your attributes here if you are adding new attributes from backend
                category:[],
                subcategory:[],
                childcategory:[],
                'Section Name':[],
            },
            search_other_attributes:{
            },
            search_price_min:0,
            search_price_max:99999999999999,
            search_sortby:{createdAt:"-1"},
            result_main_attributes:[],
            result_other_attributes:[],
            resultdatas:null,
            resultdatasprice:null,
            page_number: 1,
            total_pages: 22,
            total_datas:485,
            datas_per_page:1,
            attributes:[],
            myattributes:[],
            defaultattributes:[]
        }
    }


    componentDidMount(){
        this.props.fetchBrands();
        this.props.fetchAttributes();
        this.props.fetchCategories();
        this.props.fetchSubCategories();
        this.props.fetchChildCategories();
        this.getDatasPagination(this.state)
        // Working
        // console.log(this.dividePrice(10,20))
        // https://stackoverflow.com/questions/8069315/create-array-of-all-integers-between-two-numbers-inclusive-in-javascript-jquery
        // https://flaviocopes.com/how-to-divide-array-js/
    }



    


    getDatasPagination(datas){
        // this.setState({page_number: 1,})
        axios.post(`${process.env.backendURL}/product/productsearch/`,datas)
        .then(response=>{

            console.log(response.data)

            //PRICE ARRAY CALCULATION
            var start=response.data.price_slider.min;
            var end=response.data.price_slider.max;

            const list = Array(end - start + 1).fill().map((_, idx) => start + idx);
            const threePartIndex = Math.ceil(list.length / 4);

            const fourthPart = list.splice(-threePartIndex);
            const thirdPart = list.splice(-threePartIndex);
            const secondPart = list.splice(-threePartIndex);
            const firstPart = list;     

            var resultdatasprice = [[firstPart.at(0),firstPart.at(-1)],[secondPart.at(0),secondPart.at(-1)],[thirdPart.at(0),thirdPart.at(-1)],[fourthPart.at(0),fourthPart.at(-1)]];

            //set sidebar attributes once first time
            if(this.state.sidebar_attributes.length===0){
                this.setState({
                    // sidebar_attributes:Object.assign(response.data.other_attributes, response.data.main_attributes)
                    sidebar_attributes:Object.assign(response.data.main_attributes, response.data.other_attributes),
                    search_price_min:response.data.price_slider.min,
                    search_price_max:response.data.price_slider.max,
                    resultdatasprice:resultdatasprice,
                })
            }

            this.setState(prevState =>{
                return{
                    ...prevState,
                    loadingBoxes:false,
                    price_slider:response.data.price_slider,
                    resultdatas:response.data.datas,
                    page_number:response.data.page_number,
                    total_pages:response.data.total_pages,
                    total_datas:response.data.total_datas,
                    datas_per_page:response.data.datas_per_page,
                    result_count_attributes:response.data.count_attributes,
                    result_main_attributes:response.data.main_attributes,
                    result_other_attributes:response.data.other_attributes,
                }
            })

        })
    }


    pushAttribute(type,name,value){
            var datas=this.state[type][name];

            if(datas===undefined){
                this.setState({
                    [type]:{
                        ...this.state[type],
                        [name]:[value]
                    }
                })
            }else{
                datas.push(value);
                this.setState({
                    [type]:{
                        ...this.state[type],
                        [name]:datas
                    }
                })
            }

            
    }

    removeAttribute(type,name,value){
        var datas=this.state[type][name];
        var indexData = datas.indexOf(name);
        datas.splice(indexData,1)
        this.setState({
            [type]:{
                ...this.state[type],
                [name]:datas
            }
        })

    }


    handleCheckBoxChange=(e,datacheck,name,value,attribute_type)=>{
        if(datacheck.checked){
            if(attribute_type==='search_main_attributes'){
                this.pushAttribute('search_main_attributes',name,value)
            }else{
                this.pushAttribute('search_other_attributes',name,value)
            }
            this.handleFilterFormSubmit();

        }else{
            if(attribute_type==='search_main_attributes'){
                this.removeAttribute('search_main_attributes',name,value)
            }else{
                this.removeAttribute('search_other_attributes',name,value)
            }
            this.handleFilterFormSubmit()
        }
    }


    handleSearchByPrice=(min,max)=>{
        var datas=this.state;
        datas.search_price_min=min;
        datas.search_price_max=max;
        this.getDatasPagination(datas)
    }

    handleSearchSortBy=(name,val)=>{
        if(name===null){
            this.setState({
                search_sortby:{}
            },()=>{
                this.getDatasPagination(this.state)
            })
        }else{
            this.setState({
                search_sortby:{[name]:val}
            },()=>{
                this.getDatasPagination(this.state)
            })
        }
    }


    onChangePagination = (pagenum) => {


        var datas=this.state;
        datas.page_number=pagenum;

        // datas.page_number=pagenum.selected;
        this.getDatasPagination(datas)
    }

    handleFilterFormSubmit=(e)=>{
        this.setState({
            loadingBoxes:true,page_number:1
        },()=>{
            this.getDatasPagination(this.state)
        })
        
    }

    //calculate percentage
    percentage(partialValue, totalValue) {
        return (100 * partialValue) / totalValue;
     }
    


  render() {

    // if(this.state.result_count_attributes.Color!==undefined){
    //     console.log(_.find(this.state.result_count_attributes.Color, function(dta) { return dta._id==='Red'}).count)
    //     // console.log(this.state.result_count_attributes.Color)
    // }

    console.log(this.state.sidebar_attributes);
    console.log(this.state);



    return (
        <div style={{padding:'30px'}}>
            <Grid>
            <Grid.Column  mobile={16} tablet={16} computer={16}>
                    <Dropdown
                        text='Filter'
                        icon='filter'
                        floating
                        labeled
                        button
                        className='icon'
                        style={{float:'right'}}
                    >
                        <Dropdown.Menu>
                                <Dropdown.Item onClick={()=>this.handleSearchSortBy('createdAt','desc')} text='Newest' />
                                <Dropdown.Item onClick={()=>this.handleSearchSortBy('createdAt','asc')} text='Oldest' />
                                <Dropdown.Item onClick={()=>this.handleSearchSortBy('price_lowest','desc')} text='Price DESC' />
                                <Dropdown.Item onClick={()=>this.handleSearchSortBy('price_lowest','asc')} text='Price ASC' />
                                <Dropdown.Item onClick={()=>this.handleSearchSortBy('name','asc')} text='Name ASC' />
                                <Dropdown.Item onClick={()=>this.handleSearchSortBy('name','desc')} text='Name DESC' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8} computer={4}>
                    <div style={{backgroundColor:'#fff', padding:'10px', margin:'16px'}}>
                        <Form onSubmit={this.handleFilterFormSubmit} loading={this.state.loadingBoxes}>
                           
                            {/* {Object.entries(this.state.sidebar_attributes).map((entry)=>{
                                return(
                                    <>
                                    <h4>{entry[0]}</h4>
                                    <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                        {entry[1].map((dt,key)=>{
                                            return(
                                                <p className='disabledDropDownBoxXXXXXXX' key={key}>
                                                    <Checkbox 
                                                        label={dt}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, entry[0], dt,'search_main_attributes')}
                                                    />
                                                    (
                                                        {this.state.result_count_attributes[entry[0]]
                                                        &&
                                                        <>
                                                        {_.find(this.state.result_count_attributes[entry[0]], function(dta) { return dta._id===dt})===undefined
                                                            ?0
                                                            :_.find(this.state.result_count_attributes[entry[0]], function(dta) { return dta._id===dt}).count
                                                        }
                                                        </>
                                                        }
                                                    )
                                                   
                                                </p> 
                                            )
                                        })}
                                    </div>
                                    </>
                                )
                            })} */}
                            
                            
                            {_.filter(this.state.sidebar_attributes.product_brand, function(fdata) {return fdata!=='-'}) &&
                                <>
                                <h4>Brand ({_.filter(this.state.sidebar_attributes.product_brand, function(fdata) {return fdata!=='-'}).length})</h4>
                                    <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                        { _.filter(this.state.sidebar_attributes.product_brand, function(fdata) {return fdata!=='-'}).map((sattr,key)=>{
                                            return(
                                                <p className={
                                                    this.state.result_main_attributes.product_brand
                                                    &&
                                                    this.state.result_main_attributes.product_brand.includes(sattr)?``:`disabledDropDownBox`
                                                } key={key}>
                                                    <Checkbox 
                                                        label={_.find(this.props.allbrands,function(gdta){return gdta._id===sattr}).brand_name}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, 'product_brand', sattr,'search_main_attributes')}
                                                    />
                                                    (
                                                        {this.state.result_count_attributes.product_brand
                                                        &&
                                                        <>
                                                        {_.find(this.state.result_count_attributes.product_brand, function(dta) { return dta._id===sattr})===undefined
                                                            ?0
                                                            :_.find(this.state.result_count_attributes.product_brand, function(dta) { return dta._id===sattr}).count
                                                        }
                                                        </>
                                                        }
                                                    )
                                                </p> 
                                            )
                                        })}
                                    </div>
                                </>
                            }



                            {_.filter(this.state.sidebar_attributes.category, function(fdata) {return fdata!=='-'}) &&
                                <>
                                <h4>Category ({_.filter(this.state.sidebar_attributes.category, function(fdata) {return fdata!=='-'}).length})</h4>
                                    <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                        { _.filter(this.state.sidebar_attributes.category, function(fdata) {return fdata!=='-'}).map((sattr,key)=>{
                                            return(
                                                <p className={
                                                    this.state.result_main_attributes.category
                                                    &&
                                                    this.state.result_main_attributes.category.includes(sattr)?``:`disabledDropDownBox`
                                                } key={key}>
                                                    <Checkbox 
                                                        label={_.find(this.props.allcategory,function(gdta){return gdta._id===sattr}).name}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, 'category', sattr,'search_main_attributes')}
                                                    />
                                                    (
                                                        {this.state.result_count_attributes.category
                                                        &&
                                                        <>
                                                        {_.find(this.state.result_count_attributes.category, function(dta) { return dta._id===sattr})===undefined
                                                            ?0
                                                            :_.find(this.state.result_count_attributes.category, function(dta) { return dta._id===sattr}).count
                                                        }
                                                        </>
                                                        }
                                                    )
                                                </p> 
                                            )
                                        })}
                                    </div>
                                </>
                            }


                            {_.filter(this.state.sidebar_attributes.subcategory, function(fdata) {return fdata!=='-'}) &&
                                <>
                                <h4>Sub Category ({_.filter(this.state.sidebar_attributes.subcategory, function(fdata) {return fdata!=='-'}).length})</h4>
                                    <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                        { _.filter(this.state.sidebar_attributes.subcategory, function(fdata) {return fdata!=='-'}).map((sattr,key)=>{
                                            return(
                                                <p className={
                                                    this.state.result_main_attributes.subcategory
                                                    &&
                                                    this.state.result_main_attributes.subcategory.includes(sattr)?``:`disabledDropDownBox`
                                                } key={key}>
                                                    <Checkbox 
                                                        label={_.find(this.props.allsubcategory,function(gdta){return gdta._id===sattr}).name}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, 'subcategory', sattr,'search_main_attributes')}
                                                    />
                                                    (
                                                        {this.state.result_count_attributes.subcategory
                                                        &&
                                                        <>
                                                        {_.find(this.state.result_count_attributes.subcategory, function(dta) { return dta._id===sattr})===undefined
                                                            ?0
                                                            :_.find(this.state.result_count_attributes.subcategory, function(dta) { return dta._id===sattr}).count
                                                        }
                                                        </>
                                                        }
                                                    )
                                                </p> 
                                            )
                                        })}
                                    </div>
                                </>
                            }


                            {_.filter(this.state.sidebar_attributes.childcategory, function(fdata) {return fdata!=='-'}) &&
                                <>
                                <h4>Child Category ({_.filter(this.state.sidebar_attributes.childcategory, function(fdata) {return fdata!=='-'}).length})</h4>
                                    <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                        { _.filter(this.state.sidebar_attributes.childcategory, function(fdata) {return fdata!=='-'}).map((sattr,key)=>{
                                            return(
                                                <p className={
                                                    this.state.result_main_attributes.childcategory
                                                    &&
                                                    this.state.result_main_attributes.childcategory.includes(sattr)?``:`disabledDropDownBox`
                                                } key={key}>
                                                    <Checkbox 
                                                        label={_.find(this.props.allchildcategory,function(gdta){return gdta._id===sattr}).name}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, 'childcategory', sattr,'search_main_attributes')}
                                                    />
                                                    (
                                                        {this.state.result_count_attributes.childcategory
                                                        &&
                                                        <>
                                                        {_.find(this.state.result_count_attributes.childcategory, function(dta) { return dta._id===sattr})===undefined
                                                            ?0
                                                            :_.find(this.state.result_count_attributes.childcategory, function(dta) { return dta._id===sattr}).count
                                                        }
                                                        </>
                                                        }
                                                    )
                                                </p> 
                                            )
                                        })}
                                    </div>
                                </>
                            }





                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />
                            <hr />

                            {/* ===== MAIN ATTRIBUTES ===== */}
                            {this.state.result_main_attributes===null
                            ?
                            <>Loading...</>
                            :
                            <>
                            {Object.entries(this.state.result_main_attributes).map(entry => {
                                return(
                                    <Form.Group grouped key={entry[0]}>
                                        <h4>{entry[0]}</h4>
                                        <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                            {entry[1].map((dt,key)=>{
                                            return(
                                                <p className='disabledDropDownBoxXXXXXXX' key={key}>
                                                    <Checkbox 
                                                        label={dt}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, entry[0], dt,'search_main_attributes')}
                                                    />
                                                </p> 
                                                )
                                            })}
                                            </div>
                                    </Form.Group>
                                )
                            })}
                            </>}


                            {/* ===== OTHER ATTRIBUTES ===== */}
                            {this.state.result_other_attributes===null
                            ?
                            <>Loading...</>
                            :
                            <>
                            {Object.entries(this.state.result_other_attributes).map((entry,key) => {
                                
                                return(
                                    <Form.Group grouped key={key}>
                                        <h4>{entry[0]}</h4>
                                        <div style={{maxHeight: '200px',overflow: 'overlay'}}>
                                            {entry[1].map((dt,key)=>{
                                            return(
                                                <p className='disabledDropDownBoxXXXXXXX' key={key}>
                                                    <Checkbox 
                                                        label={dt}
                                                        onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, entry[0], dt,'search_other_attributes')}
                                                    />
                                                </p> 
                                                )
                                            })}
                                            </div>
                                    </Form.Group>
                                )
                            })}
                            </>}
                            
                            {/* {this.state.result_main_attributes.map(((attr,key1)=>{
                                return(
                                    <Form.Group grouped key={key1}>
                                        <h4>{attr.name}</h4>
                                        <div style={{height: '200px',overflow: 'overlay'}}>
                                            {attr.datasarray.map((dt,key)=>{
                                            return(
                                                <p className='disabledDropDownBox' key={key}>
                                                    <Checkbox 
                                                        label={dt}
                                                        // onClick={(evts, datacheck)=>this.handleCheckBoxChange(evts, datacheck, attr.name, dt)}
                                                    />
                                                </p> 
                                                )
                                            })}
                                            </div>
                                    </Form.Group>
                                )
                            }))} */}
                            {/* <br />
                            <br />
                            {this.state.price_slider.min}/{this.state.price_slider.max}
                            <InputRange
                                maxValue={this.state.price_slider.max}
                                minValue={this.state.price_slider.min}
                                value={this.state.price_sliderNew}
                                onChange={price_sliderNew => this.setState({price_sliderNew:price_sliderNew})}
                            /> */}
                            <br />
                            <br />

                            <Form.Group grouped>
                            <h4>Price</h4>
                            {this.state.resultdatasprice &&
                                this.state.resultdatasprice.map((price)=>{
                                    return(
                                        <p onClick={()=>this.handleSearchByPrice(price[0],price[1])}>₹{price[0]} to ₹{price[1]}</p>
                                    )
                                })
                            }
                            </Form.Group>

                            <br/>


                            <Form.Field control={Button}>Submit</Form.Field>
                        </Form>
                    </div>
                </Grid.Column>

                

                <Grid.Column mobile={16} tablet={8} computer={12}>
                        <div style={{padding:'10px', margin:'10px'}}>
                            {this.state.resultdatas===null
                            ?
                            <center>Loading...</center>
                            :
                            <>
                            <h3>Total: {this.state.total_datas}
                            
                            
                            </h3>
                            <Grid>
                                {this.state.resultdatas.map((data)=>{
                                    return(
                                        <Grid.Column computer={4} style={{backgroundColor:'#fff', padding:'10px', margin:'10px'}}>
                                            <h3>{data.name}</h3>
                                            {data.type==='Simple'
                                            ?
                                            <>
                                            <p>₹ {data.pricemain[0]}</p>
                                            </>
                                            :
                                            <>
                                            <p>
                                                ₹{data.price_lowest}
                                                -
                                                ₹{data.price_heighest} 
                                            </p>
                                            {/* {data.myattributes.map((ss)=>{
                                              
                                                return(
                                                    <p>{Object.keys(ss)}: {Object.values(ss).join(', ')}</p>
                                                )
                                            })} */}
                                            </>}
                                            
                                        </Grid.Column>
                                    )
                                })}
                            </Grid>
                            <br />
                            <br />
                            <br />
                            
                                <Pagination 
                                    current={this.state.page_number}
                                    defaultCurrent={this.state.page_number} 
                                    pageSize={this.state.datas_per_page}
                                    total={this.state.total_datas} 
                                    onChange={this.onChangePagination} 
                                    showSizeChanger={false} 
                                    showQuickJumper={false} 
                                />


                            {/* <ReactPaginate
                                breakLabel="..."
                                nextLabel="next >"
                                // onPageChange={handlePageClick}
                                onPageChange={this.onChangePagination} 

                                pageRangeDisplayed={this.state.datas_per_page}
                                pageCount={this.state.total_datas}
                                previousLabel="< previous"
                                renderOnZeroPageCount={null}


                                initialPage={1}
                                forcePage={this.state.page_number}
                            /> */}



                            <br />
                            <br />
                            {/* <p>{this.findMinMax('price_lowest').min} - {this.findMinMax('price_heighest').max}</p> */}
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
    // alltaxes:state.all_taxes,
})



export default connect(mapStateToProps, {fetchAttributes,fetchCategories,fetchSubCategories,fetchChildCategories,fetchBrands,fetchTaxes})(withRouter(webtypesearch))