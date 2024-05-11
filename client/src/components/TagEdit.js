import axios from "axios"
import React from "react"
import { NavigationBar } from "./Navigationbar"
import { useParams } from 'react-router-dom'

// Props:
// navigate => navigate react router method
class TagEdit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            name: '',
            error: '',
        }

        this.changeName = this.changeName.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/taginfo/${this.props.params.id}`)
            .then((res) => {
                this.setState({
                    loaded: true,
                    name: res.data.tag.name,
                })
            }).catch(() => {
                this.setState({
                    error: 'Failed to get tag info from server, please refresh.'
                })
            })
    }

    changeName(e) {
        this.setState({
            name: e.target.value,
        })
    }

    onSave() {
        axios.post(`http://localhost:8000/edittag`, {
            id: this.props.params.id,
            name: this.state.name,
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
                    error: 'Error communicating with server, please try again.'
                })
            })
    }

    onDelete() {
        axios.post(`http://localhost:8000/deletetag`, {
            id: this.props.params.id,
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
                    error: 'Error deleting tag, please try again later.'
                })
            })
    }

    render() {
        if (this.state.loaded) {
            return (
                <div className="TagEdit">
                    <NavigationBar navigate={this.props.navigate}/>
                    <div>
                        <div>{this.state.error}</div>
                        <div>Tag Name</div>
                        <textarea value={this.state.name} onChange={this.changeName}/>
                        <div><button onClick={this.onSave}>Save</button></div>
                        <div><button onClick={this.onDelete}>Delete</button></div>
                    </div>
                </div>
            )
        } else {
            return (
                <NavigationBar navigate={this.props.navigate}/>
            )
        }
    }
}

 // eslint-disable-next-line
export default (props) => {
    return (
        <TagEdit 
            {...props}
            params={useParams()}
            key={useParams().id} // Make sure that whenever query changes, componenet will remount.
        />
    )   
}