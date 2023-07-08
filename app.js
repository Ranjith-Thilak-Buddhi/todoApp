const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite = require("sqlite3");
const date = require("date-fns");

app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });
    app.listen(3000, () => {
      console.log("Server Is Up Running And At http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const verifyQueries = (request, response, next) => {
  const { priority, status, category } = request.query;
  const priorities = ["HIGH", "LOW", "MEDIUM"];
  const statuses = ["TO DO", "IN PROGRESS", "DONE"];
  const categories = ["WORK", "HOME", "LEARNING"];
  const 

  switch (true) {
    case priority !== undefined:
      if (priorities.includes()) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;
    case status !== undefined:
      if (statuses.includes(status)) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case category !== undefined:
      if (catagories.includes(category)) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    default:
      break;
  }
};

app.get("/todos/", verifyQueries, async (request, response) => {
  const { priority, status, category, search_q } = request.query;
  let getTodoListQuery = ``;

  switch (true) {
    case search_q !== undefined:
      getQuery = `
            SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate 
            FROM
            todo
            WHERE
            todo LIKE %'${search_q}'%;`;
      break;
    case status !== undefined && priority !== undefined:
      getQuery = `
           SELECT 
           id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
           FROM
           todo
           WHERE
           status = '${status}' AND priority = '${priority}';`;
      break;
    case status !== undefined && category !== undefined:
      getQuery = `
           SELECT 
           id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
           FROM
           todo
           WHERE
           status = '${status}' AND category = '${category}';`;
      break;
    case priority !== undefined && category !== undefined:
      getQuery = `
           SELECT 
           id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
           FROM
           todo
           WHERE
           status = '${priority}' AND category = '${category}';`;
      break;
    case priority !== undefined &&
      status === undefined &&
      category === undefined:
      getQuery = `
            SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate 
            FROM
            todo
            WHERE
            priority = '${priority}';`;
      break;
    case priority === undefined &&
      status !== undefined &&
      category === undefined:
      getQuery = `
            SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate 
            FROM
            todo
            WHERE
            priority = '${status}';`;
    case priority === undefined &&
      status === undefined &&
      category !== undefined:
      getQuery = `
            SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate 
            FROM
            todo
            WHERE
            category = '${category}';`;
    default:
      break;
  }
  const todoList = await db.all(getTodoListQuery);
  response.send(todoList);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    id = ${todoId};`;
  const todo = await db.get(getTodoQuery);
  response.send(todo);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const postTodoQuery = `
    INSERT INTO
        todo (id, todo, priority, status, category, due_date)
    VALUES
        (${id}, '${todo}', '${priority}',  '${status}', '${category}', '${dueDate}')`;
  await db.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const requestQuery = `
         SELECT
         *
         FROM
         todo
         WHERE
         due_date = '${date}';`;
  const todosList = await db.all(requestQuery);
  response.send(todosList);
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { priority, status, category, dueDate } = request.body;
  let updateTodoQuery = "";

  switch (true) {
    case status !== undefined:
      updateTodoQuery = `
    UPDATE
    todo
    SET
    status = '${status}'
    WHERE
    id = ${todoId};`;
      await db.run(updateTodoQuery);
      response.send("Status Updated");
      break;
    case priority !== undefined:
      updateTodoQuery = `
    UPDATE
    todo
    SET
    priority = '${priority}'
    WHERE
    id = ${todoId};`;
      await db.run(updateTodoQuery);
      response.send("Priority Updated");
      break;
    case category !== undefined:
      updateTodoQuery = `
        UPDATE
            todo
        SET
            category = '${category}'
        WHERE
            id = ${todoId};`;
      await db.run(updateTodoQuery);
      response.send("Category Updated");
      break;
    case dueDate !== undefined:
      updateTodoQuery = `
        UPDATE
            todo
        SET
            due_date = '${dueDate}'
        WHERE
            id = ${todoId};`;
      await db.run(updateTodoQuery);
      response.send("dueDate Updated");
      break;
  }
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
    DELETE FROM
    todo
    WHERE
    id = ${todoId};`;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
