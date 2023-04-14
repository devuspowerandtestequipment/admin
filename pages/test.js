import React, { Component } from "react";

export class test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: ["Small", "Medium", "Large"],
      color: ["Red", "Green"],
    };
  }

  componentDidMount() {
    this.multiplyAll();
  }

  multiplyAll() {
    // let product = 1;
    // // Only change code below this line
    // for (let i = 0; i < arr.length; i++) {
    //   console.log(arr[i]);
    // }
    // // Only change code above this line
    // return product;

    // let chunked = [this.state.size, this.state.color];

    // for (let i = 0; i < chunked.length; i++) {
    //   for (let j = 0; j < chunked[i].length; j++) {
    //     console.log(chunked[i][j]);
    //   }
    // }



    // let nathaliaPals = ['Ernest','Jack','Peter','Miley','Sally','Xavier'];
    // let johnPals = ['Jesus','Ernest', 'Joe','Peter','James','Monica'];
    // let commonPals = [];

    // nathaliaPals.forEach(pal => {
    //     if (johnPals.includes(pal)) {
    //         return commonPals.push(pal);
    //     }
    // });
    // console.log(commonPals);

    var num = ['size','color'];

    // num.map((nu)=>{
    //     this.state[nu].forEach(element2 => {
    //         console.log(element2)
    //     });
    // })

    

    this.state.size.forEach(element => {
        this.state.color.forEach(element2 => {
            console.log(element+'-'+element2)
        });
    });
  }

  render() {
    return (
      <div>
        <h1>Test</h1>
      </div>
    );
  }
}

export default test;
