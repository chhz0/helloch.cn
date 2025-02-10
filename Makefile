.PHONY dc-log
docker-log:
	docker compose logs caddy

.PHONY py-gen-log
py-gen-log:
	@py -3 ./tools/git_commit_2md.py --repo . --output ./docs/about/changelog.md