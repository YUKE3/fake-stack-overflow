import React from 'react'
import { NavigationBar } from './Navigationbar'
import { useParams } from 'react-router-dom'
import axios from 'axios'

// props:
// navigate
// editId => if this form is for editing answer.
class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
            error: '',
        }

        this.onTextChange = this.onTextChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    componentDidMount() {
        if (this.props.editId) {
            axios.get(`http://localhost:8000/answer/${this.props.editId}`)
                .then((res) => {
                    this.setState({
                        text: res.data.text,
                    })
                })
                .catch((err) => {
                    this.setState({
                        error: 'Error while getting answer info, please refresh.'
                    })
                })
        }
    }

    onTextChange(e) {
        this.setState({
            text: e.target.value,
        })
    }

    onSubmit() {
        if (this.props.editId) {
            axios.post('http://localhost:8000/updateanswer', {
                text: this.state.text,
                qid: this.props.editId,
            }, { withCredentials: true })
                .then((res) => {
                    if (res.data === 'OK') { this.props.navigate('/userprofile')}
                    else { this.setState({ error: res.data })}
                })
        } else {
            axios.post('http://localhost:8000/postanswer', {
                text: this.state.text,
                qid: this.props.params.id,
            }, { withCredentials: true })
                .then((res) => {
                    if (res.data === 'OK') { this.props.navigate(`/questions/${this.props.params.id}`) }
                    else { this.setState({ error: res.data }) }
                })
        }
    }

    onDelete() {
        axios.post('http://localhost:8000/deleteanswer', {
            aid: this.props.editId,
        }, { withCredentials: true })
            .then((res) => {
                if (res.data === 'OK') { this.props.navigate('/userprofile') }
                else { this.setState({ error: res.data })}
            })
    }

    render() {
        return (
            <div>
                <NavigationBar navigate={this.props.navigate} />
                <div className='AnswerQuestion'>
                    <div>{this.state.error}</div> 
                    <div>Answer Text</div>
                    <textarea value={this.state.text} onChange={this.onTextChange}/>
                    <div>
                        <button onClick={this.onSubmit}>Submit</button>
                        {this.props.editId ? <button onClick={this.onDelete}>Delete</button>: ''}
                    </div>
                </div>
            </div>
        )
        
    }
}

export default (props) => {
    return (
        <AnswerQuestion
            {...props}
            params={useParams()}
            key={useParams().id} // Make sure that whenever query changes, componenet will remount.
        />
    )   
}