# argon-theme-showcase

Argon 主题用户展示墙
-------

## 添加网站

### 要求

- 使用 Argon 主题
- 有一定的内容
- 部署 https

### 添加

Fork 该 Repo，在 `/site-list` 中新建一个 JSON 文件，命名即网站的域名（例如网站是 `solstice23.top` 则命名为 `solstice23_top.json`）。

JSON 内容如下: 

```json
{
	"title": "站点标题",
	"description": "站点描述",
	"owner": "站长用户名",
	"url": "https://example.com/"
}
```

然后提交 Pull Request 即可。

截图和其他信息由脚本自动抓取，只需新建此 JSON，无需修改其他文件。


## 持续集成

Github Action 会每隔 4 小时检测一次网站状态，每隔 24 小时抓取一次网站截图。

爬虫使用的 UA 为 `ArgonBot xxxxxxxxxxxxxxxx` （`ArgonBot` + 由域名生成的 16 位字符串，每个域名不同）。

自动抓取时可能会被 CDN 阻止，请将爬虫的 UA 加入放行名单。

可以私信 @solstice23 获取生成的带 16 位字符串的 UA，以精准放行爬虫而过滤其他流量。
