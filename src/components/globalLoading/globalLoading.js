import React from 'react';
import Loading from '../loading/loading';
import {Button} from 'element-react';
function GlobalLoading(props) {
  if (props.error) {
    return (
      <div className="globalLoading" key="error">
        <div className="globalLoadingCover"></div>
        <div className="globalLoadingContent">
          <div className="globalLoadingError">
            组件加载失败
            <div className="globalLoadingBtn">
              <Button type="primary" onClick={()=>{this.props.history.replace('/')}}>主要按钮</Button>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (props.pastDelay) {
    return (
      <div className="globalLoading" key="success">
        <div className="globalLoadingCover"></div>
        <div className="globalLoadingContent"><Loading/></div>
      </div>
    )
  } else {
    return null;
  }
}
export default GlobalLoading;