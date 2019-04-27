import * as React from 'react';
import FormContext from './context';
const Form = ({ initialValue, onSubmit, children }) => {
    const [formData, setFormData] = React.useState({});
    // if (initialValue) {
    //   setFormData(initialValue);
    // }
    return (React.createElement(FormContext.Provider, { value: {
            formData,
            setFormData
        } }, children));
};
export default Form;
//# sourceMappingURL=form.js.map