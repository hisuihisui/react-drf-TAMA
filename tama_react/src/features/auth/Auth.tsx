import { Button, TextField } from "@material-ui/core";
import { Theme, makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import styles from "./Auth.module.css";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  fetchAsyncCreateProf,
  fetchAsyncLogin,
  fetchAsyncRegister,
  selectIsLoginView,
  toggleMode,
} from "./authSlice";

// MaterialUIのスタイルを定義
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    // 8×3の24pxに設定
    margin: theme.spacing(3),
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);
  // ローカルなState
  const [credential, setCredential] = useState({ username: "", password: "" });

  // フォームの入力値が変更したら実行される
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ユーザーが入力した内容
    const value = e.target.value;
    // valueに対応するキー
    const name = e.target.name;
    // username もしくは password のどちらかのみを更新したい
    setCredential({ ...credential, [name]: value });
  };

  // Login ボタン押下時の関数
  const login = async () => {
    if (isLoginView) {
      // ログイン画面だったら
      await dispatch(fetchAsyncLogin(credential));
    } else {
      // 新規登録画面だったら
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        // 新規登録処理が成功したら
        await dispatch(fetchAsyncLogin(credential));
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };

  return (
    <div className={styles.auth__root}>
      <h1>{isLoginView ? "Login" : "Register"}</h1>
      <br />
      <TextField
        // ラベルの表示
        InputLabelProps={{
          shrink: true,
        }}
        label="Username"
        type="text"
        name="username"
        value={credential.username}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        // ラベルの表示
        InputLabelProps={{
          shrink: true,
        }}
        label="Password"
        type="password"
        name="password"
        value={credential.password}
        onChange={handleInputChange}
      />
      <Button
        // 塗りつぶす
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={login}
      >
        {isLoginView ? "Login" : "Register"}
      </Button>
      <span onClick={() => dispatch(toggleMode())}>
        {isLoginView ? "Create new account ?" : "Back to Login"}
      </span>
    </div>
  );
};

export default Auth;
