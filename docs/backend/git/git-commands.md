
## Git 命令 <Badge type="tip" text="Git Command" />

### git rebase
git rebase的最大作用是重写历史

使用`git rebase -i <commit ID>`使用git rebase命令  修改某次 commit 的 message

| 命令       | 目的                                   |
|----------|--------------------------------------|
| p,pick   | 不对该commit做任何处理                       |
| r,reword | 保留该commit，但是修改提交信息                   |
| e,edit   | 保留该commit，但是rebase是会暂停，允许你修改这个commit |
| s,squash | 保留该commit，但是将当前commit与上一个commit合并    |
| f,fixup  | 与squash相同，但不会保存当前commit的提交信息         |
| x,exec   | 执行其他shell命令                          |
| d,drop   | 删除该commit                            |

### git commit -amend
git commit –amend：修改最近一次 commit 的 message