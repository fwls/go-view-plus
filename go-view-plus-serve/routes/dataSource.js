const express = require('express');
const knex = require('../utils/db');

const router = express.Router();

router.get('/list', async function (req, res, next) {
    let { page, pageSize, sorter, name } = req.query

    !page ? page = 1 : page
    !pageSize ? pageSize = 10 : pageSize

    const query = knex('t_goview_data_source')
        .orderBy(sorter ? `${sorter.columnKey} ${sorter.order}` : 'id', 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    const results = name
        ? await query.where('name', 'like', `%${name}%`).select()
        : await query.select();
    const total = await knex('t_goview_data_source').count('* as total').first();
    
    res.send({
        code: 200,
        data: results,
        count: total['total'],
        msg: "获取成功"
    });
});

router.post('/create', async function (req, res, next) {
    const { name, type, host, username, password, remark, database, charset, port } = req.body
    if (!name || !type || !host || !username || !password || !database || !charset || !port) {
        res.send({
            code: 400,
            msg: "参数错误"
        })
        return
    }
    const exist = await knex('t_goview_data_source').where({ name }).first()
    if (exist) {
        res.send({
            code: 400,
            msg: "数据源名称已存在"
        })
        return
    }
    await knex('t_goview_data_source').insert({
        name,
        type,
        host,
        username,
        password,
        remark,
        database,
        charset,
        port,
        createTime: new Date(),
        createUserId: req.user.id
    })
    res.send({
        code: 200,
        msg: "添加成功"
    })
})

router.put('/update', async function (req, res, next) {
    const { id, name, type, host, username, password, remark, database, charset, port } = req.body
    if (!name || !type || !host || !username || !password || !database || !charset || !port) {
        res.send({
            code: 400,
            msg: "参数错误"
        })
        return
    }
    await knex('t_goview_data_source').where({ id }).update({
        name,
        type,
        host,
        username,
        password,
        remark,
        database,
        charset,
        port
    })
    res.send({
        code: 200,
        msg: "修改成功"
    })
})


router.delete('/delete', async function (req, res, next) {
    const { id } = req.query
    if (!id) {
        res.send({
            code: 400,
            msg: "参数错误"
        })
        return
    }
    await knex('t_goview_data_source').where({ id }).del()
    res.send({
        code: 200,
        msg: "删除成功"
    })
})


router.post('/execute', async function (req, res, next) {
    const { id, sql } = req.body
    if (!id || !sql) {
        res.send({
            code: 400,
            msg: "参数错误"
        })
        return
    }
    const dataSource = await knex('t_goview_data_source').where({ id }).first()
    let knexDb = null;
    switch (dataSource.type) {
        case 'MySQL':
            knexDb = require('knex')({
                client: 'mysql',
                connection: {
                    host: dataSource.host,
                    user: dataSource.username,
                    password: dataSource.password,
                    database: dataSource.database,
                    charset: dataSource.charset,
                    port: dataSource.port
                }
            })
            break;
        case 'sqlserver':
            knexDb = require('knex')({
                client: 'mssql',
                connection: {
                    host: dataSource.host,
                    user: dataSource.username,
                    password: dataSource.password,
                    database: dataSource.database,
                    charset: dataSource.charset,
                    port: dataSource.port
                }
            })
            break;
        case 'oracle':
            knexDb = require('knex')({
                client: 'oracledb',
                connection: {
                    host: dataSource.host,
                    user: dataSource.username,
                    password: dataSource.password,
                    database: dataSource.database,
                    charset: dataSource.charset,
                    port: dataSource.port
                }
            })
            break;
        case 'PostgreSQL':
            knexDb = require('knex')({
                client: 'pg',
                connection: {
                    host: dataSource.host,
                    user: dataSource.username,
                    password: dataSource.password,
                    database: dataSource.database,
                    charset: dataSource.charset,
                    port: dataSource.port
                }
            })
            break;
        default:
            res.send({
                code: 500,
                data: null,
                msg: "数据源暂不支持"
            })
    }
    const result = await knexDb.raw(sql)
    res.send({
        code: 200,
        data: result[0],
        msg: "执行成功"
    })
})


module.exports = router