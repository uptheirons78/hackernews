import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const green = {
    color: '#808080',
    fontSize: '60px'
}

const Loading = () => (
    <div>
        <FontAwesomeIcon style={green} icon="sync-alt" spin />
    </div>
)

export default Loading