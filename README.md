# react-drf-JIRA
## 対象講座
[JIRA編]React Hooks/TypeScript + Django REST APIで作るオリジナルJIRA <br>
https://www.udemy.com/course/jirareact-hookstypescript-django-rest-apijira/

## アプリ概要
### 機能
1. 認証機能（ログイン＋新規アカウント） <br>
2. ユーザープロフィール <br>
3. タスクの作成、閲覧、更新 <br>
4. タスク一覧のソーティング <br>
5. タスク更新・削除制限 <br>
　→オーナーになっているタスクのみ更新・削除が可能 <br>

### タスクの詳細
Task：タイトル <br>
Description：説明 <br>
Criteria：完了となる条件 <br>
Owner：タスクの管理者 <br>
Responsible：タスクの担当者 <br>
Estimate：タスク完了見込み日数 <br>
Category：カテゴリ <br>
Status：ステータス <br>
Created：作成日 <br>
Updated：更新日 <br>

### 画面設計
・シングルページアプリケーション <br>
・画面左がタスク一覧、右が新規作成や更新、詳細等切り替える <br>

### APIエンドポイント
|URL|HTTPメソッド|用途|h
|--|--|--|--|
|api/create|POST|新規ユーザー作成（ユーザー名とパスワード）|
|api/users|GET|ユーザーリスト取得|
|api/loginuser|GET|ログインユーザー情報取得|
|api/category|POST|新規カテゴリ作成|
|api/profile|POST/PUT|プロフィール作成＋更新|
|api/tasks|POST/GET/PUT/DELETE|タスクのCRUD|


[注意] simplejwt, PyJWT + django-cors-headers の version指定
① 次の動画の、1:52辺りでpip installするsimple jwtですが、4.6.0をインストールしてください。

pip install djangorestframework-simplejwt==4.6.0



② そして、djangorestframework-simplejwt==4.6.0をインストールした後に、下記version指定でPyJWTをインストールしてください。

pip install PyJWT==2.0.0



③ 次のレクチャー動画でインストールする下記packageもversion指定してインストールしてください。

pip install django-cors-headers==3.4.0
