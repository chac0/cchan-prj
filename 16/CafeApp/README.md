# CafeApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.


# フォルダ構成
以下のような構成でお願いします。
```
/src
    |-/app
        |-/models       :DBデータ構造を定義
        |-/repositories :DB CRUD処理を定義
        |-/utils        :共通便利ツール
        |-/views        :各画面表示処理を格納
        |-/components   :画面の共通部品を格納
        |-/services     :Serviceクラスを格納
    |-/assets :画像・音声素材など
    |-/environments
        |-firebase_config.js : 開発時新規作成して下さい(.gitignore)
```


# 開発手順

## Step0)
firebase consoleを開き、Webアプリを追加（名前は適当でよい）し、  
firebase sdk snippetをコピーしておく。

![image](../../Resources/Images/Setup/FireStore_Importer/4.png)


## Step1)
environments/firebase_config.js を新規作成し、  
(step0)で取得したsdk snippetを以下のように適切に入力する。

```
export const firebaseConfig = {
    apiKey: "API_KEY_HERE",
    authDomain: "AUTH_DOMAIN_HERE",
    databaseURL: "DATABASE_URL_HERE",
    projectId: "PROJECT_ID_HERE",
    storageBucket: "STORAGE_BUCKET_HERE",
    messagingSenderId: "MESSAGING_ID_HERE"
    appId: "YOUR_APP_ID_HERE"
};
```


## Step2)
以下コマンドで必要なプロジェクトのパッケージを入れる。
```
npm install
```

# テストについて
以下コマンドで
```
ng test --code-coverage

```
カバレッジBranchesが80%以上が目安です。

# その他

- サンプルコードを用意してあります。  
ご参照ください。
    - Routing: /sample
    - Firestore: read, create, delete 






## Development server

Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
