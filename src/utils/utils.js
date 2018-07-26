import crypto from 'crypto';
export function TransTime(time,type){
  function addZero(str){
    return str<10?`0${str}`:str;
  }
  const date = new Date(time);
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hour = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const seconds = addZero(date.getSeconds());
  let str;
  switch(type){
    case 'yy':
      str = year;
      break;
    case 'mm':
      str = `${year}-${month}`;
      break;
    case 'dd':
      str = `${year}-${month}-${day}`;
      break;
    case 'hh':
      str = `${year}-${month}-${day} ${hour}`;
      break;
    case 'min':
      str = `${year}-${month}-${day} ${hour}:${minutes}`;
      break;
    case 'ss':
      str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
      break;
    default:
      str = `${year}-${month}-${day}`;
      break;
  }
  return str;
}
export function mathId(){
  const str = ('Math_' + Math.random() + new Date().getTime()).replace('.', '');
  const md5 = crypto.createHash("md5");
  const MathId = md5.update(str).digest("hex");
  return MathId;
}