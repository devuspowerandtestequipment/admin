import React, {Component} from 'react';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMoveImmutable from './ArrayMoveMutable';

const DragHandle = sortableHandle(() => <span>::</span>);

const SortableItem = sortableElement(({value,clickFunction}) => (
  <li className="list1212">
    <span className="list1212span"><DragHandle /></span>{value}   <span onClick={() => clickFunction(value)} className="ppo121">x</span>
  </li>
));

const SortableContainer = sortableContainer(({children}) => {
  return <ul>{children}</ul>;
});

export default class InputSort extends Component {

  constructor(props){
      super(props)
      this.state={
        items: this.props.parentdata,
        // items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
      }
      this.setData=this.setData.bind(this);
  }


  UNSAFE_componentWillReceiveProps(props){
    this.setState({
      items:props.parentdata,
    })
  }

  setData=(data)=>{
    this.setState({
        items:data
    })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: arrayMoveImmutable(items, oldIndex, newIndex),
    }));
    this.props.setDataMain(this.state.items)
  };


  clickFunction=e=>{
    this.props.removeDataFromList(e)
  }


  render() {
    const {items} = this.state;
    return (
        <>
        {items===undefined
        ?<></>
        :
        <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
            {items.map((value, index) => (
              <SortableItem key={`item-${index}`} index={index} value={value} clickFunction={this.clickFunction} />
            ))}
        </SortableContainer>
        }

        </>
      
    );
  }
}