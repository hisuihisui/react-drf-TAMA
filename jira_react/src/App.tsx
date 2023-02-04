import { Avatar, Grid } from "@material-ui/core";
import {
  MuiThemeProvider,
  Theme,
  createTheme,
  makeStyles,
} from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PolymerIcon from "@material-ui/icons/Polymer";
import React, { useEffect } from "react";
import styles from "./App.module.css";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
  selectLoginUser,
  selectProfiles,
} from "./features/auth/authSlice";
import {
  fetchAsyncGetCategory,
  fetchAsyncGetTasks,
  fetchAsyncGetUsers,
  selectEditedTask,
  selectTasks,
} from "./features/task/taskSlice";

import { AppDispatch } from "./app/store";
import TaskDisplay from "./features/task/TaskDisplay";
import TaskForm from "./features/task/TaskForm";
import TaskList from "./features/task/TaskList";

// MaterialUIのSecondaryの色を緑色へ変更
const theme = createTheme({
  palette: {
    secondary: {
      // カラーコード
      main: "#3cb371",
    },
  },
});

// MaterialUIのコンポーネントを装飾
const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginTop: theme.spacing(3),
    cursor: "none",
  },
  avatar: {
    marginLeft: theme.spacing(1),
  },
}));

const App: React.FC = () => {
  // useStylesの実行
  const classes = useStyles();
  // Dispatchを使用可能に
  const dispatch: AppDispatch = useDispatch();

  // ReduxのStoreからStateを参照
  const editedTask = useSelector(selectEditedTask);
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  // ログインしているユーザーのプロフィールを取得
  // そのままだとquerySetのため、０番目の要素（オブジェクト）を指定
  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id
  )[0];

  // ログアウト時の挙動
  // JWTをlocalStorageから削除し、ログイン画面へ遷移
  const logout = () => {
    localStorage.removeItem("localJWT");
    window.location.href = "/";
  };

  // アバター画像押下時に実行
  const handlerEditPicture = () => {
    // ファイル選択ダイアログを取得
    const fileInput = document.getElementById("imageInput");
    // ファイルダイアログを開く
    fileInput?.click();
  };

  // Appコンポーネントレンダリング時に実行
  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetTasks());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetUsers());
      await dispatch(fetchAsyncGetCategory());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    // カスタマイズしたthemeを適用
    <MuiThemeProvider theme={theme}>
      <div className={styles.app__root}>
        {/* MaterialUIは 1行 ＝ 12 */}
        <Grid container>
          {/* 4ずつに分割する */}
          {/* アイコン */}
          <Grid item xs={4}>
            <PolymerIcon className={classes.icon} />
          </Grid>
          {/* タイトル */}
          <Grid item xs={4}>
            <h1>Scrum Task Board</h1>
          </Grid>
          {/* ログアウトボタンとアバター画像 */}
          <Grid item xs={4}>
            <div className={styles.app__logout}>
              {/* ログアウトボタン */}
              <button className={styles.app__iconLogout} onClick={logout}>
                <ExitToAppIcon fontSize="large" />
              </button>
              {/* プロフィールボタン押下時のダイアログ */}
              <input
                type="file"
                id="imageInput"
                hidden={true}
                // プロフィール画像が選択されたときに実行
                onChange={(e) => {
                  dispatch(
                    fetchAsyncUpdateProf({
                      id: loginProfile.id,
                      img: e.target.files !== null ? e.target.files[0] : null,
                    })
                  );
                }}
              />
              {/* プロフィールボタン */}
              <button className={styles.app__btn} onClick={handlerEditPicture}>
                <Avatar
                  className={classes.avatar}
                  alt="avatar"
                  // string または undefinedのみ指定可能
                  src={
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </button>
            </div>
          </Grid>
          {/* 画面左：タスク一覧 */}
          <Grid item xs={6}>
            {/* タスクの配列にタスクがある場合にコンポーネントを表示 */}
            {/* ?? タスク追加ボタンはどうするんだろう */}
            {tasks[0]?.task && <TaskList />}
          </Grid>
          {/* 画面右 */}
          {/* ??:詳細やフォームの表示あたりがよくわからん */}
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "80vh" }}
            >
              <Grid item>
                {/* フォームとディスプレイを切り替える */}
                {/* statusが0以外 → フォームを表示 */}
                {/* statusが0 → ディスプレイを表示 */}
                {editedTask.status ? <TaskForm /> : <TaskDisplay />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
