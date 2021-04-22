import React from 'react'
import { SomeService } from '../../services/some'

interface Props { }

function CreateRecord(props: Props) {
    const { } = props

    return (
        <button onClick={() => {
            const someSvc = new SomeService();
            someSvc.createRecord({
                email: "test",
                name: "test"
            })
                .then(r => console.log(r))
                .catch(e => console.error(e))
        }}>
            Create
        </button>
    )
}

export default CreateRecord