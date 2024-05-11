const bcrypt = require('bcrypt')
let mongoose = require('mongoose')

var Question = require('./models/questions')
var Answer = require('./models/answers')
var Tag = require('./models/tags')
var Comment = require('./models/comments')
var User = require('./models/users')

var {QuestionsBuilder} = require('./builders/QuestionsBuilder')
var {AnswersBuilder} = require('./builders/AnswersBuilder')
var {TagsBuilder} = require('./builders/TagsBuilder')
var {CommentsBuilder} = require('./builders/CommentsBuilder')
var {UsersBuilder} = require('./builders/UsersBuilder')

const mongoDB_url = 'mongodb://localhost:27017/fake_so'
const port = 8000

mongoose.connect(mongoDB_url, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = global.Promise
let db = mongoose.connection

async function bruh(hash) {
    try {
        let rootUser = new UsersBuilder('root')
            .setEmail('root@me')
            .setPassword(hash)
            .setReputation(1000)
            .setCreationDate(new Date(2010, 1, 1, 1, 24))
            .build()
        let highRepUser = new UsersBuilder('highRep')
            .setEmail('highrep@me')
            .setPassword(hash)
            .setReputation(1000)
            .setCreationDate(new Date(2011, 2, 2, 2, 22))
            .build()
        let lowRepUser = new UsersBuilder('lowRep')
            .setEmail('lowrep@me')
            .setPassword(hash)
            .setReputation(7)
            .setCreationDate()
            .build()
        let manyThingsUser = new UsersBuilder('manyThings')
            .setEmail('manything@me')
            .setPassword(hash)
            .setReputation(105)
            .setCreationDate(new Date(2015, 1, 5, 1, 5))
            .build()

        rootUser = await rootUser.save()
        highRepUser = await highRepUser.save()
        lowRepUser = await lowRepUser.save()
        manyThingsUser = await manyThingsUser.save()

        let t_js = new TagsBuilder('javascript').setCreatedBy(rootUser).build()
        let t_react = new TagsBuilder('react').setCreatedBy(highRepUser).build()
        let t_java = new TagsBuilder('java').setCreatedBy(highRepUser).build()
        let t_network = new TagsBuilder('network').setCreatedBy(highRepUser).build()
        let t_random = new TagsBuilder('random').setCreatedBy(highRepUser).build()
        let t_sad = new TagsBuilder('sad').setCreatedBy(lowRepUser).build()
        let t_thing1 = new TagsBuilder('thing1').setCreatedBy(manyThingsUser).build()
        let t_thing2 = new TagsBuilder('thing2').setCreatedBy(manyThingsUser).build()
        let t_thing3 = new TagsBuilder('thing3').setCreatedBy(manyThingsUser).build()
        let t_android = new TagsBuilder('android-studio').setCreatedBy(manyThingsUser).build()
        let t_shared = new TagsBuilder('shared-preference').setCreatedBy(manyThingsUser).build()

        t_js = await t_js.save()
        t_react = await t_react.save()
        t_java = await t_java.save()
        t_network = await t_network.save()
        t_random = await t_random.save()
        t_sad = await t_sad.save()
        t_thing1 = await t_thing1.save()
        t_thing2 = await t_thing2.save()
        t_thing3 = await t_thing3.save()
        t_android = await t_android.save()
        t_shared = await t_shared.save()

        let a1 = new AnswersBuilder('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.')
            .setAnsBy(lowRepUser)
            .build()

        let a2 = new AnswersBuilder('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.')
            .setAnsBy(manyThingsUser)
            .build()

        let a3 = new AnswersBuilder('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.')
            .setAnsBy(lowRepUser)
            .build()

        let a4 = new AnswersBuilder('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);')
            .setAnsBy(manyThingsUser)
            .build()

        let a5 = new AnswersBuilder('I just found all the above examples just too confusing, so I wrote my own.')
            .setAnsBy(lowRepUser)
            .build()

        a1 = await a1.save()
        a2 = await a2.save()
        a3 = await a3.save()
        a4 = await a4.save()
        a5 = await a5.save()

        let q1 = new QuestionsBuilder('Programmatically navigate using React router')
            .setSummary('The one from example')
            .setText('the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.')
            .setAsker(highRepUser)
            .setViews(138)
            .addTagsWithIds([t_react, t_js])
            .addAnswersWithIds([a1, a2])
            .build()

        let q2 = new QuestionsBuilder('android studio save string shared preference...')
            .setSummary('The other one from example')
            .setText('I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.')
            .setViews(28)
            .setAsker(highRepUser)
            .addTagsWithIds([t_js, t_android, t_shared])
            .addAnswersWithIds([a3, a4, a5])
            .build()

        q1 = await q1.save()
        q2 = await q2.save()

        let a6 = new AnswersBuilder('Fake answer 1 to fake question with 6 answers')
            .setAnsBy(highRepUser)
            .build()
        let a7 = new AnswersBuilder('Fake answer 2 to fake question with 6 answerss')
            .setAnsBy(lowRepUser)
            .build()
        let a8 = new AnswersBuilder('Fake answer 3 to fake question with 6 answersss')
            .setAnsBy(manyThingsUser)
            .build()
        let a9 = new AnswersBuilder('Fake answer 4 to fake question with 6 answerssss')
            .setAnsBy(manyThingsUser)
            .build()
        let a10 = new AnswersBuilder('This should be the last answer in first answer page')
            .setAnsBy(manyThingsUser)
            .setAnsDateTime(Date(2019, 1, 1, 11, 2))
            .build()
        let a11 = new AnswersBuilder('This should appear on second answer page')
            .setAnsBy(manyThingsUser)
            .setAnsDateTime(Date(2019, 1, 1, 11, 1))
            .build()

        a6 = await a6.save()
        a7 = await a7.save()
        a8 = await a8.save()
        a9 = await a9.save()
        a10 = await a10.save()
        a11 = await a11.save()

        let q3 = new QuestionsBuilder('This question have 2 page of answer')
            .setSummary('Test page functions')
            .setText('This is a question object created by the populateDatabase.js script that contains 6 answers. Since only 5 answers are displayed per page, this should have 2 pages.')
            .setViews(10)
            .setAsker(highRepUser)
            .addTagsWithIds([t_thing1, t_thing2, t_thing3, t_random, t_react])
            .addAnswersWithIds([a6, a7, a8, a9, a10, a11])
            .build()

        q3 = await q3.save()

        let q4 = new QuestionsBuilder('This question have no answers')
            .setSummary('Nobody cares about this question')
            .setText('Someone please answer me')
            .setAsker(lowRepUser)
            .addTagsWithIds([t_sad])
            .build()

        q4 = await q4.save()

        let a12 = new AnswersBuilder('Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... Incrediblely long answer... ')
            .setAnsBy(highRepUser)
            .build()
        let a13 = new AnswersBuilder('var a = [1, 2, 3], b = [101, 2, 1, 10] \n var c = a.concat(b.filter((item) => a.indexOf(item) < 0)')
            .setAnsBy(manyThingsUser)
            .build()

        a12 = await a12.save()
        a13 = await a13.save()

        let q5 = new QuestionsBuilder('merge 2 array in Javascript without duplicate?')
            .setSummary('I have arr1=[1,2,3] and arr2=[1,3,4]. I want arr3=[1,2,3,4]')
            .setText('how do I do this?')
            .setAsker(lowRepUser)
            .addTagsWithIds([t_js])
            .addAnswersWithIds([a12, a13])
            .build()

        q5 = await q5.save()

        let a14 = new AnswersBuilder('Make sure they are both on the same address, and you sent a response back after a request')
            .setAnsBy(highRepUser)
            .build()

        a14 = await a14.save()

        let q6 = new QuestionsBuilder('Why is this react session code not working?')
            .setSummary("I have both useCredientials set to true, but client still don't get cookie")
            .setText('Axios have withCredential, cors have useCredentails, I do not understand why it no work')
            .setAsker(lowRepUser)
            .addTagsWithIds([t_react, t_js])
            .addAnswersWithIds([a14])
            .build()

        q6 = await q6.save()

        let q7 = new QuestionsBuilder('Question so old it should not even exist')
            .setSummary('This purely for testing, should not exist in real world use case')
            .setText('This question should be the last question in the list')
            .setAsker(rootUser)
            .setAskDate(new Date(1900, 1, 1, 1, 1))
            .build()

        q7 = await q7.save()

        let c1 = new CommentsBuilder('Random Comment!')
            .setUser(lowRepUser)
            .build()
        let c2 = new CommentsBuilder('This is another comment on this question!')
            .setUser(rootUser)
            .build()
        let c3 = new CommentsBuilder('Another test comment!')
            .setUser(highRepUser)
            .build()
        let c4 = new CommentsBuilder('Yet another test comment!')
            .setUser(highRepUser)
            .build()

        c1 = await c1.save()
        c2 = await c2.save()
        c3 = await c3.save()
        c4 = await c4.save()

        let c5 = new CommentsBuilder('This is a comment for the answer!')
            .setUser(rootUser)
            .build()

        c5 = await c5.save()

        let a15 = new AnswersBuilder('This is a answer')
            .setAnsBy(manyThingsUser)
            .addCommentsByIds([c5])
            .build()

        a15 = await a15.save()

        let q8 = new QuestionsBuilder('This Question have some comments')
            .setSummary('Comments to test')
            .setText('This should have a good amount of comments.')
            .setAsker(highRepUser)
            .addCommentsByIds([c1, c2, c3, c4])
            .addAnswersWithIds([a15])
            .build()

        q8 = await q8.save()

        console.log('Done!')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('connected', function() {
    bcrypt.hash('password', 10, function(err, hash) {
        if (err) {throw new Error('bcrypt errored')}
        
        db.dropDatabase()

        bruh(hash)
    })
})