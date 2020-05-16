const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');
const Account = require('../../model/infomation');

exports.list = async (ctx) => {
    let infolist;

    try {
        infolist = await Account.find().exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = infolist;
};

exports.get = async (ctx) => {
    const { id } = ctx.params;

    let info;

    try {
        info = await Account.findById(id).exec();
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
        return ctx.throw(500, e);
    }

    if(!info) {
        // 존재하지 않으면
        ctx.status = 404;
        ctx.body = { message: 'book not found' };
        return;
    }

    ctx.body = info;
};
exports.create = async (ctx) => {
    const {
        profile,
        email,
        social,
        passward,
        thoughtCount,
        expirence,
        createdDate
    } = ctx.request.body;

    const information = new Account({
        profile,
        email,
        social,
        passward,
        thoughtCount,
        expirence,
        createdDate
    });

    try{
        await information.save();
    }catch(e){
        return ctx.throw(500, e); 
    }

    ctx.body = information;
};

exports.delete = async (ctx) => {
    const { id } = ctx.params;

    try {
        await Account.findByIdAndRemove(id).exec();
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }

    ctx.status = 204;
};

exports.replace = async (ctx) => {
    const { id } = ctx.params;

    if(!ObjectId.isValid(id)) {
        ctx.status = 400;
        return;
    }

    const schema = Joi.object().keys({
        profile: Joi.array().items(Joi.object().keys({
            username : Joi.string().required(),
            age : Joi.number().required(),
            gender : Joi.string().required(),
            school : Joi.string().required(),
            region : Joi.string(),
            bio : Joi.string(),
            myfield : Joi.string().required(),
            mylevel : Joi.string().required(),
            thumbnail : Joi.string().required()
        })),
        email : Joi.string().email().required(),
        social : Joi.array().items(Joi.object().keys({
            facebook : Joi.array().items(Joi.object().keys({
                id : Joi.string().required(),
                accessToken : Joi.string().required()
            })),
            google: Joi.array().items(Joi.object().keys({
                id: Joi.string().required(),
                accessToken : Joi.string().required()
            })),
        })),
        passward : Joi.string().required(),
        thoughtCount: Joi.number().required(),
        expirence : Joi.array().items(Joi.object().keys({
            field : Joi.string().required(),
            level : Joi.string().required(),
            scale : Joi.string().required(),
            category : Joi.string().required()
        })),
        createdDate : Joi.date().required()
    });

    const result = Joi.validate(ctx.request.body, schema); 

    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    let account;

    try {
        account = await Account.findByIdAndUpdate(id, ctx.request.body, {
            upsert: true, // 이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줍니다
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다.
                      // 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
        });
    } catch (e) {
        return ctx.throw(500, e);
    }
    ctx.body = account;
}

exports.update = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    if(!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request
        return;
    }

    let account;

    try {
        // 아이디로 찾아서 업데이트를 합니다.
        // 파라미터는 (아이디, 변경 할 값, 설정) 순 입니다.
        account = await Account.findByIdAndUpdate(id, ctx.request.body, {
            // upsert 의 기본값은 false 입니다.
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다. 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
        });
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = account;
};