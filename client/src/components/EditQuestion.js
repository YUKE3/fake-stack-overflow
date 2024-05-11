import { useParams } from 'react-router-dom'
import { AskQuestion } from './AskQuestion'

export default (props) => {
    return (
        <AskQuestion 
            {...props}
            editId={useParams().id}
        />
    )
}