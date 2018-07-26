import React from 'react';
import style from './list.styl';
import axios from 'axios';
import PropTypes from 'prop-types';
import Loading from '../../../components/loading/loading';
import {TransTime} from '../../../utils/utils.js';
import {
  Button,
  Input,
  Table,
  Form,
  Message,
  MessageBox
} from 'element-react';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
export default class ArticleList extends React.Component {
  state = {
    menus:['文章管理','文章列表'],
    label:'全部',
    type:'全部',
    status:'全部',
    isopen:'全部',
    typeList:['全部','贤心','慢生活','碎言碎语'],
    labelList:[{labelId:'-1',label:'全部'}],
    isopenList:['全部','公开','私密'],
    statusList:['全部','发布','草稿'],
    search:'',
    searchDisabled:false,
    columns: [
      {
        type: 'expand',
        expandPannel:(data)=>{
          return this.expandPannel(data)
        }
      },
      {
        label: "文章标题",
        prop: "title",
        align:'center'
      },
      {
        label: "发布日期",
        prop: "time",
        align:'center'
      },
      {
        label: "分类",
        prop: "type",
        align:'center'
      },
      {
        label: "公开",
        prop: "isopen",
        align:'center'
      },
      {
        label: "状态",
        prop: "status",
        align:'center'
      },
      {
        label: "操作",
        align:'center',
        render:(row,column,index)=>{
          const status = row.status==='草稿'?'发布':'草稿';
          return (
            <span>
              <Button type="text" size="small" onClick={this.setRevise.bind(this,row.articleId)}>修改</Button>
              <Button type="text" size="small" onClick={this.setStatus.bind(this,row,index)}>{status}</Button>
              <Button type="text" size="small" onClick={this.delArticles.bind(this,index)}>删除</Button>
            </span>
          )
        }
      }
    ],
    data:[],
    page:1,
    limit:6,
    isSearch:false,
    d1:false,
    d2:false,
    isFrist:true,
    isLoading:true
  };
  static contextTypes = {
    onChangeUrl:PropTypes.func
  };
  render() {
    return (
      <div className={style.listBox}>
        <Breadcrumb menus={this.state.menus} />
        <div className={style.section}>
          <div className={style.searchBox}>
            <div className={style.oneSearch}>
              <div className={style.searchText}>标签</div>
              <div className={style.searchSection}>
                {
                  this.state.labelList&&this.state.labelList.length>1?
                  this.state.labelList.map((item,index)=>{
                    return (
                      <Button
                        key={index}
                        type={
                          this.state.label===item.label?
                            'primary':item.isDefault?'success':''}
                        className={`${style.searchButton}`}
                        onClick={this.onChangeSearch.bind(this,'label',index,this.state.labelList)}
                      >{item.label}</Button>
                    )
                  }):<Button className={style.searchButton} type="primary" loading={true}>标签加载中</Button>
                }
              </div>
            </div>
            <div className={style.oneSearch}>
              <div className={style.searchText}>分类</div>
              <div className={style.searchSection}>
                {
                  this.state.typeList.map((item,index)=>{
                    return (
                      <Button
                        key={index}
                        type={this.state.type===item?'primary':''}
                        className={style.searchButton}
                        onClick={this.onChangeSearch.bind(this,'type',index,this.state.typeList)}
                      >{item}</Button>
                    )
                  })
                }
              </div>
            </div>
            <div className={style.oneSearch}>
              <div className={style.searchText}>公开</div>
              <div className={style.searchSection}>
                {
                  this.state.isopenList.map((item,index)=>{
                    return (
                      <Button
                        key={index}
                        type={this.state.isopen===item?'primary':''}
                        className={style.searchButton}
                        onClick={this.onChangeSearch.bind(this,'isopen',index,this.state.isopenList)}
                      >{item}</Button>
                    )
                  })
                }
              </div>
            </div>
            <div className={style.oneSearch}>
              <div className={style.searchText}>状态</div>
              <div className={style.searchSection}>
                {
                  this.state.statusList.map((item,index)=>{
                    return (
                      <Button
                        key={index}
                        type={this.state.status===item?'primary':''}
                        className={style.searchButton}
                        onClick={this.onChangeSearch.bind(this,'status',index,this.state.statusList)}
                      >{item}</Button>
                    )
                  })
                }
              </div>
            </div>
            <div className={style.oneSearch} style={{'paddingBottom':'20px'}}>
              <div className={style.searchText}>搜索</div>
              <div className={style.searchSection}>
                <Input
                  style={{'width':'50%'}}
                  placeholder="标题、描述、关键字"
                  value={this.state.search}
                  onInput={this.onInputSearch.bind(this)}
                  append={
                    <Button
                      type="primary"
                      disabled={this.state.searchDisabled||(this.state.data.length===0&&this.state.isFrist)}
                      onClick={this.onSaveSearch.bind(this)}
                      icon={this.state.searchDisabled?'loading':'search'}>搜索</Button>
                  }/>
              </div>
            </div>
          </div>
          <div className={style.tableBox}>
            <div className={style.listTitle}>文章列表</div>
            <Table
              style={{width: '100%'}}
              columns={this.state.columns}
              data={this.state.data}
              border={true}
              stripe={true}
            />
          </div>
          {
            this.state.data.length>0&&!this.state.isFrist?
            <div className={style.listPage}>
              <Button type="primary" size="small" disabled={this.state.d1} onClick={this.onPageChange.bind(this,true)}>上一页</Button>
              <Button type="primary" size="small" disabled={this.state.d2} onClick={this.onPageChange.bind(this,false)}>下一页</Button>
            </div>:null
          }
        </div>
        {
          this.state.isLoading?<div className="adminLoading"><Loading/></div>:null
        }
      </div>
    )
  }
  expandPannel(data){
    return (
      <Form labelPosition="left" labelWidth="80" inline={false} className={style.tableForm}>
        <Form.Item label="标签：" className={style.formItem}><span>{data.label}</span></Form.Item>
        <Form.Item label="关键字：" className={style.formItem}><span>{data.keyword}</span></Form.Item>
        {
          data.describe?<Form.Item label="描述：" className={style.formItem}><span>{data.describe}</span></Form.Item>:null
        }
        {
          data.image&&data.image.length>0?
          <Form.Item label="缩略图：" className={`${style.formItem} formImage`}>
            <img style={{'margin':'5px 0','maxWidth':'100px'}} src={data.image[0].url} alt=""/>
          </Form.Item>:null
        }
      </Form>
    )
  }
  warning(text,type){
    Message({
      message: text||'请正确填写信息',
      type: type||'warning',
    });
  }
  setRevise(articleId){ // 跳转到添加页面 同时更改导航 使用this.context
    sessionStorage.setItem('key','/home/article/add');
    this.context.onChangeUrl('/home/article/add');
    this.props.history.push(`/home/article/add/${articleId}`);
  }
  resizeList(data){
    if(!data||!data.length)
      return [];
    return data.map((item,index)=>{
      return {
        time:TransTime(item.time,'dd'),
        __v:item.__v,
        _id:item._id,
        articleId:item.articleId,
        content:item.content,
        describe:item.describe,
        image:item.image,
        isopen:item.isopen,
        keyword:item.keyword,
        label:item.label,
        labelId:item.labelId,
        status:item.status,
        title:item.title,
        type:item.type,
        typeId:item.typeId,
        imageList:item.imageList
      }
    })
  }
  setStatus(index){
    console.log(index);
  }
  delArticles(index){
    MessageBox.confirm('确认删除此文章?', '删除文章', {
      type: 'warning'
    }).then(() => {
      const data = this.state.data[index];
      const imageList = data.imageList;
      let array = [];
      if(imageList&&imageList.length){
        imageList.forEach((item)=>{
          if(item.isOss){
            array.push(item);
          }
        });
      }
      data.delList = array;
      axios.post('/del-articles',{data:JSON.stringify(data)}).then(res=>{
        if(Number(res.data.code)===0){
          this.state.data.splice(index,1);
          this.setState({
            data:this.state.data
          },()=>{
            Message({
              type: 'success',
              message: '文章删除成功'
            });
          });
        }else{
          Message({
            type: 'warning',
            message: '文章删除失败'
          });
        }
      }).catch(()=>{
        Message({
          type: 'warning',
          message: '文章删除失败'
        });
      });
    }).catch(()=>{
      Message({
        type: 'info',
        message: '已取消删除'
      });
    });
  }
  onPageChange(bool){
    const page = bool?this.state.page-1:this.state.page+1;
    this.setState({
      page
    },()=>{
      const data = this.getSearch();
      this.ajax_articles(data);
    })
  }
  onChangeSearch(type,index,data){
    const value = type==='label'?data[index].label:data[index];
    this.setState({
      [type]:value
    });
  }
  onInputSearch(event){
    const search = event.target.value.trim();
    this.setState({search});
  }
  getSearch(){
    const {label,type,isopen,status,search} = this.state;
    return {
      label:label==='全部'?'':label,
      type:type==='全部'?'':type,
      isopen:isopen==='全部'?'':isopen,
      status:status==='全部'?'':status,
      keyword:search,
    };
  }
  onSaveSearch(){
    const data = this.getSearch();
    this.setState({
      page:1
    },()=>{
      this.ajax_articles(data);
    });
  }
  ajax_getData(){
    this.ajax_articles({});
    this.ajax_labels();
  }
  ajax_searchArticles(data){
    this.setState({searchDisabled:true});
    axios.post('/search-articles',{
      data:JSON.stringify(data)
    }).then(res=>{
      if(Number(res.data.code)===0){
        this.setState({
          data:this.resizeList(res.data.data),
          searchDisabled:false
        })
      }else{
        this.warning('查询文章列表失败');
        this.setState({searchDisabled:false});
      }
    }).catch(err=>{
      this.warning('查询文章列表失败');
      this.setState({searchDisabled:false});
    })
  }
  ajax_articles(data){
    this.setState({searchDisabled:true});
    axios.post('/get-articles',{
      data:JSON.stringify(data),
      page:this.state.page,
      limit:this.state.limit
    }).then(res=>{
      if(Number(res.data.code)===0){
        let d2 = res.data.data.length<this.state.limit;
        this.setState({
          data:this.resizeList(res.data.data),
          count:res.data.count,
          page:this.state.page,
          isFrist:false,
          searchDisabled:false,
          isLoading:false,
          d2
        },()=>{
          const d1 = this.state.page===1;
          this.setState({d1})
        });
      }else{
        this.setState({searchDisabled:false,isLoading:false},()=>{
          this.warning('获取文章列表失败');
        });
      }
    }).catch(err=>{
      this.setState({searchDisabled:false,isLoading:false},()=>{
        this.warning('获取文章列表失败');
      });
    })
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
  ajax_labels(){
    axios.post('/get-labels',{data:JSON.stringify({})}).then(res=>{
      if(Number(res.data.code)===0){
        this.setState({
          labelList:this.state.labelList.concat(this.setDefaultLabel(res.data.data))
        });
      }else{
        this.warning('获取标签列表失败');
      }
    }).catch(err=>{
      this.warning('获取标签列表失败');
    })
  }
  componentWillMount() {
    this.ajax_getData();
  }
}
