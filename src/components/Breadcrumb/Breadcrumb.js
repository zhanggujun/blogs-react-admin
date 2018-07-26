import React from 'react';
import { Breadcrumb } from 'element-react';
import style from './Breadcrumb.styl';
export default ({ menus, ...props }) => (
  <div className={style.header}>
    <Breadcrumb separator="/">
      {
        menus && menus.map(item =>
          <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
        )
      }
    </Breadcrumb>
  </div>
);