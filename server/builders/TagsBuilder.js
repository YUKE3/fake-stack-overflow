var Tag = require('../models/tags')

class TagsBuilder {
    constructor(name) {
        this.name = name.toLowerCase()
        return this
    }

    setCreatedBy(userId) {
        this.created_by = userId
        return this
    }


    build() {
        if(!('name' in this)) {
            throw new Error('name is missing')
        }
        if (!('created_by' in this)) {
            throw new Error('creator is missing')
        }

        let tagDetails = {
            name: this.name,
            created_by: this.created_by,
        }

        return new Tag(tagDetails)
    }
}

module.exports = {TagsBuilder}