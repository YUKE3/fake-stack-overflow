import axios from "axios";
import React from "react";

// props:
// parent => is question or answer.
// pid => id of parent.
export class UpvoteDownvote extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentStatus: 'novote',
            voteNum: 0,
            error: false,
            guest: true,
        }

        this.onUpvote = this.onUpvote.bind(this)
        this.onDownvote = this.onDownvote.bind(this)
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/voteinfo/${this.props.parent}/${this.props.pid}`, { withCredentials: true })
            .then((res) => {
                this.setState({
                    currentStatus: res.data.currentStatus,
                    voteNum: res.data.voteNum,
                    guest: res.data.guest,
                })
            })
            .catch((err) => {
                this.setState({
                    error: true
                })
            })
    }

    onUpvote() {
        axios.post('http://localhost:8000/upvote/', {
            parent: this.props.parent,
            id: this.props.pid,
        },{ withCredentials: true })
            .then((res) => {
                if (res.data === 'OK') { this.componentDidMount() }
                else { alert(res.data) }
            })
            .catch(() => {
                alert('Error upvoting, please try again.')
            })
    }

    onDownvote() {
        axios.post('http://localhost:8000/downvote/', {
            parent: this.props.parent,
            id: this.props.pid,
        },{ withCredentials: true })
            .then((res) => {
                if (res.data === 'OK') { this.componentDidMount() }
                else { alert(res.data) }
            })
            .catch(() => {
                alert('Error downvoting, please try again.')
            })
    }

    render() {
        if (this.state.guest) {
            return(<div className="UpvoteDownvote">
                <div>{this.state.voteNum} {this.state.voteNum === 1 ? 'Vote' : 'Votes'}</div>
            </div>)
        }

        return (
            <div className="UpvoteDownvote">
                <button onClick={this.onUpvote} className={this.state.currentStatus === 'upvoted' ? 'upvoted' : 'upvote'}></button>
                {this.state.error ? <div>Error</div> : <div>{this.state.voteNum} {this.state.voteNum === 1 ? 'Vote' : 'Votes'}</div>}
                <button onClick={this.onDownvote} className={this.state.currentStatus === 'downvoted' ? 'downvoted' : 'downvote'}></button>
            </div>
        )
    }
}