import React from 'react';


const DbAppMenu = ({menu}) => (
    <li className={`dbAppMenuItem ${true === menu.current ? "active" : ""}`}>
        <a href="#" id={"menu_item_" + menu.item + "_"+menu.schemaName}>
           {menu.item}
        </a>
    </li>

);

export default DbAppMenu;