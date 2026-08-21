---
title: "自动 Agent 设计空间搜索：从手工调参到机器自动发现"
date: 2026-08-18
author: "AI Research"
tags: ["Agent设计", "设计空间搜索", "ADAS", "AgentSquare", "MaAS", "Archon", "神经架构搜索", "元学习"]
reading_time: "约35分钟"
---

## 摘要

大语言模型（LLM）智能体的设计长期依赖人工专家的经验与反复试错：选择哪些模块（规划、推理、工具使用、记忆）、如何编排工作流、如何配置提示词与超参数——这些决策共同构成一个庞大而复杂的**设计空间**。2024年起，研究者开始将"自动化设计"本身作为一个形式化问题，借鉴神经架构搜索（NAS）的思想，让 LLM 作为"元智能体"自动搜索、组合、优化 Agent 架构。本文系统梳理这一新兴领域——**自动 Agent 设计空间搜索（Automated Agent Design Space Search）**——的核心范式、代表性框架、搜索策略、性能预测机制与评估信号，并给出选型指南与开放挑战。

---

## 目录

1. 为什么 Agent 设计需要"自动搜索"
2. 设计空间的形式化定义
3. ADAS：一切始于"元智能体编程"
4. AFlow：把工作流变成可搜索的代码图
5. AgentSquare：模块化设计空间搜索
6. Archon：推理时架构搜索与贝叶斯优化
7. MaAS：Agentic Supernet 与查询条件化
8. AgentSwift：价值引导的分层 MCTS
9. RAAS：用 GRPO 稳定超级网络训练
10. AutoMaAS：自演进多智能体架构
11. 性能预测器：低成本替代昂贵评估
12. 学习配置：从搜索到策略
13. 硬件/算法协同设计中的 AgentDSE
14. 递归自我改进：AIRA-Compose 与 AIRA-Design
15. 十种方法横评
16. 按场景选型指南
17. 未来方向与开放挑战
18. 常见问题

---

## 一、为什么 Agent 设计需要"自动搜索"

### 1.1 手工设计的天花板

LLM Agent 系统通常由人类专家手动组装：选用 Chain-of-Thought 还是 Tree-of-Thought？加不加 Self-Reflection？几个 Agent 协作？用什么提示词？如何分配工具？这些问题构成一个组合爆炸的**设计空间**。

以数学推理任务为例，仅考虑以下选择：
- **推理策略**：CoT / Self-Consistency / ToT / ReAct / Debate（5种）
- **反思机制**：无 / Self-Refine / Reflexion（3种）
- **工具使用**：无 / 计算器 / 代码解释器（3种）
- **记忆机制**：无 / 向量检索 / 结构化记忆（3种）

仅此四维就有 5×3×3×3 = **135 种组合**，每种还需精细调节提示词与超参数。人工穷举不可行，而专家直觉往往陷入局部最优。

### 1.2 历史的教训：手工设计终将被学习取代

> "机器学习的history teaches us that hand-designed solutions are eventually replaced by learned solutions." —— Hu et al., ADAS (2024) [citation:26]

图像识别中，HOG/SIFT 手工特征被 CNN 取代；NLP 中，手工特征工程被 Transformer 取代。Agent 设计正在经历同样的范式转移：从"人类编程 Agent"到"元智能体编程 Agent"。

### 1.3 评估成本：核心瓶颈

评估一个 Agent 配置的真实性能极其昂贵。在 ALFWorld 上评估一个 CoT Agent 约需 **$60**（GPT-4o API 调用）[citation:6]。若搜索空间有上千候选，单次完整搜索成本可达数万美元。这催生了**性能预测器（Performance Predictor）**——用低成本代理模型替代昂贵真实评估。

---

## 二、设计空间的形式化定义

### 2.1 从 NAS 到 Agent 搜索

自动 Agent 设计空间搜索直接借鉴了**神经架构搜索（NAS）** 的三要素分解 [citation:1]：

| NAS 要素 | Agent 搜索对应 |
|---|---|
| 搜索空间（Search Space） | Agent 模块组合空间（规划/推理/工具/记忆） |
| 搜索策略（Search Strategy） | LLM 元编程 / MCTS / 贝叶斯优化 / 策略梯度 |
| 性能估计（Performance Estimation） | 真实评估 / 性能预测器 / 价值模型 |

### 2.2 数学形式化

AgentSquare 将问题定义为离散优化 [citation:2][citation:3]：

$$\arg\max_{P\in\mathcal{P}, R\in\mathcal{R}, T\in\mathcal{T}, M\in\mathcal{M}} \mathrm{Eval}_d(P, R, T, M)$$

其中 $\mathcal{P}$（规划）、$\mathcal{R}$（推理）、$\mathcal{T}$（工具使用）、$\mathcal{M}$（记忆）是四个核心模块集合，$\mathrm{Eval}_d$ 是任务 $d$ 上的性能度量。

MaAS 进一步将搜索目标从"找一个固定架构"升级为"学一个架构分布" [citation:7][citation:28]：

$$\min_{\pi, \mathcal{O}} \; \mathbb{E}_{(q,a)\sim D,\; G\sim Q_\phi}\big[\,-\log p(a\mid q, \pi, \mathcal{O}) \;+\; \lambda \cdot C(G; q)\,\big]$$

其中 $Q_\phi$ 是 Agentic Supernet（参数化的架构分布），$C(G;q)$ 是采样架构 $G$ 在查询 $q$ 上的推理成本，$\lambda$ 权衡性能与开销。

### 2.3 核心模块分类法

主流框架普遍将 Agent 拆解为以下**标准化模块**，每个模块有统一输入-输出接口，支持即插即用 [citation:2][citation:3]：

| 模块 | 功能 | 典型实现 |
|---|---|---|
| **Planning（规划）** | 将任务分解为子目标 | CoT / ToT / ReAct / 层级规划 |
| **Reasoning（推理）** | 执行核心推理步骤 | CoT / Self-Consistency / Debate |
| **Tool Use（工具）** | 调用外部 API/代码 | Toolformer / 代码解释器 / 搜索 |
| **Memory（记忆）** | 维护跨轮次状态 | 向量检索 / 结构化日志 / 工作记忆 |

---

## 三、ADAS：一切始于"元智能体编程"

### 3.1 核心思想

2024年8月，Hu、Lu、Clune 提出 **ADAS（Automated Design of Agentic Systems）** [citation:26]，在 NeurIPS 2024 Open-World Agentic Workshop 获 Outstanding Paper。其洞察极为简洁：

> "Given that programming languages are Turing Complete, this approach theoretically enables the learning of **any possible agentic system**." [citation:26]

既然 Agent 用代码定义，而编程语言是图灵完备的，那么让一个"元智能体"（Meta Agent，通常是 GPT-4 级强模型）**编写和改进其他 Agent 的代码**，就能在理论上覆盖任意 Agent 结构。

### 3.2 Meta Agent Search 算法

ADAS 的搜索循环极简 [citation:26][citation:30]：

```
初始化：空档案 Archive = {}
循环：
  1. 元智能体读取 Archive 中所有历史 Agent 及其性能
  2. 元智能体编写一个新的、有趣的 Agent 代码
  3. 在验证集上评估新 Agent → 得到分数
  4. 将 (Agent代码, 分数) 加入 Archive
  5. 若收敛则停止，否则回到步骤1
```

### 3.3 实验结果

在 ARC、DROP、MGSM、MMLU、GPQA 五个基准上 [citation:30]：
- ADAS 发现的 Agent **超越所有手工基线**（CoT、Self-Consistency、Self-Refine、LLM-Debate 等）
- 在 MGSM 上发现的 Agent 迁移到 GSM8K（+25.9%）和 GSM-Hard（+13.2%）仍有效
- 用 GPT-3.5 评估发现的 Agent，换用 Claude 3.5 Sonnet 后 ARC 达 ~50%

### 3.4 涌现的新结构

ADAS 并非简单重组已知模块，而是**涌现全新设计模式** [citation:30]：
- **Multi-Step Peer Review Agent**（多步同行评审）：多个专家模块协作审查与改进
- **Divide and Conquer Agent**（分而治之）：将问题拆给不同专家再汇总

### 3.5 局限

- **无约束搜索空间**：任意代码意味着不可控、难复现
- **评估成本极高**：每个候选都需完整运行
- **收敛慢**：纯探索式搜索易陷局部最优

> ADAS 是"开放式的代码搜索"，后续工作则走向"结构化、可扩展"的搜索。

---

## 四、AFlow：把工作流变成可搜索的代码图

### 4.1 核心洞察

AFlow（ICLR 2025 Oral，前 1.8%）[citation:27][citation:31] 将 Agent 工作流**用代码表示为有向图**：节点是 LLM 调用单元，边是条件逻辑与数据流。这样，工作流优化就被**重新定义为图结构上的搜索问题**。

### 4.2 预定义算子（Operator）

为提高搜索效率，AFlow 提供一组可复用的**算子**作为搜索基元 [citation:31]：

| 算子 | 功能 |
|---|---|
| `Generate` | 生成内容 |
| `Format` | 格式化输出 |
| `Review` | 审查内容质量 |
| `Revise` | 根据反馈修改 |
| `Ensemble` | 集成多个结果 |
| `Test` | 测试代码正确性 |
| `Programmer` | 编程任务专用 |

### 4.3 MCTS 搜索算法

AFlow 使用**蒙特卡洛树搜索（MCTS）** 探索工作流空间 [citation:27][citation:36]：

```
初始化：模板工作流 W₀
循环：
  1. Selection：软混合分数与均匀探索选择节点
  2. Expansion：LLM 基于评估结果生成修改后的工作流
  3. Evaluation：在验证集上执行新工作流
  4. Update：将结果反向传播到搜索树
  5. 若 top-k 平均分 plateau 或达预算，停止
```

### 4.4 实验结果

- 在 6 个基准上**平均超越手工设计 5.7%**，**超越 ADAS 等自动方法 19.5%** [citation:27]
- 让小模型（DeepSeek-V2.5）在 HumanEval 上**匹敌 GPT-4o**，但成本仅为其 **4.55%** [citation:27]
- 消融实验：即使移除预定义算子，AFlow 也能自主发现集成式结构

### 4.5 局限

- 搜索空间仍限于**工作流结构**，未涵盖功能模块（记忆/工具/规划）的联合优化
- MCTS 在大规模空间中仍易陷局部最优

---

## 五、AgentSquare：模块化设计空间搜索

### 5.1 核心创新

清华大学团队提出的 **AgentSquare** [citation:2][citation:3] 将 NAS 中的"基于细胞的搜索"移植到 Agent 领域。其核心是**四模块标准化抽象**：

```
┌─────────────────────────────────────────┐
│         Agent = P + R + T + M          │
│                                         │
│  Planning → Reasoning → Tool Use → Memory│
│     (P)       (R)        (T)       (M)  │
└─────────────────────────────────────────┘
   每个模块有统一 I/O 接口，可即插即用
```

### 5.2 搜索算法：进化 + 重组交替

AgentSquare 的搜索循环交替执行两种操作 [citation:2][citation:3]：

- **Module Evolution（模块进化）**：LLM 程序员对某个模块做**代码级变异**，生成新变体
- **Module Recombination（模块重组）**：LLM 提议者从已发现的模块库中**挑选组合**

每次迭代后，用**性能预测器**过滤低质量候选，只对高潜力配置做真实评估。

### 5.3 性能预测器

AgentSquare 训练一个 LLM 性能预测器 $\pi_p$ [citation:47]：

$$v' = \pi_p(A', d, \mathbb{P}, \mathbb{R}, \mathbb{T}, \mathbb{M}, \mathbb{E})$$

其中 $A'$ 是候选 Agent，$d$ 是任务描述，$\mathbb{E}$ 是历史评估数据。该预测器与真实性能**相关系数 $\rho \approx 0.9$**，可将评估成本降低最高 **400×** [citation:3]。

### 5.4 实验结果

- 在 Webshop、ALFWorld、SciWorld 等 6 个基准上，**平均超越最佳手工设计 17.2%** [citation:2]
- 搜索轨迹比 ADAS 和模块级/prompt 级搜索更高效
- 生成**可解释的设计洞察**，帮助理解哪些模块组合对哪些任务有效

### 5.5 局限

- 固定四槽位单 Agent 流程，**不支持新控制流**（如循环、条件分支）
- 预测器仍依赖 LLM 推理，有一定开销

---

## 六、Archon：推理时架构搜索与贝叶斯优化

### 6.1 问题定位

Stanford 的 **Archon**（2024年9月）[citation:40][citation:44] 聚焦**推理时技术（Inference-Time Techniques）**的自动组合：生成集成、多采样、排序、融合、批判、验证、单元测试。

### 6.2 设计空间：三层组件分类

| 类型 | 功能 | 例子 |
|---|---|---|
| **Generative（生成式）** | 产生候选响应 | 集成生成、多采样 |
| **Reductive（归约式）** | 筛选/聚合响应 | 排序、融合 |
| **Comparative（比较式）** | 分析候选质量 | 批判、单元测试 |

### 6.3 贝叶斯优化

Archon 将架构搜索定义为**超参数优化问题**，用**高斯过程代理模型 + 贝叶斯优化**探索约 **9,576 种可行配置** [citation:44]。构造规则（如"Critic 必须在 Fuser 之前"）剪枝无效配置。

### 6.4 漏斗策略

成功架构普遍遵循**"漏斗"模式** [citation:44]：
1. **宽入口**：并行生成大量候选
2. **逐层筛选**：Critic 评估 → Ranker 排序 → Fuser 融合
3. **窄出口**：输出单一高质量结果

### 6.5 实验结果

- 在 MT-Bench、Arena-Hard-Auto、AlpacaEval 2.0、MATH、CodeContests 上
- **超越 GPT-4o 和 Claude 3.5 Sonnet 平均 14.1 个百分点**（全源模型）[citation:40]
- 在 MATH 上训练成本仅 **$3.38**，而 AFlow 需 **$22.50** [citation:37]

---

## 七、MaAS：Agentic Supernet 与查询条件化

### 7.1 核心洞察

ICML 2025 的 **MaAS（Multi-agent Architecture Search）** [citation:28][citation:32] 指出：现有方法搜索一个**静态、一刀切**的架构，但不同查询的复杂度差异巨大——简单问题不值得复杂流程。

### 7.2 Agentic Supernet

MaAS 引入 NAS 中的 **Supernet（超级网络）** 概念 [citation:28]：

```
Layer 1: [CoT | ReAct | Debate | Self-Refine | Early-Exit]
              ↓ (概率采样)
Layer 2: [CoT | ReAct | Debate | Self-Refine | Early-Exit]
              ↓
Layer 3: [CoT | ReAct | Debate | Self-Refine | Early-Exit]
              ↓
Layer 4: [CoT | ReAct | Debate | Self-Refine | Early-Exit]
```

- 每条路径是一个完整的 Agent 架构
- **Controller**（轻量编码器）读取查询嵌入，逐层采样操作
- **Early-Exit 操作符**：若判断已解决，提前退出，省去后续 LLM 调用

### 7.3 双重优化

| 优化目标 | 方法 | 说明 |
|---|---|---|
| 架构分布 $\pi$ | 蒙特卡洛策略梯度 | 学习哪些路径对哪些查询有效 |
| 操作符内部 $\mathcal{O}$ | 文本梯度（Textual Gradients） | LLM "梯度智能体"根据反馈改写提示词 [citation:28] |

### 7.4 实验结果

在 GSM8K、MATH、MultiArith、HumanEval、MBPP、GAIA 上 [citation:28][citation:32]：

| 指标 | 结果 |
|---|---|
| 推理成本 | 仅基线方法的 **6–45%** |
| 性能提升 | 超越手工与自动基线 **0.54%–11.82%** |
| 跨数据集迁移 | 优秀 |
| 跨 LLM 骨干迁移 | 优秀 |

---

## 八、AgentSwift：价值引导的分层 MCTS

### 8.1 AAAI 2026 论文

**AgentSwift** [citation:6][citation:8] 是 AgentSquare 的精神继承者，核心改进有三：

1. **分层搜索空间**：联合优化工作流（Workflow）和功能组件（Memory/Tool/Planning）
2. **轻量价值模型**：替代昂贵的 in-context LLM 预测器
3. **不确定性引导 MCTS**：优先探索"预测分数高但不确定"的区域

### 8.2 价值模型

AgentSwift 训练一个**轻量 7B 模型**作为价值模型 [citation:42]：

$$\hat{v} = f_\theta(\mathbf{A}, d)$$

其中 $\mathbf{A} = (\mathbf{W}, \mathbf{M}, \mathbf{T}, \mathbf{P})$ 是完整 Agent 配置。训练数据通过**成对覆盖数组 + 贝叶斯采样**构建，确保覆盖工作流与组件的交互组合 [citation:8]。

### 8.3 不确定性引导扩展

MCTS 扩展阶段三种操作 [citation:6][citation:8]：

| 操作 | 说明 |
|---|---|
| **Recombination（重组）** | 从库中抽取现有模块替换 |
| **Mutation（变异）** | 基于历史性能探索新变体 |
| **Refinement（精修）** | 根据失败案例反馈调整 |

不确定性估计引导搜索优先探索**高预测值 + 高不确定性**的区域，平衡探索与利用。

### 8.4 实验结果

在 7 个基准上**平均提升 8.34%** [citation:6]，覆盖推理、工具使用、代码生成等多领域。

---

## 九、RAAS：用 GRPO 稳定超级网络训练

### 9.1 CVPR 2026 论文

**RAAS（Robust Agentic Supernet Search）** [citation:7] 在 MaAS 基础上解决核心不稳定性：

1. **任务难度纠缠**：绝对分数混淆了"查询难"与"架构差"
2. **执行随机性**：单次运行捕获的是 transient artifact

### 9.2 双模块评估框架

| 模块 | 功能 |
|---|---|
| **CAO（Contextual Merit）** | 同伴归一化、零中心化的上下文 merit 分数 |
| **MTAS（Multi-Trial Synthesis）** | 多轮统计合成，减少方差 |

### 9.3 闭环流水线

```
查询 → Controller 采样架构 → 同伴队列评估 (CAO)
                                ↓
                         多轮聚合 (MTAS)
                                ↓
                     Merit-Weighted 分布更新 (GRPO)
                                ↓
                          下一轮采样
```

### 9.4 实验结果

| 基准 | RAAS | 最强基线 | 提升 |
|---|---|---|---|
| MATH | 60.87% | 52.08% | **+8.79** |
| GSM8K | 95.16% | 91.84% | **+3.32** |
| HumanEval | 96.31% | 92.23% | **+4.08** |
| MBPP | 84.18% | 78.71% | **+5.47** |
| GAIA | 20.84% | 18.06% | **+2.78** |

平均 +5.41，成本仅 MaAS 的 ~94%（N=5, K=5 → 25 runs/query，每查询约 $0.31）[citation:7]。

---

## 十、AutoMaAS：自演进多智能体架构

### 10.1 核心创新

**AutoMaAS** [citation:12] 在 MaAS 基础上引入**动态操作符生命周期管理**：

1. **自动生成**：基于性能-成本分析创建新操作符
2. **融合**：合并互补操作符
3. **淘汰**：移除低效操作符
4. **在线反馈集成**：持续架构精化
5. **决策追踪**：增强可解释性

### 10.2 实验结果

在 6 个基准上**提升 1.0–7.1%**，同时**降低推理成本 3–5%** [citation:12]，并展示优秀的跨数据集与跨 LLM 迁移性。

---

## 十一、性能预测器：低成本替代昂贵评估

### 11.1 为什么需要预测器

这是整个领域的**经济性基石**。评估一个 Agent 候选的真实性能需要：
- 在完整验证集上运行
- 每次运行调用 LLM API
- 成本从几美元到数百美元不等

**性能预测器**用低成本代理替代这一过程，是整个搜索可行的关键。

### 11.2 三代预测器演进

| 代际 | 方法 | 成本 | 准确性 | 代表 |
|---|---|---|---|---|
| 第一代 | In-context LLM 预测 | 中（每次调用强模型） | 高（ρ≈0.9） | AgentSquare [citation:3] |
| 第二代 | 轻量微调模型 | 低（7B 前向传播） | 高 | AgentSwift [citation:42] |
| 第三代 | 学习型价值模型 + 不确定性 | 极低 | 高 + 校准 | AgentSwift [citation:6] |

### 11.3 预测器训练数据构建

AgentSwift 的数据构建策略值得注意 [citation:8]：
- **成对覆盖数组（Pairwise Covering Arrays）**：确保工作流与组件交互的全面覆盖
- **平衡贝叶斯采样**：从搜索空间的高性能区和低性能区均衡采样
- 使模型能泛化到未见过的设计组合

---

## 十二、学习配置：从搜索到策略

### 12.1 范式升级

2026年2月，Taparia 等人提出 **ARC（Agentic Resource & Configuration learner）** [citation:29]，将"为每个查询搜索架构"升级为"**学习一个轻量策略，直接输出配置**"：

- 输入：查询 $q$
- 输出：完整配置（工作流 + 工具 + Token 预算 + 提示词）
- 方法：**分层强化学习策略**

### 12.2 实验效果

- **准确率提升最高 25%**
- **Token 与运行时间成本同步降低**
- 一次训练，推理时零搜索开销

### 12.3 与 MaAS 的关系

| 维度 | MaAS | ARC |
|---|---|---|
| 推理时 | 每次查询采样 + 评估 | 一次前向传播 |
| 训练 | 策略梯度 + 文本梯度 | 分层 RL |
| 成本 | 每查询 $0.31 | 接近零边际成本 |

> ARC 是 MaAS 的"编译版"：把搜索过程**蒸馏**成一个可直接调用的策略网络。

---

## 十三、硬件/算法协同设计中的 AgentDSE

### 13.1 问题领域

**AgentDSE**（2026年6月）[citation:11][citation:48] 将 Agent 设计空间搜索的思想移植到**计算机体系结构**领域：DNN 加速器映射、软硬件协同设计、CPU 缓存层次优化。

### 13.2 仿真器在环（Simulator-in-the-Loop）

```
┌──────────────────────────────────────┐
│         AgentDSE 工作区              │
│                                      │
│  README.md ← 目标与领域上下文        │
│  action_space.md ← 候选字段与约束    │
│  candidate.yaml ← 当前设计点        │
│  eval.py / submit.sh ← 仿真器接口   │
│  notes.md ← 推理日志（TAO轨迹）     │
└──────────────────────────────────────┘
        ↓ 假设 → 行动 → 观察 循环
```

### 13.3 推理增强的搜索

LLM 编码智能体执行**假设-测试-精修**循环 [citation:48][citation:51]：
1. **Reasoning**：分析历史指标，形成关于"该调哪个维度"的假设
2. **Action**：更新 candidate.yaml，调用仿真器
3. **Observation**：将指标反馈写入 notes.md

### 13.4 实验结果

| 对比维度 | AgentDSE | 传统方法（BO/GA/RL） |
|---|---|---|
| 仿真器调用次数 | **少 100×** | 数万次 |
| 与 DOSA（可微 DSE）对比 | EDP 相当 | 少 37×（逐层）/ 165×（网络级）调用 |
| 架构语义注入 | 额外 2.4× 加速 | 无 |

### 13.5 可审计轨迹

与传统黑盒优化器不同，AgentDSE 生成**显式 TAO 轨迹**（Thinking-Action-Observation），让人类架构师能审查每个决策的理由 [citation:48]。

---

## 十四、递归自我改进：AIRA-Compose 与 AIRA-Design

### 14.1 Meta FAIR 的宏大愿景

2026年5月，Meta FAIR 团队发布 **AIRA（Agentic Discovery of Neural Architectures）** [citation:9][citation:49]，将 Agent 设计搜索推向**递归自我改进**的前沿：让 LLM Agent **自主设计下一代基础模型架构**。

### 14.2 双框架设计

| 框架 | 层级 | 任务 |
|---|---|---|
| **AIRA-Compose** | 高层架构搜索 | 组合 Attention / MLP / Mamba 等计算原语 |
| **AIRA-Design** | 低层机制实现 | 编写新注意力机制、优化训练脚本 |

### 14.3 AIRA-Compose 流程

```
11 个 Agent → 在 24 小时预算内探索架构空间
    ↓
在百万参数规模评估候选
    ↓
Top 设计外推到 350M / 1B / 3B
    ↓
预训练 + 下游评估
```

### 14.4 实验结果

| 指标 | AIRAformer-D | AIRAhybrid-D | 基线（Llama 3.2） |
|---|---|---|---|
| 下游准确率 | **+2.4%** | **+3.8%** | 基准 |
| 缩放效率（Transformer） | **快 54%** | — | 基准 |
| 缩放效率（Hybrid） | — | **快 23–37%** | Nemotron-2 / Composer |

在 Long Range Arena 上，Agent 设计的架构在文档匹配和文本分类上**距人类 SOTA 仅 2.3–2.6 个百分点** [citation:49]。

### 14.5 AIRA-Design：编写注意力机制

20 个 Agent 被指派**从头编写新的注意力机制**处理长距离依赖。在 Autoresearch 基准上，**Greedy Opus 4.5 达到 0.968 验证 BPB**，超越已发表最优参考（0.9775）[citation:49]。

### 14.6 意义

> "AI research agents can autonomously discover hybrid architectures and algorithmic optimizations that rival or surpass hand-designed baselines — a step towards **recursive self-improvement**." [citation:9]

---

## 十五、十种方法横评

### 15.1 九维星级评分矩阵

| 方法 | 搜索空间广度 | 评估效率 | 成本效益 | 性能上限 | 可解释性 | 迁移性 | 实现复杂度 | 适用规模 | 创新度 |
|---|---|---|---|---|---|---|---|---|---|
| **ADAS** | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | 中小 | ★★★★★ |
| **AFlow** | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | 中小 | ★★★★☆ |
| **AgentSquare** | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | 中小 | ★★★★☆ |
| **Archon** | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | 中大 | ★★★★☆ |
| **MaAS** | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★★ | ★★★★☆ | 中大 | ★★★★★ |
| **AgentSwift** | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | 中大 | ★★★★★ |
| **RAAS** | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★★ | ★★★★★ | 大 | ★★★★★ |
| **AutoMaAS** | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★☆ | 中大 | ★★★★★ |
| **ARC (Learn-to-Configure)** | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | 大 | ★★★★☆ |
| **AIRA-Compose/Design** | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★★★ | 超大 | ★★★★★ |

### 15.2 性能基准对比

| 方法 | 代表基准 | 平均提升 | 成本特征 |
|---|---|---|---|
| ADAS | ARC/DROP/MMLU | +5~15% over baselines | 高（每候选完整评估） |
| AFlow | 6 benchmarks | +5.7% over hand / +19.5% over ADAS | 中（MCTS 引导） |
| AgentSquare | Webshop/ALFWorld/SciWorld | **+17.2%** over hand | 低（400× 预测器加速） |
| Archon | MT-Bench/MATH/CodeContests | **+14.1pp** over GPT-4o | 中（BO 样本高效） |
| MaAS | GSM8K/MATH/HumanEval/MBPP/GAIA | +0.54~11.82% | 极低（6-45% 基线成本） |
| AgentSwift | 7 benchmarks | **+8.34%** | 低（价值模型） |
| RAAS | MATH/GSM8K/HumanEval/MBPP/GAIA | **+5.41%** avg | 低（~$0.31/query） |
| AIRA-Compose | 1B pre-training + downstream | +2.4~3.8% over Llama 3.2 | 高（大规模预训练） |

---

## 十六、按场景选型指南

### 16.1 十二种典型场景

| 场景 | 首选方案 | 备选方案 | 关键考量 |
|---|---|---|---|
| **快速原型验证** | ADAS | AFlow | 开放空间，探索性强 |
| **资源受限搜索** | AgentSquare | AgentSwift | 性能预测器降成本 |
| **推理时架构优化** | Archon | MaAS | 贝叶斯优化样本高效 |
| **查询自适应部署** | MaAS | ARC | 按查询动态分配资源 |
| **大规模生产服务** | RAAS | AutoMaAS | 稳定性 + 成本控制 |
| **跨任务泛化** | AgentSwift | MaAS | 价值模型泛化性好 |
| **代码生成任务** | AFlow + Ensemble | Archon | 单元测试是关键 |
| **数学推理** | RAAS | MaAS | GRPO 稳定训练 |
| **多 Agent 协作** | AutoMaAS | DyLAN | 动态生命周期管理 |
| **硬件协同设计** | AgentDSE | — | 仿真器在环 |
| **下一代架构发现** | AIRA-Compose | AIRA-Design | 递归自我改进 |
| **教学/研究入门** | ADAS | AFlow | 概念清晰易实现 |

---

## 十七、未来方向与开放挑战

### 17.1 技术路线图

```
2024                    2025                    2026                    2027+
│                        │                       │                       │
├ ADAS (NeurIPS)         ├ AgentSquare (ICLR)     ├ AgentSwift (AAAI)     ├ 递归自我改进
├ AFlow (ICLR Oral)      ├ Archon (Stanford)      ├ RAAS (CVPR)          ├ 多目标联合优化
└ Archon (Stanford)       ├ MaAS (ICML Oral)      ├ AutoMaAS             ├ 硬件-算法闭环
                         └ DyLAN (EMNLP)          ├ ARC (Learn-to-Config) ├ 标准化评估基准
                                                 ├ AgentDSE
                                                 └ AIRA-Compose/Design
```

### 17.2 六大开放挑战

| 挑战 | 核心问题 | 当前进展 |
|---|---|---|
| **搜索空间定义** | 如何界定"足够大"又不失控？ | 模块化 + 分层约束 |
| **评估信号质量** | 绝对分数 vs 同伴比较？单次 vs 多轮？ | CAO/MTAS 双模块 |
| **过拟合风险** | 在验证集上搜索导致过拟合 | 交叉验证 + 迁移测试 |
| **可重复性** | LLM 输出随机性导致结果不稳定 | 种子固定 + 多轮聚合 |
| **计算成本** | 大规模搜索仍昂贵 | 价值模型 + 预测器 + 蒸馏 |
| **理论理解** | 为什么某些结构涌现？能否预测？ | 早期探索阶段 |

---

## 十八、常见问题

### Q1：自动 Agent 搜索与神经架构搜索（NAS）的本质区别是什么？

**答：** 三者核心范式相同（搜索空间 + 策略 + 评估），但有两个关键差异：
1. **搜索空间是代码而非矩阵**：Agent 空间由 LLM 可执行的程序构成，表达能力更强（图灵完备），但也更难约束。
2. **评估不可微分**：NAS 可用梯度反传，Agent 评估调用外部 LLM API，只能通过强化学习或文本梯度优化。

### Q2：性能预测器会不会引入偏差，导致错过好架构？

**答：** 会。这是当前方法的**核心风险**。AgentSquare 的实验显示预测器与真实性能相关系数约 0.9，意味着仍有 10% 的"好架构可能被误杀"。缓解策略包括：不确定性估计（AgentSwift）、多轮验证（RAAS MTAS）、定期用真实评估校准。

### Q3：MaAS 的"查询条件化"在小数据集上有效吗？

**答：** 有效但有前提。MaAS 的 Controller 需要足够多的查询-架构-性能三元组来学习路由策略。在小数据集（<100 查询）上，建议：
- 用预训练的句子编码器初始化 Controller
- 从 AgentSquare 的搜索结果热启动
- 降低控制器复杂度（如用线性层替代 Transformer）

### Q4：AIRA 的"递归自我改进"是否意味着 AI 可以完全自主设计 AI？

**答：** 目前仍是**有限自主**。AIRA 在 24 小时预算内搜索，架构仍需人类定义搜索空间边界（Attention/MLP/Mamba 等原语），训练脚本由 Agent 编写但超参数范围由人类设定。真正的"完全自主"还需解决：安全验证、能耗约束、伦理对齐等外部约束的形式化。

### Q5：对于资源有限的团队，最务实的入门路径是什么？

**答：** 推荐三步走：
1. **从 AFlow 开始**：安装 MetaGPT，在 MATH 或 HumanEval 上跑通优化流程，理解 MCTS + 算子搜索的基本范式
2. **接入 AgentSquare 的预测器**：用少量真实评估 + LLM 预测器加速搜索
3. **迁移到 MaAS/ARC**：当任务量增大、需要查询自适应时，升级到超级网络 + 学习策略

---

## 参考文献

[1] Hu, S., Lu, C., & Clune, J. (2024). Automated Design of Agentic Systems. *arXiv:2408.08435*. NeurIPS 2024 Open-World Agentic Workshop Outstanding Paper.

[2] Shang, Y., et al. (2024). AgentSquare: Automatic LLM Agent Search in Modular Design Space. *Tsinghua University*. alphaXiv / arXiv:2410.06153.

[3] Shang, Y., et al. (2024). Modularized LLM Agent Search (MoLAS). *API EmergentMind*.

[4] Jeong, S., Kim, M., & Kim, T. (2026). Agentic Neural Architecture Search. *arXiv:2607.07984*. Pith Review.

[5] Pepe, A., Lin, C.-Y., Magka, D., Acun, B., Wu, Y. N., Protopopov, A., Wu, C.-J., & Bachrach, Y. (2026). Agentic Discovery of Neural Architectures: AIRA-Compose and AIRA-Design. *arXiv:2605.15871*. Meta FAIR.

[6] Anonymous. (2026). AgentSwift: Efficient LLM Agent Design via Value-guided Hierarchical Search. *AAAI 2026*. arXiv:2506.06017. GitHub: Ericccc02/AgentSwift.

[7] Yang, et al. (2026). RAAS: LLM Agentic System Architecture Search with GRPO. *CVPR 2026*. OpenAccess CVF.

[8] Anonymous. (2025). AgentSwift: Efficient LLM Agent Design via Value-guided Hierarchical Search. *arXiv:2506.06017*. ar5iv.

[9] Pepe, A., et al. (2026). Agentic Discovery of Neural Architectures. *alphaXiv Audio Overview*. arXiv:2605.15871v1.

[10] Wu, Y., Li, D., Chen, Y., Jiang, R., Zou, H. P., Fang, L., Wang, Z., Yu, P. S. (2025). Multi-Agent Autonomous Driving Systems with Large Language Models: A Survey. *arXiv:2502.16804v2*.

[11] Wang, C., Shi, J. C., Kong, D., Boning, D. S., Wan, Z., Du, Y., & Reddi, V. J. (2026). AgentDSE: Reasoning-Augmented Architectural Design Space Exploration. *arXiv:2606.21836v1*. DeepPaper.

[12] Anonymous. (2025). AutoMaAS: Self-Evolving Multi-Agent Architecture Search for Large Language Models. *arXiv:2510.02669*.

[13] Carreon, A., Sharma, V., & Raman, V. (2025). AUTO: Strategic Search for Design Optimization with LLM Agents. *University of Michigan*. alphaXiv 中文版: arXiv:2511.22651.

[14] Zhang, G., Niu, L., Fang, J., Wang, K., Bai, L., & Wang, X. (2025). Multi-agent Architecture Search via Agentic Supernet. *ICML 2025 Oral*. arXiv:2502.04180.

[15] Saad-Falcon, J., Lafuente, A. G., Natarajan, S., Maru, N., Todorov, H., Guha, E., Buchanan, E. K., Chen, M., Guha, N., Ré, C., & Mirhoseini, A. (2024). Archon: An Architecture Search Framework for Inference-Time Techniques. *Stanford University*. scalingintelligence.stanford.edu.

[16] Zhang, et al. (2025). AFlow: Automating Agentic Workflow Generation. *ICLR 2025 Oral* (top 1.8%). alphaXiv / arXiv:2410.10762v4.

[17] Li, Z., Lin, Z., & Wang, Y. (2025). CoLLM-NAS: Collaborative Large Language Models for Efficient Knowledge-Guided Neural Architecture Search. *arXiv:2509.26037*. Pith Review.

[18] Taparia, A., Sagar, S., & Senanayake, R. (2026). Learning to Configure Agentic AI Systems (ARC). *arXiv:2602.11574*. arxiv-vanity.

[19] Xiang, et al. (2025). Self-Supervised Prompt Optimization (SPO). *DeepWisdom*. arXiv:2502.06855.

[20] Liu, Z., Zhang, Y., Li, P., Liu, Y., & Yang, D. (2024). DyLAN: A Dynamic LLM-Powered Agent Network for Task-Oriented Agent Collaboration. *EMNLP 2024*. arXiv:2310.02170.

[21] Zijun Hu. Automated Design of Agentic Systems. *ORCID: 0009-0007-6433-8878*. UT Austin.

[22] AgentSquare: Automatic LLM Agent Search. *Tsinghua University FI.ee*.

[23] Jawahar, G., et al. (2023). LLMs for Neural Architecture Search. *Cited in AgentSquare*.

[24] LLM-Blender: Ensembling Large Language Models with Pairwise Comparison. *Cited in Archon*.

[25] Mixture-of-Agents (MoA). *Cited in Archon*.

[26] Hu, S., Lu, C., & Clune, J. (2024). Automated Design of Agentic Systems. *arXiv:2408.08435v2*. Submitted Aug 15 2024, revised Mar 2 2025.

[27] AFlow: Automating Agentic Workflow Generation. *ICLR 2025 Oral Presentation*. alphaxiv.org/overview/2410.10762v4.

[28] MaAS: Multi-agent Architecture Search via Agentic Supernet. *ICML 2025*. openaccess.thecvf.com / lacuna.tiptreesystems.com.

[29] Learn-to-Configure (ARC). *arXiv:2602.11574*. arxiv-vanity.com.

[30] ADAS 论文解説. *Preferred Networks Tech Blog*. tech.preferred.jp/ja/blog/adas.

[31] AFlow 与 SPO: 自动化工作流生成与提示优化. *LearnGraph Online*. learngraph.online.

[32] Multi-Agent System: Dynamically-Decided Architectures. *hungchun0201.github.io*.

[33] AgentSwift: Efficient LLM Agent Design via Value-guided Hierarchical Search. *en.papernotes.org*. AAAI2026.

[34] AgentSwift: Value model. *Tsinghua University FI.ee*. fi.ee.tsinghua.edu.cn.

[35] AgentDSE: Reasoning-Augmented Architectural Design Space Exploration. *themoonlight.io* (中文版).

[36] AFlow optimization process. *ima.qq.com knowledge base*.

[37] MaAS: Agentic Supernet details. *hungchun0201.github.io/agentic-ai-survey*.

[38] MAS-GPT: Supervised Fine-Tuning for MAS. *ICML 2025*. arXiv:2503.03686.

[39] Archon: An Architecture Search Framework for Inference-Time Techniques. *lacuna.tiptreesystems.com*.

[40] Archon: Full PDF. *Stanford Scaling Intelligence*. scalingintelligence.stanford.edu/pubs/archon.pdf.

[41] SPO: Self-Supervised Prompt Optimization. *AI Daily Papers / emergentmind.com*. arXiv:2502.06855.

[42] AgentSwift value model training. *Tsinghua University*. fi.ee.tsinghua.edu.cn/public/...pdf.

[43] AgentDSE: Reasoning-Augmented DSE. *themoonlight.io* (英文版).

[44] Archon: Lacuna summary. *lacuna.tiptreesystems.com*.

[45] Self-Supervised Prompt Optimization frameworks. *emergentmind.com*.

[46] CudaForge: Multi-Agent CUDA Kernel Optimization. *arXiv:2511.01884*.

[47] AgentSquare performance predictor. *arxiv-vanity.com/papers/2410.06153*.

[48] AgentDSE: Literature Review. *themoonlight.io/en/review/agentdse*.

[49] AIRA-Compose & AIRA-Design. *arXiv.org/abs/2605.15871*.

[50] CoLLM-NAS: Collaborative LLM-based NAS. *arXiv:2509.26037*.

---

*本文基于截至 2026 年 8 月公开资料撰写，部分预印本论文尚未经同行评审，结论可能随后续修订更新。*
