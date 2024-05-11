var User = require('../models/users')

class UsersBuilder {
    constructor(username) {
        this.username = username
        this.reputation = 0
        return this
    }

    setEmail(email) {
        this.email = email
        return this
    }

    setPassword(password) {
        this.password = password
        return this
    }

    // OPTIONAL

    // No add questions or answers or tags, since they shouldn't be with a new user no matter what.

    setReputation(rep) {
        this.reputation = rep
        return this
    }

    setCreationDate(date) {
        this.creation_date = date
        return this
    }

    build() {
        if(!('username' in this)) {
            throw new Error('username is missing')
        }
        if (!('email' in this)) {
            throw new Error('email is missing')
        }
        if (!('password' in this)) {
            throw new Error('password is missing')
        }

        let userDetails = {
            username: this.username,
            email: this.email,
            password: this.password,
            questions: this.questions,
            answers: this.answers,
            tags: this.tags,
            reputation: this.reputation,
        }

        if (this.creation_date) {
            userDetails.creation_date = this.creation_date
        }

        return new User(userDetails)
    }
}

module.exports = {UsersBuilder}