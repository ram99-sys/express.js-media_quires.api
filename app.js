const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
module.exports = app;
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/todos/", async (request, response) => {
  const {
    status = "",
    priority = "",
    todo = "",
    search_q = "",
  } = request.query;
  if (status != "") {
    console.log(status, priority, todo);
    const returnRowsStatusTodo = `SELECT * FROM todo WHERE status LIKE 
        '%${status}%';`;
    const dbResponse = await db.all(returnRowsStatusTodo);
    response.send(dbResponse);
  } else if (priority != "") {
    console.log(`${priority},${status},${todo}`);
    const returnRowsPriorityHigh = `SELECT * FROM todo WHERE priority = '${priority}';`;
    const dbResponse = await db.all(returnRowsPriorityHigh);
    console.log(dbResponse);
    response.send(dbResponse);
  } else if (priority != "" && status != "") {
    console.log(`${priority},${status},${todo}`);
    const returnRowsWithPriorityAndStatus = `SELECT * FROM todo WHERE priority = '${priority}' AND status = '${status}';`;
    const dbResponse = await db.all(returnRowsWithPriorityAndStatus);
    response.send(dbResponse);
  } else if (search_q != "") {
    console.log(`${priority},${status},${todo},${search_q}`);
    const getSearchStringRows = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
    const dbResponse = await db.all(getSearchStringRows);
    response.send(dbResponse);
  }
});
/*
app.get("/todos/", async (request, response) => {
  const { priority = "", status = "", todo = "" } = request.query;
  console.log(`${priority},${status},${todo}`);
  const returnRowsPriorityHigh = `SELECT * FROM todo WHERE priority = '${priority}';`;
  const dbResponse = await db.all(returnRowsPriorityHigh);
  console.log(dbResponse);
  response.send(dbResponse);
});
*/
/*
app.get("/todos/", async (request, response) => {
  const { priority = "", status = "", todo = "" } = request.query;
  console.log(`${priority},${status},${todo}`);
  const returnRowsPriorityHigh = `SELECT * FROM todo WHERE priority = '${priority}';`;
  const dbResponse = await db.all(returnRowsPriorityHigh);
  console.log(dbResponse);
  response.send(dbResponse);
});
*/

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  console.log(`${todoId}`);
  const getTodo = `SELECT * FROM todo WHERE id = ${todoId};`;
  const dbResponse = await db.get(getTodo);
  response.send(dbResponse);
});

app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const addTodo = `INSERT INTO todo(id,todo,priority,status) 
    VALUES (
        ${id},
        '${todo}',
        '${priority}',
        '${status}'
    );`;
  await db.run(addTodo);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  console.log(`${todoId}`);
  const todoDetails = request.body;
  if (todoDetails.status != undefined) {
    const { status } = todoDetails;
    const updateStatus = `UPDATE todo SET status = '${status}' WHERE
    id = ${todoId};`;
    await db.run(updateStatus);
    response.send("Status Updated");
  } else if (todoDetails.priority != undefined) {
    const { priority } = todoDetails;
    const updatePriority = `UPDATE todo SET priority = '${priority}' WHERE
    id = ${todoId};`;
    await db.run(updatePriority);
    response.send("Priority Updated");
  } else if (todoDetails.todo != undefined) {
    const { todo } = todoDetails;
    const updateTodo = `UPDATE todo SET todo = '${todo}' WHERE
    id = ${todoId};`;
    await db.run(updateTodo);
    response.send("Todo Updated");
  }
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodo = `DELETE FROM todo WHERE id = ${todoId};`;
  await db.run(deleteTodo);
  response.send("Todo Deleted");
});
