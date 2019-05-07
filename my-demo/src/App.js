import React from "react";
import { Button, Input } from 'antd';
import 'antd/dist/antd.css'; 
import Form, { useForm }  from "use-form-hooks";

import './App.css';


const bottom16 = {
  marginBottom: '16px'
}

function Test() {
  const { getFieldDecorator, getFieldsValue } = useForm();
  function onSubmit(e) {
    const values = getFieldsValue();
  }

  return (
    <div style={{ maxWidth: 300, margin: '0 auto'}}>
        <div style={bottom16}>
        {getFieldDecorator("m", {
          initialValue: 12
        })(<Input placeholder="请输入" />)}
      </div>
      <div style={bottom16}>
        {getFieldDecorator("obj.b", {})(<Input placeholder="请输入" />)}
      </div>
      <div style={bottom16}>
        {getFieldDecorator("obj.c[0]", {
          initialValue: 1
        })(<Input placeholder="请输入" />)}
      </div>
      <div style={bottom16}>
        {getFieldDecorator("obj.c[1]", {
          initialValue: 3
        })(<Input placeholder="请输入" />)}
      </div>
      <div style={bottom16}>
        <Form.Field name="obj.n[0]" value={20}>
          <Input placeholder="请输入" />
        </Form.Field>
      </div>
      <Button
        type="primary"
        htmlType="submit"
        className="login-form-button"
        onClick={onSubmit}
      >
        保存
      </Button>
    </div>
  );
}


function App() {
  function onSubmit(value) {
    debugger
    console.log(value);
  }

  return (
    <div className="App">
      <h1>Hello</h1>
      <h2>welcome use use-form-hooks!</h2>
      <Form onSubmit={onSubmit} initialValues={{ m: 1 }}>
        <Test />
      </Form>
    </div>
  );
}

export default App;
