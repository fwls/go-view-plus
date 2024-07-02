const config = require("./config");
const { md5 } = require("./utils/index");

const knex = require("knex")({
  client: config.dbClient,
  connection: config.dbConnection,
  useNullAsDefault: true,
});

async function dropTables() {
  try {
    await knex.schema.dropTable("t_sys_user");
    await knex.schema.dropTable("t_goview_project");
    await knex.schema.dropTable("t_goview_project_data");
    await knex.schema.dropTable("t_goview_data_source");
    await knex.schema.dropTable("t_goview_custom_component");
  } catch (error) {
    // console.log(error)
  }
}

async function createTables() {
  await knex.schema.createTable("t_sys_user", function (table) {
    table.increments();
    table.string("username");
    table.string("password", 128);
    table.string("nickname", 128);
    table.string("dep_id", 128);
    table.string("pos_id", 128);
    table.timestamps();
  });

  await knex.schema.createTable("t_goview_project", function (table) {
    table.increments();
    table.string("projectName");
    table.smallint("state").defaultTo(0);
    table.dateTime("createTime");
    table.integer("createUserId");
    table.smallint("isDelete").defaultTo(0);
    table.string("indexImage");
    table.string("remarks");
    table.timestamps();
  });

  await knex.schema.createTable("t_goview_project_data", function (table) {
    table.increments();
    table.integer("projectId");
    table.dateTime("createTime");
    table.integer("createUserId");
    table.text("content");
    table.timestamps();
  });

  await knex.schema.createTable("t_goview_custom_component", function (table) {
    table.increments();
    table.string("name");
    table.string("type", 32);
    table.text("content");
    table.string("remark");
    table.dateTime("createTime");
    table.integer("createUserId");
    table.timestamps();
    table.index("type");
  });

  await knex.schema.createTable("t_goview_data_source", function (table) {
    table.increments();
    table.string("name");
    table.string("host");
    table.string("username");
    table.string("password");
    table.string("database", 32);
    table.integer("port", 6);
    table.string("charset");
    table.string("remark");
    table.string("type");
    table.dateTime("createTime");
    table.integer("createUserId");
    table.timestamps();
  });
}

async function seed() {
  let md5Pwd = await md5("admin");
  await knex("t_sys_user").insert({
    username: "admin",
    password: md5Pwd,
    nickname: "管理员",
    dep_id: "2",
    pos_id: "410792368778907648",
  });
}

async function main() {
  await dropTables();
  await createTables();
  await seed();
  process.exit();
}

main();
