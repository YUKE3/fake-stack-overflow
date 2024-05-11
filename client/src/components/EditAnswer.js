import { useParams } from "react-router-dom";
import AnswerQuestion from './AnswerQuestion'

export default (props) => {
    return (
        <AnswerQuestion
            {...props}
            editId={useParams().id}
        />
    )
}