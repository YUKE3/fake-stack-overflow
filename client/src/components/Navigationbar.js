import axios from "axios"
import React from "react"
import { Link } from "react-router-dom"

// Props:
// navigate => function to navigate to other pages.
// selected => what page is currently selected.
export class NavigationBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false,
            username: '',
            searchbar: '',
        }

        this.onLogout = this.onLogout.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
    }

    onLogout() {
        axios.post('http://localhost:8000/logout', {}, {
            withCredentials: true,
        }).then((res) => {
            if (res.data === 'OK') {
                this.props.navigate('/')
            }
        }).catch(() => {
            alert('Logout failed, server error.')
        })
    }

    onSearchChange(e) {
        this.setState({
            searchbar: e.target.value,
        })
    }

    componentDidMount() {
        axios.get('http://localhost:8000/sessioninfo', {
            withCredentials: true,
        }).then((res) => {
            this.setState({
                loggedIn: res.data.loggedIn,
                username: res.data.username,
            })
        }).catch(() => {
            this.setState({
                loggedIn: false,
            })
        })
    }

    render() {
        let userPortion = []
        if (this.state.loggedIn) {
            userPortion.push(<li key='1'><Link to='/userprofile/' className={this.props.selected === 'userprofile' ? 'selected' : 'navButton'}>{this.state.username}</Link></li>)
            userPortion.push(<li key='2'><button onClick={() => this.props.navigate('/questions/ask')}>Post Question</button></li>)
            userPortion.push(<li key='3'><button onClick={this.onLogout}>Logout</button></li>)
        } else {
            userPortion.push(<li key='1'><button onClick={() => this.props.navigate('/login')}>Login</button></li>)
            userPortion.push(<li key='2'><button onClick={() => this.props.navigate('/register')}>Register</button></li>)
        }

        return (
            <ul className='navigation'>
                <li><div>FakeStackOverflow</div></li>
                <li><Link to='/questions' className={this.props.selected === 'questions' ? 'selected' : 'navButton'}>Questions</Link></li>
                <li><Link to='/tags' className={this.props.selected === 'tags' ? 'selected' : 'navButton'}>Tags</Link></li>
                
                {userPortion}

                <li><div><input
                    placeholder="Search..."
                    onChange={this.onSearchChange} 
                    value={this.state.searchbar}
                    onKeyDown={(e) => {if (e.key === "Enter") this.props.navigate('/search/' + e.target.value)}}  
                /></div></li>
            </ul>
        )
    }
}