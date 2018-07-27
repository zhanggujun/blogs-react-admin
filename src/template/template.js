/**
 * 路由组件出口文件
 */
import Loadable from 'react-loadable';
// import HomeIndex from '../pages/home/index';
import Loading from '../components/globalLoading/globalLoading';
const HomeIndex = Loadable({
  loader:()=>import('../pages/home/index'),
  loading:Loading,
});
const ArticleAdd = Loadable({
  loader:()=>import('../pages/article/add/add'),
  loading:Loading,
});
const ArticleList = Loadable({
  loader:()=>import('../pages/article/list/list'),
  loading:Loading,
});
const Label = Loadable({
  loader:()=>import('../pages/label/list/label'),
  loading:Loading,
});
const Link = Loadable({
  loader:()=>import('../pages/link/link'),
  loading:Loading,
});
const Users = Loadable({
  loader:()=>import('../pages/users/list'),
  loading:Loading,
});

export default {
  HomeIndex,
  ArticleAdd,
  ArticleList,
  Label,
  Link,
  Users
}