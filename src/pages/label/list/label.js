import React from 'react';
import style from './label.styl';
import DocumentMeta from 'react-document-meta';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import axios from 'axios';
import {TransTime,mathId} from '../../../utils/utils.js';
import Loading from '../../../components/loading/loading';
import {
  Input,
  Button,
  Table,
  Message,
  MessageBox
}from 'element-react';
export default class LabelList extends React.Component {
  state = {
    menus:['标签管理','标签列表'],
    label:'',
    keyword:'',
    disabled1:false,
    disabled2:false,
    columns: [
      {
        label: "标签名",
        prop: "label",
        align:'center'
      },
      {
        label: "添加日期",
        prop: "time",
        align:'center'
      },
      {
        label: "文章",
        prop: "articleCount",
        align:'center'
      },{
        label: "操作",
        prop: "zip",
        align:'center',
        render:(row,column,index)=>{
          return <span>
            <Button type="text" onClick={this.labelEdit.bind(this,index)} size="small">修改</Button>
            <Button type="text" size="small" onClick={this.labelDelete.bind(this,index)}>删除</Button>
          </span>
        }
      }
    ],
    data: [],
    isLoading:true
  };
  render() {
    return (
      <div className={style.listBox}>
        <DocumentMeta {...{title:'微微下雨天 | 标签列表'}}/>
        <Breadcrumb menus={this.state.menus}/>
        <div className={style.lableBox}>
          <div className={style.newLabel}>
            <div className={`${style.addLabel} ${style.flex1}`}>
              <Input placeholder="新增标签" value={this.state.label} onInput={(event)=>this.onChangeInput(event,'label')} append={
                <Button type="primary" icon="plus" disabled={this.state.disabled1} onClick={this.addLabel.bind(this)}>新增标签</Button>
              }/>
            </div>
            <div className={`${style.searchLabel} ${style.flex1}`}>
              <Input placeholder="搜索标签" value={this.state.keyword} onInput={(event)=>this.onChangeInput(event,'keyword')} append={
                <Button type="primary" icon="search" disabled={this.state.disabled2} onClick={this.searchLabel.bind(this)}>搜索标签</Button>
              }/>
            </div>
          </div>
          <div className={style.labelList}>
            <div className={style.listTitle}>标签列表</div>
            <div className={style.listTable}>
              <Table
                style={{width: '100%'}}
                columns={this.state.columns}
                rowClassName={this.rowClassName.bind(this)}
                data={this.state.data}
                stripe={true}
                border={true}
              />
            </div>
          </div>
        </div>
        {
          this.state.isLoading?<div className="adminLoading"><Loading/></div>:null
        }
      </div>
    )
  }
  rowClassName(row){
    return row.isDefault?'default':'';
  }
  warning(text,type){
    Message({
      message: text||'请正确填写信息',
      type: type||'warning',
    });
  }
  hasRepeat(data,value){
    let repeat = false;
    for(let i=0;i<data.length;i++){
      const e = data[i];
      if(e.label===value){
        repeat = true;
        break;
      }
    }
    return repeat;
  }
  onChangeInput(event,key){
    const value = event.target.value.trim();
    this.setState({
      [key]:value
    });
  }
  addLabel(){  // 新增
    const value = this.state.label.trim();
    const labelId = mathId();
    const repeat = this.hasRepeat(this.state.data,value);
    if(value===''){
      this.warning('请输入标签名');
      return false;
    }
    if(repeat){
      this.warning('标签已存在，请勿重复输入');
      return false;
    }
    const isDefault = this.state.data.length===0;
    this.setState({disabled1:true});
    axios.post('/add-labels',{
      data:JSON.stringify({
        label:value,
        labelId:labelId,
        isDefault,
        add:true
      })
    }).then(res=>{
      if(Number(res.data.code)===0){
        const dt = this.resizeList([res.data.data]);
        this.setState({
          data:this.setDefaultLabel([dt[0],...this.state.data]),
          disabled1:false,
          label:''
        },()=>{
          this.warning('标签添加成功','success');
        });
      }else{
        this.setState({disabled1:false},()=>{
          this.warning('标签添加失败');
        });
      }
    }).catch(err=>{
      this.setState({disabled1:false},()=>{
        this.warning('标签添加失败');
      });
    })
  }
  searchLabel(){
    const value = this.state.keyword.trim();
    this.ajax_initLabel({label:value});
  }
  labelEdit(index){  // 修改
    const label = this.state.data[index];
    MessageBox.prompt('输入标签名','修改标签',{
      inputPlaceholder:'请输入标签名',
      inputValue:label.label
    }).then(({value})=>{
      if(value==='')
        return false;
      if(value===label.label)
        return false;
      axios.post('/update-labels',{
        labelId:label.labelId,
        label:value
      }).then(res=>{
        if(Number(res.data.code)===0){
          this.setState(preState=>{
            const list = preState.data;
            list[index].label = value;
            return {date:list}}
          );
          this.warning('标签更新成功','success');
        }else{
          this.warning('标签更新失败');
        }
      }).catch(()=>{
        this.warning('标签更新失败');
      })
    }).catch(() => {
      this.warning('已取消操作','info');
    });
  }
  setDefaultLabel(list){
    let defaultLbale = [];
    for(let i=0;i<list.length;i++){
      if(list[i].isDefault){
         defaultLbale = list.splice(i,1);
         break;
      }
    }
    return defaultLbale.concat(list);
  }
  getDefault(list,count){
    count = count?count:0;
    for(let i=0;i<list.length;i++){
      if(list[i].isDefault){
        list[i].articleCount = list[i].articleCount?parseInt(list[i].articleCount,10)+parseInt(count,10):0;
        break;
      }
    }
    return list;
  }
  labelDelete(index){  // 删除
    const label = this.state.data[index];
    const isDefult = label.isDefault;
    const count = this.state.data[index].articleCount;
    if(isDefult){
      this.warning('该标签为默认标签，不能删除','info');
      return false;
    }
    MessageBox.confirm('标签删除后，所属文章将被放到默认标签内，确认删除?', '删除标签', {
      type: 'warning'
    }).then(() => {
      axios.post('/del-labels',{
        labelId:label.labelId
      }).then(res=>{
        if(Number(res.data.code)===0){
          this.state.data.splice(index,1);
          const data = this.getDefault(this.state.data,count);
          this.setState({
            data:data
          },()=>{
            Message({
              type: 'success',
              message: '标签删除成功'
            });
          })
        }else{
          Message({
            type: 'warning',
            message: '标签删除失败'
          });
        }
      }).catch(()=>{
        Message({
          type: 'warning',
          message: '标签删除失败'
        });
      })
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消删除'
      });
    });
  }
  resizeList(data){
    if(!data||!data.length)
      return [];
    return data.map((item,index)=>{
      return {
        articleCount:item.articleCount,
        isDefault:item.isDefault,
        label:item.label,
        labelId:item.labelId,
        time:TransTime(item.time,'dd'),
        __v:item.__v,
        _id:item._id
      }
    })
  }
  ajax_initLabel(data){
    this.setState({disabled2:true});
    axios.post('/get-labels',{data:JSON.stringify(data)}).then(res=>{
      if(Number(res.data.code)===0){
        console.log(this.resizeList(res.data.data).length);
        this.setState({
          data:this.setDefaultLabel(this.resizeList(res.data.data)),
          disabled2:false,
          isLoading:false
        });
      }else{
        this.setState({disabled2:true,isLoading:false},()=>{
          this.warning('获取标签列表失败');
        });
      }
    }).catch(err=>{
      this.setState({disabled2:true,isLoading:false},()=>{
        this.warning('获取标签列表失败');
      });
    })
  }
  componentWillMount() {
    this.ajax_initLabel({});
  }
}