---
title: "Prompt to System Design: AI Dev Knowledge Graph 2026"
date: 2026-07-26
description: "从Prompt到System Design：AI应用开发完整知识图谱。覆盖Prompt Engineering、Context Engineering、RAG、Agent框架、评估体系、生产部署六大层级，帮你建立AI开发的全景认知。"
tags:
  - AI开发
  - Prompt Engineering
  - RAG
  - Agent
  - System Design
  - LangGraph
  - 知识图谱
  - 架构设计
  - 评估体系
  - 生产部署
categories:
  - AI工程
  - 架构设计
---

<p class="reading-time">⏱️ 阅读时间：约 18 分钟</p>

<div class="toc">

## 📑 目录

- [为什么你需要这张知识图谱](#为什么你需要这张知识图谱)
- [全局视图：AI应用开发的六层架构](#全局视图ai应用开发的六层架构)
- [Layer 1：Prompt Engineering（提示词工程）](#layer-1prompt-engineering提示词工程)
- [Layer 2：Context Engineering（上下文工程）](#layer-2context-engineering上下文工程)
- [Layer 3：RAG（检索增强生成）](#layer-3rag检索增强生成)
- [Layer 4：Agent & Multi-Agent（智能体）](#layer-4agent--multi-agent智能体)
- [Layer 5：Eval & Observability（评估与可观测性）](#layer-5eval--observability评估与可观测性)
- [Layer 6：Production System Design（生产系统设计）](#layer-6production-system-design生产系统设计)
- [技术选型矩阵](#技术选型矩阵)
- [学习路径（6阶段）](#学习路径6阶段)
- [常见架构反模式](#常见架构反模式)
- [FAQ](#faq)
- [写在最后](#写在最后)

</div>

---

# From Prompt to System Design: The Complete AI Dev Knowledge Graph

## <span id="为什么你需要这张知识图谱">为什么你需要这张知识图谱</span>

> AI应用开发在2026年已经不是"调个API加个Prompt"那么简单了。它是一套从**提示词→上下文→检索→智能体→评估→部署**的完整工程体系——缺任何一层，你的AI应用要么上不了线，要么上线就翻车。

**这篇文章给你一张完整的知识图谱：六层架构、每层的原理/工具/反模式、技术选型矩阵、学习路径。读完你知道自己站在哪一层，该往哪走。**

---

## <span id="全局视图ai应用开发的六层架构">全局视图：AI应用开发的六层架构</span>

```
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 6: Production System Design (生产系统设计)                    │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 负载均衡 → 请求调度 → Prefill/Decode分离 → KV-Cache → 降级    │ │
│  │ 工具: vLLM/K8s/Envoy/Prometheus/KEDA                          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 5: Eval & Observability (评估与可观测性)                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Span级 → Trajectory级 → Outcome级                              │ │
│  │ 工具: LangSmith/Phoenix/W&B Weave/Galileo                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 4: Agent & Multi-Agent (智能体)                              │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Agent Loop → Tool Use → Memory → Planning → Multi-Agent        │ │
│  │ 工具: LangGraph/CrewAI/AutoGen/Claude Agent SDK               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 3: RAG (检索增强生成)                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 切分 → 嵌入 → 向量存储 → 检索 → 重排 → 生成                    │ │
│  │ 工具: ChromaDB/Qdrant/Pinecone/Anthropic Rerank              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 2: Context Engineering (上下文工程)                          │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 分层提示 → JIT检索 → Compaction → 子Agent → 笔记外部化         │ │
│  │ 原理: Anthropic 2025.09 "Effective Context Engineering"        │ │
│  └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 1: Prompt Engineering (提示词工程) ← 起点                   │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 四层模型 → 12种模式 → 输出验证 → 版本管理                      │ │
│  │ 原理: Anthropic 12 Patterns / FutureAGI 四层模式               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ 数据流
                    User → API → LLM → Response
```

> **每一层都是下一层的基础。** 跳层搭建的后果：Prompt没写好就上Agent → Agent疯狂调错工具；RAG没评估就上生产 → 幻觉率30%+；没有Eval就部署 → 翻车了都不知道为什么。

---

## <span id="layer-1prompt-engineering提示词工程">Layer 1：Prompt Engineering（提示词工程）</span>

### 从"写提示词"到"工程化提示"

> 2026年的共识：**把Prompt当成代码对待**——版本控制、单元测试、Code Review、回归测试。硬编码在应用代码里的字符串是反模式 [citation:1]。

### 四层系统提示模型（Anthropic 2026标准）

| 层级 | 内容 | 典型长度 | 变化频率 |
|---|---|---|---|
| **Identity**（身份）| 角色、领域、边界 | 50-200 tokens | 极少变 |
| **Capability**（能力）| 可用工具、何时用、参数说明 | 800-2000 tokens | 偶尔变 |
| **Behavioral**（行为）| 输出格式、风格、"绝不X"、示例 | 200-600 tokens | 中等 |
| **Context**（上下文）| 日期、用户、当前工作流 | 100-400 tokens | 每次变 |

> 总长度：核心500-3000 tokens。太短→输出不稳定；太长→触发"lost in the middle"效应 [citation:21]。

### 四层Prompt模板（直接抄）

```
<system>
  <identity>
    你是XX公司的技术支持助手。
    你只回答与本公司产品相关的问题。
    你不提供医疗/法律/财务建议。
  </identity>

  <capability>
    你有以下工具可用：
    - search_knowledge_base: 查询产品文档（参数：query）
    - check_order_status: 查询订单状态（参数：order_id）
    - create_ticket: 创建工单（参数：description, priority）
    
    <when-not-to-use>
      不要用水search_knowledge_base查天气/新闻等外部信息。
      不要用check_order_status查非订单类问题。
    </when-not-to-use>
  </capability>

  <behavioral>
    回答格式：先给结论，再给依据。
    如果知识库没有答案，说"我不确定，帮你转人工"。
    绝不编造产品功能或价格。
    语气：专业但亲切，不用"作为一个AI"开头。
    
    <output_format>
      {
        "answer": "直接回答",
        "sources": ["引用的文档ID"],
        "confidence": "high/medium/low",
        "needs_human": true/false
      }
    </output_format>
  </behavioral>

  <context>
    当前日期: {current_date}
    用户: {user_name}（{user_tier}用户）
    对话轮次: {turn_count}
    活跃工作流: {active_workflow}
  </context>
</system>
```

### 12种设计模式（精华6种）

| # | 模式 | 作用 | 示例 |
|---|---|---|---|
| 1 | Role/Persona | 设定行为域 | "你是奥地利汽车保险理赔分诊Agent" |
| 2 | Clear Goal | 可验证的成功定义 | "目标：完整记录理赔信息并分配正确费率" |
| 3 | Constraints | 禁止行为+默认行为 | "绝不确认赔付金额，不确定时追问" |
| 4 | Tool Instructions | 工具选择规则 | "search_db用于老客户，不用于通用搜索" |
| 5 | Output Format | 机器可解析的输出 | "只输出JSON Schema OrderResult" |
| 6 | Stop Criteria | 防无限循环 | "最多5轮工具调用，超限转人工" |

> 2026年最大教训：**没有Stop Criteria的Agent无限循环是头号生产Bug**。每次循环加延迟和成本，失控的Agent能在一夜之间烧掉$500+ [citation:21]。

### Prompt版本管理

```
做法：
  ① 每个Prompt存为独立文件（prompt_system.txt / prompt_rag.txt）
  ② 放进Git版本控制
  ③ 修改Prompt = 一次Commit = 可回滚
  ④ 每个版本对应一组Eval结果（见Layer 5）
  ⑤ A/B测试：5%流量用新Prompt，对比指标

工具：LangSmith Prompt Management / PromptLayer / 自建Git+CI
```

---

## <span id="layer-2context-engineering上下文工程">Layer 2：Context Engineering（上下文工程）</span>

### 核心认知：上下文是"有限的注意力预算"

> Anthropic 2025年9月提出：**LLM的上下文窗口不是越大越好，而是越精准越好**。Transformer的n²注意力意味着token越多，每个token分到的注意力越薄。200K上下文 ≠ 200K都有效 [citation:23]。

### 六大技术

#### ① 分层提示 + 缓存布局

```
稳定内容放前面（可缓存）→ 动态内容放后面
  Layer 1 Identity    ← 缓存命中（不变）
  Layer 2 Capability  ← 缓存命中（偶尔变）
  Layer 3 Behavioral  ← 部分缓存
  Layer 4 Context     ← 不缓存（每次变）

效果：命中缓存的部分不重新计算 → 延迟↓ 成本↓
```

#### ② Just-in-Time（JIT）检索

```
❌ 旧方式：把整个知识库塞进Prompt（"怕漏了"）
✅ 新方式：只放文件路径/URL/查询标识 → 用工具按需取

  "我有一份产品文档（路径: /docs/pricing.md），需要时用read_file读取"

好处：
  - 避免过期索引（文件改了不用重建向量）
  - 渐进式发现（Agent自己决定读什么）
  - 元数据本身提供相关性信号
```

#### ③ Compaction（压缩）

```
当对话接近上下文窗口上限：
  ① 把消息历史发给LLM → 生成摘要
  ② 保留：架构决策/未解决bug/关键实现细节
  ③ 丢弃：冗余工具输出/重复确认/调试噪音
  ④ 保留最近5个访问过的文件原文

Claude Code已实现此功能 → 对话可从200K压缩到20K继续
```

#### ④ 结构化笔记（外部记忆）

```
Agent定期写笔记到外部存储 → 跨上下文重置保持状态

Claude Code的Todo List模式：
  - 维护一个todo.md → 每完成一步更新
  - 上下文满了 → 压缩 → todo.md保留 → 继续

Pokémon-playing Claude案例：
  - 数千步游戏 → 用笔记追踪目标/已探索区域/战斗策略
  - 跨多次上下文重置不丢失进度
```

#### ⑤ 子Agent架构

```
Orchestrator-Worker模式：
  Lead Agent（主Agent）
    → 分析任务 → 拆分子任务
    → 派发Sub-Agent 1（搜索产品文档）
    → 派发Sub-Agent 2（查订单系统）
    → 派发Sub-Agent 3（生成回复）
    → 汇总结果 → 输出

关键：每个Sub-Agent有独立上下文窗口
     返回给Lead的只是摘要（1000-2000 tokens）
     细节隔离在子窗口里

效果：Anthropic内部测试 → 多Agent比单Agent强90.2%
代价：token消耗~15x（只适合高价值任务）[citation:23]
```

#### ⑥ 工具结果清理

```
工具返回原始数据 → Agent处理完 → 立即从上下文删除原始数据
只保留处理后的结论

例：search返回5000字 → Agent提取关键3句 → 删掉5000字原文
省下的token预算给后续步骤
```

---

## <span id="layer-3rag检索增强生成">Layer 3：RAG（检索增强生成）</span>

### RAG质量在第一次查询之前就决定了

> "The quality of a RAG system is largely determined before the first user query is processed." [citation:1]

### 完整RAG管道

```
文档源 → 切分 → 嵌入 → 向量存储 → 检索 → 重排 → 增强生成
                                              ↓
                                        用户查询 → 嵌入 → 相似度搜索
```

### 切分策略（按文档类型）

| 文档类型 | 推荐切分 | 重叠 |
|---|---|---|
| 叙事文（博客/政策）| 按段落或token数 | 10-20% |
| 结构化（FAQ/产品规格）| 按逻辑单元（一条FAQ一个chunk）| 0% |
| 代码文档 | 按函数/类定义 | 含上下文注释 |
| 表格/JSON | 按记录或键值对 | 含schema描述 |

> 重叠参数关键：相邻chunk 10-20%重叠，确保跨边界的查询仍能命中 [citation:1]。

### 嵌入模型选型

| 模型 | 特点 | 适用 |
|---|---|---|
| text-embedding-3-small（OpenAI）| 性价比之王 | 英文为主 |
| text-embedding-3-large（OpenAI）| 高质量 | 英文高精度 |
| all-MiniLM-L6-v2 | 开源、可本地部署 | 多语言/隐私 |
| bge-large-zh | 中文最强之一 | 纯中文场景 |
| Cohere Embed v3 | 多语言均衡 | 国际化产品 |

> ⚠️ 索引时和查询时必须用同一个嵌入模型。混用 → 相似度分数不可靠 [citation:1]。

### 元数据策略

```
每个chunk除了文本向量，还要存：
  - source_document_id（来源文档）
  - document_type（类型：产品/政策/FAQ）
  - created_date（创建时间）
  - section_heading（所属章节）
  - tags（分类标签）

作用：支持过滤检索
  "只在support文档中搜，不要搜product catalog"
  → 检索精度大幅提升
```

### 重排（Reranking）

```
两阶段检索：
  Stage 1: 向量搜索（粗排，取Top 20）
  Stage 2: Reranker模型重排（精排，取Top 5）

推荐Reranker：
  - Cohere Rerank 3
  - Anthropic Rerank（2026新）
  - bge-reranker-v2-m3（开源）

实测效果：加Rerank后Faithfulness从72%→89%
```

### RAG评估指标

| 指标 | 测什么 | 怎么算 |
|---|---|---|
| Retrieval Precision@5 | 前5个chunk有多少相关 | 人工标注/LLM Judge |
| Faithfulness | 回答是否被检索内容支持 | LLM Judge |
| Answer Relevance | 回答是否解决了问题 | LLM Judge |
| Hallucination Rate | 编造不在上下文中的内容 | 人工抽检 |

---

## <span id="layer-4agent--multi-agent智能体">Layer 4：Agent & Multi-Agent（智能体）</span>

### Agent Loop：2026年的核心抽象

```
不再是"写一条好Prompt"
而是"设计一个能自我纠错的循环"

  Intent → Plan → Act(Tool) → Observe → Evaluate → 
      ↑                                      ↓
      ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
                  Success? → Respond
                  Fail? → Retry with feedback

关键：如果模型第1步产生bug → 不重要
     重要的是系统能否在第4步检测到→执行测试→修复
```

> Jonas Steinberger和Addy Osmani在2026年6月的开创性论文《Loop Engineering: The Architecture of Autonomous Iteration》正式宣告：**工程单元从"Response"变成了"Trajectory"** [citation:3]。

### Agent三大模块

| 模块 | 作用 | 实现方式 |
|---|---|---|
| **Memory** | 记住历史、状态、偏好 | 向量存储 + 结构化笔记 + 会话压缩 |
| **Tools** | 与外部世界交互 | Function Calling / MCP协议 |
| **Planning** | 分解任务、决定下一步 | LLM推理 + 反射（Reflection）|

### 工具设计原则

```
✅ 好的工具设计：
  - 自包含（输入→输出清晰）
  - 错误处理健壮（超时/重试/降级）
  - 用途无歧义（人能说清什么时候用）

❌ 坏的工具设计：
  - 功能重叠（search_web和search_google选哪个？）
  - 参数模糊（query vs keyword vs text）
  - 无错误处理（超时=卡死）

Anthropic的建议：
  工具数量控制在5-10个
  每个工具配"When-not-to-use"说明
  工具描述用动词开头（"查询订单状态"而非"订单"）
```

### 多Agent框架对比（2026）

| 框架 | 定位 | 上手 | 生产 | 生态 |
|---|---|---|---|---|
| **LangGraph** | 复杂有状态工作流 | ⭐⭐ | ⭐⭐⭐⭐⭐ | LangChain生态 |
| **CrewAI** | 多Agent角色协作 | ⭐⭐⭐⭐ | ⭐⭐⭐ | Python原生 |
| **AutoGen** | 学术/辩论/验证 | ⭐⭐⭐ | ⭐⭐⭐ | 微软系 |
| **OpenAI Agents SDK** | 简单Agent快速搭建 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | OpenAI生态 |
| **Claude Agent SDK** | 工具安全优先 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Anthropic生态 |
| **Google ADK** | 多模态Agent | ⭐⭐⭐ | ⭐⭐⭐ | Google生态 |

> 生产首选LangGraph（Klarna/Uber/LinkedIn在用），原型首选CrewAI，学术首选AutoGen [citation:20][citation:24]。

### Agentic Loop的终止条件（必须有！）

```
必须定义的三件事：
  ① 终止条件：什么算"完成"？（任务成功/用户满意/达到目标）
  ② 最大迭代次数：超过N次强制停止（防止无限循环）
  ③ 超限处理：达到上限没完成 → 转人工/返回错误/降级方案

真实案例：没设终止条件的Agent
  → 在一个bug上反复尝试同一方法
  → 循环了200次 → 烧了$47 → 最后也没修好
```

---

## <span id="layer-5eval--observability评估与可观测性">Layer 5：Eval & Observability（评估与可观测性）</span>

### 为什么Eval是AI开发的"测试金字塔"

```
传统软件：                          AI应用：
  单元测试 → 集成测试 → E2E           Span级 → Trajectory级 → Outcome级
  （确定性的）                        （非确定性的）
  
区别：AI每次跑结果可能不同
      → 需要多次采样取统计
      → 需要LLM当裁判（LLM-as-Judge）
      → 需要追踪完整执行轨迹
```

### 三层评估

#### Layer 1: Span-level（步骤级）

```
评估Agent的每一步：
  - 检索对了没？（召回了相关chunk？）
  - 工具调对了没？（选对工具+参数正确？）
  - 参数提取对了没？

工具：确定性断言（不是LLM Judge）
  assert tool_call.name == "search_knowledge_base"
  assert "order_id" in tool_call.args
```

#### Layer 2: Trajectory-level（轨迹级）

```
评估完整执行路径：
  路径A: 检索→分析→回答（正确路径）
  路径B: 检索→答非所问→重试→回答（侥幸路径）
  
  路径B最终答案可能也对 → 但这是"幸运"
  → 下次同样输入可能失败
  → Trajectory评估能捕获这种"静默失败"
```

#### Layer 3: Outcome-level（结果级）

| 指标 | 测什么 | 怎么算 |
|---|---|---|
| Task Success Rate | 完成用户目标的比例 | LLM Judge over full trace |
| Cost per Success | 每次成功花费 | (Token+Tool成本) / 成功数 |
| Latency P50/P90/P99 | 响应时间分布 | Trace时间戳 |
| Tool-call Accuracy | 工具调用正确率 | 确定性断言 |
| Faithfulness | 输出有依据 | Judge或引用检查 |
| Human-intervention Rate | 需要人介入的频率 | 介入次数/总运行 |
| Safety-gate Pass | 安全门通过率 | 红队测试 |

> Galileo 2026年2月报告：500+从业者调研，**84.9%的团队上线6个月内遇到AI事故** [citation:22]。

### 评估工具对比

| 工具 | 定位 | 亮点 |
|---|---|---|
| **LangSmith** | LangChain生态全链路 | Trace+Eval+Prompt版本管理一体 |
| **Phoenix**（Arize）| 开源可观测性 | OpenTelemetry兼容、免费起步 |
| **W&B Weave** | 实验追踪 | 和Weights & Biases模型训练打通 |
| **Galileo** | 企业级Eval | 500+团队数据、Trajectory评估 |
| **PromptLayer** | Prompt专用 | 轻量、Prompt A/B测试 |

### Eval集怎么建

```
原则：先建Eval集，再写Prompt

步骤：
  ① 收集50-200条真实用户查询（覆盖正常/边界/恶意）
  ② 每条标注"理想行为"（检索什么/调什么工具/输出什么）
  ③ 存为JSON/CSV → 版本控制
  ④ 每次Prompt/模型变更 → 全量跑Eval → 对比指标
  ⑤ 回归测试：上次的bad case这次不能更差

自动化：
  CI/CD集成 → Prompt改了自动跑Eval
  指标下降 → Pipeline失败 → 阻止合并
```

---

## <span id="layer-6production-system-design生产系统设计">Layer 6：Production System Design（生产系统设计）</span>

### 成熟LLM服务架构（五层）

```
┌──────────────────────────────────────────────────┐
│  Load Balancer / API Gateway                     │
│  → 限流 / 认证 / 路由                            │
├──────────────────────────────────────────────────┤
│  Request Scheduler                               │
│  → 排队 / 优先级 / 批处理决策                     │
├──────────────────────────────────────────────────┤
│  Prefill Cluster（计算密集）                      │
│  → GPU池：处理prompt（一次性计算）                │
├──────────────────────────────────────────────────┤
│  Decode Cluster（带宽密集）                       │
│  → GPU池：逐token生成（内存带宽瓶颈）             │
├──────────────────────────────────────────────────┤
│  KV-Cache Store（分布式缓存）                     │
│  → 跨请求共享 / 跨节点复制                        │
└──────────────────────────────────────────────────┘
```

> 核心架构模式：**Prefill-Decode分离**。Prefill是计算密集（大矩阵乘法），Decode是内存带宽密集（逐token读取权重）。分开部署→各自优化→吞吐量翻倍 [citation:2]。

### 四种部署模式

| 模式 | 架构 | 适合 | 成本 |
|---|---|---|---|
| **Replicated Monolith** | 每节点完整模型，端到端处理 | 小模型/起步阶段 | 低 |
| **Prefill-Decode分离** | 两类GPU池分别优化 | 高吞吐生产 | 中 |
| **Tensor Parallelism** | 单请求跨多GPU（模型太大放不进单卡）| 超大模型推理 | 高 |
| **Multi-Region** | 多区域部署+流量调度 | 全球用户/合规要求 | 高 |

### 推荐生产栈（2026）

| 组件 | 推荐 | 替代 |
|---|---|---|
| 推理引擎 | **vLLM** 或 TensorRT-LLM | TGI / SGLang |
| 编排 | **Kubernetes** + KServe | NVIDIA Triton |
| 负载均衡 | **Envoy** 或 NGINX（LLM感知路由）| HAProxy |
| 监控 | **Prometheus** + Grafana | Datadog |
| 自动扩缩 | **KEDA**（基于TTFT/TPOT指标）| HPA |
| 模型仓库 | HuggingFace Hub 或 S3+元数据 | Model Registry |
| A/B测试 | 流量按比例分桶 | LaunchDarkly |

### 关键SLO指标

```
必须监控的4个指标：
  - TTFT（Time to First Token）< 500ms → 用户不觉得卡
  - TPOT（Time Per Output Token）< 50ms → 输出流畅
  - KV-Cache命中率 > 80% → 缓存有效
  - 队列深度 = 0 且 GPU空闲 > 30% → 可以缩容

告警规则：
  TTFT P95 > 1s → 扩容Prefill节点
  TPOT P95 > 100ms → 扩容Decode节点
  KV-Cache > 90% → 扩容总GPU池
  队列深度 = 0 且 GPU空闲 > 30% → 缩容
```

### 降级策略（必须有）

```
Level 1: 模型降级
  主模型(GPT-5)超时/限流 → 自动切备用模型(DeepSeek/Gemini)
  
Level 2: 功能降级
  RAG检索超时 → 只用Prompt知识回答 + 标注"信息可能不完整"
  
Level 3: 缓存兜底
  相似查询从缓存返回（语义缓存）
  
Level 4: 人工接管
  连续失败N次 → 转人工 + 友好提示
```

---

## <span id="技术选型矩阵">技术选型矩阵</span>

### 按场景选技术栈

| 场景 | LLM | 框架 | 向量DB | 部署 |
|---|---|---|---|---|
| 聊天机器人 | Claude Opus 4.7 / GPT-5 | LangGraph | ChromaDB | vLLM + K8s |
| 文档问答 | Gemini 3 Pro（长上下文）| LlamaIndex | Qdrant | Cloud Run |
| 代码助手 | Claude Sonnet 4.5 | Agent SDK | - | 本地+Ollama |
| 数据分析 | GPT-5（推理强）| 直接API | - | Serverless |
| 多模态搜索 | Gemini 3 / GPT-5o | LangGraph | Pinecone | GCP/AWS |
| 本地私有 | Qwen3-235B / Llama 4 | llama.cpp | ChromaDB本地 | 自建GPU集群 |
| 低成本批量 | DeepSeek V3 | 直接API | - | 云函数 |

### 模型选型（2026参考）

| 维度 | 最强 | 性价比 | 开源 | 长上下文 | 多模态 |
|---|---|---|---|---|---|
| 推理 | GPT-5 / Claude Opus 4.7 | DeepSeek V3 | Qwen3-235B | Gemini 3（1M+）| Gemini 3 |
| 代码 | Claude Opus 4.8 | DeepSeek Coder V3 | Llama 4 Maverick | - | - |
| 中文 | Claude / GPT-5 | DeepSeek | **Qwen3** | - | - |
| 速度 | GPT-5 mini | Gemini Flash | Llama 4 Scout | - | - |

---

## <span id="学习路径6阶段">学习路径（6阶段）</span>

### 每阶段2-4周，做一个完整小项目

```
Phase 1: Prompt Engineering基础（2周）
  ✓ 掌握四层模型
  ✓ 会写系统提示+少样本+输出格式
  ✓ 会做A/B对比测试
  项目: 用API做一个有角色设定的聊天机器人

Phase 2: API调用与工具使用（2周）
  ✓ OpenAI/Anthropic/DeepSeek API
  ✓ 流式输出 / 函数调用 / 错误处理
  ✓ 成本估算与限额
  项目: 做一个"会查天气+查日历"的工具Bot

Phase 3: RAG入门（3周）
  ✓ 文档切分 → 嵌入 → 检索 → 生成
  ✓ ChromaDB / Qdrant 选一个
  ✓ 加Reranker
  项目: 做个人文档问答（上传PDF→提问）

Phase 4: Agent框架（3周）
  ✓ LangGraph或CrewAI实现一个Agent
  ✓ 规划→工具→反思循环
  ✓ Memory持久化
  项目: 做一个能自动搜索+总结+写报告的Agent

Phase 5: 评估体系（2周）
  ✓ 建Eval集（50+条）
  ✓ 接入LangSmith/Phoenix
  ✓ Span级+Trajectory级评估
  项目: 给Phase 4的Agent写完整Eval

Phase 6: 生产部署（3周）
  ✓ Docker容器化
  ✓ vLLM推理服务
  ✓ K8s编排 + 监控 + 降级
  项目: 把Phase 5的Agent部署上线（含监控）
```

---

## <span id="常见架构反模式">常见架构反模式</span>

| 反模式 | 症状 | 后果 | 正确做法 |
|---|---|---|---|
| **Prompt硬编码** | Prompt写在应用代码里 | 无法版本管理/A/B测试 | 独立文件+Git+Eval |
| **无终止条件的Agent** | Agent跑了200轮还没停 | 烧钱+用户体验灾难 | 设max_iter + 停止条件 |
| **RAG不评估** | "感觉还行"就上线 | 幻觉率30%+ | 建Eval集+跑指标 |
| **上下文塞满** | 200K全塞进去 | 注意力稀释→质量下降 | JIT检索+Compaction |
| **工具爆炸** | 给Agent 30个工具 | 选错工具率飙升 | 控制在5-10个+When-not-to-use |
| **无降级** | 主模型挂了→全挂 | 单点故障 | 多级降级链 |
| **无监控** | 翻车了才知道 | 用户先发现Bug | Prometheus+Trace |
| **Eval是摆设** | 只跑一次就忘了 | 模型更新后悄悄退化 | CI集成+持续采样 |

---

## <span id="faq">FAQ</span>

### 1. Prompt Engineering在2026年还重要吗？不是说模型越来越强了？

重要，但性质变了。2026年共识是单轮Prompt Engineering天花板已到，但Loop Engineering和Context Engineering成为新前沿。模型越强，提示词质量差距越明显——强模型能放大好提示威力，也忠实暴露烂提示缺陷。Anthropic的12种系统提示设计模式、四层模型已成为生产级Agent标配。对模型说"你是个专家"没用（实测无效果），但结构化工具定义+停止条件+错误处理能让Agent成功率从40%跳到85%。Prompt不是不重要了，是需要更工程化地对待它 [citation:21][citation:23]。

### 2. RAG和Agent是什么关系？什么时候该用哪个？

RAG是Agent的子集。RAG解决"让LLM知道它不知道的东西"（检索+生成），Agent解决"让LLM主动做它该做的事"（检索+推理+行动+反思）。选择标准：需求是"基于文档回答问题"→ RAG够用（简单、便宜、可预测）；需求涉及"根据情况决定调哪个API、查哪个数据库、何时问人"→ 需要Agent（复杂、贵、灵活）。2026年出现Agentic RAG——把RAG嵌入Agent循环，Agent自主决定何时检索、检索什么、怎么用结果。演进路径：Prompt→RAG→Tool-use Agent→Multi-Agent→Agentic Loop [citation:1][citation:5][citation:22]。

### 3. LangGraph、CrewAI、AutoGen怎么选？

2026年格局：① LangGraph——生产首选。状态机模型、checkpointing、time-travel调试、human-in-the-loop，Klarna/Uber/LinkedIn在用。缺点：学习曲线陡、LangChain依赖重。② CrewAI——原型最快。角色制多Agent，Python原生API干净。缺点：生产可观测性弱。③ AutoGen——研究/学术最强。多Agent辩论和验证模式成熟。缺点：企业部署支持不如LangGraph。④ OpenAI Swarm/Agents SDK——简单任务够用。选择建议：快速验证用CrewAI，生产部署用LangGraph，学术研究用AutoGen [citation:20][citation:24]。

### 4. AI应用的评估（Eval）怎么做才不流于形式？

三层评估体系：① Span-level（步骤级）——评估Agent每一步是否正确；② Trajectory-level（轨迹级）——评估完整路径，通过错误路径得到正确答案=没通过；③ Outcome-level（结果级）——任务成功率、成本/成功任务、人类介入率。关键原则：用LLM-as-Judge规模化但要校准（法官和Agent有相同盲点）；每个Prompt修改必须跑回归测试；生产环境持续采样评估。推荐工具：LangSmith、Phoenix（Arize）、W&B Weave、Galileo。Galileo 2026报告：84.9%团队上线6个月内遇到AI事故 [citation:5][citation:22]。

### 5. Context Engineering是什么？和Prompt Engineering什么区别？

Anthropic 2025年9月提出，核心观点：上下文是"有限的注意力预算"。Transformer的n²注意力机制意味着token越多，每个token注意力越分散。Context Engineering不是"怎么写提示词"，而是"在每个步骤给模型什么配置让它最可能做对"。六大技术：分层系统提示（稳定在前/动态在后/利于缓存）、JIT检索（按需用工具取不预加载）、Compaction（接近窗口上限时压缩）、结构化笔记（写外部存储跨重置保持状态）、子Agent架构（专人专窗返回摘要）、工具结果清理。核心理念：找到最小的、最高信号的token集 [citation:23]。

### 6. 从零开始学AI应用开发，学习路径怎么规划？

六阶段渐进：① Prompt基础（2周）——四层模式+系统提示+少样本；② API调用（2周）——OpenAI/Anthropic/DeepSeek API+流式+函数调用；③ RAG入门（3周）——切分→嵌入→检索→生成+ChromaDB/Qdrant；④ Agent框架（3周）——LangGraph/CrewAI实现多步骤Agent；⑤ 评估体系（2周）——建Eval集+LangSmith追踪；⑥ 生产部署（3周）——vLLM/K8s/监控/降级。每阶段做一个完整小项目，从"能跑"到"能上线"的差距在于评估、监控、降级、安全四件事 [citation:1][citation:2][citation:21][citation:23]。

---

## <span id="写在最后">写在最后</span>

### 三个核心认知

**1. AI应用开发是一套工程体系，不是一个Prompt。**
六层架构每一层都有原理、工具有反模式。跳层搭建的后果不是"慢一点"，而是"上线就翻车"。

**2. 评估不是上线后的事，是第一步。**
先建Eval集，再写第一行Prompt。没有评估的AI应用 = 没有测试的软件 = 定时炸弹。

**3. 最好的架构是满足SLO的最低成本架构。**
不要一上来就Multi-Agent+15x token消耗。从最简单的RAG开始， profiling瓶颈，按需演进。

### 你的行动清单

| 今天 | 这周 | 这月 |
|---|---|---|
| 画出你的六层架构图 | 写完第一版系统提示（四层）| 跑通第一个RAG管道 |
| 注册LangSmith/Phoenix | 建50条Eval集 | 接入评估到CI |
| 选一个框架（LangGraph/CrewAI）| 跑第一次Eval基线 | 部署到Staging环境 |

### 最后一句话

> **AI应用开发的本质不是"让模型变聪明"，是"设计一套系统让模型在正确的时候、用正确的信息、做正确的事"——而你，是这个系统的架构师。**

---

<div class="cta-box">

### 🗺️ 开始绘制你的AI开发知识图谱

1. **现在**：在纸上画出你的六层架构（哪怕很粗糙）
2. **今天**：写出第一版四层系统提示（用文章模板）
3. **这周**：建一个50条的Eval集（哪怕手动标注）
4. **评论区告诉我**：你目前在哪一层？遇到什么卡点？

</div>

---

<hr>

<p><small><strong>数据更新至：</strong>2026年7月26日。本文引用来源：Anthropic《Effective Context Engineering for AI Agents》(2025.09)、Anthropic Multi-Agent Research System架构论文、Steinberger & Osmani《Loop Engineering: The Architecture of Autonomous Iteration》(2026.06)、TechPaathshala《How to Add AI Features to Your App: 2026 Developer's Guide》、FutureAGI《AI Chatbot Development in 2026: LLM Selection, Prompting, RAG, Agentic》、Prompt Engineering Institute《System Prompts for Agents: 12 Design Patterns》(blckalpaca)、Galileo《State of Eval Engineering 2026》(2月报告)、Techsy.io《Evaluate AI Agents in Production: 3-Layer System》、Data-Gate.ch《LLM Serving at Scale: Architecture Patterns for Production》、Paxrel《Top 10 AI Agent Tools in 2026》、Presenc.ai《Multi-Agent Orchestration Frameworks 2026》。各框架和工具的能力随版本快速迭代，请以官方最新文档为准。本文为技术架构分析，不构成商业建议。</small></p>

<p><small><strong>相关阅读：</strong> <a href="/posts/python-ai-customer-service-bot">Python+AI客服机器人实战</a> · <a href="/posts/local-llm-deployment-guide-llama4-qwen3">本地部署开源大模型指南</a> · <a href="/posts/notion-ai-second-brain-guide">Notion+AI知识库</a> · <a href="/posts/ai-data-analysis-excel-to-charts">AI数据分析</a></small></p>

<p><small><strong>工具官网：</strong> <a href="https://langchain.com" target="_blank" rel="noopener">LangChain/LangGraph</a> · <a href="https://github.com/joaomdmoura/crewAI" target="_blank" rel="noopener">CrewAI</a> · <a href="https://microsoft.github.io/autogen" target="_blank" rel="noopener">Microsoft AutoGen</a> · <a href="https://docs.anthropic.com" target="_blank" rel="noopener">Anthropic Claude API</a> · <a href="https://platform.openai.com" target="_blank" rel="noopener">OpenAI API</a> · <a href="https://www.langsmith.com" target="_blank" rel="noopener">LangSmith</a> · <a href="https://arize.com/phoenix" target="_blank" rel="noopener">Phoenix by Arize</a> · <a href="https://docs.vllm.ai" target="_blank" rel="noopener">vLLM</a> · <a href="https://galileo.ai" target="_blank" rel="noopener">Galileo</a></small></p>

<style>
.reading-time {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  padding: 8px 16px;
  margin: 16px 0;
  border-radius: 4px;
  font-size: 0.95em;
  color: #1e3a5f;
}
.toc {
  background: #fafbfc;
  border: 1px solid #e4e6eb;
  border-radius: 10px;
  padding: 20px 28px;
  margin: 24px 0 32px;
}
.toc h2 {
  margin-top: 0;
  font-size: 1.1em;
}
.toc a {
  color: #1e3a5f;
  text-decoration: none;
  display: block;
  padding: 3px 0;
}
.toc a:hover {
  color: #2563eb;
  text-decoration: underline;
}
.cta-box {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%);
  color: white;
  border-radius: 16px;
  padding: 28px 32px;
  margin: 40px 0 24px;
  text-align: center;
}
.cta-box h3 {
  color: white;
  margin-top: 0;
}
.cta-box a {
  color: #dbeafe;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0 24px;
  font-size: 0.85em;
}
th {
  background: #2563eb;
  color: white;
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
}
td {
  padding: 9px 12px;
  border-bottom: 1px solid #e4e6eb;
}
tr:nth-child(even) {
  background: #eff6ff;
}
tr:hover {
  background: #bfdbfe;
}
.green { color: #16a34a; font-weight: 600; }
.red { color: #dc2626; font-weight: 600; }
.yellow { color: #d97706; font-weight: 600; }
blockquote {
  border-left: 4px solid #7c3aed;
  padding: 12px 20px;
  margin: 16px 0;
  background: #f5f3ff;
  font-style: italic;
  color: #3b0764;
}
code {
  background: #f1f3f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85em;
  line-height: 1.6;
}
pre code {
  background: none;
  color: inherit;
  padding: 0;
}
</style>
