#!/usr/bin/env python3
"""Verify a locally supplied customer IPA; --apply additionally writes 119.
No GitHub credential, artifact URL, password, or key is accepted or logged.
Invoke --apply only with explicit 119 authorization under shared publish_lock.py.
"""
import argparse,hashlib,json,os,plistlib,re,subprocess,zipfile
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('--ipa',type=Path,required=True);p.add_argument('--sha256',required=True)
p.add_argument('--version',required=True);p.add_argument('--apply',action='store_true');a=p.parse_args()
if not re.fullmatch(r'[a-f0-9]{64}',a.sha256) or not re.fullmatch(r'\d+\.\d+\.\d+',a.version):p.error('invalid SHA256/version')
ipa=a.ipa.resolve();actual=hashlib.sha256(ipa.read_bytes()).hexdigest()
if actual!=a.sha256:raise SystemExit('IPA SHA256 mismatch')
with zipfile.ZipFile(ipa) as z:
 names=[n for n in z.namelist() if n.count('/')==2 and n.endswith('.app/Info.plist')]
 if len(names)!=1:raise SystemExit('Expected exactly one app')
 info=plistlib.loads(z.read(names[0]))
 if info['CFBundleIdentifier']!='cn.qyai001.qiuyu':raise SystemExit('Wrong app bundle; refusing customer publication')
 if info['CFBundleShortVersionString']!=a.version:raise SystemExit('Version does not match signed IPA')
result={'bundle':info['CFBundleIdentifier'],'version':a.version,'build':info['CFBundleVersion'],'sha256':actual,'applied':False}
if not a.apply:
 print(json.dumps(result));raise SystemExit(0)
if os.environ.get('ZZ_SHARED_PUBLISH_LOCK_HELD')!='1':raise SystemExit('Invoke under shared publish_lock.py; explicit 119 authorization required')
# SSH alias 119 must be preconfigured privately; no password embedded in source.
remote='/tmp/qiuyu-upload-'+actual+'.ipa'
subprocess.run(['scp','-q',str(ipa),'119:'+remote],check=True)
script=r'''
import datetime,hashlib,json,os,plistlib,shutil,sys,tempfile
from pathlib import Path
incoming,expected,version=sys.argv[1:]
src=Path(incoming);root=Path('/var/www/qiuyu-app')
assert hashlib.sha256(src.read_bytes()).hexdigest()==expected
stamp=datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
backup=Path('/home/ubuntu/ipa-backup')/stamp;backup.mkdir(parents=True,exist_ok=False)
for name in ['QiuYuAI.ipa','manifest.plist','install.html']:
 if (root/name).exists():shutil.copy2(root/name,backup/name)
manifest=plistlib.loads((root/'manifest.plist').read_bytes())
for item in manifest['items']:item['metadata']['bundle-version']=version
staged=root/'QiuYuAI.ipa.new';shutil.copy2(src,staged)
assert hashlib.sha256(staged.read_bytes()).hexdigest()==expected
os.replace(staged,root/'QiuYuAI.ipa')
staged=root/'manifest.plist.new';staged.write_bytes(plistlib.dumps(manifest));os.replace(staged,root/'manifest.plist')
import re
page=root/'install.html'
if page.exists():
 staged=root/'install.html.new';staged.write_text(re.sub(r'v2\.[0-9]+\.[0-9]+','v'+version,page.read_text()));os.replace(staged,page)
assert hashlib.sha256((root/'QiuYuAI.ipa').read_bytes()).hexdigest()==expected
print(json.dumps({'backup':str(backup),'sha256':expected,'version':version,'applied':True}))
'''
import shlex
cmd='sudo python3 - '+ ' '.join(shlex.quote(x) for x in [remote,actual,a.version])
subprocess.run(['ssh','119',cmd],input=script,text=True,check=True)
