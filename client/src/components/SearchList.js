import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { QuestionsList } from './QuestionsList'

class SearchList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            questions: [],
            error: false,
        }
    }
    
    componentDidMount() {
        const { query } = this.props.params
        axios.get(`http://localhost:8000/search/${query}`)
            .then((res) => {
                this.setState({
                    questions: res.data
                })
            }).catch(() => {
                this.setState({
                    error: true,
                })
            })
    }

    render() {
        if (this.state.error) {
            <QuestionsList 
                questions={this.state.questions}
                navigate={this.props.navigate}
                error={true}
            />
        }

        let tagsArr = []
        let textsArr = []

        if (this.props.params.query) {
            let query = this.props.params.query.split(/\s+/)
            query.forEach(item => {
                if (item.charAt(0) === '[' && item.charAt(item.length-1) === ']') {
                    tagsArr.push(item.substring(1,item.length-1).toLowerCase())
                } else {
                    textsArr.push(item)
                }
            })
        }

        let title = ''
        if (tagsArr.length === 0 && textsArr.length === 0) {
            title = 'No results'
        } else if (tagsArr.length === 0) {
            title = 'Results for "' + textsArr.join(' ') + '"'
        } else if (textsArr.length === 0) {
            title = 'Questions tagged with: [' + tagsArr.join('] [') + ']'
        } else {
            title = 'Results for "' + textsArr.join(' ') + '" with tags: [' + tagsArr.join('] [') + ']'
        }

        return (
            <QuestionsList 
                questions={this.state.questions}
                navigate={this.props.navigate}
                title = {title}
            />
        )
    }
}

// This is a function wrapper so I can use useParams().
// This is by far the easiest way I can see while still being able to use router redirects.
// eslint-disable-next-line
export default (props) => {
    return (
        <SearchList 
            {...props}
            params={useParams()}
            key={useParams().query} // Make sure that whenever query changes, componenet will remount.
        />
    )   
}