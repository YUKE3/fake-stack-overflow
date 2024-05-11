import axios from "axios";
import React from "react";
import { NavigationBar } from "./Navigationbar";
import { TagDisplay } from "./TagDisplay";

// Props:
// navigate
export class TagsList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tags: [],
            loaded: false,
            error: false,
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/tags')
            .then((res) => {
                this.setState({
                    tags: res.data,
                    loaded: true,
                })
            })
            .catch(() => {
                this.setState({
                    error: true,
                })
            })
    }
    
    render() {
        if (!this.state.loaded) {
            return (
                <div>
                    <NavigationBar selected='tags' navigate={this.props.navigate} />
                    <div>Loading...</div>
                </div>
            )
        }

        if (this.state.error) {
            return (
                <div>
                    <NavigationBar selected='tags' navigate={this.props.navigate} />
                    <div>Error loading tags from server, please refresh.</div>
                </div>
            )
        }

        if (this.state.tags.length === 0) {
            return (
                <div>
                    <NavigationBar selected='tags' navigate={this.props.navigate} />
                    <div>No tags to display.</div>
                </div>
            )
        }

        let rows = []
        for (let i = 0; i < this.state.tags.length; i+=4) {
            rows.push(
                <TagDisplay 
                    key={this.state.tags[i]._id}
                    tagArr={this.state.tags.slice(i, i+4)}
                    navigate={this.props.navigate}
                    wrapper={true}
                />
            )
        }

        return (
            <div className='TagsList'>
                <NavigationBar selected='tags' navigate={this.props.navigate} />
                <div>All Tags:</div>
                {rows}
            </div>
        )
    }
}