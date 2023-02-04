import React, { useEffect, useState } from "react";
import styles from "./TaskList.module.css";

import {
  Avatar,
  Badge,
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Theme,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlineIcon from "@material-ui/icons/EditOutlined";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import { READ_TASK, SORT_STATE } from "../types";
import {
  editTask,
  fetchAsyncDeleteTask,
  initialState,
  selectTask,
  selectTasks,
} from "./taskSlice";

// material-uiのスタイルを定義
const useStyle = makeStyles((theme: Theme) => ({
  table: {
    tableLayout: "fixed",
  },
  button: {
    matgin: theme.spacing(3),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

// Task一覧を表示するコンポーネント
const TaskList: React.FC = () => {
  const classes = useStyle();
  const dispatch: AppDispatch = useDispatch();

  // Stateを読み込む
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  // タスク一覧に使用する項目名
  // tasksのオブジェクトのキーを取得
  const columns = tasks[0] && Object.keys(tasks[0]);

  // ローカルState
  const [state, setState] = useState<SORT_STATE>({
    rows: tasks,
    order: "desc",
    activeKey: "",
  });

  // sort用関数
  // 引数にsortしたいカラムを指定する
  const handleClickSortColumn = (column: keyof READ_TASK) => {
    // sortしたいカラムが選ばれている ＆ orderがdesc の場合、true
    // カラムをクリックした1回目にdescになる
    // カラムをクリックした2回目にascになる
    const isAsc = column === state.activeKey && state.order === "desc";
    const newOrder = isAsc ? "asc" : "desc";
    // sortを行い、配列に格納
    // 1  : b → a の順番で返す
    // -1 : a → b の順番で返す
    const sortedRows = Array.from(state.rows).sort((a, b) => {
      if (a[column] > b[column]) {
        return newOrder === "asc" ? 1 : -1;
      } else if (a[column] < b[column]) {
        return newOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });

    // sortした内容でStateを上書き
    setState({
      rows: sortedRows,
      order: newOrder,
      activeKey: column,
    });
  };

  // タスク一覧が変化したら、更新する
  useEffect(() => {
    setState((state) => ({
      ...state,
      rows: tasks,
    }));
  }, [tasks]);

  // TaskのStatusに応じてバッジの色を切り替える
  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case "Not Started":
        return (
          <Badge variant="dot" color="error">
            {statusName}
          </Badge>
        );
      case "On going":
        return (
          <Badge variant="dot" color="primary">
            {statusName}
          </Badge>
        );
      case "Done":
        return (
          <Badge variant="dot" color="secondary">
            {statusName}
          </Badge>
        );
      default:
        return null;
    }
  };

  // ユーザーIDからプロフィール画像を持ってくる
  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter(
      (prof) => prof.user_profile === user
    )[0];
    return loginProfile?.img !== null ? loginProfile?.img : undefined;
  };

  return (
    <>
      {/* Add Newボタン */}
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="small"
        // ボタン内のアイコン指定
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          dispatch(
            editTask({
              id: 0,
              task: "",
              description: "",
              criteria: "",
              // 担当者をログインユーザーにする
              responsible: loginUser.id,
              status: "1",
              category: 1,
              estimate: 0,
            })
          );
          dispatch(selectTask(initialState.selectedTask));
        }}
      >
        Add new
      </Button>
      {/* タスクがない時に一覧を表示しない */}
      {tasks[0]?.task && (
        <Table size="small" className={classes.table}>
          {/* ラベル */}
          <TableHead>
            <TableRow>
              {columns.map(
                (column, colIndex) =>
                  (column === "task" ||
                    column === "status" ||
                    column === "category" ||
                    column === "estimate" ||
                    column === "responsible" ||
                    column === "owner") && (
                    <TableCell align="center" key={colIndex}>
                      {/* ソート実装 */}
                      <TableSortLabel
                        // アクティブなカラム
                        active={state.activeKey === column}
                        // 昇順、降順
                        direction={state.order}
                        onClick={() => handleClickSortColumn(column)}
                      >
                        <strong>{column}</strong>
                      </TableSortLabel>
                    </TableCell>
                  )
              )}
              {/* アイコン用の列 */}
              <TableCell />
            </TableRow>
          </TableHead>
          {/* 一覧の部分 */}
          <TableBody>
            {/* タスクごとに行に展開 */}
            {state.rows.map((row, rowIndex) => (
              <TableRow hover key={rowIndex}>
                {Object.keys(row).map(
                  (key, colIndex) =>
                    (key === "task" ||
                      key === "status_name" ||
                      key === "category_item" ||
                      key === "estimate") && (
                      <TableCell
                        align="center"
                        className={styles.tasklist__hover}
                        key={`${rowIndex}+${colIndex}`}
                        onClick={() => {
                          dispatch(selectTask(row));
                          dispatch(editTask(initialState.editedTask));
                        }}
                      >
                        {key === "status_name" ? (
                          renderSwitch(row[key])
                        ) : (
                          <span>{row[key]}</span>
                        )}
                      </TableCell>
                    )
                )}
                {/* 担当者 */}
                <TableCell>
                  <Avatar
                    className={classes.small}
                    alt="resp"
                    src={conditionalSrc(row["responsible"])}
                  />
                </TableCell>
                {/* 管理者 */}
                <TableCell>
                  <Avatar
                    className={classes.small}
                    alt="owner"
                    src={conditionalSrc(row["owner"])}
                  />
                </TableCell>
                {/* 更新・削除ボタン */}
                <TableCell align="center">
                  {/* 削除ボタン */}
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => dispatch(fetchAsyncDeleteTask(row.id))}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </button>
                  {/* 更新ボタン */}
                  <button
                    className={styles.tasklist__icon}
                    onClick={() => dispatch(editTask(row))}
                    disabled={row["owner"] !== loginUser.id}
                  >
                    <EditOutlineIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TaskList;
