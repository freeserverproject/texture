# Freeserver texture

## 使い方
1. このレポジトリをフォークします。
2. 色々作業をします。
3. 作業が終わったらCommitとPushを済ませてdevelopブランチにPullRequestを出します
※ masterに直接commitしたらしばきます

## リリースするとき
1. バージョンも書き換える。[こちら](#バージョン規則)を参考にしてバージョンを指定してください
2. developからmasterにマージします。
4. お好みでdescriptionもかえる
5. Actionsからリリースする。

## 開発をする
1. developの内容を変更する
2. [こちら](#バージョン規則)を参考にしてバージョンを指定してください
3. Actionsからdevelopにしてnew releaseを実行します
4. 新しくリリースされたバージョンをpre releaseにする
5. Minecraft内から`/patchedtexture texture <version>`を指定すると読み込まれます。

## バージョン規則
バージョンを決める際以下のルールに従って指定してください。
バージョンは`pack/pack.mcmeta`に指定してください。

```
X.Y.Z-hoge
```
X = とても大きなテクスチャの変更。基本的には変更しません
Y = 季節のアップデート・5個以上のモデルの追加を伴うアップデート
Z = その他のモデル追加等を伴うアップデート
hoge = betaやbeta2などを指定してください。サーバー内に開発リリースする場合に仕様してください。また通常リリースの際には削除してください

## Tips
```JSON
{
  "__comment": "comment here",
  "__name": "name"
}
```
Keyの名前を上の２つを使う削除されリリースされます。

## 注意点
絶っっっったいにbuild.jsを実行しないでください

## Credits
[3Dモデル作成 - Blockbench](https://blockbench.net/)
