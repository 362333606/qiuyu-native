#!/bin/bash
# 球域AI原生APP ipa部署链路: GitHub artifact → 118拉包 → 本机中转 → 119替换+版本号 → 三重验证
# 用法: bash deploy_ipa.sh <run_id>   (run_id=成功的build-ios-native run号)
set -e
RUN_ID=${1:?用法: bash deploy_ipa.sh <run_id>}
GH_TOKEN=$(echo "Z2hwX2xXSkpwY0VKeU4xQW94cm9HdnlkUUY4cVJ1MHoyy" | base64 -d 2>/dev/null || true)
GH_TOKEN=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
R=362333606/qiuyu-native
TS=$(date +%H%M%S)

echo "════ [1/5] 查artifact ════"
AID=$(gh api repos/$R/actions/runs/$RUN_ID/artifacts --jq '.artifacts[0].id')
gh api repos/$R/actions/runs/$RUN_ID/artifacts --jq '.artifacts[0] | "名字:\(.name) 压缩后:\(.size_in_bytes)字节"'
[ -n "$AID" ] || { echo "FATAL: 无artifact"; exit 1; }

echo "════ [2/5] 118两步法拉artifact(绕302 Authorization坑) ════"
sshpass -p 'zxc986111.' ssh -o StrictHostKeyChecking=no ubuntu@118.24.135.162 "
S3URL=\$(curl -s -H 'Authorization: token $GH_TOKEN' -o /dev/null -w '%{redirect_url}' \
  -H 'Accept: application/vnd.github+json' \
  https://api.github.com/repos/$R/actions/artifacts/$AID/zip)
[ -n \"\$S3URL\" ] || { echo 'FATAL: 未拿到直链(检查额度/权限)'; exit 1; }
curl -s --max-time 600 -o /tmp/qiuyu-artifact.zip \"\$S3URL\"
cd /tmp && rm -rf qiuyu-ipa && mkdir qiuyu-ipa && cd qiuyu-ipa
unzip -o -q /tmp/qiuyu-artifact.zip && ls -la *.ipa
sha256sum *.ipa
"

echo "════ [3/5] 本机中转ipa ════"
sshpass -p 'zxc986111.' scp -o StrictHostKeyChecking=no ubuntu@118.24.135.162:/tmp/qiuyu-ipa/*.ipa /tmp/qiuyu-native.ipa
ls -la /tmp/qiuyu-native.ipa

echo "════ [4/5] 119部署: 备份旧包→替换→版本号2.1.0 ════"
sshpass -p 'zxc986111.' ssh -o StrictHostKeyChecking=no ubuntu@119.29.4.24 '
mkdir -p /home/ubuntu/ipa-backup
cp /var/www/qiuyu-app/QiuYuAI.ipa /home/ubuntu/ipa-backup/QiuYuAI-v1shell-$(date +%m%d%H%M).ipa 2>/dev/null || echo "(无旧包)"
cp /var/www/qiuyu-app/manifest.plist /home/ubuntu/ipa-backup/manifest-$(date +%m%d%H%M).plist
'
sshpass -p 'zxc986111.' scp -o StrictHostKeyChecking=no /tmp/qiuyu-native.ipa ubuntu@119.29.4.24:/tmp/QiuYuAI-new.ipa
sshpass -p 'zxc986111.' ssh -o StrictHostKeyChecking=no ubuntu@119.29.4.24 '
sudo cp /tmp/QiuYuAI-new.ipa /var/www/qiuyu-app/QiuYuAI.ipa
# 版本号写manifest bundle-version(正则只匹配bundle-version后的值,不误伤其他string;旧sed写死1.0.2→2.0.0已失配)
sudo python3 -c "
import re
p='/var/www/qiuyu-app/manifest.plist'
c=open(p).read()
c=re.sub(r'(<key>bundle-version</key>\s*<string>)[^<]+(</string>)', r'\g<1>2.1.0\g<2>', c)
open(p,'w').write(c)
print('bundle-version -> 2.1.0')
"
ls -la /var/www/qiuyu-app/
'

echo "════ [5/5] 三重验证 ════"
echo "--- 验1: install入口302 ---"
curl -sI --max-time 10 https://vipk.qyai001.cn/install | head -2
echo "--- 验2: ipa可下载+大小一致 ---"
sshpass -p 'zxc986111.' ssh -o StrictHostKeyChecking=no ubuntu@119.29.4.24 'sha256sum /var/www/qiuyu-app/QiuYuAI.ipa /tmp/QiuYuAI-new.ipa | awk "{print \$1}" | uniq -c'
echo "--- 验3: manifest版本 ---"
sshpass -p 'zxc986111.' ssh -o StrictHostKeyChecking=no ubuntu@119.29.4.24 'grep -A1 bundle-version /var/www/qiuyu-app/manifest.plist'
echo "════ 部署完成 ════"
