import React from 'react'
import axios from 'axios'
import { NavigationBar } from './Navigationbar'

// Props: 
// navigate => method to navigate around
// editId => answer id of question being edited. (If this is not a new question)
export class AskQuestion extends React.Component {
    constructor(props) {
        super(props)

        this.state = ({
            loggedIn: false,
            loaded: false,
            qstn_title: '',
            qstn_summary: '',
            qstn_text: '',
            qstn_tags: '',
            error: '',
        })

        this.onTextInput = this.onTextInput.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    componentDidMount() {
        axios.get('http://localhost:8000/sessioninfo', { withCredentials: true })
            .then((res) => {
                this.setState({
                    loggedIn: res.data.loggedIn,
                    loaded: true,
                })
            })
            .catch(() => {
                this.setState({
                    loaded: true,
                    error: 'Error getting session information, please refresh.'
                })
            })

        if (this.props.editId) {
            axios.get(`http://localhost:8000/questionsnoincr/${this.props.editId}`)
                .then((res) => {
                    let tagString = ''
                    for (let i = 0; i < res.data.tags.length; i++) {
                        tagString += res.data.tags[i].name + ' '
                    }

                    this.setState({
                        qstn_title: res.data.title,
                        qstn_summary: res.data.summary,
                        qstn_tags: tagString,
                        qstn_text: res.data.text,
                    })
                })
                .catch(() => {
                    this.setState({
                        error: 'Error getting question data, please refresh.'
                    })
                })
        }
    }

    onTextInput(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    onSubmit() {
        if (this.props.editId) {
            axios.post('http://localhost:8000/updatequestion', {
                id: this.props.editId,
                title: this.state.qstn_title,
                summary: this.state.qstn_summary,
                text: this.state.qstn_text,
                tags: this.state.qstn_tags,
            }, { withCredentials: true })
                .then((res) => {
                    if (res.data === 'OK') { this.props.navigate('/userprofile') }
                    else {
                        this.setState({
                            error: res.data
                        })
                    }
                })
                .catch(() => {
                    this.setState({
                        error: 'Error submitting change, please try again later.'
                    })
                })
        } else {
            axios.post('http://localhost:8000/postquestion', {
                title: this.state.qstn_title,
                summary: this.state.qstn_summary,
                text: this.state.qstn_text,
                tags: this.state.qstn_tags,
            }, { withCredentials: true })
                .then((res) => {
                    if (res.data === 'OK') {
                        this.props.navigate('/questions')
                    } else {
                        this.setState({
                            error: res.data
                        })
                    }
                })
                .catch(() => {
                    this.setState({
                        error: 'Error submitting question, please try again later.'
                    })
                })
        }
    }

    onDelete() {
        axios.post('http://localhost:8000/deletequestion', { id: this.props.editId }, { withCredentials: true })
            .then((res) => {
                if (res.data === 'OK') { this.props.navigate('/userprofile') }
                else { alert(res.data) }
            })
            .catch(() => {
                this.setState({
                    error: 'Error deleting the question, please try again later.'
                })
            })
    }

    render() {
        let body = <div>Loading</div>

        if (this.state.loaded && this.state.loggedIn) {
            body = (
                <div className='AskQuestion'>
                    <div>{this.state.error}</div> 
                    <div>Question Title</div>
                    <input id='qstn_title' value={this.state.qstn_title} onChange={this.onTextInput}/>
                    <div>Question Summary</div>
                    <textarea id='qstn_summary' value={this.state.qstn_summary} onChange={this.onTextInput}/>
                    <div>Question Text</div>
                    <textarea id='qstn_text' value={this.state.qstn_text} onChange={this.onTextInput}/>
                    <div>Question Tags</div>
                    <textarea id='qstn_tags' value={this.state.qstn_tags} onChange={this.onTextInput}/>
                    <div>
                        <button onClick={this.onSubmit}>Submit</button>
                        {this.props.editId ? (<button onClick={this.onDelete}>Delete</button>) : ''}
                    </div>
                </div>
            )
        }

        if (this.state.loaded && !this.state.loggedIn) {
            body = (
                <div>Please login.</div>
            )
        }

        return (
            <div>
                <NavigationBar navigate={this.props.navigate} />
                {body}
            </div>
            
        )
    }
}