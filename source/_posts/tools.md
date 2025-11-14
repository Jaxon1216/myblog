---
title: tools
date: 2025-10-01 15:20:10
categories:
  - study
tags:
  - git
  - md
---
## 目录

- [git](#git)
  - [修改远程仓库地址](#修改远程仓库地址)
  - [正确删除文件](#正确删除文件)
  - [Git 分支配置与远程仓库URL不匹配](#git-分支配置与远程仓库-url-不匹配)
- [md](#md)
  - [插入链接](#插入链接)
  - [插入图片](#插入图片)
  - [导出为pdf](#导出为pdf)
  - [写目录](#写目录)
- [Linux](#linux)
- [hexo](#Hexo)
- [快捷键](#快捷键)
- [流程图](#流程图)

# git 
### 修改远程仓库地址
- 查看远程仓库指向

```bash
git remote -v
```

- 基础

  - `git commit`(创建并指向新的子节点) 与 parent 节点
  - `git branch`
  - `git branch` 加一个 `-a` 查看所有分支，按`q`退出
  - `git checkout`(换*)，简洁版本（`git checkout -b <your-branch-name>`）
  - `git merge`(差不多把对面分支连到自己身上，)
  - `git rebase` 对面(把自己搞个副本作为对面子级)
  - `git log` 查看历史提交记录,按q退出
  - `git remote -v` 查看关联仓库
  - `git add remote
- 进阶：

  - 分离 head：head, 直接 checkout 目前分支所指的记录，head 就指过去了
  - 相对引用：`checkout 目标^`（把目标移动到目标的父级, 或者 `～1`），感觉有点单向链表，结构体指针的味道，分支是命名指针，head 是指向指针的指针，commit 链就是单向链表
  - `git branch -f` (force) `main HEAD~3`：main 强制指向 (head 的父级上 3 个单位)，（不需要换过去分支，便捷）
  - `git reset HEAD~1`，回到父级，但是子级还在但是未加入暂存区，对于远程无效
  - `git revert HEAD` (当前*)，一个新的提交，引入了更改，状态与上上级相同，远程有效

- 最后一个 git pull，让 gpt 来：

  - `git fetch`：只更新远程指针，不动你本地分支。从远处拿过来，
  - `git pull`：fetch + merge（最常用）
  - `git pull --rebase`：fetch + rebase（让你的提交排在远程节点后面）
  - `git push`：把你本地的节点推到远程（相当于反向传递链表）。


### 正确删除文件
- `git rm -r name` // remove, recursive 递归, 定位到根目录，name 直接从下一级开始。
### Git 分支配置与远程仓库 URL 不匹配
- 当看到推送目标与预期不符时，检查 git config branch.<分支名>.remote 配置
- 确保分支的远程仓库配置与 git remote -v 显示的 URL 一致
- 使用 git config --list | grep branch 可以快速查看所有分支配置


# md
### 插入链接
- 作者：`[jx's blog]` + `(https://jiangxu.net/ "个人博客")`

### 插入图片
- 将图片放到 `source/img/`（发布后路径为 `/img/`）
- 桌面图片复制到项目：
```bash
cp ~/Desktop/screenshot.png /Users/jiangxu/Documents/code/myblog/source/img/
```
> 也可以在访达直接拖拽吧
- 在 Markdown 中引用：
```markdown
![截图说明](/img/screenshot.png)
```
- 需要控制大小（可选）：
```html
<img src="/img/screenshot.png" alt="截图说明" width="600">
```
- 文件名尽量用英文与连字符，避免空格。

### 导出为pdf
- 在 md 文件页面 `cmd+Shift+P`

### 写目录
- `- [显示在目录中的文字](#实际标题的锚点格式)`
- 锚点格式为：去掉标题中所有标点（含数字后的点），空格换为连字符`-`，保留中文和数字，不区分大小写。

# Linux
- `pwd` 查看当前路径
- `rm -d name/directory` 删除空目录
- `rm -r` // recursive 递归，删除非空目录
- `rm -f` // force
- `rm -rf` // -r 和 -f 一起
- `la` list all
- `mv`移动文件夹
- 查看文件：`cat` 文件名（适合小文件）
- 创建文件：`cat >` 文件名（Ctrl+D 保存，覆盖同名文件）
- 追加内容：`cat >>` 文件名（Ctrl+D 保存，不覆盖原有内容）
- 合并文件：`cat 文件1 文件2 >` 新文件
- 输出字符串：`echo "Hello"` 或 `echo Hello`（空格 / 特殊字符需加引号）
-  输出变量：`echo` $PATH（打印环境变量）、`echo $USER`（打印当前用户）
- 重定向输出到文件：`echo "内容" >` 文件名（覆盖）、`echo "内容" >>` 文件名（追加）
- 换行 / 不换行：`echo -e` "第一行\n第二行"（-e 启用转义，\n 换行）


# Hexo
- `hexo new "postname"`,
# 快捷键
- 撤销 `cmd` + `z`
- 左移 `cmd` + `[`
- 在 html 内输入 `.name` 之后，光标在标签中间，可以按 `cmd` + `return` 换到下一行行首



# 流程图

### 导出与协作
| 项目 | 建议 |
| --- | --- |
| 保存 | 使用 .drawio 或 .drawio.png（含可编辑元数据）便于后续编辑 |
| 导出 | File → Export as → PNG / SVG / PDF |
| 背景 | 勾选 Transparent Background（透明背景） |
| 使用场景 | SVG：网页；PNG：博客；PDF：打印 |
| 版本/备份 | 本地或云端（Git、Google Drive、OneDrive），必要时使用版本历史 |

### 小技巧（draw.io）
| 动作 | 快捷/用法 |
| --- | --- |
| 快速连线 | 拖动形状四角蓝箭头，自动连线并生成新节点 |
| 复制/对齐 | Option(Alt) 拖拽复制；Cmd+D 复制；按住 Shift 拖动保持水平/垂直 |
| 多页图 | 底部 Pages 管理，将子流程放到独立页面并从子流程符号跳转 |
| 页面设置 | File → Page Setup 调整页面、边距，或开启自适应内容 |
| 搜索图形 | 左侧 Shapes 搜索“flowchart/uml”，或 + More Shapes 启用更多库 |
| 文案规范 | 步骤用动宾短语；判断为可判定条件；分支出口清晰不交叉 |


# docker

容器，虚拟机，内核，镜像，安装包，模具，docker仓库，镜像仓库，基于linux的容器化技术。

`docker -version(-v)` 查看版本

`docker pull` 命令从 library 官方拉取镜像，nginx 后面加 `:版本号`，官方命名空间是 library。
比如说下载 `docker pull docker/n8n.io/n8n`，格式是：私有仓库/命名空间（名字）/然后就是镜像名。

配置镜像站，解决网络问题。

`sudo docker images` 就是镜像的英文
`sudo docker rmi` 就是 remove image
`sudo docker run nginx` 用模具制作糕点
`sudo docker ps` 查看正在运行的容器
`sudo docker run -d` 表示 detached，后台运行，后续日志不会打印在控制台，不会阻塞
直接 `docker run nginx` 可以自动 pull 并 run

## 网络与端口映射
容器和宿主机网络分离，需要添加启动参数，需要参数映射绑定，如80:80，访问网页端口localhost:80，这时候直接转移到容器内部署的nginx，用 `-p` 绑定端口。

## 挂载卷
挂载卷，`-v` 绑定宿主机和容器，绑定的目录称为挂载卷，好处就是文件持久保存，删除容器，不会删除文件。

例子：`docker run -d -p 80:80 -v /website/html:/user/share/nginx/html nginx`，访问80端口显示403，因为宿主机目录会覆盖容器目录。

`cd /website/html` 然后 `sudo vi index.html`，然后写内容。
然后再访问就可以显示内容了，这种挂载叫绑定挂载。

清理容器：
`sudo docker ps`
`sudo docker rm`（注意rmi的区别） `-f id`

创建挂载卷 `sudo docker volume create nginx_html`
`sudo docker run -d -p 80:80 -v nginx_html`（此处不需要目录了，直接使用挂载卷的名字）`:/user/share/nginx/html nginx 1bdc....`
这行命令可以显示挂载卷的真实目录：`sudo docker volume inspect 名字（nginx_html）`
进入这个目录要切换成root用户 `sudo -i`
`~# cd 复制的目录` 然后再 `目录# vi index.html` 查看文件

`sudo docker volume rm nginx_html` 删除挂载卷
`sudo docker volume list` 查看卷
`sudo docker volume prune -a` 清除所有未使用的卷

## run 其他参数
`sudo docker run -d --name my_nginx nginx` 表示给容器命名

`sudo docker run -it --rm alpine`，`-i` 表示交互式，`-t` 表示分配伪终端，`--rm` 表示容器退出后自动删除，一般一起使用，一般用来做临时测试。然后 `# ls` 和 `#exit` 退出。

`sudo docker run -d --restart always nginx` 和 `--restart unless-stopped`，`always` 表示容器退出时总是重启，`unless-stopped` 表示除非手动停止，否则都重启，分别应用于生产环境和开发环境等场景。

### 环境变量
环境变量就是传配置给容器的一种方式，好处就是不用写死在代码里，换个环境只需要改变量就行了，配置和代码解耦。

通过 `-e` 参数传递环境变量：
`sudo docker run -d -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=mydb mysql`
这样容器里的 MySQL 就会用这些配置启动，密码是123456，数据库名是mydb。

也可以在 Dockerfile 里用 `ENV` 指令设置默认的环境变量：
`ENV NODE_ENV=production`
`ENV PORT=3000`
不过 `-e` 参数会覆盖 Dockerfile 里的 `ENV`，所以运行时还是可以灵活修改。

查看容器的环境变量：`sudo docker exec id env`

## 调节容器
`sudo docker stop id/name`
`sudo docker start id/name`
`sudo docker inspect id` 用来查看容器的详细信息，包括配置、网络、挂载等

`sudo docker create -p 80:80 mongo` 表示创建但不启动容器，与 run 的区别是 create 只创建不启动。

`sudo docker logs id/name` 查看容器日志

## Docker 原理
docker 利用了 linux 的两大原生功能实现了容器化，Cgroups 用来限制和隔离进程的资源使用，可以为每个容器设定CPU，内存，网络带宽等资源的使用上限，确保一个容器的资源消耗不会影响到宿主机，或者其他正在运行的容器，namespaces 用来隔离进程的资源视图，namespaces 使得容器只能看到自己内部的进程ID、网络资源和文件目录，容器本质上是个特殊的进程，每个容器表现的都像一个独立的 Linux 系统。

`sudo docker exec id ps -ef` 表示在运行中的容器里执行命令，这里是查看进程列表
`sudo docker exec -it id /bin/sh` 表示进入容器的交互式 shell，可以在里面操作

## Dockerfile
dockerfile 写的是如何制作模具，是一个图纸，在 vscode 创建这个文件。
分别开始写 `FROM python:3.9`（基础镜像）、`WORKDIR /app`（工作目录）、`COPY . .`（复制文件）、`RUN pip install -r requirements.txt`（安装依赖）、`EXPOSE 8000`（暴露端口）、`CMD["python3", "main.py"]`（启动命令），作用是定义镜像的构建步骤。

然后终端 `docker build -t docker_test .` 作用是构建镜像，`-t` 表示 tag 标签（命名），这个点表示当前目录（找 Dockerfile）。
然后 `docker run -d -p 8000:8000 docker_test` 作用是启动容器，`-d` 表示后台运行，`-p` 表示端口映射。
浏览器就可以访问这个端口了，然后在 docker desktop 这里，images 显示构建出来的镜像，container 显示正在运行的容器。

推送 dockerhub，在终端 `docker login`
`docker build -t username/docker_test .`
然后 `docker push username/docker_test`

## Docker 网络
docker 网络是桥接模式，一般是172.17.开头的，容器网络跟宿主机网络是隔离的。
创建子网 `docker network create network1`，好处有容器间可以互相通信、隔离网络环境。
同一子网里的多个容器可以互相通信，其实里面有一个 dns 机制可以把名字解析成 ip。

host 模式：容器直接共享宿主机的网络，直接使用宿主机的 IP 地址，无需 `-p` 进行端口映射，可以解决一些棘手的网络问题。
 
比如 `sudo docker run -d --network host nginx`，此时浏览器直接访问服务器的 IP 地址加端口80就可以访问到 nginx。
进入容器内部查看ip地址，`sudo docker exec -it id /bin/sh`
```bash
apt update
apt install iproute2
ip addr show  # 显示内网ip地址
```

`sudo docker network list` 表示列出所有网络
`sudo docker network rm networkid` 删除网络

## Docker Compose
一般一个项目需要前端后端数据库，如果把他们都容器化，我们需要多次输入命令，并且尝试管理这些容器的时候很多地方都会出错，这时候容器编排技术来了 compose。
可以理解成一个或者多个 run 命令，按照特定格式列到了 yaml 文件里面。
一个轻量级的容器编排技术。
我们只需要把想要的 docker 命令发给 ai，让他生成一个等价的 compose 文件。
 
比如 `vi docker-compose.yaml` 表示在服务器上创建 compose 文件；然后把 ai 写的文件内容保存在这个文件里。
然后执行
`sudo docker compose up`，这样就启动了文件里面定义的所有容器。加上 `-d` 在后台运行。

`sudo docker compose down` 停止又删除
`sudo docker compose stop` 只停止不删除，还可以 start