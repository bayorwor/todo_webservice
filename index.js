import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Todo from "./schemas/todoSchhema.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.DB_URL, { useUnifiedTopology: true })
  .then(() => console.log("DB connected"));

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

//GET all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find({});
  if (todos) {
    return res.status(200).json({
      status: true,
      message: "todos fetched successfully",
      data: todos,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todos not found",
    });
  }
});

//GET all todos
app.get("/todos/:status", async (req, res) => {
  const { status } = req.params;
  const todos = await Todo.find({}).where("status").equals(status);
  if (todos) {
    return res.status(200).json({
      status: true,
      message: "todos fetched successfully",
      data: todos,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todos not found",
    });
  }
});
//GET single todo
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (todo) {
    return res.status(200).json({
      status: true,
      message: "todo fetched successfully",
      data: todo,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todo not found",
    });
  }
});
//POST a todo
app.post("/todos", async (req, res) => {
  const { title, description, date_time } = req.body;
  const todo = await Todo.create({
    title,
    description,
    date_time,
  });
  if (todo) {
    return res.status(200).json({
      status: true,
      message: "todo created",
      data: todo,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todo not created",
    });
  }
});

//PATCH single todo
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const todo = await Todo.updateOne({ status }).where({ _id: id });

  if (todo) {
    return res.status(200).json({
      status: true,
      message: "todo updated",
      data: todo,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todo not updated",
    });
  }
});
//DELETE single todo
app.delete("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (todo) {
    return res.status(200).json({
      status: true,
      message: "todo deleted",
      data: todo,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "todo not deleted",
    });
  }
});

app.listen(port || 7000, () => console.log(`server started in port ${port}`));
