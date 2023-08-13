import { useSelector } from "react-redux";
import _ from 'lodash'
import DynamicAmount from "../pages/components/DynamicAmount";


export function add(x, y) {
    return x + y
}
  
export function mutiply(x, y) {
    return x * y
}

// calculate perentage amount
function per(num, amount){
    return num*amount/100;
}

//<<<=== calculate tax amount cartitems ===>>>
export function calculateTax(item){

    // const auth = useSelector(state => state.auth);
    // const navbaritems = useSelector(state => state.navbaritems===null?[]:state.navbaritems);
    // const navbaritems = useSelector(state => state.navbaritems===null?[]:state.navbaritems);

    // console.log('navbaritems',navbaritems)

    var main_product_price=item.product_id.pricemain[0];
    var main_product_quantity=item.quantity;
    var tax_list=item.parent_product_id.product_tax;

    //NO TAX FOUND
    if(tax_list.length===0){
      return Number(main_product_price).toFixed(2);
    }else{

      var taxtotal=[]; //tax in json
      var taxtotalinmum=0;//total tax in amount

        tax_list.forEach(element => {

            if(element.type==='1'){
                taxtotal.push({name:element.name,percentage:element.percentage,pamount:per(element.percentage,Number(main_product_price))})
                taxtotalinmum+=per(element.percentage,Number(main_product_price));
            }else{
                taxtotal.push({name:element.name,amount:element.amount,pamount:element.amount})
                taxtotalinmum+=element.amount;
            }

        });
        // return Number(main_product_price+taxtotalinmum).toFixed(2);
        return (Number(main_product_price)+Number(taxtotalinmum)).toFixed(2);
    }

  }










//<<<=== calculate sum amount of cartitems (without tax) ===>>>
export function calculateSumWithoutTax(json){
    let sum=0
  
    if(json!==null){
      json.forEach(item => {
  
      var main_product_price=item.product_id.pricemain[0];
      var main_product_quantity=item.quantity;
      

        sum+=Number(main_product_price)*main_product_quantity;

    });
    }
    return sum.toFixed(2);
}



//<<<=== calculate sum amount of cartitems (withtax) ===>>>
export function calculateSum(json){


    // var json=

    let sum=0
  
    if(json!==null){
      json.forEach(item => {
  
      var main_product_price=item.product_id.pricemain[0];
      var main_product_quantity=item.quantity;
      var tax_list=item.parent_product_id.product_tax;
  
          
          if(tax_list.length===0){//NO TAX FOUND
            // return main_product_price;
            sum+=Number(main_product_price)*main_product_quantity;
          }else{
  
            var taxtotal=[]; //tax in json
            var taxtotalinmum=0;//total tax in amount
  
              tax_list.forEach(element => {
  
                  if(element.type==='1'){
                      taxtotal.push({name:element.name,percentage:element.percentage,pamount:per(element.percentage,Number(main_product_price))})
                      taxtotalinmum+=per(element.percentage,Number(main_product_price));
                  }else{
                      taxtotal.push({name:element.name,amount:element.amount,pamount:element.amount})
                      taxtotalinmum+=element.amount;
                  }
  
              });
  
              sum+=(Number(main_product_price)+taxtotalinmum)*main_product_quantity;
          }
  
  
      return Number(sum.toFixed(2));
  
      });
    }
    return Number(sum.toFixed(2));

}







// export function calculateSum(json){

//     let sum=0
  
//     if(json!==null){
//       json.forEach(item => {
  
//       var main_product_price=item.product_id.pricemain[0];
//       var main_product_quantity=item.quantity;
//       var tax_list=item.parent_product_id.product_tax;
  
          
//           if(tax_list.length===0){//NO TAX FOUND
//             // return main_product_price;
//             sum+=Number(main_product_price)*main_product_quantity;
//           }else{
  
//             var taxtotal=[]; //tax in json
//             var taxtotalinmum=0;//total tax in amount
  
//               tax_list.forEach(element => {
  
//                   if(element.type==='1'){
//                       taxtotal.push({name:element.name,percentage:element.percentage,pamount:per(element.percentage,Number(main_product_price))})
//                       taxtotalinmum+=per(element.percentage,Number(main_product_price));
//                   }else{
//                       taxtotal.push({name:element.name,amount:element.amount,pamount:element.amount})
//                       taxtotalinmum+=element.amount;
//                   }
  
//               });
  
//               sum+=(Number(main_product_price)+taxtotalinmum)*main_product_quantity;
//           }
  
  
//       return sum.toFixed(2);
  
//       });
//     }
//     return sum.toFixed(2);

// }



 //<<<=== calculate sum amount of cartitems ===>>>
 export function calculateTotal (json) {
    let tot=0
    if(json!==null){
      json.forEach(element => {
        // if(element.product_id!==null){
          tot+=1*element.quantity
        // }
      });
    }
    return tot;
}





//<<<=== calculate shipping amount of cartitems (without tax) ===>>> shipping.js
export function  calculateShipping(shipping_method_selected,shippings,cart){
    
    var amount=calculateSum(cart);
    
    let result = _.find(shippings, function(obj) {
        if (obj._id === shipping_method_selected.shipping_method_id) {
            return true;
        }
    });
    if(result){
        if(result.type==='2'){
            return Number(result.amount.toFixed(2));
        }else{

            // console.log('amount',amount);
            // console.log('result.percentage',result.percentage);
            // console.log((per(23,5880.29)).toFixed(2))

            return (per(result.percentage,amount)).toFixed(2);
        }
    }else{
        return false;
    }

    

    // if(result){
    //     return <>{result.name}({result.type==='2'?<><DynamicAmount amount={result.amount} /></>:<>{result.percentage}%</>})</>; 
    // }else{
    //     return false;
    // }
 
}


export function calculateSumWithShipping(cart,shipping_method_selected,shippings){
    
    var amount=calculateSum(cart);

    //check shipping availabe or not
    let result = _.find(shippings, function(obj) {
        if (obj._id === shipping_method_selected.shipping_method_id) {
            return true;
        }
    });
    if(result){ 

        if(result.type==='2'){
            var sum=Number(amount)+Number(result.amount.toFixed(2));
            return sum.toFixed(2);
        }else{
            return (per(result.percentage,amount)+amount).toFixed(2);
        }
        
    }else{
        return amount;
    }


}


export function calculateSumWithShippingAndCoupon(amount,result){
   
    if(result.type==='2'){
        var sum=Number(amount)-Number(result.amount.toFixed(2));
        return sum.toFixed(2);
    }else{
        return (amount-per(result.percentage,amount)).toFixed(2);
    }

}


//<<<=== calculate dicountmount amount of cartitems (without tax) ===>>> shipping.js
export function calculateDiscounts(matcheddiscounts,cart_raw_amount){

    var total_discounts=0;
    matcheddiscounts.forEach(element => {
        if(element.type==='1'){
            if(element.calculation_type==='Discount'){
                total_discounts=total_discounts-per(element.percentage,cart_raw_amount);
            }else{
                total_discounts=total_discounts+per(element.percentage,cart_raw_amount);
            }
        }else{
            //amount
            if(element.calculation_type==='Discount'){
                total_discounts=total_discounts-element.amount;
            }else{
                total_discounts=total_discounts+element.amount;
            }
        }
    });
    // console.log('total_discounts',total_discounts);
    return total_discounts;
}





export function calculateAllTotalAmount(datas){
    // console.log('datas',calculatePlusMinusArray(allArrayToNumber(datas)))


    return calculatePlusMinusArray(allArrayToNumber(datas));
}
