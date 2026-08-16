# AGENTS.md — One API Web

本文件把本仓库的工程约定固化为编码代理的硬性执行规则。适用于本仓库的**每一次改动**，不区分任务大小。

## Start Here（开始之前）

- 改动前先读 `docs/REQUIREMENTS.md`（规范需求）与 `docs/PLAN_md/PLAN_yymmdd.md`（当日计划清单）。
- 把每次改动与当前需求逐项对照；出现歧义冲突时标记给用户，不得自行猜测取舍。
- 每次改动完成后必须完整运行 `pnpm typecheck` 与 `pnpm test`；出现模糊失败时标记给用户，不得静默跳过。
- 需求文档或计划文件缺失时，先创建再动手，不得省略规则。

## Repository Map（仓库地图）

| 路径 | 职责 |
|------|------|
| `src/main.jsx` / `src/App.jsx` | 应用入口 |
| `src/routes/index.tsx` / `src/routes/Root.tsx` | React Router 路由表与根布局 |
| `src/api/oneApi.ts` | 唯一 API 请求层 + 接口类型（`ApiResponse<T>` 信封） |
| `src/store/index.ts` | Jotai 全局状态（登录态、主题、语言、Toast 等） |
| `src/common/` | 共享类型、枚举与无障碍工具 |
| `src/components/` | 通用组件（AuthGuard、AdminGuard、PageHeader、TableShell 等） |
| `src/hooks/` | 自定义 Hook（useLocalize、useSiteInfo） |
| `src/layout/` | 面板布局与导航（layout.tsx、hooks/useResource.ts） |
| `src/pages/` | 页面组件，按域分子目录（auth / channel / dashboard / log / profile / redemption / setting / token / user） |
| `src/librechat-client/` | UI 基础组件库（Button、Dialog、Dropdown、Toast、Skeleton 等） |
| `src/librechat-data-provider/` | 数据类型与枚举的再导出 |
| `src/locales/` | i18next 初始化（当前为 stub，见「已知陷阱」） |
| `src/utils/` | 纯函数工具（cn、chart、logger、oauth、permission） |
| `src/__tests__/` | Vitest 单元测试 |
| `docs/REQUIREMENTS.md` | 规范需求文档（权威） |
| `docs/PLAN_md/PLAN_yymmdd.md` | 按日期组织的任务清单 |

## Architecture Rules（架构规则）

- 本仓库是纯前端 SPA，不包含后端代码。
- 后端交互**只允许**通过 `src/api/oneApi.ts` 统一入口，遵守 `ApiResponse<T> { success, message, data }` 信封约定与 401 统一登出。
- 可复用的业务规则、格式化与状态逻辑放在 `src/utils/` 与 `src/store/`，不得内联进 DOM 胶水或组件渲染逻辑。
- 外部系统（后端 API）在单元测试中必须 mock 或 fake，除非明确要求集成测试。
- **前瞻规则**：若未来引入后端代码，必须定义清晰的后端抽象边界，且每次后端改动必须附带单元测试。

## Frontend Rules（前端规则）

- 路径别名：`~/*` → `src/*`；`@librechat/client` → `src/librechat-client/index.ts`；`librechat-data-provider` → `src/librechat-data-provider/index.ts`。
  - 注意：`~/` 由 Vite 自定义插件 `workspace-tilde-resolver` 解析，`src/librechat-client/` 内部写 `~/` 指向的是 `librechat-client` 而非 `src`，容易踩坑。
- 每次前端改动必须附带 Vitest 单元测试（覆盖被改动逻辑的意图，而非仅行为）。
- 每次前端改动必须附带 Playwright E2E 覆盖，优先幂等或自清理流程。**当前仓库缺少 `test:e2e` 脚本，这是必须解决的缺口**——在补齐脚本前不得声称 E2E 覆盖已完成。

## Domain Guardrails（领域护栏）

- 角色编号约定：`1` 普通用户、`10` 管理员、`100` 超级管理员；`isAdmin = role >= 10`，`isRoot = role >= 100`。不得引入其他编号。
- localStorage 键 `user`：`store` 的 `accountAtom` 与 API 层 401 登出逻辑必须保持一致，任何一侧改名必须同步另一侧。
- 令牌密钥以 `sk-` 为前缀，复制时不得截断或改写。
- 兑换码状态编号：`1` 未使用、`2` 已禁用、`3` 已使用（`REDEMPTION_STATUS`），不得漂移。
- 路由守卫：`AuthGuard` 保护 `/panel` 下所有页面；`AdminGuard` 保护 `channel`、`redemption`、`user`、`setting`。新增受限页面必须挂对应守卫。
- 401 自动登出是硬性行为，不得绕过。

## Testing Policy（测试策略）

- 命令：`pnpm test`（Vitest，node 环境，single fork，串行执行）；`pnpm typecheck`（`tsc --noEmit`）。
- 每次改动（含文档、配置以外的代码改动）必须完整跑一遍 `pnpm test`，模糊失败上报用户，不静默通过。
- 前端逻辑改动必须带 Vitest 覆盖；UI 相关覆盖优先使用稳定 ID / test ID / 无障碍 ID，不用可见文本，且失败快速终止不降级。
- Playwright 缺口：`package.json` 目前无 `test:e2e` 脚本，须在引入 E2E 覆盖前补齐并标准化。

## Documentation Rules（文档规则）

- `docs/REQUIREMENTS.md` 是规范需求文档，必须是活文档：行为变更或澄清后同步更新。
- 需求组织不超过三级层级（`##` → `###` → `####`）。
- 文档缺失时必须创建，不得以"仓库还小/尚无文档"为由省略规则。
- 文档与代码冲突时，以当前代码与通过测试为准，并在同一改动中修正文档。

## Planning Rules（计划规则）

- 任务按时间顺序以 checklist 形式记录在 `docs/PLAN_md/PLAN_yymmdd.md`（如 `PLAN_20260816.md`）。
- 相关日期文件缺失时创建，完成后勾选对应项。

## Consistency Checks（一致性检查）

- 每次改动都必须对照当前 `docs/REQUIREMENTS.md`；发现歧义冲突时标记给用户，不得猜着做。
- 若需求、计划与代码三者不一致，先厘清再继续，不得把冲突"平均"掉。

## Feedback Loop（反馈闭环）

- 用户测试或反馈暴露行为偏差时，同时更新 `docs/REQUIREMENTS.md` 与相关测试，让预期行为随时间更精确。
- 反馈修正不得只改代码而不改需求与测试。

## Security and Config Hygiene（安全与配置卫生）

- `.env` 不入库（已 gitignore），只提交 `.env.example` 类占位；开发代理目标通过 `VITE_API_PROXY_TARGET` 配置。
- OAuth client id、Turnstile site key 等敏感配置来自后端 `SiteInfo`，前端不得硬编码密钥或凭据。
- 前端不保存、不打印任何后端密钥类信息。

## Files and Paths to Avoid（应避免的路径）

以下路径为 gitignore 或产物目录，禁止存放产品逻辑：

- `node_modules/`（依赖）、`dist/`（构建产物）、`public/`（静态资源，gitignore 排除）、`.env`
- `log/`、`temp/`（运行时产物）
- `.reasonix/`、`.codegraph/`、`.cursor/`、`.idea/`（工具/索引目录）

## Change Approval（变更审批）

以下架构级改动必须在需求文档、评审意见或提交信息中显式注明理由：

- 角色模型或权限边界变更（角色编号、守卫结构）
- localStorage 键或 401 登出行为变更
- `ApiResponse` 信封或错误处理约定变更
- 路由结构（新增/移动受限页面）
- 新增或移除外部系统对接（OAuth、Turnstile 等）
- `~/` 路径解析或依赖结构变更

## 已知陷阱

- `src/locales/i18n.ts` 当前为 stub：`resources` 为空，`locales/en|zh-Hans|zh-Hant` 目录为空，国际化尚未真正生效；不要假设界面文案已走 i18n。
- Vitest 配置为 `environment: 'node'` + `singleFork`：涉及 DOM 的测试需要引入 jsdom/happy-dom 或调整配置，不要直接假设 DOM API 可用。
- 大型改动遵循"保留行为、向下抽取"：不要在既有入口大规模重写，先提取再扩展。
