import * as React from 'react';
import FormContext from './context';
const Form = ({ initialValues, children, onSubmit }) => {
    const [formData, setFormData] = React.useState(initialValues);
    function submit() {
        onSubmit(formData);
    }
    return (React.createElement(FormContext.Provider, { value: {
            formData,
            setFormData
        } },
        React.createElement("div", null, "updated"),
        React.createElement("form", { onSubmit: submit }, children)));
};
export default Form;
//# sourceMappingURL=form.js.map