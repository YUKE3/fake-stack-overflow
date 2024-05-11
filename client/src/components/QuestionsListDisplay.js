import React from "react";
import { Link } from 'react-router-dom';
import { TagDisplay } from "./TagDisplay";
import { TimeUserDisplay } from "./TimeUserDisplay";

// Props:
// questions => list of questions
// totalQuestions => number of total questions
// title => text
// navigate => navigate function for tag onclick.
// edit => whether on link click lead to to edit question or not.
export class QuestionsListDisplay extends React.Component {
    render() {
        let rows = []
        this.props.questions.forEach(q => {
            rows.push(
                <tr key={q._id}>
                    <td>
                        <div>{q.views}</div> <div>{q.views === 1 ? 'View' : 'Views'}</div>
                        <div>{q.answers.length}</div> <div>{q.answers.length === 1 ? 'Answer' : 'Answers'}</div>
                        <div>{q.upvotes.length - q.downvotes.length}</div> <div>{q.upvotes.length - q.downvotes.length === 1 ? 'Vote' : 'Votes'}</div>
                    </td>
                    <td>
                        <div><Link to={(this.props.edit ? '/editquestion/' : '/questions/') + q._id}>{q.title}</Link></div>
                        <p>{q.summary}</p>
                        <TagDisplay
                            tagIdArr={q.tags}
                            navigate={this.props.navigate}
                        />
                    </td>
                    <td>
                        <TimeUserDisplay 
                            userId={q.asked_by}
                            date={q.ask_date_time}
                            text={'Asked '}
                        />
                    </td>
                    
                </tr>
            )
        });

        if (rows.length === 0) {
            rows.push(
                <tr key='bruh'>
                    <td></td>
                    <td className="noquestion">No Question to display.</td>
                    <td></td>
                </tr>
            )
        }

        return (
            <table className='QuestionsListDisplay'>
                <thead>
                    <tr>
                        <td>{this.props.totalQuestions} {this.props.totalQuestions === 1 ? "Question" : "Questions"}</td>
                        <td>{this.props.title}</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }
}