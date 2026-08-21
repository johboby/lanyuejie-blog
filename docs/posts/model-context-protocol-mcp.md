---
title: "Model Context Protocol：让大模型安全、可控地连接真实世界"
date: 2026-08-17
tags: [MCP, 大模型, 工具调用, Agent, 协议标准, 企业安全]
duration: "25 min"
---

# Model Context Protocol：让大模型安全、可控地连接真实世界

## 先说结论

1. **MCP 已经成为 AI Agent 时代的"USB-C"**。它把"N 个 Agent × M 个工具 = N×M 次重复集成"压缩成"N+M 次对接"，是这个领域过去两年最重要的一次标准化。
2. **2026 年 7 月 28 日的规范更新是分水岭**。协议核心从"有状态会话"切换为"无状态请求/响应"，并引入多轮请求（MRTR）、可缓存的列表结果和更严格的 OAuth 2.1 授权——本质上是在为大规模生产部署铺路。
3. **它解决的是"让模型稳定地用上工具"，而不是"让模型变聪明"**。把 MCP 当成银弹会失望，把它当成基础设施来设计，才会真正受益。
4. **安全是最大也是最容易被低估的成本项**。工具描述本身就是模型输入，供应链、凭证管理和可观测性缺一不可，否则 MCP 会把 prompt injection 的风险面成倍放大。
5. **从开发者的角度，它已经是"能用的标准"**；从企业的角度，它仍是"需要自己补齐治理的协议"——差距主要在授权粒度、审计和跨服务追踪。

---

## 一、为什么需要 MCP：从 N×M 到 N+M

在 MCP 出现之前，每一对"Agent ↔ 工具"的对接都是一次独立的工程：

- 想让 Claude 查数据库？写一套连接代码。
- 想让 Cursor 调 GitHub？再写一套。
- 想让内部助手读 Confluence？又是一套。

结果是 **N 个 Agent × M 个工具 = N×M 个集成点**，每一处都要单独处理认证、错误处理、Schema 同步和版本升级。这种碎片化不仅拖慢开发，还让安全审计几乎不可能系统地进行。

MCP 的核心承诺非常朴素：**定义一套通用协议，让任何 Agent（Host）都能用同一套方式发现、调用和监管任何工具（Server）**。

```
没有 MCP：
  Agent₁ ──custom──> Tool₁
  Agent₁ ──custom──> Tool₂
  Agent₂ ──custom──> Tool₁
  ... N×M 条专用接线

有了 MCP：
  Agent₁ ──MCP──┐
  Agent₂ ──MCP──┼──> MCP Server₁ (DB)
  Agent₃ ──MCP──┤           MCP Server₂ (GitHub)
  ...            └──MCP──> MCP Server₃ (Search)
```

**整合复杂度从 N×M 降到 N+M**，这是 MCP 真正值钱的地方 [citation:5]。

---

## 二、MCP 的架构：Host、Client 与 Server

MCP 采用经典的 **客户端-主机-服务器（Host-Client-Server）** 三层架构 [citation:2][citation:7]：

| 角色 | 职责 | 实例 |
|------|------|------|
| **Host（主机）** | 容器与协调者，管理多个 Client，控制权限、生命周期、用户授权和跨 Client 的上下文聚合 | Claude Desktop、VS Code + Copilot、Cursor、Zed |
| **Client（客户端）** | 由 Host 创建，与某个 Server 维持 1:1 连接，负责协议协商、消息路由、订阅与通知 | 每个 MCP Server 对应一个 Client 实例 |
| **Server（服务器）** | 提供具体的上下文与能力，通过 MCP 原语暴露资源、工具和提示词，独立运行、职责单一 | 官方 GitHub Server、PostgreSQL Server、文件系统 Server |

关键设计原则 [citation:2]：

- **Server 应该极其容易构建**——协议把复杂的编排留给 Host，Server 只聚焦单一明确的功能。
- **Server 之间彼此隔离**——任何一个 Server 都看不到完整对话，也不能"窥探"其他 Server。
- **能力可渐进添加**——核心协议只规定最小必要功能，额外能力通过协商按需开启。

这套结构让"模型"和"世界"之间多了一层有规则的契约，而不是一堆零散的 API 拼接。

---

## 三、三种核心原语：Tools、Resources、Prompts

MCP 在 JSON-RPC 2.0 之上定义了三类**原语（Primitives）**，构成 Agent 与工具交互的全部词汇表 [citation:21][citation:31]。

### 3.1 Tools —— 让模型"做事"

Tool 是模型可以**主动调用**的函数，例如查询数据库、调用外部 API、处理文件、执行命令。

```json
{
  "tools": [
    {
      "name": "query_database",
      "description": "Execute SQL query on customer database",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" }
        },
        "required": ["query"]
      }
    }
  ]
}
```

模型看到 `description` 和 `inputSchema` 后，自行决定何时调用、传什么参数。工具的**描述质量直接决定模型的选择正确率**——把"黄瓜"描述成"西红柿"，模型就可能选错东西 [citation:27]。

### 3.2 Resources —— 让模型"读数据"

Resource 是**只读**的数据源，模型可以按需读取，但不会产生副作用。

```json
{
  "resources": [
    {
      "uri": "file:///docs/api-spec.md",
      "name": "API Specification",
      "mimeType": "text/markdown"
    },
    {
      "uri": "db://customers/12345",
      "name": "Customer Record",
      "mimeType": "application/json"
    }
  ]
}
```

常见的 URI 方案由 Server 自定义（`file://`、`db://`、`jira://`、`github://` 等），它们是只读的，没有副作用 [citation:26]。

### 3.3 Prompts —— 让模型"用模板"

Prompt 是**可复用的提示词模板**，把常见的任务模式（如季度复盘、文档摘要）固化到 Server 端，所有 Agent 共享同一套规范版本 [citation:26]。

```json
{
  "prompts": [
    {
      "name": "analyze_customer",
      "description": "Analyze customer behavior and generate insights",
      "arguments": [
        { "name": "customer_id", "description": "Customer identifier", "required": true }
      ]
    }
  ]
}
```

**直觉理解**：Tools 是"手"，Resources 是"眼睛"，Prompts 是"流程卡"。三者配合，Agent 才能既看得到、做得了，又不出格。

---

## 四、传输层：stdio 与 Streamable HTTP

MCP 的协议语义与传输方式解耦，目前定义两种标准传输 [citation:7][citation:23]。

### 4.1 stdio：本地首选

Host 把 Server 作为**子进程**拉起，双方通过标准输入/输出以**换行分隔的 JSON** 通信。

- ✅ 零网络配置、零端口、零证书。
- ✅ 天然继承父进程的环境变量与权限。
- ❌ 只能本机、单 Client，不适合多租户。

```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}
```

这是 Claude Desktop、本地 IDE 插件、CI Runner 的默认选择 [citation:28]。

### 4.2 Streamable HTTP：远程与共享

Server 暴露一个 **HTTP 端点**，Client 用 POST 发送 JSON-RPC 消息，需要流式通知时升级为 SSE [citation:23]。

- ✅ 支持多租户、跨网络、CDN/反向代理。
- ✅ 可被普通轮询负载均衡器分发。
- ❌ 必须配 TLS + Bearer Token / mTLS。

> **注意**：早期 "HTTP + 长连接 SSE 双端点" 的方案已在 2025-03-26 被弃用，新 Server 应使用 Streamable HTTP [citation:28]。

### 4.3 两种传输的取舍

| 维度 | stdio | Streamable HTTP |
|------|-------|-----------------|
| 部署位置 | 本机子进程 | 远程服务 / 容器 |
| 网络配置 | 无 | 需要 TLS、认证 |
| 适用场景 | 本地开发、单机工具 | SaaS 集成、团队协作 |
| 冷启动 | 慢（250–400 ms）[citation:33] | 中（取决于 DC 距离）|
| 多租户 | 不支持 | 天然支持 |

---

## 五、2026-07-28 规范更新：一次结构性重写

2026 年 7 月 28 日发布的规范版本，是 MCP 自 2024 年 11 月问世以来**最大的一次修订**[citation:1][citation:6]。它之所以重要，是因为它把协议从"能跑通"推进到了"能上生产"。

### 5.1 无状态核心（Stateless Core）

**过去**：每次连接都要先 `initialize` 握手、交换 protocolVersion 与 capabilities，并在整个会话期间维持一个有状态的 Session。

**现在**：握手被移除，protocolVersion、clientInfo、clientCapabilities 跟随每个请求的 `_meta` 字段一起发送。任何请求都可以落到负载均衡器后面的任意副本 [citation:1][citation:6]。

```
Before 2026-07-28:
  Client ──initialize handshake──> Server (sticky session required)

After 2026-07-28:
  Client ──POST /mcp  (Mcp-Method + Mcp-Name headers)──> Any Replica
```

**直接收益**：Server 变成普通的、可水平扩展的无状态 HTTP 服务，可以放心放在 round-robin LB 后面，不再需要粘性会话和共享会话存储 [citation:6]。

**代价**：原本只交换一次的元数据，现在每次请求都带一段。对绝大多数部署来说，这点字节换来的运维简化是划算的 [citation:6]。

### 5.2 多轮请求（MRTR）

以前 Server 在处理工具调用时如果需要向用户确认或补充参数，必须依赖一直打开的双向流。MRTR 用一种**无状态**的方式解决了这个问题 [citation:1]：

1. Server 在 `tools/call` 的响应里返回 `resultType: "input_required"`，并附带需要回答的问题。
2. Client 收集用户回答后，**重试**原始请求，把答案放进 `inputResponses`。
3. Server 用新答案继续完成原调用。

这意味着"中途问用户一个问题"不再需要保持长连接，天然适配无状态架构。

### 5.3 列表结果可缓存

`tools/list`、`prompts/list`、`resources/list`、`resources/read` 的响应现在会携带 `ttlMs` 和 `cacheScope`，客户端可以缓存工具目录，并在重连后保持上游 prompt cache 稳定 [citation:1][citation:11]。

> 一个具体数字：不加缓存时，每次会话启动可能被工具定义吃掉约 **15 万 token**；利用缓存与按需发现后，可降到约 **2000 token**——相差约 **75 倍**[citation:33]。

### 5.4 授权对齐 OAuth 2.1

- 强制 **OAuth 2.1 + PKCE（S256）**，不再接受裸 API Key 或 Basic Auth（面向公网 Server）[citation:25]。
- 新增 **RFC 9207 Issuer 校验**，防止一个 Server 签发的 token 被重放到另一个信任同一授权服务器的 Server 上（Confused Deputy 类攻击）[citation:9][citation:25]。
- 用 **Client ID Metadata Documents（CIMD）** 取代动态客户端注册（DCR），客户端公布一个元数据 URL，Server 去拉取并缓存，堵住"drive-by 注册"的滥用路径 [citation:1][citation:25]。
- 引入 **Enterprise-Managed Authorization（EMA）**：由企业 IdP 统一签发 ID-JAG Token，Agent 在 SSO 登录后自动获得所有已授权 Server 的访问权，无需逐个点击同意 [citation:25][citation:37]。

### 5.5 形式化的扩展框架

扩展（Extensions）从此有了**反向 DNS 命名、独立版本号和委托维护者**。`MCP Apps`（Server 提供可交互的 HTML 界面）和 `Tasks`（长时运行任务的生命周期原语）作为首批扩展随规范一同发布 [citation:11]。

---

## 六、SDK 与快速上手

官方为 Python、TypeScript、Go、C# 都提供了 SDK，核心理念是**用装饰器/声明式 API 把 JSON-RPC 路由、Schema 生成和协议握手全部自动化**[citation:24]。

### 6.1 Python（FastMCP）

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="customer-lookup",
    version="1.0.0",
    protocol_version="2026-07-28",
)

@mcp.tool()
def search_customers(region: str, segment: str) -> list[dict]:
    """Return customers filtered by region and segment."""
    return crm_client.query(region=region, segment=segment)

@mcp.resource("customer://{customer_id}")
def customer_record(customer_id: str) -> str:
    """Return a single customer record as JSON."""
    return crm_client.get(customer_id).to_json()

@mcp.prompt()
def account_review(customer_id: str) -> str:
    """Prompt template for a quarterly account review."""
    return f"Draft a quarterly review for customer {customer_id}."

if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8080)
```

FastMCP 在 import 时**自动根据函数签名生成 JSON Schema**，并在收到 `tools/call` 时先做参数校验，不合法直接返回结构化 JSON-RPC 错误，避免脏数据进入你的业务逻辑 [citation:24]。

### 6.2 TypeScript

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

server.tool(
  "get_current_weather",
  "Get the current weather for a city.",
  {
    city: z.string().describe("City name, e.g. 'San Francisco'"),
    units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  },
  async ({ city, units }) => {
    const data = await fetchWeather(city, units);
    return {
      content: [{ type: "text", text: `${city}: ${data.temp}°, ${data.conditions}` }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

SDK 同时处理 `result` 与 `isError` 两种返回路径——**工具执行失败不是 JSON-RPC 错误，而是正常响应**，模型能直接读到错误内容并据此调整下一步行为 [citation:26][citation:29]。

---

## 七、MCP vs 传统 API：到底差在哪

这是工程决策时最常被问到的问题 [citation:3][citation:8]。

| 维度 | MCP | 传统 REST/gRPC API |
|------|-----|----------------------|
| 通信模型 | 有状态会话（旧）→ 无状态请求/响应（2026-07-28） | 无状态请求-响应 |
| 工具发现 | 运行时 `tools/list` 动态发现 | 设计期手写 / OpenAPI 静态生成 |
| 协议 | 标准化 JSON-RPC 2.0 | 各异（REST / GraphQL / 自定义） |
| 传输 | stdio（本地）+ Streamable HTTP（远程） | 主要 HTTP，也有 WebSocket / gRPC |
| 认证 | OAuth 2.1 + PKCE，凭证不进模型上下文 | 各异，凭证常直接暴露给调用方 |
| 集成成本 | N+M | N×M |
| 延迟基线 | 多 300–800 ms（协议开销）| 通常更低 |
| Token 消耗 | Server 控制暴露面，可缓存；但全量加载时会更大 | 由开发者手工裁剪，可控但费人力 |

**怎么选**：

- **选 MCP**：需要运行时动态发现工具、跨多个数据源统一认证、Agent 要自适应工具变化。
- **选传统 API**：延迟极度敏感（如实时风控、高频交易）、已有成熟审计与合规体系、工具集稳定不变。

实践中更常见的模式是 **REST 在内、MCP 在外**：后端微服务之间继续用 gRPC/REST，对外给 Agent 暴露一层 MCP Server，把同一套能力"翻译"成工具调用 [citation:8]。

---

## 八、安全治理：MCP 最容易被低估的部分

把 MCP 直接连上生产环境，等于把一堆高权限工具直接递到模型手里。下面是 2026 年经过实战检验的防护清单 [citation:4][citation:9]。

### 8.1 威胁模型

独立安全研究给出了六类需要命名的风险 [citation:4]：

1. **Confused Deputy**：代理 Server 以自身权限而非用户权限去调用下游。
2. **工具投毒 / Rug Pull**：恶意 Server 在安装后偷偷改工具描述，注入 prompt。
3. **Token Passthrough**：Server 接受并非签发给自己的 Token。
4. **凭证窃取**：从环境变量或日志里把密钥捞出来。
5. **SSRF**：利用 OAuth 元数据发现阶段的 URL 打内网。
6. **供应链攻击**：MCP Server 本身或其依赖被篡改。

### 8.2 十条生产级最佳实践

| # | 实践 | 对应威胁 |
|---|------|---------|
| 1 | 把所有 Server 默认视为不可信，建立审批注册表，阻断一切未批准项 | 全部 |
| 2 | 强制 OAuth 2.1 + PKCE，严格校验 Token 的 audience | Token Passthrough、Confused Deputy |
| 3 | 每个 Client 单独存储同意决策，展示 client 名、scope、redirect URI | Confused Deputy |
| 4 | 安装时和每次更新时扫描工具描述中的 prompt injection | 工具投毒 |
| 5 | 凭证进 Vault，绝不进环境变量，使用短期可轮换令牌 | 凭证窃取 |
| 6 | 工具执行做沙箱（容器 + seccomp / AppArmor / gVisor），最小权限 | 任意代码执行 |
| 7 | 每个工具调用都做严格 JSON Schema 校验 | 注入与越权 |
| 8 | 全量日志记录到 SIEM，对高频调用、异常工具、大流量外发告警 | 横向移动 |
| 9 | 写、删、付款、触达生产数据前必须人工确认 | 误操作与滥用 |
| 10 | 签名分发 + SBOM + 依赖扫描（Trivy / Grype） | 供应链 |

### 8.3 一个真实教训

2026 年 4 月，OX Security 披露了 stdio 传输的一个配置缺陷，约 **20 万台** MCP Server 暴露在命令执行风险下；Anthropic 将其定性为**配置风险**而非协议漏洞 [citation:5]。这件事的启示很简单：**协议再安全，错误的部署方式照样会出事**。

---

## 九、企业授权：EMA 与 ID-JAG

标准 MCP OAuth 对个人用户够用，对企业却很痛苦——每个员工都要逐个 Server 点同意，安全团队也没有统一视图 [citation:37]。

**Enterprise-Managed Authorization（EMA）** 的做法是让企业 IdP 成为唯一权威：

1. 员工登录企业 IdP（Okta / Entra ID / Google Workspace）。
2. Client 用 RFC 8693 Token Exchange 向 IdP 换取一张 **ID-JAG（Identity Assertion JWT Authorization Grant）**。
3. Client 把 ID-JAG 交给目标 MCP Server 的授权服务器，换取普通 MCP 访问令牌。
4. 之后所有工具调用都走这张令牌，与个人 OAuth 流程完全一致。

**带来的变化** [citation:37]：

- 员工**不再看到任何 MCP 同意页面**，SSO 一次即全部就绪。
- 撤销权限在 **IdP 一处完成**，不再需要逐个 Server 清理。
- 审计日志集中在 IdP 管理后台，而不是散落各处。

> 截至 2026-07-28 规范发布，已公开采用 EMA 的厂商包括 Anthropic、VS Code、Okta、Asana、Atlassian、Canva、Figma、Linear 和 Supabase [citation:25]。

---

## 十、可观测性：别在黑盒里跑 Agent

传统 APM 只回答"请求成不成功、快不快"。MCP Server 服务的是**会犯错的 Agent**，失败模式完全不同 [citation:34][citation:39]：

- Agent 可能在某个工具上**死循环**，因为推理卡住了。
- 工具返回 HTTP 200，但内容是**误导性的**，导致下一步出错。
- 参数**通过 Schema 校验**却语义错误，返回看起来正常实则偏差的结果。

这些在标准 APM 仪表盘上**完全看不见**。

### 10.1 应该采集什么

| 信号 | 传统 API | MCP Server |
|------|---------|------------|
| 延迟 | P50 / P99 每端点 | P50 / P99 每工具 + 每 Agent |
| 错误 | HTTP 4xx / 5xx | HTTP 错误 + 语义错误（`isError: true`）|
| 量级 | 请求/秒 | 每次会话调用次数（用于检测循环）|
| 内容 | 可选 | **关键**——Agent 实际拿到了什么 |
| 成本 | 无 | Token 消耗 + 下游 API 成本 |

### 10.2 用 OpenTelemetry 接入

OpenTelemetry 的 **GenAI 语义约定**在 2026 年初趋于稳定，为 MCP 工具调用提供了一套标准属性名 [citation:34][citation:39]。

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'mcp-tools-server',
    'mcp.transport': process.env.MCP_TRANSPORT ?? 'stdio',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_ENDPOINT ?? 'http://localhost:4318/v1/traces',
  }),
});

sdk.start();
```

在工具调用处埋点，记录工具名、输入参数、输出、耗时和错误状态，再导出到 Grafana、Datadog、New Relic 或 Honeycomb 任一后端即可 [citation:34]。

---

## 十一、生产部署模式

随着生态成熟，三种部署模式已经清晰分化 [citation:5][citation:10]。

### 11.1 本地模式（Local）

MCP Server 跑在同一台机器上，通过 stdio 与 Client 通信。配置文件写在应用本地（如 `~/.claude/mcp.json`）。

- ✅ 隐私好、零运维成本、适合个人探索。
- ❌ 无法扩展，无法集中管控。

### 11.2 企业代理模式（Corporate Proxy）

组织把 MCP Server 集中部署在代理层，统一对接内部目录（Azure AD / Okta / Google Workspace），对所有工具调用做审计、限流和版本管理 [citation:5]。

- ✅ 统一策略、集中审计、版本可控。
- ❌ 需要专门的平台团队维护。

### 11.3 托管 SaaS 模式（Managed SaaS）

第三方供应商（如 Zenrows、Composio、Pipedream）提供托管 MCP Server，自带 OAuth 对接和运维 [citation:5]。

- ✅ 小团队也能快速用上大量服务，无需自建基础设施。
- ❌ 数据经过第三方，合规与延迟要单独评估。

### 11.4 容器化与 Kubernetes

把 Server 跑进 Docker 是最基本的"去手工化"步骤 [citation:10]：

```bash
docker mcp gateway run \
  --verify-signatures \
  --block-network \
  --log-calls \
  --cpus 1 \
  --memory 2Gb
```

- `--verify-signatures`：只跑经过签名的镜像。
- `--block-network`：默认阻断出站网络，白名单放行。
- `--log-calls`：记录每次工具调用，用于审计。

在 Kubernetes 里进一步加 `livenessProbe` / `readinessProbe`、资源配额、只读根文件系统和网络策略，就构成了一套生产级底座 [citation:10]。

---

## 十二、生态现状：谁在用、用哪些 Server

截至 2025 年 12 月，MCP 生态已有 **超过 1 万个活跃公共 Server**，Tier 1 SDK 月下载量接近 **5 亿次**[citation:5]。真正承载大部分流量的，是其中一小撮成熟实现 [citation:5]：

| 类别 | 代表性 Server | 成熟度 |
|------|--------------|--------|
| 生产力 | Google Workspace、Microsoft 365、Notion、Linear、Slack | 高，OAuth 完善 |
| 开发工具 | Git、GitHub、GitLab、CI/CD 连接器 | 高 |
| 数据库 | PostgreSQL、MySQL、MongoDB、Redis | 稳定 |
| 持久记忆 | memory-mcp（Anthropic）、Mem0-MCP | 新兴但重要 |
| 企业应用 | Salesforce、SAP、ServiceNow、Jira、Confluence、HubSpot | 成熟 |

> 一个现实问题：**社区 Server 的质量参差不齐**。很多项目做 Demo 很好看，上生产却缺错误处理、超时校准和文档。选 Server 时，优先挑有持续维护、有签名分发、有 SBOM 的项目 [citation:5]。

---

## 十三、性能基准：别被数字带跑

不同机构给出的绝对数字差异很大，因为它们测的是不同工作负载、不同硬件 [citation:33][citation:38]。但**相对关系**是稳定的：

| 指标 | stdio（冷启动） | stdio（热态） | Streamable HTTP（同 DC）|
|------|----------------|--------------|------------------------|
| 单次调用开销 | 250–400 ms | 0.3–1 ms | 5–10 ms |
| 持续吞吐 | 受进程数限制 | 高 | 高（可共享连接池）|

几个对工程有用的结论 [citation:33]：

- **传输方式决定上限**。把 stdio 换成 HTTP，本质是一次"传输层替换"，核心逻辑几乎不用改。
- **冷启动是远端部署的头号敌人**。Serverless / 容器冷启动 250–400 ms 的尾部延迟，要单独测、单独优化。
- **缓存工具列表是零成本大杀器**。规范已要求 `tools/list` 返回**确定性顺序**以提升 LLM prompt cache 命中率，先把这件事做对 [citation:33]。

---

## 十四、按场景选型指南

| 场景 | 推荐模式 | 关键注意点 |
|------|---------|------------|
| 个人开发、本地工具 | stdio + 本地 Server | 限制文件系统作用域 |
| 小团队快速接入 SaaS | 托管 SaaS（Composio 等）| 评估数据合规 |
| 企业多部门、统一管控 | 企业代理 + EMA | IdP 集成、集中审计 |
| 高安全（金融/医疗）| 企业代理 + 沙箱 + 人工确认 | 最小权限、SIEM 联动 |
| 延迟敏感（风控/交易）| 传统 API 优先，MCP 仅做编排 | 避免多层协议嵌套 |
| 多模型 failover | MCP 网关（Bifrost 等）| 工具定义注册一次，跨模型复用 |

---

## 十五、未来方向

- **协议层**：扩展框架成熟后，会出现更多标准化扩展（如通知、审批流、跨 Server 编排）。
- **安全层**：授权粒度、跨 Server 分布式追踪、自动化渗透测试会逐步标准化。
- **生态层**：参照 LSP、DAP 的历史轨迹，社区 Server 会经历"爆发 → 洗牌 → 围绕少数高质量项目收敛"的过程 [citation:5]。
- **工程层**："MCP 网关 + 评估 + 护栏 + 审计"会合并成统一的控制平面，而不是今天这样分散在多款工具里 [citation:8]。

---

## 十六、常见疑问

**MCP 会取代传统 API 吗？**
不会。它更像是 API 之上的"Agent 接入层"。后端服务之间继续用 gRPC/REST，对外给 Agent 的能力用 MCP 暴露，两者长期共存 [citation:8]。

**把工具描述写进 prompt 和用 MCP 有什么区别？**
本质区别是**谁维护 Schema、谁负责版本**。手写 prompt 容易漂移、难审计；MCP 把 Schema 放到 Server 端，更新一次全部 Agent 受益，也更方便做权限和日志 [citation:8]。

**2026-07-28 的无状态化会不会让已有的有状态 Server 失效？**
不会。新 Client 遇到旧 Server 时会自动回退到 `initialize` 握手；已发布的 Server 不会被强制下线，只是新特性（MRTR、缓存头）需要升级才能用 [citation:11]。

**MCP 安全吗？**
协议本身提供了安全机制，但**安全是部署出来的，不是协议白送的**。不扫工具描述、不隔离凭证、不记日志，再好的协议也救不了 [citation:4][citation:9]。

**该从哪个 Server 开始尝试？**
对个人开发者，从官方 `filesystem`、`git`、`fetch`、`memory` 四个 stdio Server 起步最稳；对企业，先选一个非核心业务跑通企业代理 + EMA，再逐步扩展 [citation:36]。

---

## 参考文献

1. Model Context Protocol Blog, "The 2026-07-28 Specification", 2026.
2. MCP 官方文档（中文镜像）, "架构", 2025.
3. Blaxel.ai, "MCP vs APIs: What's the Difference and When to Use Each", 2026.
4. Practical DevSecOps, "MCP Security Best Practices: What Actually Works in 2026", 2026.
5. Jacar.es, "Consolidated MCP ecosystem: a quick map for 2026", 2026.
6. TheVibeFather, "The MCP 2026-07-28 Spec, Stateless Core, Tasks, and What Breaks", 2026.
7. ModelContextProtocol.io, "Architecture overview", 2026.
8. FutureAGI, "API vs MCP in 2026: REST/gRPC vs Model Context Protocol", 2026.
9. (MCP Security Investigation 2026, 综合 Trail of Bits / OWASP / 官方安全文档).
10. gsstk.gem98.com, "MCP in Production: Registries, Docker, and Enterprise Patterns", 2026.
11. 4sysops.com, "2026-07-28 Model Context Protocol: stateless, multi-round-trip, routable headers, authorization hardening", 2026.
12. LobeHub, "MCP Architecture Expert", 2026.
13. ModelContextProtocol.io, "Understanding MCP clients", 2026.
14. DeepWiki, "Transport Layer — modelcontextprotocol/modelcontextprotocol", 2026.
15. Superteams.ai, "Setting Up the Python (FastMCP) and TypeScript MCP SDKs", 2026.
16. AliceLabs.ai, "Model Context Protocol (MCP) Guide 2026: Complete Reference", 2026.
17. javaguide.cn, "什么是 Model Context Protocol (MCP)? 和 Function Calling、Agent 什么关系?", 2025.
18. home.wonlab.top, "MCP Series (02): Protocol Deep Dive — Host/Client/Server Model and JSON-RPC Communication", 2025.
19. llmbestpractices.com, "MCP: Transports", 2026.
20. mcpguide.dev, "MCP TypeScript SDK: Complete Developer Guide", 2026.
21. diors.tech, "MCP 生态 2026 Q2 现状: 从协议到事实标准", 2026.
22. Stanza.dev, "Model Context Protocol (MCP)", 2026.
23. skakarh.com, "MCP Elicitation: Powerful User Input for Safer AI Agents", 2026.
24. niteagent.com, "MCP Server Performance Benchmarking: What to Measure, What the Numbers Say", 2026.
25. channel.tel, "MCP Servers in Production: Observability from Day One", 2026.
26. dev.to, "Centralising tool access with Bifrost MCP gateway", 2026.
27. dibi8.com, "Claude Code MCP Advanced 2026: The 10-Server Production Stack", 2026.
28. ScaleKit, "What Is Enterprise-Managed Authorization for MCP?", 2026.
29. mcp.institute, "Performance Benchmarks Across MCP Frameworks", 2026.
30. openobserve.ai, "MCP Server Observability: How to Trace, Monitor, and Debug", 2026.
31. JSON-RPC 2.0 Specification, "JSON-RPC 2.0", 2010.
32. IETF RFC 9207, "OAuth 2.0 Issuer Identification", 2022.
33. IETF RFC 8693, "Token Exchange", 2020.
34. IETF RFC 7523, "JWT Bearer Token Profiles", 2015.
35. IETF RFC 7636, "Proof Key for Code Exchange (PKCE)", 2015.
36. OAuth Working Group, "Dynamic Client Registration (DCR) Security Considerations", 2024.
37. Anthropic, "MCP EMA Announcement", 2026.
38. Docker, "Docker MCP Catalog: Signed Images & SBOMs", 2025.
39. OWASP, "MCP Security Cheat Sheet", 2026.
40. Microsoft, "MCP Security Documentation", 2026.

---

> **一句话总结**：MCP 的真正价值不在于"让模型变强"，而在于**把杂乱无章的工具对接，变成一套可治理、可审计、可扩展的协议**。把它当基础设施来设计，它就能撑起下一代 Agent 系统；把它当银弹来崇拜，它就只是又一层华丽的胶水。
