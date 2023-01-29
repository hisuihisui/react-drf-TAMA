# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


# インストール
## create-react-app オプション
次の動画の、2:54辺りのcreate-react-appコマンドですが、--use-npmオプションを付けて実行して下さい。
```
npx create-react-app . --template redux-typescript --use-npm
```
## [注意] react-router-dom ver6.0以降 + Material UI
1. 最新のreact-router-dom ver6で書き方が少し変わってしまった為、次のレクチャーで react-router-dom インストール時に下記version指定をしてください。
```
npm i react-router-dom@5.3.0 @types/react-router-dom@5.3.1
```
最新ver6以降で進めたい場合は、下記↓repoにミニマムな例を作成しましたので参考にしてください。
<br>
<br>
App.tsx内のRoutesの書き方変更と、useHistory -> useNavigateへの変更で対応できます。
<br>
<br>
https://github.com/GomaGoma676/react-router-dom-v6
<br>
<br>
↓こちらが公式のdocumentになります。
<br>
<br>
https://reactrouter.com/docs/en/v6/getting-started/overview
<br>
<br>
2. 次の動画4:43でnpm installする下記一部のpackageはReact18との互換性でインストールエラーとなる為、--legacy-peer-depsのオプションを指定してinstallしてください。
```
npm i @material-ui/core @material-ui/icons @material-ui/lab --legacy-peer-deps
```
## [注意] axios のversion
次のレクチャーでinstallするaxiosですが、下記のversionでinstallしてください。
```
npm i axios@0.27.2
```

## Material UI
1.createMuiThemeがcreateThemeに名前が変更になった為、2箇所変更をお願いいたします。
<br>
2. GridのjustifyがjustifyContentに変更なった為、名前変更をお願いいたします。
