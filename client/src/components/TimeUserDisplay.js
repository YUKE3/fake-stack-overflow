import axios from 'axios'
import React from 'react'

// Props:
// userId => id of user to display.
// date => date to display.
// text => text before date
export class TimeUserDisplay extends React.Component {
    constructor(props) {
        super(props)

        this.state = { username: '' }
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/userinfo/${this.props.userId}`)
            .then((res) => {
                this.setState({ username: res.data.username })
            })
            .catch({
                username: 'server error'
            })
    }

    render() {
        return (
            <div className='TimeUserDisplay'>
                <div>
                    {this.props.text} <span>{new Date(this.props.date).toLocaleDateString("en-US", {month: 'short', day: '2-digit', year: 'numeric'})}</span>
                </div>
                <div> 
                    at <span>{new Date(this.props.date).toLocaleTimeString("en-US", {hour: '2-digit', minute: '2-digit', hour12: false})}</span>
                </div>
                <div>By <span>{this.state.username}</span></div>
            </div>
        )
    }
}