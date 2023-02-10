import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedTask } from "./taskSlice";

// Task詳細表示
const TaskDisplay: React.FC = () => {
  // 表示するタスク情報を取得
  const selectedTask = useSelector(selectSelectedTask);
  // 表示するために配列へデータを格納
  const row = [
    { item: "Task", data: selectedTask.task },
    { item: "Description", data: selectedTask.description },
    { item: "Criteria", data: selectedTask.criteria },
    { item: "Owner", data: selectedTask.owner_username },
    { item: "Responsible", data: selectedTask.responsible_username },
    { item: "Estimate [days]", data: selectedTask.estimate },
    { item: "Category", data: selectedTask.category_item },
    { item: "Status", data: selectedTask.status_name },
    { item: "Created", data: selectedTask.created_at },
    { item: "Updated", data: selectedTask.updated_at },
  ];
  // selectedTaskがない場合
  if (!selectedTask.task) {
    return null;
  }

  return (
    <>
      <Table>
        <TableBody>
          {row.map((row) => (
            <TableRow key={row.item}>
              <TableCell align="center">
                <strong>{row.item}</strong>
              </TableCell>
              <TableCell align="center">{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TaskDisplay;
