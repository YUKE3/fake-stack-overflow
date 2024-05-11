var Answer = require('../models/answers')

class AnswersBuilder {
    constructor(text) {
        this.text = text
        this.upvotes = []
        this.downvotes = []
        this.comments = []
        return this
    }

    setAnsBy(userId) {
        this.ans_by = userId
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

    addCommentsByIds(commentIdArr) {
        this.comments = this.comments.concat(commentIdArr.filter((item) => this.comments.indexOf(item) < 0)) // Add in non duplicate
        return this
    }

    setAnsDateTime(ans_date_time) {
        this.ans_date_time = ans_date_time
        return this
    }

    build() {
        if(!('text' in this)) {
            throw new Error('text is missing')
        }
        if (!('ans_by' in this)) {
            throw new Error('answering user is missing')
        }

        let ansDetails = {
            text: this.text,
            ans_by: this.ans_by,
            upvotes: this.upvotes,
            downvotes: this.downvotes,
            comments: this.comments,
        }

        if (this.ans_date_time) {
            ansDetails.ans_date_time = this.ans_date_time
        }

        return new Answer(ansDetails)
    }
}

module.exports = {AnswersBuilder}