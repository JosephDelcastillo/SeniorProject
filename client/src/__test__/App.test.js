import React from "react";
import ReactDOM from "react-dom";
import Login from '../Pages/Login';
import App from '../Pages/Home';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
})

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Login />, div);
    ReactDOM.unmountComponentAtNode(div);
})