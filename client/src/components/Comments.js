import React from "react";
import { PageSelector } from "./PageSelector";
import { IndividualComment } from "./IndividualComment";
import axios from "axios";

// Props:
// parent => what parent does this comment belong to (question or answer)
// pid => id of parent
// loggedIn => whether the user is logged in or not, does not display comment input if not logged in.
export class Comments extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            currPage: 1,
            commentsArr: [],
            text: '',
            error: false,
        }

        this.onPageChange = this.onPageChange.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onKey = this.onKey.bind(this)
    }

    componentDidMount() {
        axios.post('http://localhost:8000/commentlist/', {
            id: this.props.pid,
            parent: this.props.parent,
        })
            .then((res) => {
                this.setState({
                    commentsArr: res.data,
                    text: '',
                })
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
    }

    onPageChange(newPage) {
        this.setState({
            currPage: newPage,
        })
    }

    onTextChange(e) {
        this.setState({
            text: e.target.value,
        })
    }

    onKey(e) {
        if (e.keyCode === 13) {
            this.onSubmit()
        }
    }

    onSubmit() {
        axios.post('http://localhost:8000/postcomment', {
            parent: this.props.parent,
            id: this.props.pid,
            text: this.state.text,
        }, { withCredentials: true })
            .then((res) => {
                if (res.data === 'OK') { this.componentDidMount() }
                else { alert(res.data) }
            })
            .catch(() => {
                alert('Failed to post comment, please try again later.')
            })
    }

    render() {
        let comments = []

        let commentsToDisplay = this.state.commentsArr.slice((this.state.currPage-1)*3, Math.min(this.state.commentsArr.length, this.state.currPage*3))

        for (let i = 0; i < commentsToDisplay.length; i++) {
            comments.push(<IndividualComment key={commentsToDisplay[i]._id} comment={commentsToDisplay[i]}/>)
        }

        if (this.props.loggedIn || this.state.error) {
            comments.push(<input onKeyDown={this.onKey} key={'inputlol'} value={this.state.text} onChange={this.onTextChange} placeholder="Write a comment..." />)
            comments.push(<button key={'buttonlol'} onClick={this.onSubmit}>Submit</button>)
        }

        return (
            <div className="Comments">
                <div>Comments:</div>
                {this.state.error ? <div>Error getting comments from server</div>: comments}
                <PageSelector 
                    currPage={this.state.currPage}
                    numOfPages={Math.ceil(this.state.commentsArr.length / 3)}
                    onClick={this.onPageChange}
                />
            </div>
        )
    }
}