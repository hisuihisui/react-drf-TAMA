import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

import {
  AUTH_STATE,
  CRED,
  JWT,
  LOGIN_USER,
  POST_PROFILE,
  PROFILE,
  USER,
} from "../types";

// ログイン処理として、JWTトークンを発行
export const fetchAsyncLogin = createAsyncThunk(
  // action名
  "auth/login",
  async (auth: CRED) => {
    // POSTでアクセスして、JWTトークンを発行
    // ジェネリクスで返り値を指定
    const res = await axios.post<JWT>(
      `$(process.env.REACT_APP_API_URL)/authen/jwt/create/`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

// 新規会員登録
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: CRED) => {
    const res = await axios.post<USER>(
      `$(process.env.REACT_APP_API_URL)/api/create/`,
      auth,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
);

// ログインしているユーザ情報取得
export const fetchAsyncGetMyProf = createAsyncThunk(
  "auth/loginuser",
  async () => {
    const res = await axios.get<LOGIN_USER>(
      `$(process.env.REACT_APP_API_URL)/api/loginuser/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// プロフィールの新規作成
export const fetchAsyncCreateProf = createAsyncThunk(
  "auth/createProfile",
  async () => {
    const res = await axios.post<PROFILE>(
      `$(process.env.REACT_APP_API_URL)/api/profile/`,
      { img: null },
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

// プロフィール一覧取得
export const fetchAsyncGetProfs = createAsyncThunk(
  "auth/getProfiles",
  async () => {
    const res = await axios.get<PROFILE[]>(
      `$(process.env.REACT_APP_API_URL)/api/profile/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// プロフィール更新
export const fetchAsyncUpdateProf = createAsyncThunk(
  "auth/updateProfile",
  async (profile: POST_PROFILE) => {
    // 画像のみ取り出して更新
    const uploadData = new FormData();
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put<PROFILE>(
      `$(process.env.REACT_APP_API_URL)/api/profile/${profile.id}/`,
      uploadData,
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

// State
const initialState: AUTH_STATE = {
  isLoginView: true,
  loginUser: {
    id: 0,
    username: "",
  },
  profiles: [{ id: 0, user_profile: 0, img: null }],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login⇔Registerを切り替えるtoggle
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
  },
  // 非同期関数の後処理
  extraReducers: (builder) => {
    // ログイン成功時の処理
    builder.addCase(
      fetchAsyncLogin.fulfilled,
      // payload:非同期関数の返り値(res.data)
      (state, action: PayloadAction<JWT>) => {
        // JWTをlocalStorageへ保存
        // action.payload.access:アクセストークン
        localStorage.setItem("localJWT", action.payload.access);
        // アクセストークンがあれば、タスク一覧画面に遷移
        action.payload.access && (window.location.href = "/tasks");
      }
    );
    // ログインユーザー情報取得後の処理
    builder.addCase(
      fetchAsyncGetMyProf.fulfilled,
      // payload:非同期関数の返り値(res.data)
      (state, action: PayloadAction<LOGIN_USER>) => {
        return {
          ...state,
          loginUser: action.payload,
        };
      }
    );
    // プロフィール一覧取得後の処理
    builder.addCase(
      fetchAsyncGetProfs.fulfilled,
      // payload:非同期関数の返り値(res.data)
      (state, action: PayloadAction<PROFILE[]>) => {
        return {
          ...state,
          profiles: action.payload,
        };
      }
    );
    // プロフィール更新後の処理
    builder.addCase(
      fetchAsyncUpdateProf.fulfilled,
      // payload:非同期関数の返り値(res.data)
      (state, action: PayloadAction<PROFILE>) => {
        return {
          ...state,
          // プロフィールを更新
          profiles: state.profiles.map((prof) =>
            prof.id === action.payload.id ? action.payload : prof
          ),
        };
      }
    );
  },
});

export const { toggleMode } = authSlice.actions;

// useSelector
// Stateの特定の値を返す
export const selectIsLoginView = (state: RootState) => state.auth.isLoginView
export const selectLoginUser = (state: RootState) => state.auth.loginUser
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
