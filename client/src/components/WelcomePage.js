import React from "react";

// Props:
// navigate
export class WelcomePage extends React.Component {
    render() {
        return (
            <div className='welcome'>
                <div>
                    <h2>Welcome to</h2>
                    <h1>FakeStackOverflow</h1>
                    <div><button onClick={() => {this.props.navigate('/register')}}>Register</button></div>
                    <div><button onClick={() => {this.props.navigate('/login')}}>Login</button></div>
                    <div><button onClick={() => {this.props.navigate('/questions')}}>Browse as Guest</button></div>
                </div>
            </div>
        )
    }
}