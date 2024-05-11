var Question = require("../models/questions")

class QuestionsBuilder {
    constructor(title) {
        this.title = title
        this.tagIds = []
        this.answers = []
        this.upvotes = []
        this.downvotes = []
        this.comments = []
        return this
    }

    setSummary(summary) {
        this.summary = summary
        return this
    }

    setText(text) {
        this.text = text
        return this
    }

    setAsker(userId) {
        this.upvotes.push(userId)
        this.asked_by = userId
        return this
    }

    // OPTIONAL
    setAskDate(date) {
        this.ask_date_time = date
        return this
    }

    setViews(views) {
        this.views = views
        return this
    }

    addTagsWithIds(tagIdArr) {
        this.tagIds = this.tagIds.concat(tagIdArr.filter((item) => this.tagIds.indexOf(item) < 0))
        return this
    }

    addAnswersWithIds(answerIdArr) {
        this.answers = this.answers.concat(answerIdArr.filter((item) => this.answers.indexOf(item) < 0))
        return this
    }

    addCommentsByIds(commentIdArr) {
        this.comments = this.comments.concat(commentIdArr.filter((item) => this.comments.indexOf(item) < 0)) // Add in non duplicate
        return this
    }

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
        if (!('title' in this)) {
            throw new Error('title is missing')
        }
        if (!('summary' in this)) {
            throw new Error('summary is missing')
        }
        if (!('text' in this)) {
            throw new Error('text is missing')
        }
        if (!('asked_by' in this)) {
            throw new Error('asker is missing')
        }

        let qstnDetails = {
            title: this.title,
            summary: this.summary,
            text: this.text,
            tags: this.tagIds,
            answers: this.answers,
            asked_by: this.asked_by,
            upvotes: this.upvotes,
            downvotes: this.downvotes,
            comments: this.comments,
        }

        if (this.ask_date_time) {
            qstnDetails.ask_date_time = this.ask_date_time
        }

        if (this.views) {
            qstnDetails.views = this.views
        }

        return new Question(qstnDetails)
    }
}

module.exports = {QuestionsBuilder}