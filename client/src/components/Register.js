import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            email: '',
            password: '',
            verifyPassword: '',
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
        axios.defaults.withCredentials = true
        // Client side checks for passwords
        let emailId = this.state.email.split('@')[0]
        if (this.state.password !== this.state.verifyPassword) {
            this.setState({
                errors: 'Password do not match.'
            })
        } else if (this.state.username.length < 1) {
            this.setState({
                errors: 'Display name cannot be empty.'
            })
        } else if (!this.state.email.includes('@')) {
            this.setState({
                errors: 'Please enter a valid email.'
            })
        } else if (this.state.password.length < 1) {
            this.setState({
                errors: 'Password cannot be blank.'
            })
        } else if (emailId.length < 1) {
            this.setState({
                errors: 'Please enter a valid email address.'
            })
        } else if (this.state.password.includes(emailId)) {
            this.setState({
                errors: 'Password cannot contain the email.'
            })
        } else if (this.state.password.includes(this.state.username)) {
            this.setState({
                errors: 'Password cannot contain the display name.'
            })
        } else if (this.state.username.length > 15) {
            this.setState({
                errors: 'Display name cannot be more than 15 characters.'
            })
        } else {
            // Send register request to server
            axios.post('http://localhost:8000/register', {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
            }, {
                withCredentials: true, 
                headers: { 'Content-Type': 'application/json' },
            }).then((res) => {
                if (res.data === 'OK') {
                    this.props.navigate('/login')
                } else {
                    this.setState({
                        errors: res.data,
                    })
                }
            }).catch((err) => {
                this.setState({
                    errors: err.response.data
                })
            })
        }
    }

    render() {
        return (
            <div className='register'>
                <div>
                    <h1>Register</h1>
                    <div id='error'>{this.state.errors}</div>
                    <div>Display Name:</div>
                    <input id='username' value={this.state.username} onChange={this.onFieldChange}/>
                    <div>Email:</div>
                    <input id='email' value={this.state.email} onChange={this.onFieldChange}/>
                    <div>Password:</div>
                    <input type={'password'} id='password' value={this.state.password} onChange={this.onFieldChange}/>
                    <div>Confirm Password:</div>
                    <input type={'password'} id='verifyPassword' value={this.state.verifyPassword} onChange={this.onFieldChange}/>
                    <br />
                    <button onClick={this.onSubmit}>Sign up</button>

                    <p>
                        <Link to='/login'><div>Already signed up? Click here to login.</div></Link>
                        <Link to='/questions'><div>Click here to continue as guest.</div></Link>
                    </p>
                </div>
            </div>
        )
    }
}