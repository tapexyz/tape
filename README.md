<div align="center">
    <img src="https://static.tape.xyz/brand/og.png" alt="banner">
</div>
<br>
<div align="center">
    <a href="https://www.gitpoap.io/gh/tapexyz/tape">
        <img src="https://public-api.gitpoap.io/v1/repo/tapexyz/tape/badge" alt="Gitpoap">
    </a>
    <a href="https://tape.xyz/discord">
       <img src="https://img.shields.io/discord/980882088783913010.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Discord">
    </a>
    <a href="https://x.com/tapexyz">
        <img src="https://img.shields.io/twitter/follow/tapexyz?style=social" alt="Twitter">
    </a>
    <a href="https://status.tape.xyz">
        <img src="https://betteruptime.com/status-badges/v1/monitor/dfaw.svg" alt="Better Uptime">
    </a>
</div>
<br>

## 📼 Tape

an open video-sharing platform.

## 💪 Community

For a place to have open discussions on features, voice your ideas, or get help with general questions please visit our community at [Discord](https://tape.xyz/discord).

## 🔍 What's inside?

> [!NOTE]
> This monorepo uses [Pnpm](https://pnpm.io/) as a package manager. It includes the following apps and packages.

#### 🌐 Apps

| Name        | Description                     |
| ----------- | ------------------------------- |
| `web`       | Frontend application            |
| `embed`     | Embed Video Player              |
| `cron`      | Cron jobs for background tasks  |
| `api`       | Backend application             |
| `og`        | Open graph meta tags generator  |
| `contracts` | Permissionless signup contracts |

#### 📦 Packages

| Name        | Description                          |
| ----------- | ------------------------------------ |
| `abis`      | Contract Interfaces                  |
| `config`    | Shared lint config                   |
| `constants` | Constants for the entire application |
| `generic`   | Collection of generic helpers        |
| `server`    | Collection of server helpers         |
| `browser`   | Collection of client helpers         |
| `lens`      | Everything related to lens indexer   |
| `ui`        | Web UI components                    |

## 🆕 Getting Started

Install all dependencies from repository root,

```bash
pnpm install
```

Start the application,

```bash
pnpm dev
```

and visit http://localhost:4783

## 🤝 Contributors

We love contributors! Feel free to contribute to this project but please read the [Contributing Guidelines](.github/CONTRIBUTING.md) before opening an issue or PR so you understand the branching strategy and local development environment.

<a href="https://github.com/tapexyz/tape/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tapexyz/tape" />
</a>

## 📜 License

Tape codebase is open-sourced software licensed under the [AGPLv3](LICENSE).
