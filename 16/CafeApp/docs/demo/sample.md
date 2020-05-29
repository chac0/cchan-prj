# issueのリンク
[github issue link]

# 前提
- fireStore の Sample DocumentにCollecttionが2件以上追加されていること。
- アプリを起動するなどの共通の手順の記載はスキップしている

# デモシナリオ

## 1. 画面表示
1. ` http://localhost:[defaultport=4200]/sample ` へアクセスする
2. Sample DocumentのCollectionがすべて表示されている

## 2. 新規作成
1. `1.画面表示` の手順を実施
2. 適切な値を入力する
4. 「登録」ボタンを押下する
5. Sample DocumentのCollectionに新規データが追加されている
6. 上記データのidはuidと合致している

## 3. 削除
1. `1.画面表示` の手順を実施
2. 1行目の「削除」ボタンを押下する
3. 1行目のデータが削除される
