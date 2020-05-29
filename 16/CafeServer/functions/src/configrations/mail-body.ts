import { Sample } from '../models/sample';
const emailBodyColor = '#E1E1DF';

export const sampleEmailBody = ( message:string,  data: Sample): string => {
    return `
  <style>
    body {background-color: ${emailBodyColor};}
    p {margin-top: 0.5em; margin-bottom: 0.5em;}
  </style>
  
  <p style="margin-bottom: 2em;">${message} </p>
  <p style="margin-bottom: 2em;">こんにちは、Sampleです。</p>
  <p>おかしDB ${data.id} の取得命令をうけました！！！！！！</p>
  <p>引っ張ってきたデータは以下です！！！！</p>
    
  <div style="margin: 2em;">
    <p>id: ${data.id}</p>
    <p>name: ${data.name}</p>
    <p>価格: ${data.price}</p>
  </div>
  
  <p>本メールの内容にお心当たりがない場合は、破棄をお願いします！！！！</p>
  `;
  };