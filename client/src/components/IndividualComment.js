import React from "react";

// Props:
// comment => comment to display.
export class IndividualComment extends React.Component {
    render() {
        return (
            <div>
                <div>{this.props.comment.text}</div>
                <div>{this.props.comment.user.username}</div>
            </div>
        )
    }
}