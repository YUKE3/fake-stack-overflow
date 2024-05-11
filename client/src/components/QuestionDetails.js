import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { NavigationBar } from './Navigationbar'
import { PageSelector } from './PageSelector'
import { TagDisplay } from './TagDisplay'
import { TimeUserDisplay } from './TimeUserDisplay'
import { Comments } from './Comments'
import { AnswerRow } from './AnswerRow'
import { UpvoteDownvote } from './UpvoteDownvote'

class QuestionDetails extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            question: { // Initialize all arrays so when question isn't fetched yet, the website don't explode
                // answers: [],
                // upvotes: [],
                // downvotes: [],
                // tags: [],
            },
            currPage: 1,
            loaded: false,
            answers: [],
            loggedIn: false,
            error: false,
        }

        this.onPageChange = this.onPageChange.bind(this)
    }
    
    componentDidMount() {
        const { id } = this.props.params
        axios.get(`http://localhost:8000/questions/${id}`)
            .then((res) => {
                this.setState({
                    loaded: true,
                    question: res.data
                })
            }).catch(() => {
                this.setState({
                    loaded: true,
                    error: true,
                })
            })
        axios.get(`http://localhost:8000/answersofquestion/${id}`)
            .then((res) => {
                this.setState({
                    answers: res.data
                })
            }).catch(() => {
                this.setState({
                    error: true,
                })
            })
        axios.get('http://localhost:8000/sessioninfo', {
            withCredentials: true,
        }).then((res) => {
            this.setState({
                loggedIn: res.data.loggedIn,
            })
        }).catch(() => {
            this.setState({
                loggedIn: false,
            })
        })
    }

    onPageChange(newPage) {
        this.setState({
            currPage: newPage,
        })
    }

    render() {
        if (!this.state.loaded) {
            return (<div className='QuestionDetails'>
                        <NavigationBar selected='' navigate={this.props.navigate} />
                        <div>Loading...</div>
                    </div>)
        }

        if (this.state.error) {
            return (<div className='QuestionDetails'>
                        <NavigationBar selected='' navigate={this.props.navigate} />
                        <div>Error getting question details, please refresh.</div>
                    </div>)
        }

        let rows = []
        let answersToShow = this.state.answers.slice((this.state.currPage-1)*5, Math.min(this.state.answers.length, this.state.currPage*5))
        for (let i = 0; i < answersToShow.length; i++) {
            rows.push(
                <AnswerRow 
                    key={i}
                    answer={answersToShow[i]}
                    loggedIn={this.state.loggedIn}
                />
            )
        }

        return (
            <div className='QuestionDetails'>
                <NavigationBar selected='' navigate={this.props.navigate} />
                
                <table>
                    <thead>
                        <tr>
                            <td>
                                <div>{this.state.question.views}</div> <div>{this.state.question.views === 1 ? 'View' : 'Views'}</div>
                                <div>{this.state.question.answers.length}</div> <div>{this.state.question.answers.length === 1 ? 'Answer' : 'Answers'}</div>
                            </td>
                            <td>{this.state.question.title}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <UpvoteDownvote 
                                    parent='question'
                                    pid={this.state.question._id}
                                />
                            </td>
                            <td>
                                <p>{this.state.question.text}</p>
                                <TagDisplay 
                                    tagIdArr={this.state.question.tags}
                                    navigate={this.props.navigate}
                                />
                                <Comments commentsIdArr={this.state.question.comments} parent={'question'} pid={this.state.question._id} loggedIn={this.state.loggedIn}/>
                            </td>
                            <td>
                                <TimeUserDisplay 
                                    userId={this.state.question.asked_by}
                                    date={this.state.question.ask_date_time}
                                    text={'Asked '}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={3}>Answers</td></tr>
                        {rows}
                        <tr><td colSpan={3}><button onClick={() => this.props.navigate(`/questions/${this.props.params.id}/answer`)}>Answer Question</button></td></tr>
                    </tbody>
                </table>
                
                <PageSelector 
                    currPage={this.state.currPage}
                    numOfPages={Math.ceil(this.state.question.answers.length / 5)}
                    onClick={this.onPageChange}
                />
            </div>
        )
    }
}

// This is a function wrapper so I can use useParams().
// This is by far the easiest way I can see while still being able to use router redirects.
// eslint-disable-next-line
export default (props) => {
    return (
        <QuestionDetails 
            {...props}
            params={useParams()}
            key={useParams().id} // Make sure that whenever query changes, componenet will remount.
        />
    )   
}