import React from 'react'
import { Comments } from './Comments'
import { TimeUserDisplay } from './TimeUserDisplay'
import { Link } from "react-router-dom"
import { UpvoteDownvote } from './UpvoteDownvote'

// Props:
// answer: answer object
// loggedIn: if user is logged in, determines if to display input for comments.
// edit: if provided, make answer text a link that allows for user to edit the answer.
export class AnswerRow extends React.Component {
    render() {
        return (
            <tr className='AnswerRow'>
                <td><UpvoteDownvote parent='answer' pid={this.props.answer._id} /></td>
                <td>
                    <p>{this.props.edit ? <Link to={`/editanswer/${this.props.answer._id}`}>{this.props.answer.text}</Link> : this.props.answer.text}</p>
                    {this.props.nocomment ? '' : <Comments parent={'answer'} pid={this.props.answer._id} loggedIn={this.props.loggedIn}/>}
                </td>
                <td>
                    <TimeUserDisplay 
                        userId={this.props.answer.ans_by}
                        text={'Answerd '}
                        date={this.props.answer.ans_date_time}
                    />
                </td>
            </tr>
        )
    }
}