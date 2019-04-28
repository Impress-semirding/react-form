import React from "react";
import { Input } from 'antd';

import Form, { hooks }  from "use-form-hooks";


const { getFieldDecorator } = hooks;

function Test() {
  return (
    <div>
      {getFieldDecorator("m", {
        initialValue: 12
      })(<Input placeholder="请输入" />)}
      {getFieldDecorator("obj.b", {})(<Input placeholder="请输入" />)}
      {getFieldDecorator("obj.c[0]", {
        initialValue: 1
      })(<Input placeholder="请输入" />)}
      {getFieldDecorator("obj.c[1]", {
        initialValue: 3
      })(<Input placeholder="请输入" />)}
    </div>
  );
}

function onSubmit(value) {
  debugger;
  console.log(value);
}


function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Form onSubmit={onSubmit} initialValues={{ m: 1 }}>
        <Test />
        <input type="submit" value="提交" />
      </Form>
    </div>
  );
}

export default App;
