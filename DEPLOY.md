# デプロイ手順（さくらのVPS / Ubuntu / git pull 方式）

静的エクスポート（`out/`）を nginx で配信する。VPS 上で公開リポジトリを `git pull` →
ビルド → nginx が `out/` を配信する構成（GitHub に鍵やSecretsを預けない）。

- 対象サーバー: さくらのVPS(v3) 1G / Ubuntu
- 公開リポジトリ: https://github.com/happy-engine1/world-cup-2026

---

## 0. 事前準備（DNS）
独自ドメインの **A レコード**を `<あなたのVPSのIPアドレス>` に向ける。
`dig +short YOUR_DOMAIN` で IP が返ればOK（反映に最大数十分）。

---

## 1. サーバー初期設定（最初の1回）
Ubuntu 既定の `ubuntu` ユーザー（sudo 可能・非root）をそのまま作業用に使う。
root 常用を避け、SSH を鍵認証で固める。

```bash
# 自分のPCの公開鍵が ubuntu に未登録なら、PC側から登録
# （クラウド初期化で登録済みのことが多い）
#   ssh-copy-id ubuntu@<あなたのVPSのIPアドレス>
```

SSH ハードニング（`/etc/ssh/sshd_config`）:
```
PermitRootLogin no
PasswordAuthentication no
```
```bash
sudo systemctl restart ssh
```

ファイアウォール（22/80/443 のみ）:
```bash
# この時点では nginx 未導入なのでポート番号で開ける
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
sudo ufw enable          # 22番許可済みなので y で続行（SSHは切れない）
```

以降は `ubuntu` ユーザーで作業。

---

## 2. 必要パッケージのインストール
```bash
# git / nginx
sudo apt update && sudo apt install -y git nginx

# Node.js 22 LTS（Next.js 16 は Node 20.9+ 必須）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node -v   # v22.x を確認
```

> メモリ1GBでビルドが落ちる場合はスワップを追加:
> ```bash
> sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
> sudo mkswap /swapfile && sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

---

## 3. リポジトリ取得 & 初回ビルド
```bash
cd ~
git clone https://github.com/happy-engine1/world-cup-2026.git
cd world-cup-2026
npm ci
npm run build          # -> out/ が生成される
```

---

## 4. nginx 設定
```bash
# サンプルを配置（YOUR_DOMAIN と root パスを編集）
sudo cp deploy/nginx.conf.sample /etc/nginx/sites-available/world-cup-2026
sudo nano /etc/nginx/sites-available/world-cup-2026   # server_name と root を修正
sudo ln -s /etc/nginx/sites-available/world-cup-2026 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default            # 既定サイト無効化（任意）

# nginx が out/ を読めるよう実行権を付与（ホームディレクトリ経由のため）
chmod o+x /home/ubuntu

sudo nginx -t && sudo systemctl reload nginx
```

この時点で `http://YOUR_DOMAIN` で表示されるはず。

---

## 5. HTTPS 化（Let's Encrypt）
```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d YOUR_DOMAIN
# 443サーバーブロックと 80→443 リダイレクトが自動追記される
# 自動更新は certbot.timer で有効（sudo certbot renew --dry-run で確認）
```

---

## 6. 更新（2回目以降のデプロイ）
コードを更新して GitHub に push したら、VPS で:
```bash
cd ~/world-cup-2026
./deploy.sh        # git reset --hard origin/main → npm ci → npm run build
```
`out/` が更新され、nginx が即座に新しい内容を配信（reload 不要）。

> 自動化したい場合は cron で定期 pull も可能（例: 5分毎）。ただし基本は手動推奨。
> ```
> */5 * * * * /home/ubuntu/world-cup-2026/deploy.sh >> /home/ubuntu/deploy.log 2>&1
> ```

---

## トラブルシュート
- **403 Forbidden**: nginx が `out/` を読めない → `chmod o+x /home/ubuntu` を確認。
- **ビルドが OOM で落ちる**: スワップ追加（手順2のメモ）。
- **ページは出るが崩れる**: `_next/` が配信できているか（root パス）を確認。
- **証明書取得失敗**: DNS が VPS の IP を指しているか、80番が開いているか確認。
