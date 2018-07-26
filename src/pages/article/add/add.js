import React from 'react';
import {MessageBox} from 'element-react';
import PropTypes from 'prop-types';
import style from './add.styl';
import axios from 'axios';
import {ossUpload} from '../../../utils/ossUpload.js';
import Loading from '../../../components/loading/loading';
import {
  Form,
  Input,
  Radio,
  Button,
  Select,
  Message,
  Dialog
}from 'element-react';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import {mathId} from '../../../utils/utils.js';
export default class ArticleAdd extends React.Component {
  state = {
    id:null,
    content:'',
    menus:['文章管理','添加文章'],
    form:{
      title: '',
      keyword: '',
      describe: '',
      type: '',
      status: '' ||'发布',
      isopen: '' ||'公开',
    },
    label: '',
    labelId:'',
    src:[],
    typeList:['贤心','慢生活','碎言碎语'],
    labelList:[],
    uploadDisabled:false,
    saveDisabled:false,
    imageList:[],
    imageSrc:'',
    allImage:[],
    dialogVisible:false,
    dialogAllImage:false,
    markdownUpload:false,
    oldLableId:'',
    isLoading:true,
    delList:[]
  };
  static contextTypes = {
    onChangeUrl:PropTypes.func
  };
  render() {
    return (
      <div className={style.addBox}>
        <Breadcrumb menus={this.state.menus}/>
        <div className={style.formBox}>
          <div className={style.formBoxLeft}>
            <Form labelWidth="100" model={this.state.form}>
              <Form.Item label="文章标题">
                <Input value={this.state.form.title} onChange={this.onChange.bind(this,'title')}  placeholder="请输入文章标题"></Input>
              </Form.Item>
              <Form.Item label="文章关键字">
                <Input value={this.state.form.keyword} onChange={this.onChange.bind(this, 'keyword')} placeholder="请输入文章关键字"></Input>
              </Form.Item>
              <Form.Item label="文章标签">
                {
                  this.state.labelList&&this.state.labelList.length>0?
                  this.state.labelList.map((item,index)=>{
                    return (
                      <Button 
                        onClick={this.onChangeLabel.bind(this,index)} 
                        key={index} 
                        className={style.button}
                        type={this.state.labelId===item.labelId?'primary':item.isDefault?'success':''}
                      >
                        {item.label}
                      </Button>
                    )
                  }):<Button type="primary" loading={true}>标签加载中</Button>
                }
              </Form.Item>
              <Form.Item label="文章描述" style={{'marginTop':'-10px'}}>
                <Input 
                  type="textarea" 
                  value={this.state.form.describe}
                  onChange={this.onChange.bind(this,'describe')}
                  autosize={{minRows:6}}
                  placeholder="请输入文章描述"
                >
                </Input>
              </Form.Item>
              <Form.Item label="文章内容">
                <textarea
                  className={style.textarea} 
                  ref={ref=>this.textarea=ref}>
                </textarea>
              </Form.Item>
              <Form.Item>
                <Button
                  disabled={this.state.saveDisabled}
                  icon={this.state.saveDisabled?'loading':''}
                  type="primary"
                  onClick={this.onSave.bind(this)}>保存文章</Button>
              </Form.Item>
            </Form>
          </div>
          <div className={style.formBoxRight}>
              <Form labelWidth="100"  model={this.state.form}>
                <Form.Item label="文章分类">
                  <Select value={this.state.form.type} onChange={this.onChange.bind(this,'type')} placeholder="请选择文章分类">
                    {
                      this.state.typeList.map((item,index)=>{
                        return (
                          <Select.Option key={index} label={item} value={item}></Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="文章状态">
                  <Radio.Group value={this.state.form.status} onChange={this.onChange.bind(this,'status')}>
                    {
                      ['发布','草稿'].map((item,index)=>{
                        return (
                          <Radio key={index} value={item}></Radio>
                        )
                      })
                    }
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="是否公开">
                  <Radio.Group value={this.state.form.isopen} onChange={this.onChange.bind(this,'isopen')}>
                    {
                      ['公开','私密'].map((item,index)=>{
                        return (
                          <Radio key={index} value={item}></Radio>
                        )
                      })
                    }
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="文章封面图" style={{'borderTop':'1px solid #bfcbd9','paddingTop':'20px','marginBottom':'0'}}></Form.Item>
                <div className={style.itemImageBox}>
                  <div className={style.imgBox}>
                    {
                      this.state.src&&this.state.src.length>0&&this.state.src[0].url?
                      <div className={style.listImage}>
                        <i className={`${style.imgDel} el-icon-circle-cross`} onClick={this.delThumbnail.bind(this)}></i>
                        <img src={this.state.src[0].url} alt=""/>
                      </div>:
                      <label className={style.upload} htmlFor="inputfile">
                        <input
                          disabled={this.state.uploadDisabled}
                          type="file"
                          id="inputfile"
                          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                          className={style.uploadFile}
                          onChange={this.uploadThumbnail.bind(this)}/>
                        {
                          this.state.uploadDisabled?
                          <div className={style.loading}><i className={`el-icon-loading`}></i></div>:
                          <i className={`${style.icon} el-icon-plus`}></i>
                        }
                      </label>
                    }
                  </div>
                </div>
              </Form>
          </div>
        </div>
        {
          this.state.isLoading?<div className="adminLoading"><Loading/></div>:null
        }
        <Dialog
          customClass="customClass"
          title="文章图片"
          size="tiny"
          visible={ this.state.dialogVisible }
          onCancel={()=>{}}
          lockScroll={true}
          top={'30%'}
        >
          <Dialog.Body>
            <div className={style.diaBody}>
              <div className={style.diaTitle}>添加图片链接</div>
              <div><Input placeholder="请输入图片地址" value={this.state.imageSrc} onInput={this.diaInput.bind(this)}/></div>
              <div className={style.diaTitle} style={{'marginTop':'10px'}}>上传图片</div>
              <div className={`${style.uploadBox} clearfix`}>
                {
                  this.state.imageList&&this.state.imageList.length>0?
                  this.state.imageList.map((item,index)=>{
                    return (
                      <div key={index} className={style.diaUpload}>
                        <div className={style.diaImageBox}>
                          <i className={`${style.diaDel} el-icon-circle-cross`}></i>
                          <img className={style.diaImage} src={item.url} alt=""/>
                        </div>
                      </div>
                    )
                  }):null
                }
                <div className={style.diaUpload}>
                  <label className={style.labelUpload} htmlFor="diaUpload">
                    <div className={style.diaIcon}>
                      <i className={`${style.diaIcon1} ${this.state.markdownUpload?'el-icon-loading':'el-icon-plus'}`}></i>
                    </div>
                    <input
                      type="file"
                      id="diaUpload"
                      disabled={this.state.markdownUpload}
                      onChange={this.onUploadMark.bind(this)}
                      accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                      className={style.diaUploadFile}/>
                  </label>
                </div>
              </div>
            </div>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={this.diaCancel.bind(this)}>取消</Button>
            <Button type="primary" onClick={this.diaSave.bind(this)}>确定</Button>
          </Dialog.Footer>
        </Dialog>
        <Dialog
          customClass={`customClass customClass2`}
          title="文章图片"
          size="tiny"
          visible={this.state.dialogAllImage}
          onCancel={()=>{this.setState({dialogAllImage:false})}}
          lockScroll={true}
          top={'30%'}
        >
          <Dialog.Body>
            <div className={style.diaBody} style={{'paddingBottom':'15px'}}>
              <div className={`${style.uploadBox} clearfix`}>
                {
                  this.state.allImage.map((item,index)=>{
                    return (
                      <div key={index} className={style.diaUpload}>
                        <div className={style.diaImageBox}>
                          <i className={`${style.diaDel} el-icon-circle-cross`} onClick={this.delAllImage.bind(this,index)}></i>
                          <img className={style.diaImage} src={item.url} alt=""/>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </Dialog.Body>
        </Dialog>
      </div>
    )
  }
  onChangeLabel(index){
    const array = this.state.labelList[index];
    const label = array.label;
    const labelId = array.labelId;
    this.setState({label,labelId})
  }
  onChange(key,value){
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }
  warning(text,type){
    Message({
      message: text||'请正确填写信息',
      type: type||'warning',
    });
  }
  onSave(){
    const {title,keyword,type,status,isopen} = this.state.form;
    const {content,label,src,labelId,oldLableId}  = this.state;
    if (title === '') {
      this.warning('请输入文章标题');
      return false;
    }
    if (keyword === '') {
      this.warning('请输入文章关键字');
      return false;
    }
    if (label === '') {
      this.warning('请选择文章标签');
      return false;
    }
    if (content === '') {
      this.warning('请输入文章内容');
      return false;
    }
    if (type === '') {
      this.warning('请选择文章分类');
      return false;
    }
    if (status === '') {
      this.warning('请选择文章状态');
      return false;
    }
    if (isopen === '') {
      this.warning('请选择文章是否公开');
      return false;
    }
    let data = Object.assign({},this.state.form);
    data.content = content;
    data.label = label;
    data.image = src;
    data.labelId = labelId;
    data.articleId = this.state.id;
    data.imageList = this.state.allImage;
    data.delList = this.state.delList;
    data.oldLableId = labelId===oldLableId?'':oldLableId;
    this.setState({saveDisabled:true});
    axios.post('/add-articles',{data:JSON.stringify(data)}).then(res=>{
      if(Number(res.data.code)===0){
        sessionStorage.setItem('key','/home/article/list');
        this.props.history.push('/home/article/list');
        this.context.onChangeUrl('/home/article/list');
      }else{
        this.setState({
          saveDisabled:false
        },()=>{
          this.state.id?this.warning('更新文章失败'):this.warning('新增文章失败');
        });
      }
    }).catch(err=>{
      this.setState({
        saveDisabled:false
      },()=>{
        this.state.id?this.warning('更新文章失败'):this.warning('新增文章失败');
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
  initMarked(){
    this.mditor = window.Mditor.fromTextarea(this.textarea);
    this.mditor.on('ready', () => {
      this.mditor.value = this.state.content;
      this.mditor.toolbar.removeItem('help');
      // console.log(this.mditor.toolbar.items)  // 获取工具条
      this.mditor.toolbar.addItem({    // 已上传图片的列表
        handler:()=>{
          if(this.state.allImage.length===0){
            this.warning('当前暂未上传文章图片','info');
            return false;
          }
          this.setState({
            dialogAllImage:true
          });
        },
        key: 'shift+alt+p',
        name: 'edit',
        title: '已上传图片'
      });
      this.mditor.toolbar.addItem({  // 清空文档
        handler: () => {
          this.mditor.value = '';
        },
        key: 'shift+alt+p',
        name: 'remove',
        title: '清空文档',
        control:true
      });
      this.mditor.on('changed',()=>{   // 改变的时候
        this.setState({
          content: this.mditor.value
        })
      });
      const Upload = this.mditor.toolbar.getItem('image');  // 获取图片上传的
      Upload.handler = ()=> {
        this.setState({
          dialogVisible:true
        });
      };
    });
  }
  diaCancel(){
    const imageList = this.state.imageList;
    if(imageList&&imageList.length){
      this.ajax_delArticleImage(imageList);
    }
    this.setState({dialogVisible:false,imageList:[],imageSrc:''})
  }
  diaSave(){
    const imageList = this.state.imageList;
    const imageSrc = this.state.imageSrc;
    if(imageSrc!=='')
      imageList.unshift({isOss:false,url:imageSrc,imageId:mathId()});
    let str = '';
    imageList.forEach((item)=>{
      str += `![](${item.url})`;
    });
    if(str){
      if(this.mditor){
        this.mditor.editor.insertBeforeText(str);
        this.setState({
          dialogVisible:false,
          imageSrc:'',
          allImage:imageList.length===0?this.state.allImage:this.state.allImage.concat(imageList),
          imageList:[]
        });
      }else{
        this.warning('添加图片失败，没有获取到markdown编辑器实例');
      }
    }else{
      this.warning('没有添加图片');
      this.setState({dialogVisible:false,imageSrc:'',imageList:[]})
    }
  }
  delAllImage(index){  // 删除文章里边的图片
    const data = this.state.allImage[index];
    const url = data.url;
    let content = this.state.content;
    const articleId = this.state.id;
    if(articleId){
      if(data.isOss){
        this.state.delList.push(data);
      }
    }else{
      if(data.isOss){
        this.ajax_delArticleImage([data],null);
      }
    }
    if(this.mditor){
      content = content.replace(`![](${url})`,'');
      this.state.allImage.splice(index,1);
      this.setState({content,allImage:this.state.allImage,delList:this.state.delList},()=>{
        this.mditor.value = content;
        if(this.state.allImage.length===0){
          this.setState({
            dialogAllImage:false
          });
        }
      })
    }
  }
  diaInput(event){
    const imageSrc = event.target.value.trim();
    this.setState({imageSrc});
  }
  ajax_delArticleImage(data,fnArray){
    axios.post('/del-articles-image',{
      data:JSON.stringify(data)
    }).then(res=>{
      fnArray&&fnArray.length&&typeof fnArray[0]==='function'&&fnArray[0](res);
    }).catch(err=>{
      fnArray&&fnArray.length&&typeof fnArray[1]==='function'&&fnArray[1](err);
    });
  }
  ajax_initDetails(){
    const data = JSON.stringify({articleId:this.state.id});
    axios.post('/get-articles',{data:data}).then(res=>{
      if(Number(res.data.code)===0){
        const dt = res.data.data[0];
        this.setState({
          content: dt.content,
          label: dt.label,
          labelId:dt.labelId,
          oldLableId:dt.labelId,
          src: dt.image||'',
          form: {
            title: dt.title||'',
            keyword: dt.keyword||'',
            describe: dt.describe||'',
            type: dt.type||'',
            status: dt.status || '发布',
            isopen: dt.isopen || '公开',
          },
          allImage:dt.imageList,
          isLoading:false
        },()=>{
          if(this.mditor){
            this.mditor.value = this.state.content
          }
        })
      }else{
        this.warning('获取文章失败');
      }
    }).catch(err=>{
      this.warning('获取文章失败');
    });
  }
  ajax_initLables(){
    axios.post('/get-labels',{data:JSON.stringify({})}).then(res=>{
      if(Number(res.data.code)===0){
        this.setState({
          labelList:this.setDefaultLabel(res.data.data)
        })
      }else{
        this.warning('获取标签列表失败');
      }
    }).catch(err=>{
      this.warning('获取标签列表失败');
    })
  }
  delThumbnail(){
    const self = this;
    MessageBox.confirm('是否删除此封面图?', '删除封面图', {
      type: 'warning'
    }).then(() => {
      this.ajax_delArticleImage(this.state.src,[function(res){
        if(res.data.code){
          self.setState({
            src:[]
          },()=>{
            self.warning('封面图删除成功','success');
          })
        }else{
          self.warning('封面图删除失败');
        }
      },function(){
        self.warning('封面图删除失败')
      }]);
    }).catch(() => {
      self.warning('已取消删除','info')
    });
  }
  async onUploadMark(event){
    const self = this;
    const target = event.target;
    const file = target.files[0];
    const size = file.size/1024/1024;
    if(size>=1){
      self.warning('图片不能超过1M');
      target.value = '';
      return false;
    }
    this.setState({markdownUpload:true});
    const sign = await axios.post('/get-sign').then(res=>res.data);
    if(sign.code){
      const oss = sign.data;
      const host = 'https://zgj-blogs.oss-cn-beijing.aliyuncs.com';
      const ossPath = (new Date().getTime())+file.name;
      const path = 'cover/'+ossPath;
      ossUpload({
        url:host,
        data:{
          key:path,
          policy:oss.policy,
          OSSAccessKeyId:oss.accesskey,
          success_action_status:'200',
          signature:oss.signature,
          name:file.name,
          file:file
        },
        success(){
          const url = `https://img.aiwuwei.cn/${path}`;
          self.setState({
            imageList:self.state.imageList.concat({isOss:true,url:url,imageId:mathId(),fileName:ossPath}),
            markdownUpload:false
          },()=>{
            target.value = '';
            self.warning('图片上传成功','success');
          });
        },
        error(){
          self.setState({
            markdownUpload:false
          },()=>{
            target.value = '';
            self.warning('图片上传失败');
          });
        }
      })
    }else{
      this.setState({
        markdownUpload:false
      },()=>{
        this.warning('获取oss签名失败');
        target.value = '';
      });
    }
  }
  async uploadThumbnail(event){ // 上传封面图
    this.setState({
      uploadDisabled:true
    });
    const self = this;
    let target = event.target;
    const sign = await axios.post('/get-sign').then(res=>res.data);
    const file = target.files[0];
    const size = file.size/1024/1024;
    if(size>=1){
      this.warning('封面图不能超过1M');
      target.value = '';
      return false;
    }
    if(sign.code){
      const oss = sign.data;
      const host = 'https://zgj-blogs.oss-cn-beijing.aliyuncs.com';
      const ossPath = (new Date().getTime())+file.name;
      const path = 'cover/'+ossPath;
      ossUpload({
        url:host,
        data:{
          key:path,
          policy:oss.policy,
          OSSAccessKeyId:oss.accesskey,
          success_action_status:'200',
          signature:oss.signature,
          name:file.name,
          file:file
        },
        success(){
          const url = `https://img.aiwuwei.cn/${path}`;
          self.setState({
            src:[{url:url,fileName:ossPath}],
            uploadDisabled:false
          },()=>{
            target.value = '';
            self.warning('封面图上传成功','success');
          });
        },
        error(){
          self.setState({
            src:'',
            pathSrc:'',
            uploadDisabled:false
          },()=>{
            target.value = '';
            self.warning('封面图上传失败');
          });
        }
      })
    }else{
      this.setState({
        uploadDisabled:false
      },()=>{
        self.warning('获取oss签名失败');
        target.value = '';
      });
    }
  }
  componentWillMount(){
    const {params} = this.props.match;
    const id = params.id?params.id:null;
    if(id){
      this.setState({id},this.ajax_initDetails)
    }else{
      this.setState({
        isLoading:false
      })
    }
    this.ajax_initLables();
  }
  componentDidMount(){
    this.initMarked();
  }
}