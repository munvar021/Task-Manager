const { EntitySchema } = require("typeorm");

const Task = new EntitySchema({
  name: "Task",
  tableName: "tasks",
  columns: {
    id: {
      type: "varchar",
      primary: true,
      generated: "uuid",
      length: 36,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 20,
      nullable: false,
      default: "todo",
      enum: ["todo", "in_progress", "done"],
    },
    dueDate: {
      type: "datetime",
      nullable: true,
    },
    createdAt: {
      type: "datetime",
      createDate: true,
    },
    updatedAt: {
      type: "datetime",
      updateDate: true,
    },
  },
  indices: [
    {
      name: "IDX_TASK_STATUS",
      columns: ["status"],
    },
    {
      name: "IDX_TASK_DUE_DATE",
      columns: ["dueDate"],
    },
    {
      name: "IDX_TASK_CREATED_AT",
      columns: ["createdAt"],
    },
  ],
});

module.exports = Task;
