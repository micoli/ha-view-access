import * as React from 'react';
import UserViewGrid from './pages/UserViewGrid';
import Menu from "./components/Menu";

export default function App() {
    return (
        <React.Fragment>
            <Menu/>
            <UserViewGrid />
        </React.Fragment>
    );
}
