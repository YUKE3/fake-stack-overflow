import React from 'react'
import axios from 'axios'
import { NavigationBar } from './Navigationbar'
import { PageSelector } from './PageSelector'
import { QuestionsListDisplay } from './QuestionsListDisplay'

// props:
// questions: if given, render this list of questions instead.
// title: if given, render this instead of "All Questions"
export class QuestionsList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            questions: [],
            currPage: 1,
            error: false,
        }

        this.onPageChange = this.onPageChange.bind(this)
    }

    componentDidMount() {
        if (!this.props.questions) {
            axios.get('http://localhost:8000/questions')
                .then((res) => {
                    this.setState({
                        questions: res.data,
                    })
                }).catch(() => {
                    this.setState({
                        error: true,
                    })
                })
        }
    }

    onPageChange(newPage) {
        this.setState({
            currPage: newPage
        })
    }

    render() {
        let questions = (this.props.questions ? this.props.questions : this.state.questions)

        if (this.state.error || this.props.error) {
            return (
                <div className='QuestionsList'>
                    <NavigationBar selected='questions' navigate={this.props.navigate} />
                    <div>Error getting question list from server.</div>
                </div>
            )
        }

        return (
            <div className='QuestionsList'>
                <NavigationBar selected='questions' navigate={this.props.navigate} />
                <QuestionsListDisplay 
                    questions={questions.slice((this.state.currPage-1)*5, Math.min(questions.length, this.state.currPage*5))}
                    totalQuestions={questions.length}
                    title={(this.props.title ? this.props.title : 'All Questions')}
                    navigate={this.props.navigate}
                />
                <PageSelector 
                    currPage={this.state.currPage}
                    numOfPages={Math.ceil(questions.length / 5)}
                    onClick={this.onPageChange}
                />
            </div>
            
        )
    }
}