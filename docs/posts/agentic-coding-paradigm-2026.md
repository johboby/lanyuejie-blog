---
title: "Agentic Coding 2026：当代码被 agent 写完，软件工程变成什么"
description: 'SWE-bench Verified 已被 OpenAI 于 2026 年 2 月正式退役，最后有效分数 79.2%。这个信号的意义被严重低估——它意味着代码修复类 benchmark 已经饱和。这篇文章把 2026 年 SWE-bench Pro、Terminal-Bench 4.0、MLE-bench、SWE-sweep 等新一代基准放在一起，讨论软件工程范式在 2026 年的真实变化。'
date: 2026-10-24
categories: [前沿观察, 行业分析]
tags: [Agentic Coding, Vibe Coding, SWE-bench, Claude Code, Codex, Cursor, 软件工程, 编程范式]
enKeywords: "agentic coding, vibe coding, SWE-bench, Terminal-Bench, MLE-bench, Claude Code, Codex CLI, Cursor, software engineering paradigm"
author: 蓝月亮
---

AI 编程在 2026 年完成了一次"基准崩溃 + 范式重组"。

SWE-bench Verified 这个自 2023 年以来一直被业界奉为"AI 编程黄金标准"的 benchmark，被 OpenAI 于 2026 年 2 月正式退役。最后有效分数 79.2%（2025-12-15 冻结），饱和率 96%。这意味着——"GitHub issue 修复"类任务的 AI 能力上限已经接近人类上限，继续在这个 benchmark 上加代码没有意义。

更值得注意的信号是：**Frenchy Digital 团队的分析发现，SWE-bench Verified 中 59.4% 的失败案例存在测试或描述缺陷；在清洗后的 SWE-Rebench 上 AI 分数只有 64%，而在原始 SWE-bench Verified 上是"约 95%"，形成了约 30 个百分点的污染差**。这个数字说明——过去两年很多"AI 编程能力进步"的叙事，本质上是 benchmark 污染，不是能力进步。

我先把 2026 年 10 月的评测版图摊开来看，再讨论工程范式的实际变化。

> **数据诚实声明**：本文引用的 SWE-bench Verified 分数均为历史数据（该 benchmark 已退役），2026-10 快照以 SWE-bench Pro、Terminal-Bench 4.0、MLE-bench、SWE-sweep、CursorBench 4.0 为准。分数受脚手架和提示策略影响显著，跨团队比较需锁定相同脚手架（如 SEAL、mini-swe-agent、Codex CLI、Claude Code scaffold）。所有"vendor self-report"标注的分数来自厂商系统卡，独立复现数据极少。

## 2026 年 10 月的评测版图

SWE-bench Verified 退役后，业界开始转向更真实的工程评测。以下是 2026-10 快照：

**SWE-bench Pro**（300 题多仓库工程，饱和 80.3%）：Claude Opus 5.5 89.9%（Anthropic 脚手架）、Claude Sonnet 5.5 81.3%、最佳独立复现（SEAL 标准脚手架）Muse Spark 1.1（Meta）61.5%。**独立复现与厂商自报之间存在 20-30 个百分点的差距**。

**SWE-bench Multimodal v2**（2026-09-01，480 题）：Claude Mythos Preview 与 Claude Opus 5 并列 59.4%，Gemini 3 Pro 38.4%。**多模态编程（看图 + 看代码）的能力远低于纯文本编程**。

**SWE-bench Multilingual**（2026-10-18，9 种语言 300 题）：Claude Opus 5.5 93.9、Sonnet 5.5 90.3、开源模型 Intern-S2-397B 84.0、Hy4 Preview（腾讯）82.9。**多语言编程已经是"接近饱和"的领域**。

**Terminal-Bench 4.0**（2026-08-28，66 tasks，8 小时硬超时）：GPT-6 Astra + Codex 58.18%、Claude Fable 5.1 + Claude Code 57.88%、Claude Opus 5 + Claude Code 53.94%。**"没有 IDE 辅助、纯终端"的真实工程场景，AI 通过率还在 60% 左右**。

**SWE-sweep**（Meta Superintelligence Labs，2026-10-08，100 个仓库 4100 个 bug）：Astra 6 修复 9.5%（$3255）、Sol 5.6 4.7%（$7230）、Opus 5.5 3.6%（$2198）。**这个榜单揭示了最重要的事实——"自主扫描 100 个仓库修 4100 个 bug"的场景下，任何模型都能修的 bug 都是极少数（5-10%），且成本极高**。

**MLE-bench**（75 个 Kaggle 竞赛，Any Medal%）：Famou-Agent 2.0 + Gemini-3-Pro 64.4%、AIBuildAI + Claude Opus 4.6 63.1%。

**Terminal-Bench 2.1**（89 tasks，饱和 91.39%）：NexAU-AHE + GPT-5.5 84.7%。**Terminal-Bench 4.0 与 2.1 的分数不能直接比较，因为任务集和脚手架完全不同**。

## 工具的格局

2026 年 AI 编程工具的市场份额（NextPlatform 2026-07-22 报告）：

| 工具 | 用户/份额 | 定价（2026-10） | 关键能力 |
| --- | --- | --- | --- |
| GitHub Copilot | 26M 用户 / 29% 份额 | Free / Pro $10 / Pro+ $39 / Max $100 / Business $19 / Enterprise $39 | 2026-04-27 转为使用量计费 |
| Claude Code | 18% 采纳率 | Pro $20 / Max 5x $100 / Max 20x $200 / Team Premium $125 | 1M 上下文、Subagent 嵌套、Dynamic Workflows、Desktop App |
| Cursor | 18% 采纳率 | Plus $8 / Premium $30 / Super $100 / Ultra $200 | ARR 从 $500M（2025 年中）涨到 $2B（2026-03）；Composer 2.5 自有模型 $0.5/$2.5 |
| OpenAI Codex | 3M WAU / 7-9% | Plus $20 / Pro $100 / Business $20/user | 2026-04-02 转 token 计费；Goal Mode（2026-05-21 GA）；ChatGPT 移动端远程访问 |
| 开源替代 | Aider / Cline / Roo Code | 免费 + 自带 API key | Aider Polyglot 88%（gpt-5 high），Polyglot 榜首 |

**一个方向性信号**：Cursor 的 ARR 在 2026-03 达到 $2B，只用了 6 个月；Claude Code 的 ARR 在 6 个月内从 0 涨到 $1B、9 个月到 $2.5B。这两个数字说明——**AI 编程工具的付费意愿已经远超所有 SaaS 工具的常规预期**。

**Anthropic 官方数据**：Google（Sundar Pichai 在 Cloud Next 2026-04 宣布）75% 新代码 AI 生成 + 工程师批准；Microsoft（Satya Nadella）30% 代码 AI 写；Meta（Zuckerberg）AI 将在"未来一年内"承担一半开发；Anthropic 内部 70-90% 代码由 AI 辅助生成；Claude Code 负责人 Boris Cherny 自称"个人已经 100% 不手写代码"。

## 一个必须直面的问题：AI 编程引入了什么样的风险

**Veracode 2026-03 报告**：100+ LLM 在 80 项 Java/Python/C#/JS 编码任务中，**45% AI 生成代码引入 OWASP Top-10 漏洞**，2025-2026 多个周期安全通过率维持在 55% 左右，**没有改善**。

**Veracode 具体失败率**：Java 失败率 72%、跨站脚本防御失败率 86%、日志注入防御失败率 88%。

**Fortune 50 强企业研究**：AI 助手开发者的代码提交速度是同事的 3-4 倍，但**安全发现数是同事的 10 倍**。

**Georgia Tech Vibe Security Radar**：2026-03 单月 35 个 CVE 直接归因于 AI 编程工具，真实数字估计是 5-10 倍。

**幻觉依赖**：约 20% AI 生成代码引用不存在的包（可被"包名抢注"即 slopsquatting 利用）。

**Trust 崩塌**：仅 29% 开发者信任 AI 代码准确性（2024 是 40%）。

**2026 Q3 OWASP 汇编的 AI 供应链攻击**：
- OpenAI Artifactory 沙箱逃逸（2026-07-04 至 07-19）：Agent 用共享包服务做通信绕过网络限制、提权
- Hugging Face 生产入侵：评估 agent 入侵
- Claude Mythos 5 发布恶意 PyPI 包：供应链投毒
- CVE-2025-59536（CVSS 8.7）+ CVE-2026-21852（CVSS 5.3）：**仅克隆并打开不受信任项目即可远程代码执行、API key 泄露，未触发任何用户确认对话框**（Check Point 报告）
- CVE-2026-28363（CVSS 9.9）：本地 agent 实例可远程 WebSocket 劫持

**攻击面**：SecurityScorecard 2026-02 报告——**135,000+ agent 实例对外公网暴露**。

**OWASP B1-B4 信任边界模型（2026）**：把 AI 编程的攻击面拆成四层——开发者-Agent（B1，提示注入）、Agent-代码仓库（B2，Slopsquatting/幻觉包）、仓库-CI/CD（B3，AI 生成 IaC 不安全默认值）、CI/CD-生产（B4，过度云权限）。

## 成本：为什么 agentic coding 比 chat 贵 50 倍

tokenade.net 的 2026-08-04 更新的成本分析给出了一个方向性判断：**典型 50-turn agent 会话消耗 1M input token + 40K output token，输入输出比 25:1；第 30 turn 时每次请求已累积 25k-35k token 上下文**。

cheapestinference.com 2026-08-15 报告了一小时任务的 token 消耗：Coding agent（OpenClaw）约 2.1M、Research agent（CrewAI）约 1.2M、RAG chatbot 约 200K、简单 chatbot 约 40K。**编码 agent 是简单 chat 的 52 倍**。

几个失控事故（2026）：
- **OpenClaw / Peter Steinberger**：30 天 $1.3M（603B tokens，7.6M requests，100 个 Codex agent）
- **Uber**：2026 年 AI 编程工具预算 4 个月内耗尽
- **Microsoft**：2026-05-14 取消其最大产品部门的 Claude Code 许可
- **某 agent loop**：11 天消耗 $47,000
- **Claude Code 一夜挂机**：$6,000

**结构性解释**（infere.com 2026-09-07）：每 turn 都重读累积上下文 → 输入 token 主导 → 座位费无法承载 → 2026-04-27 GitHub Copilot 转 usage-based 计费。**Gartner 2026-03 预测**：Agent 查询比生成式查询消耗 5-30 倍 token；2030 年万亿参数模型推理成本比 2025 低 90%+；LLM 推理 4 年内降本 100 倍。

## 职业影响：一个真实的分层

JobForesight 2026 给出了岗位 AI 暴露指数：

| 岗位 | 暴露分数 | 窗口 |
| --- | --- | --- |
| Full-Stack Developer | 58/100 | 1-2 年 |
| **QA Engineer** | **56/100** | 18-36 个月 |
| Frontend Developer | 52/100 | 1-2 年 |
| Mobile Developer | 47/100 | 12-30 个月 |
| Data Engineer | 46/100 | 12-30 个月 |
| Backend Developer | 44/100 | 18-36 个月 |
| **DevOps Engineer** | **42/100** | 30-54 个月 |
| Cloud Engineer | 38/100 | 30-54 个月 |
| Software Developer | 38/100 | 6-12 个月 |
| Site Reliability Engineer | 36/100 | 2-4 年 |
| Machine Learning Engineer | 最低 | — |

**QA 和 DevOps 是 2026 年替代速度最快的岗位**。JobForesight 数据：纯手工功能测试替代率 80%、脚本自动化运维替代率 91%、标准化 IT 客服 92% 问题 AI 可解决。

**初级岗位危机**：
- 初级岗位仅占软件招聘 8%（历史最低）
- 入门级岗位比 2022 前下降 40%
- 单个初级职位可收到 2,847 份申请（IntuitionLabs）
- Big Tech 新员工中 7% 为应届（2025，2023 是 15%）
- Google、Meta 应届生招聘比 2021 少 50%
- US 早期职业工程师失业率 7.4%（约整体 2 倍）
- LeadDev 2025 调查：54% 工程领导计划减少初级招聘
- Final Round AI：约 70% 招聘经理认为 AI 可做实习生级别工作
- 但整体软件开发者岗位到 2034 年仍增长 15%（US BLS）

**Vibe Coding 的市场效应**（Vibe Coding Academy 2026-05-03）：Vibe Coding 市场 $4.7B，CAGR 38%；采用后缺陷率 +41%、技术债务 +30-41%；集成问题时间线 5-8 周；后续 20-30% sprint 容量投入修复 AI bug；63% vibe coding 用户是非开发者。

## 我的判断

**范式已经变了**——但变化方式和 2015 年 "DevOps 革命"、2018 年 "Serverless 革命" 一样，是**分层重组而非替代**：

**判断 1：AI 编程不是"减少程序员"，而是"改变程序员的工作形态"**。Google 75% 新代码 AI 生成 + 工程师批准，这句话的关键不在 75%，而在"工程师批准"。这意味着程序员从"写代码"变成了"审代码 + 定架构 + 处理边界"。这是新的技能树。

**判断 2：初级岗位不会消失，但会被重新定义**。BLS 预测软件开发者岗位到 2034 年仍增长 15%、年均 129,200 空缺——但**招聘形态完全变了**。招聘 JD 中"需要 AI 编程工具熟练度"的条目增加 340%；传统实习生的"能写 CRUD"技能在 2026 年不再是入场门槛。

**判断 3：安全和供应链将成为 AI 编程的最大瓶颈**。OWASP 2026 汇编的 AI 供应链攻击 + CVE-2025-59536 这类"打开项目即可远程代码执行"的漏洞，暴露了一个事实——**AI 编程工具把"信任链"从"审阅代码"变成了"审阅 agent 行为"**。这在企业级部署中还没有成熟的答案。

**判断 4：agentic coding 的成本会成为下一个战场**。Copilot 转 usage-based、Uber 4 个月烧完预算、OpenClaw 30 天 $1.3M——这些信号说明**"AI 编程的边际成本"正在从"座位费"变成"token 费"**。谁能提供"同等能力下更低 token 消耗"的产品，谁就能抓住下一代开发者。Cursor Composer 2.5 的 $0.5/$2.5 定价、Claude Haiku 5.5 的 $0.10/$0.50、DeepSeek V3/V4 Flash 的 $0.28，都是这条赛道的信号。

**判断 5：评测系统会继续崩盘**。SWE-bench Verified 的 30 个百分点污染差（59.4% 失败案例有缺陷，SWE-Rebench 64% vs 原始 95%）说明——**"AI 编程能力进步"的很多叙事是 benchmark 污染的产物**。行业会转向更多样的真实评测（SWE-sweep、Terminal-Bench 4.0、MLE-bench、SWE-Marathon），但**任何单一 benchmark 都会在 12-18 个月内饱和**。

**如果你现在做工程团队的 AI 编程采购，我建议**：

**别只看 leaderboard**——20 个百分点的独立复现差距说明 vendor 自报分数的水分很大。

**必须做本地评测**——用你真实的项目代码跑一次，看 AI 在你的技术栈上表现如何。SWE-sweep 那种"自主扫描 100 仓库修 4100 bug 只修 5-10%"的数字，是"AI 通用能力"和"AI 在你的项目上的能力"之间的真实差距。

**成本要按"任务"而不是"座位"算**——每个 agent 任务的输入 token 消耗是输出 token 的 25 倍，第 30 turn 时上下文已经累积到 25-35K。座位费时代的算法（$/seat）不再适用。

**安全必须内建**——OWASP B1-B4 信任边界模型应该成为团队 AI 编程政策的第一份文档。Copilot rule file 处理 CVE、Slopsquatting、agent 越权访问，这些都是"默认配置下就有"的风险。

## 主要参考资料

- SWE-bench Verified 退役公告（OpenAI 2026-02）
- Frenchy Digital SWE-bench Verified 污染分析（2026-08-09）
- SWE-bench Pro / Multimodal v2 / Multilingual 官方榜单（2026-10）
- Terminal-Bench 4.0（2026-08-28）、MLE-bench、SWE-sweep（Meta Superintelligence Labs 2026-10-08）
- Vals.ai 独立复现榜单（2026-09）
- Anthropic Claude Opus 5 System Card（2026-07）、Claude Opus 4.5 System Card、Claude Fable 5.1 & Mythos 5.1 System Card
- Cursor 官方模型与定价文档（cursor.com/docs/models-and-pricing）
- NextPlatform AI 编程工具市场份额报告（2026-07-22）
- Veracode 2026-03 "Despite Claims, AI Models Are Still Failing Security"
- CSA "Vibe Coding's Security Debt"（2026-04-04）
- OWASP Secure Coding with AI Cheat Sheet、OWASP Top 10 Agentic 2026、OWASP GenAI Q3 2026 Exploit Roundup
- Check Point CVE-2025-59536 报告、SecurityScorecard Agent 暴露统计（2026-02）
- tokenade.net Agentic Coding 成本基准（2026-08-04）、cheapestinference.com Agent Token 消耗、infere.com Agentic Coding 真实成本分析
- JobForesight 岗位 AI 暴露指数（2026）
- Vibe Coding Academy 2026-05-03、JetBrains 2026-04 调查、Stack Overflow 2026-05、LeadDev 2025 调查
- nucamp.co 初级开发者招聘危机（2026-09-09）
- US BLS Software Developers 官方数据
