import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { QuestionsList } from './QuestionsList'
import { IndividualTag } from './IndividualTag'

class TagFilterList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            questions: [],
            error: false,
        }
    }
    
    componentDidMount() {
        const { query } = this.props.params
        axios.get(`http://localhost:8000/questions/tagged/${query}`)
            .then((res) => {
                this.setState({
                    questions: res.data
                })
            })
            .catch(() => {
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

        return (
            <QuestionsList 
                questions={this.state.questions}
                navigate={this.props.navigate}
                title = {<div>Questions tagged with: <IndividualTag tagId={this.props.params.query} navigate={this.props.navigate}/></div>}
            />
        )
    }
}

// This is a function wrapper so I can use useParams().
// This is by far the easiest way I can see while still being able to use router redirects.
export default (props) => {
    return (
        <TagFilterList 
            {...props}
            params={useParams()}
            key={useParams().query} // Make sure that whenever query changes, componenet will remount.
        />
    )   
}