---
title: "存储与推理科研知识：从知识图谱到可验证思维链"
date: 2026-08-18
category: "AI for Science"
tags: ["知识图谱", "RAG", "GraphRAG", "SciencePedia", "CATDA", "EvoScientist", "科研智能体", "持久记忆", "长思维链"]
reading_time: "约 42 分钟"
---

## 摘要

科研知识的存储与推理正在经历一场静默却深刻的范式转移。过去三十年，科学知识主要以"扁平文本"形式存在——论文、教科书、专利——人类研究者从中手动提取、连接、推理。今天，大语言模型（LLM）与知识图谱（KG）的协同，正在将这种"人类独占"的知识加工过程，逐步转化为可计算、可验证、可累积的结构化基础设施。本文系统梳理 2025—2026 年该领域的关键进展：从 OpenScholar 的 4500 万篇论文检索增强生成、SciencePedia 的 300 万条长思维链知识库、CATDA 的催化文献知识蒸馏（F1=0.983），到 EvoScientist 的持久化记忆多智能体系统、GraphRAG 在药物发现中将研究周期压缩 87%、以及 Intern-S2 的"知识与推理分离"双引擎架构。文章的核心命题是：**科学知识的"存储"不再只是存档，"推理"也不再只是计算——二者正在融合为一种自进化的、可验证的、跨模态的科研知识操作系统。**

---

## 一、问题的提出：科学知识的"压缩困境"

### 1.1 知识的"冰山效应"

2026 年 1 月，中国科学院理论物理研究所陈锟副研究员在发布 SciencePedia 时，用了一个精妙的比喻[1]：

> "目前的科学大模型主要基于互联网语料训练，这些语料就像冰山浮在水面上的 10%——它们大多是结论、公式和既定事实。而真正支撑科学大厦根基的，是水面下那 90% 的'知识暗物质'——包含了科学家推导公式的思维过程、学科间深层的逻辑联系，甚至是失败尝试中蕴含的经验。"

这不是修辞，而是一个可验证的工程命题。Li et al. 在 *Inverse Knowledge Search over Verifiable Reasoning*（arXiv:2510.26854）中系统论证了这一点[2]：绝大多数科学材料（教科书、维基百科、 polished claims）呈现的是"端点"——定义、公式、结论——而几乎从不展示"到达端点所经历的推导脚手架"。当 LLM 在这些压缩语料上训练时，它们学会了"看起来像科学"，却不真正"理解科学"。

### 1.2 三个相互关联的危机

| 危机 | 表现 | 后果 |
|------|------|------|
| **碎片化** | 论文、数据集、软件、协议分散在异构平台 | 即使开放获取，也"功能上碎片化"[3] |
| **不可验证** | LLM 凭"参数记忆"生成内容，无溯源 | OpenAI GPT-4o 在科学引文中 78%–90% 为幻觉[4] |
| **不可累积** | 每次研究从零开始，失败不传承 | 知识工作者 30% 时间花在跨孤岛搜索[5] |

这三个危机的共同根源是：**我们缺少一种能够同时存储"知识端点"和"推理路径"的结构化基础设施。**

---

## 二、知识存储层：从向量数据库到结构化知识图谱

### 2.1 第一波：向量 RAG 的崛起与天花板

检索增强生成（RAG）的核心公式简洁有力[6]：

$$\mathbf{z} = g(\mathbf{x}), \quad \mathbf{y} = f(\mathbf{x}, \mathbf{z})$$

其中 $g$ 是从外部知识库检索相关上下文的检索函数，$f$ 是结合检索内容生成答案的 LLM。RAG 从根本上改变了 LLM 的知识更新方式——不再需要重训练，只需"换索引"。

Wang et al. 在《计算机科学》2026 年的综述中将 RAG 方法按核心挑战分为四类[7]：

| 类别 | 代表方法 | 核心思路 |
|------|----------|----------|
| Chunk 优化 | 语义分块、层次化切分 | 解决"切太碎丢失上下文"问题 |
| 检索增强 | HyDE、Rewrite-Retrieve-Read | 先生成假设文档再检索 |
| 上下文压缩 | LLMLingua、LongLLMLingua | 4–20× 压缩检索结果 |
| **知识图谱集成** | **GraphRAG、KG-RAG** | **将实体关系结构化，支持多跳推理** |

向量 RAG 在简单问答上效果显著，但在科研场景中暴露了两个根本缺陷[5]：

1. **"chunking"盲点**：向量搜索检索"看起来相似"的文本块，但无法理解实体（分子、蛋白、化合物）之间的因果关系。
2. **浅层上下文与幻觉**：传统 RAG 产生"片段拼贴"式答案，在药物研发等高风险场景不可接受。

### 2.2 第二波：知识图谱成为科研基础设施

2026 年，科学知识图谱（SciKG）从"学术玩具"升级为"工业级基础设施"。三个标志性事件：

**事件一：SciAtlas 发布——4300 万论文、3 亿三元组**

由浙江大学等机构发布的 SciAtlas（arXiv:2605.22878）整合了超过 4300 万篇论文、26 个学科、1.57 亿实体和 30 亿关系[8]。其 schema 定义了 9 种实体类型（Paper、Author、Institution、Keyword 等）和 12 种关系边（CITES、AUTHORED、COOCCUR 等），支持四个推理层次：

| 层次 | 内容 | 示例 |
|------|------|------|
| Semantic | 引用与相关性直接连接 | 论文 A 引用论文 B |
| Conceptual | 高层关键词共现模式 | "transformer" 与 "attention" 共现 |
| Directional | 领域→子领域层次组织 | 物理→凝聚态→拓扑绝缘体 |
| Social | 作者/机构社会网络 | 某作者在哪些机构工作过 |

**事件二：SciGraph-SCP Server——首个 AI 原生科学图谱开放服务**

2026 年，浙江大学联合上海人工智能实验室发布 SciGraph-SCP Server[9]，集成科学智能上下文协议（SCP），覆盖数学、物理、生物、化学、材料等 8 个学科，拥有超过 3.7 亿实体和 37 亿三元组，是当前国内外覆盖领域最多、规模最大的开放科学知识图谱服务。

**事件三：SciLake 收官——从碎片化到可操作知识**

经过三年合作，SciLake 项目于 2026 年 3 月展示了五大试点成果[3]：能源规划（链接 OpenStreetMap 地理对象）、癌症研究（整合基因/药物资源）、海上运输、自动化出行、神经科学。核心理念是用 OpenAIRE Graph 作为"共享骨干"，各社区在其上构建领域专属子图。

### 2.3 知识图谱×LLM：三种融合范式

Frontiers in Computer Science（2025）的一篇综述将 KG-LLM 融合归纳为三种策略[10]，已成为领域标准分类框架：

| 范式 | 方向 | 典型代表 | 一句话总结 |
|------|------|----------|------------|
| **KEL** | KG 增强 LLM | GraphRAG、Think-on-Graph、KGE token 注入 | 给 LLM 配一个"事实顾问" |
| **LEK** | LLM 增强 KG | Ontogenia、AutoSchemaKG、KGGEN | 让 LLM 当 KG 的"建筑工人" |
| **LKC** | 双向协同 | QA-GNN、GreaseLM、KGLM | KG 和 LLM 互为"教练" |

三种范式的演进趋势清晰可见[10]：

- **趋势 1**：从静态图谱到动态归纳。AutoSchemaKG（2025）支持企业级 KG 的实时生成和演化，"构建"与"使用"的边界正在消失。
- **趋势 2**：从模块化流水线到生成式统一。传统 NER→RE→建图管线正被统一生成式框架取代。
- **趋势 3**：从单学科到跨学科整合。真正的科学突破往往发生在学科交叉地带。

---

## 三、推理层：从检索到"可验证的思维链"

### 3.1 SciencePedia：让知识"活起来"

SciencePedia 是 2025—2026 年最具想象力的科研项目之一。其核心创新不是"更多数据"，而是**重新定义知识的存储单元**[1][2]。

**传统知识系统**：存储"端点"——定义、公式、结论。
**SciencePedia**：存储"路径"——从第一性原理出发的完整推导链。

#### 三步构建流程

```
第一性原理问题生成 → 多模型独立求解（LCoT）→ 交叉验证与筛选
```

具体来说[2][11]：

1. **苏格拉底智能体（Socratic Agent）**：从约 200 门课程的课程体系中，生成约 300 万个第一性原理问题。
2. **多模型求解**：多个独立 LLM "solver" 为每个问题生成完整推理链（LCoT），包含从公理到结论的每一步。
3. **严格过滤**：通过提示消毒（prompt sanitization）和多模型答案共识（consensus）过滤，仅保留可验证的 QA 对。

#### 逆知识搜索（Inverse Knowledge Search）

这是 SciencePedia 最革命性的设计[2][12]。传统搜索引擎是"由词找义"（关键词匹配），而逆知识搜索是"由义找理"（基于逻辑关系）：

> 当你查询"拓扑绝缘体"，系统不会只给出凝聚态物理的定义，还会自动指向材料科学里的制备工艺、数学拓扑学中的关键概念，乃至量子计算中的器件应用路径。

本质上，它检索的不是"事实"，而是"推理过程本身"。

#### 实测效果

| 指标 | 数据 |
|------|------|
| 覆盖学科 | 数学、物理、化学、生物、工程、计算科学、天文（7 大领域） |
| 细粒度条目 | ~20 万 |
| 长思维链（LCoT） | 300 万+ 条 |
| 练习题 | 10 万+ |
| 知识密度 | 比 GPT-4 生成内容高 50% |
| 事实错误率 | 比同等规模基线低 50% |

### 3.2 OpenScholar：4500 万篇论文的"可信"推理

2026 年 2 月，华盛顿大学与艾伦人工智能研究院（AI2）在 *Nature* 发表 OpenScholar[4]，被视为科研文献处理的里程碑。

**核心架构三件套**：

1. **OSDS（OpenScholar DataStore）**：4500 万篇开放获取论文的全文向量化索引，2.36 亿段落嵌入，毫秒级检索。
2. **自适应检索模块**：训练专用 retriever 和 reranker，超越通用语义搜索。
3. **自反馈推理循环**：生成答案 → 自我检查 → 迭代修正 → 输出带引用的最终答案。

**ScholarQABench 评测结果**（2967 个专家级问题，208 份长篇参考答案，横跨 CS/物理/神经科学/生物医学）[4]：

| 系统 | 多论文综合正确性 | 引用准确率 |
|--------|-----------------|----------|
| GPT-4o | 基线 | 78%–90% 幻觉 |
| PaperQA2 | 基线 + 0.6% | — |
| **OpenScholar-8B** | **+6.1% over GPT-4o** | **接近人类专家** |
| OpenScholar-GPT-4o | +12% over GPT-4o | — |

最令人惊讶的发现：**OpenScholar-8B（仅 80 亿参数）在专家评估中，有 51% 的答案优于人类专家撰写的参考答案。** 这意味着，一个"检索+推理"的 8B 模型，在科研文献综合任务上已经超越了"人类+传统文献调研"的组合。

### 3.3 CATDA：从催化文献到可计算知识图谱

清华大学王笑楠团队 2025 年 10 月发表在 *ACS Catalysis* 的 CATDA 框架[13][14]，展示了知识存储与推理在垂直领域的威力。

**问题**：数十年催化知识"锁定"在非结构化文本中。传统文本挖掘工具难以建立"合成-结构-性能"关系——因为它们很少将某章节的合成方案与另一章节报道的材料性能关联起来。

**CATDA 三步流程**：

```
整篇文献 → CatGraph 提取（长上下文 LLM）→ DatasetAgent / CatAgent
```

| 模块 | 功能 | 效果 |
|------|------|------|
| **CatGraph** | 长上下文 LLM 读取完整文献，识别化学品、合成步骤、测试条件、性能指标，构建信息丰富的知识图谱 | 145 篇专利验证 |
| **DatasetAgent** | 根据研究者定义的特征，自动从图谱导出 ML-ready 表格 | 乙苯转化率预测 R²=0.89 |
| **CatAgent** | 自然语言对话界面，将用户问题转为 Cypher 查询，返回带原文证据答案 | 支持多轮推理对话 |

**关键数据**：

- **F1 = 0.983**（特征级提取准确率），显著优于 DeepSeek-R1（F1=0.78）和 GPT-4.1（F1=0.67）
- **12× 加速**：处理单篇文献约 5 分钟 vs 人工约 1 小时
- 可并行处理实现更大规模加速

---

## 四、记忆层：让 AI 科学家"越做越聪明"

### 4.1 持久化记忆：从会话到跨项目

2026 年，科研智能体领域最被低估的突破不是某个模型，而是**记忆机制**。Airbyte 的技术报告将 Agent 记忆分为三层[15]：

| 记忆类型 | 作用域 | 生命周期 | 存储位置 |
|----------|--------|----------|----------|
| 工作记忆（Working） | 当前推理步骤 | 单次生成内 | 上下文窗口 |
| 会话记忆（Session） | 单次对话 | 对话结束即丢弃 | 临时缓冲区 |
| **持久记忆（Persistent）** | **跨会话、跨项目** | **永久** | **数据库/文件系统** |

为什么持久记忆对科研至关重要？EvoScientist 论文给出了最直观的答案[16]：

> "传统 AI 研究系统就像没有记忆的复印机，每次都按同样程序工作，哪怕之前已经在某个实验上撞过南墙，下次遇到类似情况还会重复同样的错误。"

### 4.2 EvoScientist：双记忆模块的自进化系统

华为技术有限公司联合阿姆斯特丹自由大学等机构发布的 EvoScientist（arXiv:2603.08127）[16][17]，是当前最完整的科研自进化系统之一。

**架构**：6 个专门智能体 + 2 个持久记忆模块

```
┌─────────────────────────────────────────────────────────┐
│                   Evolution Manager Agent               │
│              （从交互中提炼可复用知识）                    │
└────────┬───────────────────────────┬────────────────────┘
         │                           │
┌────────▼────────┐         ┌───────▼────────┐
│ Researcher Agent│         │ Engineer Agent  │
│  （想法生成）    │         │ （实验执行）     │
└────────┬────────┘         └───────┬────────┘
         │                           │
┌────────▼───────────────────────────▼────────┐
│              持久化记忆模块                    │
│  ┌──────────────┐   ┌───────────────────┐  │
│  │ 想法记忆      │   │ 实验记忆          │  │
│  │ (Ideation)   │   │ (Experimentation) │  │
│  │ • 可行方向   │   │ • 数据处理策略    │  │
│  │ • 失败记录   │   │ • 训练调优技巧    │  │
│  └──────────────┘   └───────────────────┘  │
└─────────────────────────────────────────────┘
```

**两个记忆模块的具体运作**[16]：

- **想法记忆（Ideation Memory）**：从高排名想法中总结可行研究方向，同时记录此前不成功的方向（避免重复踩坑）。
- **实验记忆（Experimentation Memory）**：从代码搜索轨迹和最佳实现中捕捉有效的数据处理和模型训练策略。

**核心机制**：每完成一轮研究，Evolution Manager Agent 从各子智能体的交互历史中提取洞察，写入持久记忆。下一轮研究启动时，Researcher Agent 和 Engineer Agent 自动检索相关历史策略。

**实测效果**：在 DeepResearch Bench II（2026 年 3 月）上排名 #1，获得 ICAIS 2025 最佳论文奖。在 7 个开源和商业先进系统的对比中，EvoScientist 在创新性、可行性、相关性和清晰度上全面领先[17]。

### 4.3 记忆架构的工程细节

EvoScientist 的持久记忆实现（EvoMemoryMiddleware）采用"注入-提取"双机制[18]：

| 机制 | 频率 | 成本 | 实现方式 |
|------|------|------|----------|
| **注入（Injection）** | 每次 LLM 调用 | 极低（文件读取+字符串拼接） | 将 MEMORY.md 内容包裹在 `<memory>` XML 标签中注入系统提示 |
| **提取（Extraction）** | 每 20 条人类消息 | 一次 LLM 结构化输出调用 | 取最近 30 条消息，用 Pydantic schema 提取结构化事实 |

```python
# EvoScientist 记忆提取的核心 schema（简化）
class ExtractedMemory(BaseModel):
    user_profile: Optional[UserProfile] = None
    research_preferences: Optional[ResearchPreferences] = None
    experiment_conclusions: Optional[List[ExperimentConclusion]] = None

class ExperimentConclusion(BaseModel):
    title: str
    question: str
    method: str
    key_result: str
    conclusion: str
    artifacts: List[str]  # 关联的代码片段/文件路径
```

### 4.4 AutoSci 与 SciMem：更精细的记忆分层

Beyond EvoScientist，2026 年还出现了更精细的记忆架构设计[19]：

| 系统 | 记忆分层 | 核心创新 |
|------|----------|----------|
| **AutoSci** | 活跃研究记忆 + 长期知识记忆 | 两阶段分离：工作区 vs 永久存档，支持版本化回滚 |
| **SciMem** | 发现（findings）→ 模式（patterns）→ 原则（principles） | 三级层次化：观察→规律→通用规则 |
| **QMatSuite** | 只读最佳实践库 + 可写智能体洞察 + 社区知识包 | SQLite + FTS5 全文索引，支持跨会话累积 |
| **DeepScientist** | 科学发现记忆库（Findings Memory） | 贝叶斯优化驱动的方向探索与已知路径利用平衡 |

### 4.5 双过程记忆架构：突破上下文窗口饱和

Milosevic（2026）提出的 Episodic-Semantic 双过程记忆架构[20]，通过大规模评估（15,000 条消息、6 个 LLM、1440 次查询）得出三个关键发现：

1. **全文本模型在 10,000 条消息时因上下文溢出而失败**，而双过程架构用 62% 更少的 token 维持 70%–85% 准确率。
2. **跨模型验证揭示架构级权衡**：双过程在数值/时间查询上强（65%–90%），RAG 在历史检索上强（60%–85%）——二者互补而非替代。
3. **"Sim-to-Real"鸿沟**：合成测试保持恒定记忆增长，而真实工作流呈线性增长（约 3 token/消息），整合质量成为主要可扩展性瓶颈。

---

## 五、图推理层：GraphRAG 与科研发现的"关系觉醒"

### 5.1 为什么向量搜索不够

微软研究院与 LangChain 2026 年 4 月的技术报告指出[21]：在跨文档推理、全局摘要、多跳关联分析任务上，基于纯向量相似度的 RAG 系统准确率普遍低于 45%；而引入知识图谱结构的 GraphRAG 架构，在同等数据集上将复杂推理准确率提升至 89% 以上。

根本原因在于：

> "向量搜索擅长回答'是什么'，但只有知识图谱才能回答'为什么'和'意味着什么'。"

### 5.2 GraphRAG 的形式化定义

GraphRAG 将外部知识存储视为图 $G = (V, E, \Phi)$[22]，其中：
- $V$：节点（实体、文本块、复合单元）
- $E$：有向或无向关系边
- $\Phi$：结构或文本特征

给定查询 $q$，检索器 $R$ 选择最小子图 $K = R(G, q)$ 足以精确生成答案，然后条件化 LLM：

$$a = \text{Gen}(M; q, K)$$

### 5.3 AWS 药物发现案例：研究周期压缩 87%

AWS 的制药 GraphRAG 部署（Amazon Neptune Analytics + Bedrock）[23][24]展示了该技术的产业威力：

| 指标 | 改造前 | 改造后 | 改善幅度 |
|------|--------|--------|----------|
| 早期发现周期 | 6 个月 | 3 周 | **87% 减少** |
| 发现命中率 | ~5% | 最高 5× 提升 | — |
| 数据检索速度 | 基线 | — | 85% 更快 |
| 文献综述时间 | 基线 | — | 70% 减少 |
| 机构知识利用率 | 基线 | — | ~90% 改善 |

架构图：

```
用户自然语言查询
       ↓
实体链接器（模糊匹配）
       ↓
Neptune 知识图谱
  ├── PubMed PMC 文献块
  ├── 内部实验室笔记
  └── 疾病本体（ICD-10）
       ↓
多跳图遍历
       ↓
Bedrock Claude 生成
       ↓
答案 + 可遍历引用路径
```

### 5.4 GraphRAG-R1：用强化学习训练推理策略

2026 年 WWW 会议 Oral（317/3370，前 10%）收录的 GraphRAG-R1[25]，通过"过程约束强化学习"让模型学会在知识图谱上自主推理：

> "能不能让模型像人一样，自己判断'什么时候该去查资料'以及'查到什么程度该收手'？"

核心思路：与其手写死板的检索规则，不如用 RL 训练模型，让它自己摸索出最优的检索与推理策略。方法在多个复杂推理数据集上取得 SOTA，F1 分数最高提升 83.81%，并能即插即用地适配各类 RAG 系统，带来平均 20%+ 的稳定性能增益。

### 5.5 药物重定位：图谱推理的"杀手级应用"

GraphRAG 在药物发现中的典型应用[26]：

- **四层图谱**：疾病→基因→通路→药物
- **预测准确率**：测试集上 Top-5 命中率 82.3%
- **发现周期**：从传统 18–24 个月缩短至 2–3 周
- **典型案例**：抗抑郁药丙咪嗪被预测对胶质母细胞瘤有潜在疗效，后经体外实验验证
- **副作用预警**：在临床部署中成功预警 17 例严重药物不良事件

---

## 六、系统架构层：知识与推理的分离设计

### 6.1 Intern-S2：让"记忆"与"思考"各司其职

2026 年 WAIC 上，上海人工智能实验室发布的 Intern-S2-Preview-397B[27]，从底层架构入手解决了一个根本问题：

> 科学研究需要模型既"记得多"，又"想得活"。

其创新在于**知识与推理分离的双引擎**：

| 组件 | 职责 | 设计理念 |
|------|------|----------|
| **Memory Decoder** | 承载专业领域可插拔外部记忆 | 打破"只有浅层隐状态可访问深层知识"的约束 |
| **Mobius** | 专注基座模型的知识与推理分离 | 深层隐状态也可访问浅层知识 |

核心价值：将大模型专业化从"一次性整体改造"转变为"可持续的能力生长"——基础模型负责稳定通用理解，专业记忆承载不断演进的学科知识，推理算子在不同任务间复用。

### 6.2 SciAtlas 的四层推理架构

SciAtlas 的 neuro-symbolic 检索算法[8]展示了知识存储如何赋能推理：

```
查询 → 三路径协同召回 → 图重排序 → 确定性关联发现
         ├── 语义路径（向量相似度）
         ├── 结构路径（图谱邻居遍历）
         └── 社会路径（作者/机构关联）
```

这种设计的妙处在于：它将"软匹配"（向量相似度）与"硬推理"（图谱遍历）结合，既保留了语义灵活性，又获得了逻辑确定性。

### 6.3 SciGraph-SCP 的工具生态

SciencePedia 不仅提供知识，更连接工具[1]。其整合了物理、化学、生物、工程等领域的 **5 万+ 科学工具**（如 DeepMD-kit、PySCF 等），通过自动化部署技术将散落在代码仓库中的"长尾工具"转化为 AI 智能体可直接调用的标准化能力单元（MCP 协议）。

这让科研智能体不仅能"想"，还能"做"——从知识推理到实验执行的闭环由此打通。

---

## 七、评估基准：如何衡量"科研知识能力"

### 7.1 评测体系的三个层次

| 层次 | 关注点 | 代表基准 |
|------|--------|----------|
| **知识检索** | 能否找到正确文献/事实 | ScholarQABench、NaturalQuestions |
| **推理质量** | 能否正确连接多步逻辑 | MRCR、NoLiMa、RULER |
| **端到端发现** | 能否完成完整科研任务 | DeepResearch Bench II、SciBench |

### 7.2 ScholarQABench：首个多学科长篇文献综合基准

由 OpenScholar 团队同步推出的 ScholarQABench[4]：

- **2200+ 专家撰写问题**（计算机科学、物理、神经科学、生物医学）
- **208 份长篇参考答案**（每份由领域专家耗时约 1 小时撰写）
- 评估维度：正确性、引用准确性、覆盖面、可解释性

### 7.3 DeepResearch Bench II：端到端科研能力

EvoScientist 排名 #1 的 DeepResearch Bench II[17]，评估的是 AI 系统完成"真实科研任务"的全流程能力——从文献调研、假设生成、实验设计到论文撰写。

---

## 八、知识存储与推理的技术选型矩阵

| 技术路线 | 适用场景 | 优势 | 局限 | 代表系统 |
|----------|----------|------|------|----------|
| **向量 RAG** | 快速原型、简单 QA | 部署简单、延迟低 | 多跳推理弱、不可解释 | Naive RAG |
| **GraphRAG** | 复杂关系推理、药物发现 | 多跳可解释、确定性强 | Schema 治理成本高 | AWS Neptune、Neo4j |
| **知识图谱 + LLM** | 垂直领域知识库 | 高精度、可验证 | 构建成本高 | CATDA、SciAtlas |
| **长思维链知识库** | 跨学科推理、教育 | 可验证推导、揭示联系 | 构建计算密集 | SciencePedia |
| **持久化记忆智能体** | 长期科研项目 | 经验累积、自我进化 | 记忆膨胀管理 | EvoScientist、AutoSci |
| **知识与推理分离架构** | 大模型专业化 | 能力可插拔、不灾难性遗忘 | 架构复杂度高 | Intern-S2 |

---

## 九、应用场景全景

### 9.1 药物研发：从 6 个月到 3 周

Insilico Medicine 的 AI 设计药物 rentosertib 已推进至 III 期临床试验[24]，从项目启动到临床提名仅 18 个月，筛选分子仅 79 个。这背后是"生物学优先 + 老化信息驱动"的 AI 工作流，结合知识图谱的结构化推理能力。

### 9.2 催化剂设计：12 倍加速 + 0.983 F1

CATDA 在 145 篇二甲苯异构化专利上的验证表明[13]：AI 提取的数据质量足以训练预测模型（R²=0.89），同时揭示源文献中的系统性数据噪声和异质性问题。

### 9.3 材料科学：从文献到可计算知识

Bai et al. 通过 LLM 自动化处理超 10 万篇框架材料（MOFs、COFs、HOFs）文献摘要，构建了包含 253 万个节点和 401 万关系的知识图谱[28]，精准挖掘隐含信息并赋能 LLM 开发专业问答系统。

### 9.4 跨学科百科全书

SciencePedia 的 20 万条目 + 300 万条 LCoT，正在成为 AI for Science 的"通用知识基座"[1][2]。它接入了 SciMaster 通用科研智能体与 Innovator 科学基座大模型，让"跨学科创新"从依赖灵光一现变为可计算的工程化能力。

---

## 十、核心挑战与开放问题

### 10.1 技术挑战

| 挑战 | 具体表现 | 可能的方向 |
|------|----------|------------|
| **数据质量与整合** | 不同数据库对同一蛋白命名不同（HER2 vs ERBB2） | 实体归一化 + 本体对齐 |
| **动态更新** | 科学知识持续演化，静态图谱快速过时 | 自进化 SciKG + LLM 自动维护 |
| **可审计性** | 科学决策必须可追溯 | 图遍历路径 + 引用溯源 |
| **互操作性** | 不同机构图谱使用不同本体 | RDA SKG-IF 标准框架 |
| **记忆膨胀** | 持久记忆无限增长导致检索退化 | 分层压缩 + 重要性衰减 |
| **Sim-to-Real 鸿沟** | 合成记忆测试 ≠ 真实工作流 | 真实科研日志训练集 |

### 10.2 认识论挑战

更深层的挑战来自科学哲学层面[29]：

1. **离散三元组的表达局限**：科学知识不仅是"实体-关系-实体"，还包含连续过程、不确定性量化、矛盾证据共存。
2. **"推理路径"的验证标准**：LCoT 的正确性由多模型共识判定，但共识≠真理。
3. **人类专家的角色迁移**：当 AI 生成的文献综述 51% 优于人类专家时，"专家评审"的定义需要重新思考。

---

## 十一、未来路线图

```
2024 ── 向量 RAG 成熟，GraphRAG 概念提出
  │
2025 ── OpenScholar 发表（Nature），CATDA 发表（ACS Catalysis）
  │      SciencePedia 构建完成，SciAtlas 发布
  │
2026 ── EvoScientist #1 on DeepResearch Bench II
  │      GraphRAG-R1 (WWW 2026 Oral)
  │      Intern-S2 知识与推理分离架构
  │      SciGraph-SCP 开放服务上线
  │
2027→ ── 自进化 SciKG 生态系统
        具身 AI 科学家（实验室机器人 + 知识图谱闭环）
        跨学科知识推理的标准化协议
        人机协同的"科学文艺复兴"
```

---

## 十二、结语：从"信息堆叠"到"逻辑贯通"

2026 年 1 月 SciencePedia 发布会上，陈锟引用历史寄语未来[1]：

> "当年的文艺复兴，源于伽利略等人打破了对直观经验的迷信，回归理性逻辑与实验验证。今天，我们构建 SciencePedia，正是为了让 AGI 摆脱对人类浅层语料的模仿，通过逻辑演绎去发现未知的真理。"

存储与推理科研知识，本质上是在回答一个古老问题的新版本：**知识是什么？** 过去的答案是"结论的集合"。今天，AI for Science 正在将答案改写为"推理路径的网络"——不仅要知道"是什么"，更要追溯"为什么"和"怎么来的"。

当知识存储从扁平文本升级为结构化、可验证、自进化的基础设施，当推理从"参数内隐式"升级为"图谱显式+思维链可追溯"，科学研究本身正在从"人类独占的手艺"演变为"人机协同的工程"——这或许就是下一次科学文艺复兴的开端。

---

## 参考文献

[1] 陈锟, 李钰, 黄远, 等. SciencePedia 科学基座发布报道. 中国科学院理论物理研究所, 上海科技报, 2026.

[2] Li Y, Huang Y, Wang T, et al. Inverse Knowledge Search over Verifiable Reasoning: Synthesizing a Scientific Encyclopedia from a Long Chains-of-Thought Knowledge Base. arXiv:2510.26854, 2025.

[3] SciLake Consortium. SciLake's Legacy: from fragmented research to Scientific Knowledge Graphs. OpenAIRE, 2026.

[4] Wang Y, et al. Synthesizing scientific literature with retrieval-augmented language models. *Nature*, 2026.

[5] Graphwise. Accelerating Discovery — How GraphRAG Drives ROI in R&D. graphwise.ai, 2026.

[6] Lewis P, et al. Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*, 2020.

[7] Wang X, Li Y, Ma C, Li S. Retrieval-Augmented Generation: Survey of Methods and Applications. *计算机科学 (Computer Science)*, 2026, 53(7): 101-117.

[8] Qiao S, et al. SciAtlas: A Large-Scale Knowledge Graph for Automated Scientific Research. arXiv:2605.22878, 2026.

[9] 中化新网. 首个 AI 原生科学图谱开放服务上线. 2026.

[10] 知识图谱×大语言模型：2025-2026 融合前沿全景. 稀土掘金技术博客, 2026.

[11] DeepTech. AI 百科全书新思路：科学家用第一性原理重构知识体系. mittrchina.com, 2026.

[12] Prompt Engineering. AI 'Dark Matter' - Using Verifiable Reasoning Chains and Inverse Search. promptengineering.org, 2026.

[13] Chen H, Liu H, Tew Y, Ren X, Tang X, Wang X. Distilling Knowledge from Catalysis Literature with Long-Context Large Language Model Agents. *ACS Catalysis*, 2025, 15(21): 18244-18254.

[14] 清华大学王笑楠团队. CATDA 催化文献知识蒸馏详解. 材算未来/催化之光, 2025.

[15] Airbyte. What is Persistent Memory for Agents? airbyte.com, 2026.

[16] Lyu Y, Zhang X, Yi X, et al. EvoScientist: Towards Multi-Agent Evolving AI Scientists for End-to-End Scientific Discovery. arXiv:2603.08127, 2026.

[17] Claw4Science. EvoScientist: #1 on DeepResearch Bench. claw4science.org, 2026.

[18] EvoScientist Documentation. Persistent Memory System (EvoMemoryMiddleware). zread.ai, 2026.

[19] BBG News. The Self-Improving Scientist: AI Automates the Research Process. bbg-news.com, 2026.

[20] Milosevic N. Episodic-Semantic Memory Architecture for Long-Horizon Scientific Agents. arXiv:2605.17625, 2026.

[21] 机器之心/The New Stack. Beyond Vector Search: The Rise of GraphRAG in Enterprise AI. 2026.

[22] EmergentMind. Graph-RAG: Retrieval-Augmented Generation. emergentmind.com, 2026.

[23] AWS. GraphRAG Cuts Drug Research Cycles by 87%. newsai.ph / mer.vin, 2026.

[24] OtherWorldsAI. AI Just Designed a Drug Moving to Phase III Trials. otherworldsai.com, 2026.

[25] GraphRAG-R1: Graph Retrieval-Augmented Generation with Process-Constrained Reinforcement Learning. *WWW 2026 Oral*. ACM, 2026.

[26] DevPress. GraphRAG 技术解析：知识图谱与大模型在药物发现中的应用. CSDN, 2026.

[27] 腾讯网. 397B 参数追平万亿模型，上海 AI Lab 发布科学智能体新基座. WAIC 2026.

[28] 中国物理学会. 大语言模型加速材料设计——从知识挖掘到智能设计的全链条赋能. *物理学报*, 2025.

[29] NSR 综述. Bridging Data and Discovery: A Survey on Knowledge Graphs in AI for Science. *National Science Review*, 2026.

[30] Rafay A, Susanti Y, Lamprecht D, Färber M. SemRepo: A Knowledge Graph for Research Software and Its Scholarly Ecosystem. arXiv:2605.13310, 2026.

[31] Hassan M A, Azam M, Amin M, Hussain A. Retrieval-Augmented Generation: Architectures, Adaptive Retrieval, Feedback-Driven Optimization. *Spectrum of Engineering Sciences*, 2026, 4(2): 70-78.

[32] Kamalipour A A, Asadi S, Amiri Chimeh M M. From vectors to knowledge graphs: A comprehensive analysis of modern RAG architectures. *Computer Science Review*, 2026, 61: 100925.

[33] Ke Z, Jiao F, Ming Y, et al. A Survey of Frontiers in LLM Reasoning: Inference Scaling, Learning to Reason, and Agentic Systems. arXiv:2504.09037, 2025.

[34] EmergentMind. The Periodic Table of LLM Reasoning. emergentmind.com, 2026.

[35] SciLit. The Reasoning Capability of LLMs on Scientific Tasks: A Survey. scilit.com, 2026.

[36] 科学网. OpenScholar: 科研文献处理的突破性工具. sciencenet.cn, 2026.

[37] Paperguide. PaperQA 深度解析：构建面向科研文献的检索增强型生成智能体. guyuehome.com, 2026.

[38] AIGazine. China's "SciencePedia" Project Turns the Invisible Logic of Knowledge into a Verifiable AI System. aigazine.com, 2026.

[39] IMA 知识号. EvoScientist 详解. ima.qq.com, 2026.

[40] HuggingFace. EvoScientist: 迈向用于端到端科学发现的多智能体演进 AI 科学家. huggingface.ac.cn, 2026.

[41] CSDN. AI Scientist：自主科学发现系统的构建与演进. blog.csdn.net, 2026.

[42] 新浪网. AI Scientist 正逐步重塑科学研究范式. 2026.

[43] 今日头条. "智能科学家"时代来临. 2026.

[44] DeepScientist 文档. 西湖大学全自动 AI 科学家系统. 2026.

[45] TheMoonlight. From Experiments to Expertise: Scientific Knowledge Consolidation for AI-Driven Computational Research (QMatSuite). themoonlight.io, 2026.

[46] 企鹅号. AI 百科全书新思路：科学家用第一性原理重构知识体系. 2026.

[47] IMA 知识号. SciencePedia：从长思维链中"生长"的科学百科. 2026.

[48] PaperWeekly. WWW 2026 | 强化学习重塑 GraphRAG，多跳推理 F1 提升 83.81%. 2026.

[49] 催化一下. 清华大学王笑楠：利用长上下文大语言模型从催化文献中提取知识. 2026.

[50] ChemRxiv. CATDA: Corpus-aware Automated Text-to-Graph Catalyst Discovery Agent (preprint). 2025.

[51] Galactica 技术解析. CSDN, 2023 (预训练科学推理引擎先例).

[52] ScholarGPT 官方文档. AI 科研助手功能说明. paperguide.ai / scholargpt.ai, 2026.

[53] GraphRAG 官方文档. graphrag.com, 2026.

[54] 中国科技网/央视新闻. "Agentic Science at Scale" 研讨会报道. 2026.

[55] 华为技术有限公司. EvoScientist 详解：多智能体演进 AI 科学家. 腾讯网, 2026.

[56] ACS Catalysis 期刊数据. 2-Year Impact Factor: 13.1, CiteScore: 19.5. American Chemical Society, 2025.

[57] 今日头条. 智能科学家时代：24 小时不停歇科研工作. 2026.

[58] 南开大学/北航/港科大(广州)/华为. GraphRAG-R1 项目主页. github.com/ycygit/GraphRAG-R1, 2026.

[59] 上海交通大学/上海算法创新研究院. "Agentic Science at Scale" 研讨会. 2026.

[60] 陈锟 (通讯作者). SciencePedia 项目主页. sciencepedia.bohrium.com, 2026.
