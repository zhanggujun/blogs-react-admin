import React from 'react';
import { Menu } from 'element-react';
import { Link } from 'react-router-dom';
const renderMenuItem = (item,onRouter) => ( // item.route 菜单单独跳转的路由
    <Menu.Item key={item.key} index={item.key}>
      {item.icon?<i className={item.icon}></i>:null}{item.title}
      <Link className="nav-link" to={item.route || item.key}></Link>
    </Menu.Item>
);

const renderSubMenu = item => ( 
  <Menu.SubMenu
    key={item.key} 
    index={item.key}
    title={
      <span><i className={item.icon}></i>{item.title}</span>
    }>
      {
        item.subs.map(item => renderMenuItem(item))
      }
  </Menu.SubMenu>
);

export default ({ menus, ...props }) => (
  <Menu {...props}>
    {menus && menus.map(item => 
      item.subs ? renderSubMenu(item,props.onRouter) : renderMenuItem(item,props.onRouter)
    )}
  </Menu>
);