import React, { useEffect } from 'react'
import { AUTH_USER_TOKEN_KEY } from '../../constants'
import { SomeService } from '../../services/some';

interface Props { }

function GetRecord(props: Props) {
    const { } = props;
    const someSvc = new SomeService();
    useEffect(() => {
        someSvc.getRecord(null).
            then(r => console.log(r))
            .catch(e => console.error(e))
    }, [])
    return (
        <div>
            <h1>GET</h1>
        </div>
    )
}

export default GetRecord
