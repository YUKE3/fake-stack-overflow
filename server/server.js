const express = require('express')
var session = require('express-session')
var cors = require('cors')
let mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const bcrypt = require('bcrypt')
require('dotenv').config()

const mongoDB_url = 'mongodb://fso-mongodb:27017/fake_so'
const port = 8000
const saltRounds = 10

// Schema for db
var Answers = require('./models/answers')
var Questions = require('./models/questions')
var Tags = require('./models/tags')
var Users = require('./models/users')
var Comments = require('./models/comments')

var {QuestionsBuilder} = require('./builders/QuestionsBuilder')
var {AnswersBuilder} = require('./builders/AnswersBuilder')
var {TagsBuilder} = require('./builders/TagsBuilder')
var {CommentsBuilder} = require('./builders/CommentsBuilder')
var {UsersBuilder} = require('./builders/UsersBuilder')

mongoose.connect(mongoDB_url, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = global.Promise
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('connected', function() {
    const app = express()
    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
        credentials: true
    }))
    app.use(express.json())
    app.use(session({
        // secret: process.env.SECRET,
        secret: "placehold",
        resave: false,
        saveUninitialized: true,
        cookie: {},
        store: new MongoStore({
            client: db.getClient(),
        })
    }))

    app.post('/register', async (req, res) => {
        // Password containing email or username check is handled by client

        Users.findOne({ email: req.body.email }, {}, {}, function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else {
                if (docs) { res.status(200).send('Email already exist in database.') }
                else {
                    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                        if (err) { res.status(500).send('Server bcrypt error, please try again later.') }
                        else {
                            let newUser = new UsersBuilder(req.body.username)
                                .setEmail(req.body.email)
                                .setPassword(hash)
                                .setReputation(100)
                                .build()
                            newUser.save(function(err, docs) {
                                if (err) { res.status(500).send('Server database error, please try again laster.') }
                                else {
                                    res.status(200).send('OK')
                                }
                            })
                        }
                    })
                }
            }
        })
    })

    app.post('/login', async (req, res) => {
        Users.findOne({ email: req.body.email }, {}, {}, function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else if (!docs) { res.status(200).send('This email is not registered.') }
            else {
                bcrypt.compare(req.body.password, docs.password, function(err, result) {
                    if (err) { res.status(500).send('Server bcrypt error, try again later.') }
                    else if (!result) { res.status(200).send('Incorrect password provided.') }
                    else {
                        req.session.userId = docs._id
                        req.session.loggedIn = true
                        res.status(200).send('OK')
                    }
                })
            }
        })
    })

    app.post('/logout', async (req, res) => {
        req.session.destroy(function (err) {
            if (err) { res.status(500).send('Server error while logging out') }
            else { res.status(200).send('OK') }
        })
    })

    app.get('/sessioninfo', async (req, res) => {
        if (req.session.userId) {
            Users.findOne({ _id: req.session.userId }, {}, {}, function(err, docs) {
                if (err) { res.status(500).send('Server database error, please try again later.')}
                else if (docs) { res.status(200).send({ loggedIn: true, username: docs.username }) }
                else { res.status(200).send({ loggedIn: false, username: '' }) }
            })
        } else {
            res.status(200).send({loggedIn: false, username: ''})
        }
    })

    // Gives back a list of all questions ordered by date newest first
    app.get('/questions', async (req, res) => {
        Questions.find({}).sort({ask_date_time: -1}).exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else { res.status(200).send(docs)} 
        })
    })

    // Gives back a user associated with id.
    app.get('/userinfo/:id', async (req, res) => {
        Users.findOne({ _id: req.params.id }).exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else { res.status(200).send(docs) }
        })
    })

    // Gives back a tag associated with id, as well as all questions associated with that tag.
    app.get('/taginfo/:id', async (req, res) => {
        Tags.findOne({ _id: req.params.id }, {}, {}, function(err, tag) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else {
                Questions.find({ tags: req.params.id }, {}, {}, function(err, qstnsWithTag) {
                    if (err) { res.status(400).send('Server database error, please try again later') }
                    else {
                        res.send({
                            tag: tag,
                            qstnsWithTag: qstnsWithTag,
                        })
                    }
                })
            }
        })
    })

    // Gives back a list of questions order by date newest first, filter by query
    app.get('/search/:query', async (req, res) => {
        let tagsArr = []
        let textsArr = []

        let query = req.params.query.split(/\s+/)
        query.forEach(item => {
            if (item.charAt(0) === '[' && item.charAt(item.length-1) === ']') {
                tagsArr.push(item.substring(1,item.length-1).toLowerCase())
            } else {
                textsArr.push(new RegExp(item, 'i'))
            }
        })


        Tags.find({name: {$in: tagsArr}}).exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else {
                Questions.find({
                    $or: [
                        {title: {$in: textsArr}},
                        {text: {$in: textsArr}},
                        {summary: {$in: textsArr}},
                        {tags: {$in: docs}}
                    ]
                }).sort({ask_date_time: -1}).exec(function(err, docs) {
                    if (err) { res.status(500).send('Server database error, please try again later.') }
                    else { res.status(200).send(docs) }
                })
            }
        })
    })

    // Gives back a list of questions tagged with a tagId
    app.get('/questions/tagged/:id', async (req, res) => {
        Questions.find({tags: req.params.id}).sort({ask_date_time: -1}).exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.')}
            else { res.status(200).send(docs)}
        })
    })

    // Gives back a question associated with an Id, as well as increment its view by 1
    app.get('/questions/:id', async (req, res) => {
        Questions.findOneAndUpdate(
            { _id: req.params.id }, // Filter
            { $inc: { views: 1 } }, // Update
            { new: true} // Option
            ).exec(function(err, docs) {
                if (err) { res.status(500).send('Server database error, please try again later.') }
                else { res.status(200).send(docs) }
            })
    })

    // Gives back a question associated with an Id, with no incrementing view, as well as have tags all populated.
    app.get('/questionsnoincr/:id', async (req, res) => {
        Questions.findOne({ _id: req.params.id }).populate('tags').exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else { res.status(200).send(docs) }
        })
    })

    app.get('/mystuff', async (req, res) => {
        try {
            res.send({
                questions: await Questions.find({ asked_by: req.session.userId }).sort({ ask_date_time: -1 }),
                answers: await Answers.find({ ans_by: req.session.userId }).sort({ ans_date_time: -1 }),
                tags: await Tags.find({ created_by: req.session.userId }),
                userinfo: await Users.find({ _id: req.session.userId })
            })
        } catch (err) {
            res.status(500).send('Server database error, please try again later.')
        }
        
    })

    app.post('/postanswer', async (req, res) => {
        if (req.body.text.trim().length < 1) {
            res.status(200).send('Answer text cannot be empty.')
        } else if (!req.session.loggedIn) {
            res.status(200).send('Not logged in, please log in from another window to continue.')
        } else {
            try {
                let newAnswer = new AnswersBuilder(req.body.text).setAnsBy(req.session.userId).build()
                    newAnswer = await newAnswer.save()
                    let qstn = await Questions.findOne({ _id: req.body.qid })
                    qstn.answers.push(newAnswer)
                    qstn.save().then(() => res.status(200).send('OK'))
            } catch (err) {
                res.status(500).send('Server database error, please try again later.')
            }
        }
    })

    app.post('/updateanswer', async (req, res) => {
        if (req.body.text.trim().length < 1) {
            res.status(200).send('Answer text cannot be empty.')
        } else if (!req.session.loggedIn) {
            res.status(200).send('Not logged in, please log in from another window to continue.')
        } else {
            await Answers.findOneAndUpdate({
                _id: req.body.qid,
                created_by: req.session.userId,
            }, {
                text: req.body.text,
            }).then(() => {
                res.status(200).send('OK')
            }).catch(() => {
                res.status(500).send('Server database error, please try again later.')
            })
        }
    })

    // Deletes an answer and the entry with its associated question.
    app.post('/deleteanswer', async (req, res) => {
        if (!req.session.loggedIn) {
            res.status(200).send('Not logged in, please log in from another window to continue.')
        } else {
            Answers.findOneAndDelete({ _id: req.body.aid, created_by: req.session.userId }, {}, function(err, docs) {
                if (err) { res.status(500).send('Server database error, please try again later.')}
                else {
                    Questions.findOneAndUpdate({ answers: docs._id }, { $pull: { answers: docs._id } }, {}, function(err, docs) {
                        if (err) { res.status(500).send('Server database error, please try again later.')}
                        else { res.status(200).send('OK') }
                    })
                }
            })
        }
    })

    app.post('/postquestion', async (req, res) => {
        if (req.body.title.trim().length < 1) {
            res.status(200).send('Title cannot be empty.')
        } else if (req.body.title.length > 50) {
            res.status(200).send('Title cannot be longer than 50 characters.')
        } else if (req.body.summary.trim().length < 1) {
            res.status(200).send('Summary cannot be empty.')
        } else if (req.body.summary.length > 140) {
            res.status(200).send('Summary cannot be longer than 140 characters')
        } else if (req.body.text.trim().length < 1) {
            res.status(200).send('Text cannot be empty.')
        } else if (!req.session.loggedIn) {
            res.status(200).send('Not logged in, please log in from another window to continue.')
        } else {
            let tagNameArr = req.body.tags.split(/\s+/)
            let tagIdsArr = []
            let newTagNameArr = []

            try {
                for (let i = 0; i < tagNameArr.length; i++) {
                    let existingTag = await Tags.findOne({name: tagNameArr[i]})

                    if (existingTag) {
                        if (tagIdsArr.findIndex(a => a.name === existingTag.name) === -1) {
                            tagIdsArr.push(existingTag)
                        }
                    } else {
                        if (newTagNameArr.indexOf(tagNameArr[i].toLowerCase()) === -1) {
                            newTagNameArr.push(tagNameArr[i].toLowerCase())
                        }
                    }
                }

                let failed = false
                if (newTagNameArr.length > 0) {
                    // If new tags needs to be created.
                    let currentUser = await Users.findOne({_id: req.session.userId})
                    if (currentUser.reputation < 100) {
                        res.status(200).send("You don't have enough repuatation to create tags.")
                        failed = true
                    } else {
                        for (let i = 0; i < newTagNameArr.length; i++) {
                            if (newTagNameArr[i] != '') {
                                let newTag = new TagsBuilder(newTagNameArr[i]).setCreatedBy(req.session.userId).build()
                                tagIdsArr.push(await newTag.save())
                            }
                        }
                    }
                }

                if (!failed) {
                    let newQuestion = new QuestionsBuilder(req.body.title)
                        .setSummary(req.body.summary)
                        .setText(req.body.text)
                        .setAsker(req.session.userId)
                        .addTagsWithIds(tagIdsArr)
                        .build()

                    await newQuestion.save()
                    res.status(200).send('OK')
                }
            } catch (err) {
                res.status(500).send('Server database error, please try again later.')
            }
        }
    })

    app.post('/updatequestion', async (req, res) => {
        if (req.body.title.length > 50) {
            res.status(200).send('Title cannot be over 50 characters.')
        } else if (req.body.title.trim().length < 1) {
            res.status(200).send('Title cannot be empty.')
        } else if (req.body.summary.length > 140) {
            res.status(200).send('Question summary cannot be over 140 character.')
        } else if (req.body.summary.trim().length < 1) {
            res.status(200).send('Question summary cannot be empty.')
        } else if (req.body.text.trim().length < 1) {
            res.status(200).send('Question text cannot be empty.')
        } else if (!req.session.loggedIn) {
            res.status(200).send('Not logged in, please log in from another window to continue.')
        } else {
            let tagNameArr = req.body.tags.split(/\s+/)
            let tagIdsArr = []
            let newTagNameArr = []
            try {
                for (let i = 0; i < tagNameArr.length; i++) {
                    let existingTag = await Tags.findOne({name: tagNameArr[i]})

                    if (existingTag) {
                        if (tagIdsArr.findIndex(a => a.name === existingTag.name) === -1) {
                            tagIdsArr.push(existingTag)
                        }
                    } else {
                        if (newTagNameArr.indexOf(tagNameArr[i].toLowerCase()) === -1) {
                            newTagNameArr.push(tagNameArr[i].toLowerCase())
                        }
                    }
                }

                let failed = false
                if (newTagNameArr.length > 0) {
                    // If new tags needs to be created.
                    let currentUser = await Users.findOne({_id: req.session.userId})
                    if (currentUser.reputation < 100) {
                        res.status(200).send("You don't have enough repuatation to create tags.")
                        failed = true
                    } else {
                        for (let i = 0; i < newTagNameArr.length; i++) {
                            if (newTagNameArr[i] != '') {
                                let newTag = new TagsBuilder(newTagNameArr[i]).setCreatedBy(req.session.userId).build()
                                tagIdsArr.push(await newTag.save())
                            }
                        }
                    }
                }

                if (!failed) {
                    await Questions.findOneAndUpdate({ _id: req.body.id, created_by: req.session.userId }, {
                        title: req.body.title,
                        summary: req.body.summary,
                        text: req.body.text,
                        tags: tagIdsArr,
                    }).then(() => { res.status(200).send('OK') })
                    .catch(() => { res.status(500).send('Server database error, please try again later') })
                }
            } catch (err) {
                res.status(500).send('Server database error, please try again later.')
            }
        }   
    })

    app.post('/deletequestion', async (req, res) => {
        if (!req.session.loggedIn) { res.status(200).send('User not logged in') }

        Questions.findOneAndDelete({ _id: req.body.id, created_by: req.session.userId }).exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else if (!docs) { res.status(200).send('Questions cannot be found in database, are you logged in?') }
            else {
                Answers.deleteMany({ _id: { $in: docs.answers } })
                    .then(() => { res.status(200).send('OK') })
                    .catch(() => { res.status(200).send('Failed to delete question and/or its associated answers') })
            }
        })
    })

    app.post('/edittag', async (req, res) => {
        if (!req.session.loggedIn) { res.status(200).send('User not logged in.') }
        else if (req.body.name.trim().length < 1) { res.status(200).send('Tag name cannot be empty.')}
        else {
            Tags.findOne({ name: req.body.name }).exec(function(err, docs) {
                if (err) { res.status(500).send('Server database error, please try again later.') }
                else if (docs) { res.status(200).send('That tag name already exists.') }
                else {
                    Tags.findOneAndUpdate({ _id: req.body.id, created_by: req.session.userId }, { name: req.body.name })
                        .then(() => { res.status(200).send('OK') })
                        .catch(() => { res.status(500).send('Server database error, please try again later.') })
                }
            })
        }
    })

    app.post('/deletetag', async (req, res) => {
        if (!req.session.loggedIn) { res.status(200).send('User not logged in.') }
        else {
            await Questions.updateMany({ tags: req.body.id }, { '$pull': { tags: req.body.id } })
            .then(async () => {
                await Tags.deleteMany({ _id: req.body.id, created_by: req.session.userId })
                    .then(() => { res.status(200).send('OK') })
                    .catch(() => { res.status(500).send('Server database error, please try again later.') })
            })
            .catch(() => { res.status(500).send('Server database error, please try again later.') })
        }
    })

    // Return array of comments based on an question or answer id
    app.post('/commentlist', async (req, res) => {
        try {
            let parent = []
            if (req.body.parent === 'question') {
                parent = await Questions.findOne({ _id: req.body.id })
            } else {
                parent = await Answers.findOne({ _id: req.body.id })
            }

            res.send(await Comments.find({ _id: { $in: parent.comments } }).populate('user').sort({ time: -1 }))
        } catch (err) {
            res.status(500).send('Server database error, please try again later.')
        }
        
    })

    app.post('/postcomment', async (req, res) => {
        if (!req.session.loggedIn) { res.status(200).send('User not logged in.') }
        else if (req.body.text.length > 140) { res.status(200).send('Comment cannot be more than 140 characters') }
        else if (req.body.text.length < 1) { res.status(200).send('Comment cannot be empty.')}
        else {
            try {
                let currUser = await Users.findOne({ _id: req.session.userId })
                if (currUser.reputation < 100) { res.status(200).send('You do not have enough reputation to post comments.') }
                else {
                    let newComment = new CommentsBuilder(req.body.text).setUser(req.session.userId).build()
                    newComment = await newComment.save()
                    let parent = []
                    if (req.body.parent === 'question') {
                        parent = await Questions.find({ _id: req.body.id })
                    } else {
                        parent = await Answers.find({ _id: req.body.id })
                    }

                    parent[0].comments.push(newComment)
                    parent[0].save().then(() => { res.status(200).send('OK') })
                    .catch(() => { res.status(500).send('Server database error, please try again later.') })
                }
            } catch (err) {
                res.status(500).send('Server database error, please try again later.')
            }
        }
    })

    app.get('/answersofquestion/:id', async (req, res) => {
        Questions.findOne({ _id: req.params.id }, {}, {}, function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else { 
                Answers.find({ _id: { $in: docs.answers } }).sort({ ans_date_time: -1 }).exec(function(err, docs) {
                    if (err) { res.status(500).send('Server database error, please try again later.') }
                    else { res.status(200).send(docs) }
                })
            }
        })
    })

    app.get('/answer/:id', async (req, res) => {
        Answers.findOne({ _id: req.params.id }).exec(function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else { res.status(200).send(docs) }
        })
    })

    app.get('/voteinfo/:parent/:id', async (req, res) => {
        let parent
        if (req.params.parent === 'question') {
            parent = Questions
        } else if (req.params.parent === 'answer') {
            parent = Answers
        }

        if (!parent) {
            res.status(200).send('Invalid')
        } else {
            parent.findOne({ _id: req.params.id }, {}, {}, function(err, docs) {
                if (err) { res.status(500).send('Failed to get vote information') }
                else {
                    if (docs.upvotes.indexOf(req.session.userId) !== -1) {
                        res.status(200).send({currentStatus: 'upvoted', voteNum: docs.upvotes.length - docs.downvotes.length})
                    } else if (docs.downvotes.indexOf(req.session.userId) !== -1) {
                        res.status(200).send({currentStatus: 'downvoted', voteNum: docs.upvotes.length - docs.downvotes.length})
                    } else {
                        res.status(200).send({guest: req.session.loggedIn ? false : true, currentStatus: 'novote', voteNum: docs.upvotes.length - docs.downvotes.length})
                    }
                }
            })
        }
    })

    app.post('/upvote/', async (req, res) => {
        let parent
        if (req.body.parent === 'question') {
            parent = Questions
        } else if (req.body.parent === 'answer') {
            parent = Answers
        }

        if (!parent) {
            res.status(200).send('Invalid')
        } else {
            parent.findOne({ _id: req.body.id }, {}, {}, function(err, docs) {
                if (err) { res.status(500).send('Server database error, please try again later.') }
                else {
                    if (docs.upvotes.indexOf(req.session.userId) !== -1) {
                        // Already upvoted, so remove upvote.
                        docs.upvotes.splice(docs.upvotes.indexOf(req.session.userId), 1)
                        docs.save(function(err, docs) {
                            if (err) { res.status(500).send('Server database error, please try again later.') }
                            else {
                                Users.findOneAndUpdate({ _id: (req.body.parent === 'question' ? docs.asked_by : docs.ans_by) }, { $inc: { reputation: -10 } }, {}, function(err, docs) {
                                    if (err) { res.status(500).send('Server database error, please try again later.') }
                                    else { res.status(200).send('OK') }
                                })
                            }
                        })
                    } else if (docs.downvotes.indexOf(req.session.userId) !== -1) {
                        // Remove downvote(-5) and add upvote(+10).
                        docs.downvotes.splice(docs.downvotes.indexOf(req.session.userId), 1)
                        docs.upvotes.push(req.session.userId)
                        docs.save(function(err, docs) {
                            if (err) { res.status(500).send('Server database error, please try again later.') } 
                            else {
                                Users.findOneAndUpdate({ _id: (req.body.parent === 'question' ? docs.asked_by : docs.ans_by) }, { $inc: { reputation: 15 } }, {}, function(err, docs) {
                                    if (err) { res.status(500).send('Server database error, please try again later.') }
                                    else {
                                        res.status(200).send('OK')
                                    }
                                })
                            }
                        })
                    } else {
                        // add downvote.
                        docs.upvotes.push(req.session.userId)
                        docs.save(function(err, docs) {
                            if (err) { res.status(500).send('Server database error, please try again later.') } 
                            else {
                                Users.findOneAndUpdate({ _id: (req.body.parent === 'question' ? docs.asked_by : docs.ans_by) }, { $inc: { reputation: 10 } }, {}, function(err, docs) {
                                    if (err) { res.status(500).send('Server database error, please try again later.') }
                                    else {
                                        res.status(200).send('OK')
                                    }
                                })
                            }
                        })
                    }
                }
            })
        } 
    })

    app.post('/downvote/', async (req, res) => {
        let parent
        if (req.body.parent === 'question') {
            parent = Questions
        } else if (req.body.parent === 'answer') {
            parent = Answers
        }

        if (!parent) {
            res.status(200).send('Invalid')
        } else {
            parent.findOne({ _id: req.body.id }, {}, {}, function(err, docs) {
                if (err) { res.status(500).send('Server database error, please try again later.') }
                else {
                    if (docs.downvotes.indexOf(req.session.userId) !== -1) {
                        // Already downvoted, so remove downvote.
                        docs.downvotes.splice(docs.downvotes.indexOf(req.session.userId), 1)
                        docs.save(function(err, docs) {
                            if (err) { res.status(500).send('Server database error, please try again later.') }
                            else {
                                Users.findOneAndUpdate({ _id: (req.body.parent === 'question' ? docs.asked_by : docs.ans_by) }, { $inc: { reputation: 5 } }, {}, function(err, docs) {
                                    if (err) { res.status(500).send('Server database error, please try again later.') }
                                    else { res.status(200).send('OK') }
                                })
                            }
                        })
                    } else if (docs.upvotes.indexOf(req.session.userId) !== -1) {
                        // Remove upvote(+10) and add downvote(-5).

                        docs.upvotes.splice(docs.upvotes.indexOf(req.session.userId), 1)
                        docs.downvotes.push(req.session.userId)
                        docs.save(function(err, docs) {
                            if (err) { res.status(500).send('Server database error, please try again later.') } 
                            else {
                                Users.findOneAndUpdate({ _id: (req.body.parent === 'question' ? docs.asked_by : docs.ans_by) }, { $inc: { reputation: -15 } }, {}, function(err, docs) {
                                    if (err) { res.status(500).send('Server database error, please try again later.') }
                                    else {
                                        res.status(200).send('OK')
                                    }
                                })
                            }
                        })
                    } else {
                        // add downvote.
                        docs.downvotes.push(req.session.userId)
                        docs.save(function(err, docs) {
                            if (err) { res.status(500).send('Server database error, please try again later.') } 
                            else {
                                Users.findOneAndUpdate({ _id: (req.body.parent === 'question' ? docs.asked_by : docs.ans_by) }, { $inc: { reputation: -5 } }, {}, function(err, docs) {
                                    if (err) { res.status(500).send('Server database error, please try again later.') }
                                    else {
                                        res.status(200).send('OK')
                                    }
                                })
                            }
                        })
                    }
                }
            })
        } 
    })

    app.get('/tags', async (req, res) => {
        Tags.find({}, {}, function(err, docs) {
            if (err) { res.status(500).send('Server database error, please try again later.') }
            else { res.send(docs) }
        })
    })

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
})

process.on('SIGINT', () =>{
    if (db) {
        db.close().then((res) => {
            console.log('Server close. Database instance disconnected')
            process.exit()
        })
        .catch((err) => console.log(err))
    }
})
