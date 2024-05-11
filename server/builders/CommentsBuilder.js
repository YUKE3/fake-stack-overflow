var Comment = require('../models/comments')

class CommentsBuilder {
    constructor(text) {
        this.text = text
        this.upvotes = []
        this.downvotes = []
        return this
    }

    setUser(userId) {
        this.user = userId
        return this
    }

    // OPTIONAL
    addUpvotes(userIdArr) {
        // Remove from downvotes
        for (let i = 0; i < this.downvotes.length; i++) {
            userIdArr.forEach(userId => {
                if (this.downvotes[i] === userId) {
                    this.downvotes.splice(i--, 1);
                }
            });
        }
        // Add non duplicate users to upvotes
        this.upvotes = this.upvotes.concat(userIdArr.filter((item) => this.upvotes.indexOf(item)< 0))
        
        return this
    }

    addDownvotes(userIdArr) {
        // Remove from upvotes
        for (let i = 0; i < this.upvotes.length; i++) {
            userIdArr.forEach(userId => {
                if (this.upvotes[i] === userId) {
                    this.upvotes.splice(i--, 1);
                }
            });
        }
        // Add non duplicate users to downvotes
        this.downvotes = this.downvotes.concat(userIdArr.filter((item) => this.downvotes.indexOf(item) < 0))
        return this
    }


    build() {
        if(!('text' in this)) {
            throw new Error('text is missing')
        }
        if (!('user' in this)) {
            throw new Error('user is missing')
        }

        let commentDetails = {
            user: this.user,
            text: this.text,
            upvotes: this.upvotes,
            downvotes: this.downvotes,
        }

        return new Comment(commentDetails)
    }
}

module.exports = {CommentsBuilder}