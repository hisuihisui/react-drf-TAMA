// authSlice.ts
// DRFの api/loginuser で返ってくる情報を格納するためのデータ型
export interface LOGIN_USER {
  id: number;
  username: string;
}

// アバターの画像をアップロードする際に使用
export interface FILE extends Blob {
  // ファイルの更新日時
  readonly lastModified: number;
  // ファイル名
  readonly name: string;
}

// プロフィール_GET用
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null;
}

// プロフィール_POST(更新)用
export interface POST_PROFILE {
  id: number;
  img: FILE | null;
}

// ログインフォーム
export interface CRED {
  username: string;
  password: string;
}

// JWTトークン用
export interface JWT {
  refresh: string;
  access: string;
}

// DRFのUSERモデル
export interface USER {
  id: string;
  username: string;
}

// authSliceで管理するState
export interface AUTH_STATE {
  // ログイン画面と新規登録画面を切り替えるため
  isLoginView: boolean;
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}
