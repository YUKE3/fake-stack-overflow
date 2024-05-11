import React from "react";

// Props:
// currPage => current page number to display
// numOfPages => total number of pages that can be displayed
// onClick => function when button is clicked.
export class PageSelector extends React.Component {
    render() {
        return (
            <div className="PageSelector">
                {this.props.currPage === 1 ? <button disabled={true}>{'<< Prev'}</button> : <button onClick={() => { this.props.onClick(this.props.currPage-1)} }>{'<< Prev'}</button>}
                <span>Pages {this.props.currPage} out of {this.props.numOfPages}</span>
                {this.props.currPage >= this.props.numOfPages ? <button disabled={true}>{'Next ..'}</button> : <button onClick={() => { this.props.onClick(this.props.currPage + 1) }}>{'Next >>'}</button>}
            </div>
        )
    }
}