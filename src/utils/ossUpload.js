// export function ossUpload(data){
//   const url = data.url;
//   const method = data.method||'POST';
//   const dt = data.data;
//   const formData = new FormData();
//   const async = data.async==null?true:data.async;
//   let progress = data.progress||function(){};
//   let success = data.success||function(){};
//   let error = data.error||function(){};
//   for(let key in dt){
//     formData.append(key,dt[key]);
//   }
//   const xmlHttp = new XMLHttpRequest();
//   if (xmlHttp.upload) {
//     // 监听进度条必须在调用open方法之前
//     xmlHttp.upload.addEventListener('progress',(event)=>{
//       event = event || window.event;
//       var number = parseFloat(event.loaded / event.total) * 100;
//       var nowSize = parseFloat(event.loaded / 1204 / 1024).toFixed(2) + 'M';
//       var allSize = parseFloat(event.total / 1204 / 1024).toFixed(2) + 'M';
//       progress(true, number, nowSize, allSize);
//     }, false);
//   } else {
//     progress(false);
//   }
//   xmlHttp.open(method, url, async);
//   xmlHttp.send(formData);
//   xmlHttp.onreadystatechange = function () {
//     if (xmlHttp.readyState === 4) {
//       if (xmlHttp.status === 200) {
//         success(xmlHttp.responseText);
//       } else {
//         error(xmlHttp.responseText);
//       }
//     }
//   };
// }
export function ossUpload({
  method = 'POST',
  url = '',
  async = true,
  data = null,
  form,
  success = function () { },
  error = function () { },
  progress = function () { },
} = {}) {
  method = method.toUpperCase();
  const xmlHttp = new XMLHttpRequest();
  const params = [];
  const formData = new window.FormData();
  Object.keys(data).forEach((key) => {
    params.push(`${key}=${data[key]}`);
    formData.append(key, data[key]);
  });
  if (xmlHttp.upload) {
    // 监听进度条必须在调用open方法之前
    xmlHttp.upload.addEventListener('progress', function (event) {
      event = event || window.event;
      var number = parseFloat(event.loaded / event.total) * 100;
      var nowSize = parseFloat(event.loaded / 1204 / 1024).toFixed(2) + 'M';
      var allSize = parseFloat(event.total / 1204 / 1024).toFixed(2) + 'M';
      progress(true, number, nowSize, allSize);
    }, false);
  } else {
    progress(false);
  }
  if (method === 'GET') {
    xmlHttp.open(method, `${url}?${params.join('&')}`, async);
    xmlHttp.send(null);
  } else {
    /* 默认参数形式为 request payload */
    if (form === true) {
      /* 参数形式为 form data 与用params.join('&')还是formData对象并无关系 */
      xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    }
    xmlHttp.open(method, url, async);
    xmlHttp.send(formData); /* 可能formData对象，或者params.join('&')字符串都可以 formData支持文件 但不可以直接用JSON对象 */
  }

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        success(xmlHttp.responseText);
      } else {
        error(xmlHttp.responseText);
      }
    }
  };
}
