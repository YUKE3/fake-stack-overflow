import axios from 'axios'
import React from 'react'

// Props:
// tagId => id of user to display.
// navigate => onclick for tag.
// edit => navigate to edit tag or not.
// wrapper => whether to wrap in a element that shows how much questions are associated.
export class IndividualTag extends React.Component {
    constructor(props) {
        super(props)

        this.state = { name: '', qstnCount: 0 }
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/taginfo/${this.props.tagId}`)
            .then((res) => {
                this.setState({ name: res.data.tag.name, qstnCount: res.data.qstnsWithTag.length })
            })
            .catch(() => {
                this.setState({ name: '', qstnsWithTag: '0'})
            })
    }

    render() {
        if (this.props.wrapper) {
            return (
                <span className='IndividualTagContainer'>
                    <button className='IndividualTag' onClick={() => this.props.navigate((this.props.edit ? '/tagedit/' : '/questions/tagged/') + this.props.tagId)}>
                        {this.state.name}
                    </button>
                    <span>{this.state.qstnCount} {this.state.qstnCount === 1 ? 'Question' : 'Questions'}</span>
                </span>
            )
        }

        return (
            <button className='IndividualTag' onClick={() => this.props.navigate((this.props.edit ? '/tagedit/' : '/questions/tagged/') + this.props.tagId)}>
                {this.state.name}
            </button>
        )
    }
}