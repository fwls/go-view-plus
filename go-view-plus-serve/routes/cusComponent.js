const express = require("express");

const knex = require("../utils/db");

const router = express.Router();

router.get("/list", async (req, res) => {
  let { page, pageSize, sorter, name } = req.query;

  !page ? (page = 1) : page;
  !pageSize ? (pageSize = 10) : pageSize;

  const query = knex("t_goview_custom_component")
    .orderBy(sorter ? `${sorter.columnKey} ${sorter.order}` : "id", "desc")
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const results = name
    ? await query.where("name", "like", `%${name}%`).select()
    : await query.select();
  const total = await knex("t_goview_custom_component")
    .count("* as total")
    .first();

  res.send({
    code: 200,
    data: results,
    count: total["total"],
    msg: "获取成功",
  });
});

router.post("/create", async function (req, res, next) {
  const { name, type, content, remark } = req.body;
  if (!name || !type || !content || !remark) {
    res.send({
      code: 400,
      msg: "参数错误",
    });
    return;
  }
  const exist = await knex("t_goview_custom_component").where({ name }).first();
  if (exist) {
    res.send({
      code: 400,
      msg: "数据源名称已存在",
    });
    return;
  }
  await knex("t_goview_custom_component").insert({
    name,
    type,
    content,
    remark,
    createTime: new Date(),
    createUserId: req.user.id,
  });
  res.send({
    code: 200,
    msg: "添加成功",
  });
});

router.put("/update", async function (req, res, next) {
  const {
    id,
    name,
    type,
    content,
    remark,
  } = req.body;
  if (
    !name ||
    !type ||
    !content ||
    !remark 
  ) {
    res.send({
      code: 400,
      msg: "参数错误",
    });
    return;
  }
  await knex("t_goview_custom_component").where({ id }).update({
    name,
    type,
    content,
    remark,
  });
  res.send({
    code: 200,
    msg: "修改成功",
  });
});

router.delete("/delete", async function (req, res, next) {
  const { id } = req.query;
  if (!id) {
    res.send({
      code: 400,
      msg: "参数错误",
    });
    return;
  }
  await knex("t_goview_custom_component").where({ id }).del();
  res.send({
    code: 200,
    msg: "删除成功",
  });
});

module.exports = router;
