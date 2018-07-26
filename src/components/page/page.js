import React from 'react';
import {Button} from 'element-react';
export default class Pagination extends React.Component {
  state = {
    page:1
  };
  render() {
    return (
      <div style={{'display':'inline-block'}}>
        <Button type="primary" size="small" disabled={false} onClick={this.onChange.bind(this,true)}>上一页</Button>
        <Button type="primary" size="small" disabled={false} onClick={this.onChange.bind(this,false)}>下一页</Button>
      </div>
    )
  }
  onChange(bool){
    // let _page = this.props.page;
    // let page = bool?_page--:_page++;
    // this.props.onPageChange(page);
    const page = bool?this.props.page = this.props.page-1:this.props.page = this.props.page+1;
    this.props.onPageChange(page);
  }
}