import * as React from 'react';
import {Tab, Tabs} from '@mui/material';

function MenuAppBar() {
    return (
        <Tabs
            style={{backgroundColor: '#01A9F4',height:"56px"}}
            scrollButtons
            allowScrollButtonsMobile
        >
            <Tab style={{color:"#FFFFFF"}} label={"Views access"} sx={{ textTransform: 'none', fontWeight:"bold"}} />
        </Tabs>
    );
}

export default MenuAppBar;
