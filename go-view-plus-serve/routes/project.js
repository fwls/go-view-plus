const express = require('express');
const multer = require('multer');
const config = require('../config')
const { verifyToken } = require('../utils/index')

const knex = require('../utils/db');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/' + config.uploadPath); // 指定上传文件存放的目录
    },
    filename: function (req, file, cb) {
        // 这里定义文件名生成逻辑
        const originalName = file.originalname; // 原始文件名
        cb(null, originalName); // 生成包含时间戳和原始扩展名的文件名
    }
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/list', verifyToken, async function (req, res, next) {
    if (req.query.limit) {
        var limit = req.query.limit
    } else {
        var limit = 12
    }
    if (req.query.page) {
        var page = req.query.page
    } else {
        var page = 1
    }

    const results = await knex('t_goview_project').limit(limit).offset((page - 1) * limit);
    const total = await knex('t_goview_project').count();

    res.send({
        code: 200,
        count: total[0]['count(*)'],
        data: results,
        msg: "获取成功"
    });
});


router.post('/create', verifyToken, async function (req, res, next) {
    const { indexImage, projectName, remarks } = req.body

    const exist = await knex('t_goview_project').where({ projectName });
    if (exist.length > 0) {
        res.send({
            code: 500,
            msg: '项目已存在'
        });
        return
    }
    const result = await knex('t_goview_project').insert({ indexImage, projectName, remarks, createTime: new Date(), createUserId: req.user.id });
    let project = null
    if (result) {
        project = await knex('t_goview_project').where({ projectName }).first();
    }
    res.send({
        code: 200,
        data: project,
        msg: "创建成功"
    });
});


router.get('/getData', async function (req, res, next) {
    const { projectId } = req.query
    if (projectId == undefined) {
        res.send({
            code: 500,
            msg: '参数错误'
        });
        return
    }
    let result = await knex('t_goview_project').where({ id: projectId }).first();
    const data = await knex('t_goview_project_data').where({ projectId }).first();

    if (data?.content) {
        result['content'] = data?.content
    } else {
        result = null
    }
    res.send({
        code: 200,
        data: result,
        msg: "获取成功"
    });
});

router.post('/edit', verifyToken, async function (req, res, next) {
    const { id, indexImage } = req.body
    if (id == undefined || indexImage == undefined) {
        res.send({
            code: 500,
            msg: '参数错误'
        });
        return
    }
    const result = await knex('t_goview_project').where({ id }).update({ indexImage });
    res.send({
        code: 200,
        data: result,
        msg: "保存成功"
    });
});

router.post('/save/data', verifyToken, upload.none(), async function (req, res, next) {
    // 获取express form数据
    const { projectId, content } = req.body
    if (projectId == undefined || content == undefined) {
        res.send({
            code: 500,
            msg: '参数错误'
        });
        return
    }
    const exist = await knex('t_goview_project_data').where({ projectId });
    if(exist.length > 0) {
        await knex('t_goview_project_data').where({ projectId }).update({ content });
    } else {
        await knex('t_goview_project_data').insert({ projectId, content, createTime: new Date(),createUserId: req.user.id });
    }
    res.send({
        code: 200,
        data: '',
        msg: "保存成功"
    });
});

router.put('/publish', async function (req, res, next) {
    const { id, state } = req.body
    if (id == undefined || state == undefined) {
        res.send({
            code: 500,
            msg: '参数错误'
        });
        return
    }
    const result = await knex('t_goview_project').where({ id: id }).update({ state });
    res.send({
        code: 200,
        data: result,
        msg: "发布成功"
    });
});


router.delete('/delete', verifyToken, async function (req, res, next) {
    const { ids } = req.query
    console.log('ids', ids)
    if (ids == undefined) {
        res.send({
            code: 500,
            msg: '参数错误'
        });
        return
    }
    const result = await knex('t_goview_project').where({ id: ids }).del();
    res.send({
        code: 200,
        data: result,
        msg: "删除成功"
    });
});



// 创建一个路由处理图片上传
router.post('/upload', verifyToken, upload.single('object'), (req, res, next) => {
    try {
        // 文件已经被上传到 'public/upload/' 目录下，req.file包含文件信息
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileName = file.filename; // 上传后的文件名（可能已被重命名）
        const originalName = file.originalname; // 原始文件名
        const fileSize = file.size; // 文件大小，单位字节
        const fileType = file.mimetype; // 文件MIME类型
        res.send({
            "code": 200,
            "data": {
                "id": "956533752530604032",
                "fileName": originalName,
                "bucketName": null,
                "fileSize": fileSize,
                "fileSuffix": fileType,
                "createUserId": "-",
                "createUserName": "-",
                "createTime": new Date(),
                "updateUserId": null,
                "updateUserName": null,
                "updateTime": null
            }
        });

    } catch (error) {
        res.send({ code: 500, msg: '上传失败' });
    }
});



module.exports = router;
