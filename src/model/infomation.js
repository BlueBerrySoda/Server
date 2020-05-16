const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const crypto = require('crypto');

function hash(passward){
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(passward).digest('hex');
}

const Expirence = new Schema({
    field : String,
    level : String,
    scale : String,
    category : String
});

const Account = new Schema({
    profile : {
        username : String,
        age : Number,
        gender : String,
        school : String,
        region : String,
        bio : String,
        myfield : String,
        mylevel : String,
        thumbnail : { type: String, default: ''}
    },

    email : {type : String},

    social : {

        facebook :{
            id : String,
            accessToken : String
        },

        google:{
            id: String,
            accessToken : String
        }
    },
    passward : String,
    thoughtCount: {type : Number, default : 0},
    expirence : [Expirence],
    createdDate : {type : Date, default : Date.now}
});

Account.statics.findByUsername = function(username) {
    // 객체에 내장되어있는 값을 사용 할 때는 객체명.키 이런식으로 쿼리하면 됩니다
    return this.findOne({'profile.username': username}).exec();
};

Account.statics.findByEmail = function(email) {
    return this.findOne({email}).exec();
};

Account.statics.findByEmailOrUsername = function({username, email}) {
    return this.findOne({
        // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
        $or: [
            { 'profile.username': username },
            { email }
        ]
    }).exec();
};

Account.statics.localRegister = function({ username, email, password }) {
    // 데이터를 생성 할 때는 new this() 를 사용합니다.
    const account = new this({
        profile: {
            username
            // thumbnail 값을 설정하지 않으면 기본값으로 설정됩니다.
        },
        email,
        password: hash(password)
    });

    return account.save();
};

Account.methods.validatePassword = function(password) {
    // 함수로 전달받은 password 의 해시값과, 데이터에 담겨있는 해시값과 비교를 합니다.
    const hashed = hash(password);
    return this.password === hashed;
};

module.exports = Mongoose.model('Account', Account);