import React from 'react'
import { IndividualTag } from './IndividualTag'

// Props:
// tagIdArr => array of tags to display
// tagArr => array of tags itself (optional)
// navigate => navigate function for tag onClick.
// wrapper => whether to wrap in a element that shows how much questions are associated.
export class TagDisplay extends React.Component {
    render() {
        let tagsElements = []
        if (this.props.tagArr) {
            this.props.tagArr.forEach(tag => {
                tagsElements.push(
                    <IndividualTag
                        key={tag._id}
                        tagId={tag._id}
                        navigate={this.props.navigate}
                        edit={(this.props.edit ? true : false)}
                        wrapper={this.props.wrapper ? true : false}
                    />
                )
            })
        } else {
            this.props.tagIdArr.forEach(tagId => {
                tagsElements.push(
                    <IndividualTag
                        key={tagId}
                        tagId={tagId}
                        navigate={this.props.navigate}
                        wrapper={this.props.wrapper ? true : false}
                    />
                )
            })
        }

        return (
            <p className='TagDisplay'>
                {tagsElements}
            </p>
        )
    }
}