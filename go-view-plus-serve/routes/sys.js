const express = require('express');
const jwt = require('jsonwebtoken')
const config = require('../config')
const knex = require('../utils/db');
const { md5 } = require('../utils/index')
const router = express.Router();

/* GET users listing. */
router.post('/login', async function (req, res, next) {
    const { username, password } = req.body
    console.log(username, password)
    //根据用户名密码查询数据库并比对密码是否一致，一致就返回token
    const user = await knex('t_sys_user').where({ username }).first();
    if (user) {
        const passMd5 = await md5(password)
        if (user.password == passMd5) {
            const token = await generateToken(user)
            res.send({
                code: 200,
                msg: "登录成功",
                data: {
                    token: {
                        isLogin: true,
                        loginDevice: "default-device",
                        loginId: "1",
                        loginType: "login",
                        sessionTimeout: 30 * 24 * 60 * 60,
                        tag: null,
                        tokenActivityTimeout: -1,
                        tokenName: "authorization",
                        tokenSessionTimeout: 30 * 24 * 60 * 60,
                        tokenTimeout: 30 * 24 * 60 * 60,
                        tokenValue: token,
                    },
                    userinfo: {
                        id: user.id,
                        nickname: user.nickname,
                        username: user.username
                    }
                }
            })
        }
    }

})

router.get('/getOssInfo', async function (req, res, next) {
    const bucketURL = req.protocol + '://' + req.hostname + ':' + config.port + "/" + config.uploadPath + '/'
    res.send({ code: 200, data: { bucketURL }, msg: "返回成功" })
})

router.get('/logout', async function (req, res, next) {
    //获取token 并吊销token
    const token = req.headers['authorization']
    res.send({ code: 200, msg: "退出成功" })
})
async function generateToken(user) {
    const payload = {
        username: user.username,
        id: user.id
        // other user data you want to include in the token
    };
    const options = {
        expiresIn: config.expiresIn, // token expires in 1 hour
    };
    return jwt.sign(payload, config.secretKey, options);
}



module.exports = router;
