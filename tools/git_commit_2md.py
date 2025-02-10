from git import Repo
import os
import shutil
from datetime import datetime
import argparse
from pytz import utc


def analyze_commits(repo_url_or_path, output_file):
    temp_dir = None
    try:
        if os.path.isdir(repo_url_or_path):
            repo = Repo(repo_url_or_path)
        else:
            temp_dir = "temp_repo_clone"
            repo = Repo.clone_from(repo_url_or_path, temp_dir)
        commits_info = []
        for commit in repo.iter_commits():
            commit_datatime = commit.committed_datetime.astimezone(utc)
            commit_data_str = commit_datatime.strftime("%Y-%m-%d")
            parents = commit.parents
            parent = parents[0] if parents else None

            added = []
            modified = []
            deleted = []

            if not parent:
                # 初次提交
                for item in commit.tree.traverse():
                    if item.type == 'blob':
                        added.append(item.path)
            else:
                diffs = commit.diff(parent, R=True, C=True)
                for diff in diffs:
                    change_type = diff.change_type
                    a_path = diff.a_path
                    b_path = diff.b_path

                    if change_type == 'A':
                        added.append(b_path)
                    elif change_type == 'D':
                        deleted.append(a_path)
                    elif change_type == 'R':
                        deleted.append(a_path)
                        added.append(b_path)
                    elif change_type == 'M':
                        modified.append(b_path)
                    elif change_type == 'C':
                        deleted.append(a_path)
                        added.append(b_path)
                    else:
                        modified.append(b_path if b_path else a_path)
            # 存储提交信息
            commits_info.append({
                'sha': commit.hexsha,
                'message': commit.message.strip(),
                'data_str': commit_data_str,
                'datetime': commit_datatime,
                'added': added,
                'modified': modified,
                'deleted': deleted
            })

        grouped = {}
        for commit in commits_info:
            data_key = commit['data_str']
            if data_key not in grouped:
                grouped[data_key] = []
            grouped[data_key].append(commit)

        sorted_commits = sorted(
            grouped.keys(),
            key=lambda x: datetime.strptime(x, "%Y-%m-%d"),
            reverse=True)

        md_content = "# 更新日志 <Badge type=\"tip\" text=\"Log\" />\n\n"
        md_content += (
            "> [!NOTE] \n"
            "> 日志记录由 [git_commit_2md.py]"
            "(https://github.com/chhz0/helloch.cn/"
            "blob/blog/tools/git_commit_2md.py)"
            " 生成，其中部分内部md链接可能因为md文件的删除或者移动导致失效"
            "，推荐使用`Ctrl K`搜索文档. \n\n"
        )
        for data in sorted_commits:
            md_content += f"## `{data}`\n\n"
            for commit in grouped[data]:
                md_content += f"### Commit SHA: `{commit['sha'][:7]}`\n\n"
                md_content += f"**Message**: {commit['message']}\n"

                if commit['added']:
                    added_md = [
                        f for f in commit['added']
                        if f.endswith('.md')
                    ]
                    if added_md:
                        md_content += "- Added:\n"
                        for file in added_md:
                            file_path = file.removeprefix("docs/")
                            if file_path.endswith("index.md"):
                                file_link = file_path.removesuffix(
                                    "index.md"
                                )
                            else:
                                file_link = file_path.removesuffix(".md")
                            md_content += (
                                f"  - [{file_path}](/{file_link})\n"
                            )
                if commit['modified']:
                    modified_md = [
                        f for f in commit['modified']
                        if f.endswith('.md')
                    ]
                    if modified_md:
                        md_content += "- Modified:\n"
                        for file in modified_md:
                            file_path = file.removeprefix("docs/")
                            if file_path.endswith("index.md"):
                                file_link = file_path.removesuffix(
                                    "index.md"
                                )
                            else:
                                file_link = file_path.removesuffix(".md")
                            md_content += (
                                f"  - [{file_path}](/{file_link})\n"
                            )
                if commit['deleted']:
                    deleted_md = [
                        f for f in commit['deleted']
                        if f.endswith('.md')
                    ]
                    if deleted_md:
                        md_content += "- Deleted:\n"
                        for file in deleted_md:
                            file_path = file.removeprefix("docs/")
                            if file_path.endswith("index.md"):
                                file_link = file_path.removesuffix(
                                    "index.md"
                                )
                            else:
                                file_link = file_path.removesuffix(".md")
                            md_content += (
                                f"  - [{file_path}](/{file_link})\n"
                            )
                md_content += "\n"

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
    finally:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Generate commit history report from a Git repository.'
    )
    parser.add_argument(
        '--repo',
        type=str,
        required=True, help='URL or local path of the Git repository'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='COMMIT_HISTORY.md', help='Output markdown file path'
    )
    args = parser.parse_args()

    analyze_commits(args.repo, args.output)
