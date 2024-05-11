import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            errors: '',
        }

        this.onFieldChange = this.onFieldChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onFieldChange(e) {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    onSubmit() {
        axios.post('http://localhost:8000/login', {
            email: this.state.email,
            password: this.state.password,
        }, {
            withCredentials: true, 
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => {
            if (res.data === 'OK') {
                this.props.navigate('/questions')
            } else {
                this.setState({
                    errors: res.data
                })
            }
        }).catch((err) => {
            this.setState({
                errors: 'Error communicating with server, please try again.'
            })
        })
    }

    render() {
        return (
            <div className='login'>
                <div>
                    <h1>Login</h1>
                    <div id='error'>{this.state.errors}</div>
                    <div>Email:</div>
                    <input id='email' value={this.state.email} onChange={this.onFieldChange}/>
                    <div>Password:</div>
                    <input type={'password'} id='password' value={this.state.password} onChange={this.onFieldChange}/>
                    <br />
                    <button onClick={this.onSubmit}>Login</button>

                    <p>
                        <Link to='/register'><div>Not signed up? Click here to register.</div></Link>
                        <Link to='/questions'><div>Click here to continue as guest.</div></Link>
                    </p>
                </div>
            </div>
        )
    }
}