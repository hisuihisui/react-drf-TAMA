import {
  Button,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@material-ui/core";
import { Theme, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  editTask,
  fetchAsyncCreateCategory,
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  initialState,
  selectCategory,
  selectEditedTask,
  selectTask,
  selectUsers,
} from "./taskSlice";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
  addIcon: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  // modalのもととなる
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// modal表示用関数
function getModalStyle() {
  // 画面中央に表示
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// Taskの作成や更新する時のコンポーネント
const TaskForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  // モーダルが開いているか閉じているかを管理
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [inputText, setInputText] = useState("");

  // モーダルを表示
  const handleOpen = () => {
    setOpen(true);
  };
  // モーダルを非表示
  const handleClose = () => {
    setOpen(false);
  };
  // 作成/更新ボタンの有効化制御
  const isDisabled =
    editedTask.task.length === 0 ||
    editedTask.description.length === 0 ||
    editedTask.criteria.length === 0;

  // カテゴリ作成ボタンの有効化制御
  const isCatDisabled = inputText.length === 0;

  // CategoryのFormの入力が変わるごとに呼び出される
  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // EditTaskのFormの入力が変わるごとに呼び出される
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    const name = e.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value }));
  };

  // プルダウン選択時呼び出される
  // selecterの使用で特定のデータ型を受け取れない
  // responsible
  const handleSelectRespChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, responsible: value }));
  };
  // Status
  const handleSelectStatusChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as string;
    dispatch(editTask({ ...editedTask, status: value }));
  };
  // Category
  const handleSelectCatChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, category: value }));
  };

  // プルダウンに使用するリスト
  // User
  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));
  // Category
  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div>
      {/* タイトル */}
      <h2>{editedTask.id ? "Update Task" : "New Task"}</h2>
      <form>
        {/* 工数 */}
        <TextField
          className={classes.field}
          label="Estimate [days]"
          type="number"
          name="estimate"
          InputProps={{ inputProps: { min: 0, max: 1000 } }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        {/* タスク名 */}
        <TextField
          className={classes.field}
          label="Task"
          type="text"
          name="task"
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        {/* 説明 */}
        <TextField
          className={classes.field}
          label="Description"
          type="text"
          name="description"
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.description}
          onChange={handleInputChange}
        />
        {/* 完了目標 */}
        <TextField
          className={classes.field}
          label="Criteria"
          type="text"
          name="criteria"
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        {/* 担当者 */}
        <FormControl className={classes.field}>
          <InputLabel>Responsible</InputLabel>
          <Select
            name="responsible"
            onChange={handleSelectRespChange}
            value={editedTask.responsible}
          >
            {userOptions}
          </Select>
        </FormControl>
        {/* ステータス */}
        <FormControl className={classes.field}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            onChange={handleSelectStatusChange}
            value={editedTask.category}
          >
            {/* TODO:定数なので、 どこかのファイルにまとめて置きたい*/}
            <MenuItem value={1}>Not Started</MenuItem>
            <MenuItem value={2}>On going</MenuItem>
            <MenuItem value={3}>Done</MenuItem>
          </Select>
        </FormControl>
        <br />
        {/* カテゴリ */}
        <FormControl className={classes.field}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            onChange={handleSelectCatChange}
            value={editedTask.category}
          >
            {catOptions}
          </Select>
        </FormControl>
        {/* カテゴリ作成モーダル表示ボタン */}
        <Fab
          size="small"
          color="primary"
          onClick={handleOpen}
          className={classes.addIcon}
        >
          <AddIcon />
        </Fab>
        {/* カテゴリ作成モーダル */}
        {/* ??:作成のキャンセルはどうするんだ */}
        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="New Category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.saveModal}
              startIcon={<SaveIcon />}
              disabled={isCatDisabled}
              onClick={() => {
                dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              SAVE
            </Button>
          </div>
        </Modal>
        <br />
        {/* タスクの作成/更新ボタン */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? "Update" : "Save"}
        </Button>
        {/* キャンセルボタン */}
        {/* ??:押したらなんでとじるの */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
