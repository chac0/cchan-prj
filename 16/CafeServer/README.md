# Server側の処理

# 環境
- node.js
- firebase tools

# セットアップ手順

## 1) 「.firebaserc」ファイル作成

自分のfirebase project idを「.firebaserc」にセットする
```
CafeServer/.firebaserc
```

中身は以下
```
{
  "projects": {
    "default": "[YOUR_FIREBASE_PROJECT_ID]"
  }
}

```

### <備考>
[YOUR_FIREBASE_PROJECT_ID]とは、firebase_config.jsの以下
```
export const firebaseConfig = {
  （略）
    projectId: "[YOUR_FIREBASE_PROJECT_ID]", <--これです
  （略）
};

```


## 2) packageインストール
コンソールでfunctionsに移動し
```
npm install
```

# ビルド手順

## 1) コンソールでfunctionsに移動し
```
npm run build
```

# 確認手順

## 0) credenticalの取得
取得方法は以下参照

```
SetUp/FireStore_Importer/README.md
> Step2) serviceAccount.json の作成
```

## 1) credenticalを登録する
<参考>
https://firebase.google.com/docs/functions/local-emulator

コンソールを開き、以下コマンドを打つ
```
#Winowsの場合

set GOOGLE_APPLICATION_CREDENTIALS=path\to\key.json

```

## 2) cloud function の emulator起動
コンソールでfunctionsに移動し
```
firebase emulators:start
```

エントリポイントが開いたことを確認
```
C:\Users\workspace\functions>firebase emulators:start
i  Starting emulators: ["functions"]
!  Your requested "node" version "8" doesn't match your global version "11"
+  functions: Emulator started at http://localhost:5001
i  functions: Watching "C:\Users\workspace\functions" for Cloud Functions...
>  Firebase project ID: [YOUR_FIREBASE_PROJECT_ID]
>  NODE_ENV: undefined
+  functions[createUser]: http function initialized (http://localhost:5001/YOUR_FIREBASE_PROJECT_ID/us-central1/createUser).
+  functions[sampleCall]: http function initialized (http://localhost:5001/YOUR_FIREBASE_PROJECT_ID/us-central1/sampleCall).
+  All emulators started, it is now safe to connect.

```

# サンプル

### Cloud Function側
```
use-cases/
        |-index.ts
        |-sample_api.ts <--- サンプルonCall

```

### Webアプリ(CafeApp)でそれを呼び出すサンプル
```
https://[ROOT_URL]/sample_api_call
```
![image](../../Resources/Images/WebApp/CafeServer/api_call_sample.gif)


