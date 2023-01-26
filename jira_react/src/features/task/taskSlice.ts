import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

import { CATEGORY, POST_TASK, READ_TASK, TASK_STATE, USER } from "../types";

// 非同期関数定義
// Task一覧を取得
export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
  const res = await axios.get<READ_TASK[]>(
    `${process.env.REACT_APP_API_URL}/api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});

// User一覧取得
export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const res = await axios.get<USER[]>(
      `${process.env.REACT_APP_API_URL}/api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// Category一覧取得
export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const res = await axios.get<CATEGORY[]>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// Category作成
export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item: string) => {
    const res = await axios.post<CATEGORY>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      { item: item },
      {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// Task作成
export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task: POST_TASK) => {
    const res = await axios.post<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// Task更新
export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task: POST_TASK) => {
    const res = await axios.put<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`,
      task,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// Task削除
export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number) => {
    await axios.delete<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/${id}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return id;
  }
);

export const initialState: TASK_STATE = {
  tasks: [
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      status: "",
      status_name: "",
      category: 0,
      category_item: "",
      estimate: 0,
      owner: 0,
      owner_username: "",
      responsible: 0,
      responsible_username: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    category: 0,
    estimate: 0,
    responsible: 0,
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    status_name: "",
    category: 0,
    category_item: "",
    estimate: 0,
    owner: 0,
    owner_username: "",
    responsible: 0,
    responsible_username: "",
    created_at: "",
    updated_at: "",
  },
  users: [
    {
      id: 0,
      username: "",
    },
  ],
  category: [
    {
      id: 0,
      item: "",
    },
  ],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // editedTaskのState更新
    editTask(state, action: PayloadAction<POST_TASK>) {
      state.editedTask = action.payload;
    },
    // selectedTaskのState更新
    selectTask(state, action: PayloadAction<READ_TASK>) {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // タスク一覧取得後、タスクの配列に情報を格納
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      (state, action: PayloadAction<READ_TASK[]>) => {
        return {
          ...state,
          tasks: action.payload,
        };
      }
    );
    // タスク一覧取得に失敗した場合、top画面に戻る
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      window.location.href = "/";
    });
    // User一覧取得成功
    builder.addCase(
      fetchAsyncGetUsers.fulfilled,
      (state, action: PayloadAction<USER[]>) => {
        return {
          ...state,
          users: action.payload,
        };
      }
    );
    // Category一覧取得成功
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY[]>) => {
        return {
          ...state,
          category: action.payload,
        };
      }
    );
    // Category作成成功後
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY>) => {
        return {
          ...state,
          category: [...state.category, action.payload],
        }
      }
    );
    // Category作成失敗後
    builder.addCase(
      fetchAsyncCreateCategory.rejected,
      () => {
        window.location.href = "/";
      }
    );
    // Task作成成功後
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
          editedTask: initialState.editedTask,
        }
      }
    )
    // Task作成失敗後
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      window.location.href = "/";
    });
    // Task更新成功後
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>) => {
        return {
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          ),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    )
    // Task更新失敗後
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      window.location.href = "/";
    });
    // Task削除成功後
    builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.tasks.filter((t) => t.id !== action.payload),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        };
      }
    )
    // Task削除失敗後
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      window.location.href = "/";
    });
  }
});

export const { editTask, selectTask } = taskSlice.actions;

// useSelector
// Stateの特定の値を返す
export const selectSelectedTask = (state:RootState) => state.task.selectedTask
export const selectEditedTask = (state:RootState) => state.task.editedTask
export const selectTasks = (state:RootState) => state.task.tasks
export const selectUsers = (state:RootState) => state.task.users
export const selectCategory = (state: RootState) => state.task.category;

export default taskSlice.reducer;
