import React from 'react'
import axios from 'axios'
import { NavigationBar } from './Navigationbar'
import { QuestionsListDisplay } from './QuestionsListDisplay'
import { PageSelector } from './PageSelector'
import { TagDisplay } from './TagDisplay'
import { AnswerRow } from './AnswerRow'

export class UserProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            questions: [],
            tags: [],
            answers: [],
            loaded: false,
            qstnCurrPage: 1,
            ansCurrPage: 1,
            reputation: 0,
            accountDate: 0,
            error: false,
        }

        this.onQuestionPageChange = this.onQuestionPageChange.bind(this)
        this.onAnswerPageChange = this.onAnswerPageChange.bind(this)
    }

    componentDidMount() {
        axios.get('http://localhost:8000/mystuff', { withCredentials: true})
            .then((res) => {
                this.setState({
                    questions: res.data.questions,
                    tags: res.data.tags,
                    answers: res.data.answers,
                    loaded: true,
                    reputation: res.data.userinfo[0].reputation,
                    accountDate: res.data.userinfo[0].creation_date,
                })
            }).catch(() => {
                this.setState({
                    error: true,
                })
            })
    }

    onQuestionPageChange(newPage) {
        this.setState({
            qstnCurrPage: newPage,
        })
    }

    onAnswerPageChange(newPage) {
        this.setState({
            ansCurrPage: newPage,
        })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <div>
                    <NavigationBar selected='userprofile' navigate={this.props.navigate} />
                    <div>Loading...</div>
                </div>
            )
        }

        if (this.state.error) {
            return (
                <div>
                    <NavigationBar selected='userprofile' navigate={this.props.navigate} />
                    <div>Error getting user information, please refresh.</div>
                </div>
            )
        }

        let ansRows = []
        let answersToShow = this.state.answers.slice((this.state.ansCurrPage-1)*5, Math.min(this.state.answers.length, this.state.ansCurrPage*5))
        for (let i = 0; i < answersToShow.length; i++) {
            ansRows.push(
                <AnswerRow 
                    key={i}
                    answer={answersToShow[i]}
                    nocomment={true}
                    edit={true}
                />
            )
        }

        // Code adapted from: https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
        let delta = (Date.now() - new Date(this.state.accountDate)) / 1000
        let days = Math.floor(delta / 86400)
        delta -= days*86400
        let hours = Math.floor(delta / 3600) % 24
        delta -= hours*3600
        let minutes = Math.floor(delta / 60) % 60


        return (
            <div className='UserProfile'>
                <NavigationBar selected='userprofile' navigate={this.props.navigate} />
                <QuestionsListDisplay 
                    questions={this.state.questions.slice((this.state.qstnCurrPage-1)*5, Math.min(this.state.questions.length, this.state.qstnCurrPage*5))}
                    totalQuestions={this.state.questions.length}
                    title={'Your Questions'}
                    navigate={this.props.navigate}
                    edit={true}
                />
               
                <table className='UserProfileTable'>
                    <tbody>
                        <tr><td colSpan={3}>{
                            `You've been a member of FakeStackOverFlow for ${days} days, ${hours} hours, ${minutes} minutes.`
                        }</td></tr>
                        <tr><td colSpan={3}>Reputation: {this.state.reputation}</td></tr>
                        <tr><td colSpan={3}>Your Tags</td></tr>
                        <tr>
                            <td colSpan={3}>
                                {this.state.tags.length === 0 ? <div className='noansrow'>You don't have any tags created.</div> :
                                    <TagDisplay
                                    tagArr={this.state.tags}
                                    navigate={this.props.navigate}
                                    edit={true}
                                />
                                }
                            </td>
                        </tr>
                        <tr><td colSpan={3}>Your Answers</td></tr>
                        {ansRows.length === 0 ? <tr><td colSpan={3}><div className='noansrow'>You have not answered any questions.</div></td></tr> : ansRows}
                    </tbody>
                </table>
                <PageSelector 
                    currPage={this.state.qstnCurrPage}
                    numOfPages={Math.ceil(this.state.questions.length / 5)}
                    onClick={this.onQuestionPageChange}
                />
                <div><PageSelector 
                    currPage={this.state.ansCurrPage}
                    numOfPages={Math.ceil(this.state.answers.length / 5)}
                    onClick={this.onAnswerPageChange}
                /></div>
            </div>
            
        )
    }
}