import React from 'react';


const Message = ({chat}) => (
    <li className={`chatmsg ${'user' === chat.sender ? "usermsg" : "servermsg"}`}>
        {'user' !== chat.sender
           && chat.output.split('\n').map(text => <p>{text}</p>)
        }
        {'user' === chat.sender
           && chat.input
        }
    </li>
);

export default Message;