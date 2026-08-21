---
title: "强化学习前沿综述：从PPO到GRPO，从世界模型到Agentic RL"
subtitle: "2025–2026年核心技术路线、算法演进与工程实践"
date: "2026-08-16"
author: "AI Research"
tags: ["强化学习", "RLHF", "GRPO", "RLVR", "DreamerV3", "Agentic RL", "世界模型", "离线RL", "安全RL"]
reading_time: "约22分钟"
---

> **先说结论**
>
> 如果你今天要训练一个能推理的大模型或部署一个机器人策略，RL的工具箱已经彻底变了：
>
> - **RLHF（PPO + 奖励模型）** 不再是默认选项——它仍用于安全对齐，但已被**RLVR（可验证奖励）** 在推理任务上全面取代。
> - **GRPO** 成为开源社区的事实标准，但2025下半年起 **DAPO / GSPO / F-GRPO** 等改进版才是SOTA。
> - **世界模型** 已登上 Nature：DreamerV3 用一套超参数在150+任务上超越专用算法，并首次从零通关Minecraft钻石。
> - **离线→在线迁移** 找到了工程解（Cal-QL、Q-chunking），机器人落地不再需要从零交互。
> - **Agentic RL** 正在把"用工具、查资料、写代码"变成可训练的策略能力，而非硬编码流程。
>
> 这篇文章帮你把这五条线串起来，给出可执行的选型判断。

---

## 目录

1. [强化学习到底在解决什么问题](#1-强化学习到底在解决什么问题)
2. [技术全景图：五条主线](#2-技术全景图五条主线)
3. [主线一：LLM后训练RL——从RLHF到GRPO家族](#3-主线一llm后训练rl从rlhf到grpo家族)
   - 3.1 RLHF + PPO：奠基者（2022）
   - 3.2 DPO：删掉奖励模型（2023）
   - 3.3 GRPO + RLVR：删掉Critic（2025）
   - 3.4 DeepSeek-R1：纯RL激发推理的工程拐点
   - 3.5 GRPO家族的进化（2025–2026）
4. [主线二：经典深度RL——从DQN到1000层网络](#4-主线二经典深度rl从dqn到1000层网络)
   - 4.1 价值方法：DQN的十年演进
   - 4.2 策略梯度：PPO与SAC的分工
   - 4.3 深度缩放定律：1000层网络带来的跃迁
5. [主线三：世界模型——DreamerV3与MuZero谱系](#5-主线三世界模型dreamerv3与muzero谱系)
   - 5.1 DreamerV3：通用RL的Nature突破
   - 5.2 MuZero与搜索式规划
   - 5.3 扩散世界模型与机器人控制
6. [主线四：离线到在线RL——从历史数据到部署策略](#6-主线四离线到在线rl从历史数据到部署策略)
   - 6.1 保守Q学习与Cal-QL
   - 6.2 动作分块（Q-chunking）
   - 6.3 贝叶斯世界模型NEUBAY
7. [主线五：Agentic RL——让模型学会"做事"](#7-主线五agentic-rl让模型学会做事)
   - 7.1 工具使用与自适应探索
   - 7.2 过程奖励与信用分配
   - 7.3 编码、数学、GUI三大场景
8. [安全强化学习：约束MDP与Lyapunov方法](#8-安全强化学习约束mdp与lyapunov方法)
9. [十项横评表：方法 × 能力矩阵](#9-十项横评表方法--能力矩阵)
10. [场景选型表：一句话告诉你该用什么](#10-场景选型表一句话告诉你该用什么)
11. [FAQ：五个关键问题](#11-faq五个关键问题)
12. [总结与展望](#12-总结与展望)
13. [参考文献](#13-参考文献)

---

## 1. 强化学习到底在解决什么问题

强化学习（Reinforcement Learning, RL）研究的是**智能体通过与环境交互、从奖励信号中学习决策策略**的范式。形式化为马尔可夫决策过程（MDP）：

$$
\mathcal{M} = (\mathcal{S}, \mathcal{A}, P, R, \gamma)
$$

- $\mathcal{S}$：状态空间
- $\mathcal{A}$：动作空间
- $P(s'|s,a)$：状态转移概率
- $R(s,a)$：奖励函数
- $\gamma \in [0,1)$：折扣因子

目标是学习策略 $\pi(a|s)$ 最大化累积折扣回报：

$$
J(\pi) = \mathbb{E}_{\tau \sim \pi}\left[\sum_{t=0}^{\infty} \gamma^t R(s_t, a_t)\right]
$$

过去十年，RL从游戏（Atari、Go）走向机器人、大语言模型对齐、电力系统、医疗决策。2025–2026年的核心变化是：**RL不再只是"学玩游戏"，而是成为训练通用推理能力和安全自主系统的核心引擎**。

---

## 2. 技术全景图：五条主线

```
强化学习 2025–2026
│
├── 主线一：LLM后训练RL
│   ├── RLHF + PPO ──────────── 奠基（2022）
│   ├── DPO / KTO / SimPO ───── 删掉奖励模型（2023–2024）
│   ├── GRPO + RLVR ─────────── 当前主力（2025）
│   ├── DAPO / GSPO / F-GRPO ─ 工程化改进（2025–2026）
│   └── Agentic RL ──────────── 多轮工具使用（2025–2026）
│
├── 主线二：经典深度RL
│   ├── 价值方法：DQN → 分布式DQN → 多步Bootstrapping
│   ├── 策略梯度：PPO（在线） / SAC（连续控制）
│   └── 深度缩放：1000层网络 → 2–50×性能提升
│
├── 主线三：世界模型
│   ├── Dreamer家族（V1→V3）→ Nature 2025
│   ├── MuZero → EfficientZero V2 → TransZero
│   └── 扩散世界模型 / VLA + WM
│
├── 主线四：离线→在线RL
│   ├── CQL → Cal-QL（校准离线预训练）
│   ├── Q-chunking（动作分块）
│   └── NEUBAY（贝叶斯世界模型）
│
└── 主线五：安全RL
    ├── CMDP + 拉格朗日方法
    ├── Lyapunov / Barrier函数
    └── Safe RLHF / 可认证安全
```

---

## 3. 主线一：LLM后训练RL——从RLHF到GRPO家族

### 3.1 RLHF + PPO：奠基者（2022）

OpenAI的InstructGPT论文（Ouyang et al., 2022）确立了RLHF三步走流程：

1. **SFT**：在人工标注的指令-回答对上做监督微调
2. **训练奖励模型（RM）**：收集人类对模型输出的偏好排序，训练一个标量奖励模型
3. **PPO优化**：以RM为环境，用近端策略优化（PPO）微调语言模型

PPO的目标函数：

$$
\mathcal{L}^{PPO} = \mathbb{E}_t\left[\min\left(r_t(\theta)\hat{A}_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t\right)\right]
$$

其中 $r_t(\theta) = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}$ 是重要性采样比率，$\hat{A}_t$ 由Critic（价值网络）估计。

**PPO的代价**：训练时需要同时维护四个模型——策略模型、参考策略、奖励模型、价值模型，GPU显存占用巨大[citation:7][citation:10]。

### 3.2 DPO：删掉奖励模型（2023）

Rafailov et al.（2023）发现：RLHF中的奖励模型可以**解析地反解**为策略的对数概率比，从而跳过RM训练和PPO的复杂流程。

DPO损失函数：

$$
\mathcal{L}_{DPO} = -\mathbb{E}\left[\log\sigma\left(\beta\log\frac{\pi_\theta(y_w|x)}{\pi_{ref}(y_w|x)} - \beta\log\frac{\pi_\theta(y_l|x)}{\pi_{ref}(y_l|x)}\right)\right]
$$

- $y_w$：人类偏好的回答
- $y_l$：被拒绝的回答
- $\pi_{ref}$：冻结的参考策略
- $\beta$：控制偏离参考策略的强度

**优势**：实现简单（标准分类损失）、训练稳定、显存节省30–50%。**局限**：只能利用偏好对，无法处理可验证的精确奖励[citation:6][citation:7]。

后续变体：
- **KTO**（Kahneman-Tversky Optimization）：基于前景理论，只需"好/坏"标签，不需要配对[citation:7]
- **SimPO**：去掉参考模型，用长度归一化改进，在AlpacaEval 2上达到72.4%胜率[citation:6]

### 3.3 GRPO + RLVR：删掉Critic（2025）

DeepSeek-R1技术报告（2025年1月）引入了**组相对策略优化（GRPO）**，核心创新是**彻底删除Critic网络**[citation:3][citation:10]。

**GRPO的工作原理**：

对于同一个prompt，模型生成 $G$ 个候选回答 $\{o_1, o_2, \ldots, o_G\}$，每个获得可验证奖励 $r_i$：

$$
\hat{A}_i = \frac{r_i - \text{mean}(\{r_j\})}{\text{std}(\{r_j\}) + \epsilon}
$$

**没有Critic、没有价值网络**——优势估计完全由组内统计量给出。

GRPO目标函数：

$$
\mathcal{L}^{GRPO} = \mathbb{E}\left[\frac{1}{G}\sum_{i=1}^{G}\min\left(r_i(\theta)\hat{A}_i, \text{clip}(r_i(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_i\right) - \beta D_{KL}(\pi_\theta || \pi_{ref})\right]
$$

**为什么GRPO是分水岭**[citation:2][citation:3]：
- GPU显存降低约40–50%（无Critic）
- DeepSeek-R1-Zero证明：**纯RL从零训练即可涌现多步链式推理、自我验证、扩展思考**
- 训练数据只需可自动验证的题目（数学、代码），无需人工标注

**RLVR（Reinforcement Learning with Verifiable Rewards）** 是配套的奖励范式：用确定性验证器（单元测试、数学答案解析器）替代学习型奖励模型，奖励是二值的 $\{0, 1\}$，无需人类标注[citation:4][citation:8]。

### 3.4 DeepSeek-R1：纯RL激发推理的工程拐点

DeepSeek-R1（2025年1月发布，2025年9月登Nature）的关键发现是**后训练缩放定律（Post-Training Scaling Law）**[citation:24][citation:33]：

| 训练步数 | R1-Zero pass@1 | R1-Zero cons@16 | o1-0912 pass@1 |
|:---:|:---:|:---:|:---:|
| 0 | 0.16 | 0.26 | 0.26 |
| 1000 | 0.39 | 0.44 | 0.57 |
| 3000 | 0.49 | 0.73 | 0.54 |
| 5000 | 0.57 | 0.68 | 0.58 |
| 7000 | 0.68 | 0.86 | 0.66 |
| 8000 | 0.66 | 0.83 | 0.68 |

随着RL训练步数增加，pass@1持续上升，**未观察到饱和**。这意味着推理能力可以通过"更多RL计算"持续放大，与预训练缩放定律互补[citation:29][citation:33]。

### 3.5 GRPO家族的进化（2025–2026）

GRPO成为基线后，社区迅速迭代出多个改进版本[citation:10][citation:14]：

| 变体 | 核心改进 | 关键效果 |
|---|---|---|
| **DAPO**（ByteDance, 2025.03） | Clip-Higher防熵坍塌 + 动态采样 + Token级损失 | Qwen2.5-32B上AIME 2024达50分 |
| **GSPO**（Qwen团队, 2025.07） | 重要性比率从Token级提升到**序列级** | 稳定MoE训练，贡献于Qwen3 |
| **F-GRPO**（2026.02） | 受Focal Loss启发，降低简单样本权重 | pass@256从64.1→70.3 |
| **Dr.GRPO** | 去掉标准差归一化，避免低方差组被放大 | 缓解长度偏置 |
| **CISPO** | 裁剪重要性采样权重而非硬屏蔽梯度 | 保留关键token（"Wait""However"）的学习信号 |
| **VAPO** | 重新引入Value Model + Length-Adaptive GAE | 处理长CoT的信用分配 |
| **POPO**（2026.05） | 只用正样本，通过重要性采样隐式产生负梯度 | AIME 2025达36.67%（GRPO为30%） |
| **GOPO**（2026.02） | 只用排序不用绝对值，去除量纲噪声 | 摘要/指令遵循上比GRPO更快收敛 |
| **REINFORCE++** | 全局优势归一化 | AIME-25上40.0 vs GRPO的0.0（Pass@16） |

**我的判断**：GRPO仍是开源推理RL的默认基线，但**DAPO是工程化强化版，GSPO是更值得关注的sequence-level替代路线**（尤其能稳定MoE训练）[citation:10]。

### 3.6 RLVR的争议与前沿

**pass@k争议**：RLVR确实提升了pass@1（单次成功率），但有研究发现基础模型在大数据k时pass@k可能更高——RLVR让模型"更确信地走已知好路径"，而非发现全新解法[citation:4][citation:12]。

**"隐形缰绳"理论**（Wu et al., 2025）：RLVR是支持约束优化——只能提升基础模型已有概率非零的解，无法触及分布外答案。即使token级熵上升，**答案级熵会坍塌**[citation:4]。

**虚假奖励实验**（Shao et al.）：在Qwen2.5-Math-7B上，随机奖励竟也能提升MATH-500约21分（正确奖励为29分）。说明该模型本身已具备"用代码思考"的潜在行为，任何奖励都在推动它更频繁地这样做——**一个模型上的结果不等于关于RLVR的普遍结论**[citation:4]。

**解决方向**：
- **ConfClip**：用置信度加权奖励替代二值奖励，缓解梯度消失[citation:8]
- **EGPO**：熵校准，在组奖励退化时重建学习信号[citation:8]
- **LongRLVR**：长上下文任务中用chunk级密集奖励替代纯结果奖励，RULER-QA上14B模型从73.17→88.90[citation:8]

---

## 4. 主线二：经典深度RL——从DQN到1000层网络

### 4.1 价值方法：DQN的十年演进

深度Q网络（DQN, Mnih et al. 2015）用神经网络近似Q函数，引入经验回放和目標网络，首次在Atari上达到人类水平。十年演进路线[citation:47]：

| 时间 | 里程碑 | 关键贡献 |
|---|---|---|
| 2015 | DQN | 经验回放 + 目标网络 |
| 2017 | Double DQN / Dueling DQN | 解耦动作选择与评估 / 分离状态价值与优势 |
| 2019 | Ape-X + 优先回放 | 分布式采集，10–100×效率提升 |
| 2020 | QR-DQN / C51 | 分布强化学习，建模回报分布 |
| 2023 | IRIS | 离散潜空间 + 世界模型，100k帧SOTA |

### 4.2 策略梯度：PPO与SAC的分工

- **PPO**（Schulman et al., 2017）：裁剪重要性比率，在线策略梯度，稳定性好，是Atari、ProcGen、DMControl的主流选择
- **SAC**（Haarnoja et al., 2018）：最大熵策略梯度，专为连续动作空间设计，机器人控制的事实标准
- **DSAC改进**（2025）：发现Actor-Critic耦合熵是离散SAC表现差的主因，解耦后性能追平DQN[citation:59]

### 4.3 深度缩放定律：1000层网络带来的跃迁

普林斯顿与华沙理工大学（2025）的研究发现：将RL网络的深度扩展到**1024层**，配合残差块、LayerNorm和Swish激活，在稀疏奖励环境中带来巨大提升[citation:11]：

- 操控任务：**2–5×**
- 长程迷宫：**20×**
- 人形控制：**50×+**

机制：更深的模型一旦跨越"临界深度"阈值，就能发展出更丰富的表征和更复杂的行为。更大的batch size和更好的泛化也随之而来。但**离线RL中收益有限**——因为缺少探索[citation:11]。

---

## 5. 主线三：世界模型——DreamerV3与MuZero谱系

### 5.1 DreamerV3：通用RL的Nature突破

Google DeepMind的DreamerV3（Hafner et al., 2025）发表在**Nature**，核心主张是：用**一套固定超参数**在8大领域、150+任务上超越专用算法[citation:46][citation:54]。

**三阶段架构**：

1. **世界模型学习**：用循环状态空间模型（RSSM）编码观测 $o_t$ 为潜状态 $s_t = \{h_t, z_t\}$
   - $h_t$：确定性循环状态（捕获时间依赖）
   - $z_t$：随机状态（编码观测不确定性）
   - 五组件：编码器 $q_\theta(z_t|h_t,o_t)$、先验 $p_\theta(\hat{z}_t|h_t)$、奖励预测器、继续预测器、解码器

2. **在想象中学习**：Actor-Critic完全在潜空间操作，用想象的rollout训练策略，**无需解码观测**，可大规模并行（单卡16K批量）

3. **交互→想象→学习循环**：数据收集与优化解耦，无训练频率超参数

**四项鲁棒性技术**[citation:54]：
- **Symlog/symexp变换**：兼容任意量级的奖励（稀疏/稠密统一处理）
- **Free bits KL平衡**：裁剪至1 nat ≈ 1.44 bits，消除跨域正则化调参
- **Return归一化**：5–95分位EMA，小回报不放大噪声
- **分布式评论家**：指数间隔分类箱 + 零初始化输出层

**里程碑**：首次**无需人类数据或课程设计**，从零开始在Minecraft中采集钻石——这一成就曾被学术界视为AI长远探索能力的试金石[citation:46][citation:58]。

### 5.2 MuZero与搜索式规划

DeepMind的MuZero（Schrittwieser et al., 2019）走另一条路：不学环境动力学，而是学一个**潜空间MCTS规划器**[citation:49]。

三个共享参数的神经模块：
- **表示函数** $h_\theta(o_{1:t}) \to s^0_t$：编码观测历史
- **动态函数** $g_\theta(s^{k-1}, a^k) \to (r^k, s^k)$：潜空间状态转移
- **预测函数** $f_\theta(s^k) \to (p^k, v^k)$：策略先验 + 价值预测

在Go、Chess、Shogi和Atari上达到超人类水平。后续演进[citation:45][citation:57]：

| 时间 | 方法 | 贡献 |
|---|---|---|
| 2020 | EfficientZero | 样本效率提升，50万帧匹敌MuZero 2000万帧 |
| 2024 | EfficientZero V2 | 扩展到连续控制，66个任务中50个超越DreamerV3 |
| 2024 | TD-MPC2 | 隐式世界模型 + MPPI规划，DMControl/Meta-World SOTA |
| 2025 | TransZero | Transformer动态网络 + 方差评估器，MCTS并行展开，速度提升11× |

### 5.3 扩散世界模型与机器人控制

2024年起，扩散模型开始渗透世界模型[citation:45]：

- **DIAMOND**：扩散世界模型用于Atari，高视觉保真度
- **Genie**（DeepMind）：从无标注视频中学到可动作控制生成环境
- **Imagine-2-Drive**：扩散世界模型 + 多模态策略用于自动驾驶
- **VLA + 世界模型**（2025–2026）：世界模型成为机器人基础模型的微调 substrate，处理人形 loco-manipulation

---

## 6. 主线四：离线到在线RL——从历史数据到部署策略

### 6.1 保守Q学习与Cal-QL

离线RL的核心困境：直接用离线数据训练的策略，在线微调时会**迅速遗忘**离线习得的技能（CQL的表现）[citation:19]。

**Cal-QL**（Nakamoto et al., NeurIPS 2023）的解决方案：学习**校准的**保守价值函数——既低估分布外动作的Q值，又保证Q值不低于参考策略的真实价值[citation:19]。

数学形式：

$$
\mathcal{L}_{CalQL} = \alpha \cdot \mathbb{E}_{s \sim D}\left[\max_{a} Q_\theta(s,a) - \mathbb{E}_{a \sim \mu(a|s)}[Q_\theta(s,a)]\right] + \frac{1}{2}\mathbb{E}_{(s,a)\sim D}[(Q_\theta(s,a) - \hat{Q}(s,a))^2]
$$

第一行是保守正则项（惩罚OOD动作），第二行是标准TD误差。Cal-QL的改进是**为保守Q值加上下限约束**，避免离线阶段过度低估。

**结果**：11个基准任务中9个实现最佳在线微调效果，平均性能提升106.9%[citation:19]。

### 6.2 动作分块（Q-chunking）

Li, Zhou & Levine（NeurIPS 2026）提出Q-chunking：把模仿学习中的动作分块技术引入TD-based RL[citation:19]。

核心思想：
- 策略网络输出**未来h步的动作序列**而非单步动作
- 价值网络用**n步回溯**更新（无偏估计）
- 用流模型（flow policy）替代高斯策略，更好捕获离线数据中的时间一致性模式

**约束项**：

$$
\mathcal{L}_{constraint} = D(\pi_\theta(a_{t:t+h}|s_t) || \pi_\beta(a_{t:t+h}|s_t))
$$

保持习得策略与离线行为分布的距离，避免分布偏移。

**结果**：在多种长时域稀疏奖励操作任务中超越现有最佳离线→在线方法。

### 6.3 贝叶斯世界模型NEUBAY

Ni et al.（ICML 2026）质疑"显式保守主义"的普适性：在低质量数据集上，保守方法反而失败[citation:32]。

**NEUBAY**（Neural Bayesian）的核心：
- 维护**世界模型的后验分布**（深度集成）
- 训练历史依赖的智能体最大化期望回报
- 贝叶斯方法**直接处理认知不确定性**，无需显式保守惩罚
- 关键发现：**长程rollout（数百步）** 是控制价值高估的关键

**结果**：在D4RL和NeoRL基准上，7个数据集达到新的SOTA，rollout horizon达数百步。

### 6.4 其他值得关注的方法

| 方法 | 核心思路 | 来源 |
|---|---|---|
| **CPQL** | 保守Peng's Q(λ)，多步算子的保守估计 | ICLR 2026[citation:28] |
| **WME-ORL** | FNO-Transformer世界模型 + 阶段感知IQL，用于ICU急性肾损伤治疗 | AI Medicine 2026[citation:22] |
| **OPRIDE** | 离线偏好RL + 数据集内探索 + 折扣调度防过优化 | ICLR 2026[citation:27] |
| **Action-Free O2O** | 无动作标签场景，学习状态策略推荐下一状态 | ICLR 2026[citation:31] |

---

## 7. 主线五：Agentic RL——让模型学会"做事"

### 7.1 从单步到多轮：LLM训练被重新定义为MDP

2026年的共识：LLM训练不应视为单步bandit问题，而是**时序扩展的部分可观测MDP**[citation:2]。RL赋予模型：规划、工具使用、记忆、自反思——跨越长程horizon的能力。

**ARPO**（Adaptive Rollout Policy Optimization）：检测token熵的尖峰（工具调用后的不确定性信号），触发自适应分支采样，再用优势归因分配信用[citation:11]。

### 7.2 过程奖励与信用分配

结果奖励（outcome reward）只告诉模型"最终答案对不对"，但长程任务需要**过程级反馈**[citation:34]：

- **OPRL**（Online Process Reward Learning）：从轨迹级偏好诱导步骤级奖励
- **RewardFlow**：在状态轨迹诱导的图拓扑上传播稀疏终端奖励，产生局部密集奖励
- **RAPO**（Retrieval-Augmented PO）：检索增强策略优化，平衡探索与利用

### 7.3 编码、数学、GUI三大场景

**软件工程**[citation:11]：
- **SWE-RL**：利用真实软件演进数据（code diffs、issues、PRs）建模开发者推理
- **Qwen3-Coder**：基于执行的RL + 长程Agent RL，支持20,000+并行环境

**数学推理**[citation:11][citation:12]：
- **rStar-Math**：MCTS + RL，7B模型超越o1
- **DeepSeek-Prover / Leanabell-Prover**：形式化定理证明，MCTS + 验证器反馈

**GUI智能体**：从零样本VLM → 监督离线训练 → RL多步交互

---

## 8. 安全强化学习：约束MDP与Lyapunov方法

安全RL研究**训练期和部署期都不违反安全约束**的算法。形式化为约束MDP（CMDP）[citation:44][citation:48]：

$$
\max_\pi J_R(\pi) \quad \text{s.t.} \quad J_C(\pi) \leq C_{max}
$$

### 主要技术路线

| 方法族 | 代表算法 | 核心思路 |
|---|---|---|
| 约束策略梯度 | CPO, PCPO | 策略梯度投影到安全约束内 |
| 拉格朗日方法 | Safe RLHF | 动态调整安全vs帮助的权衡 |
| Lyapunov函数 | LyaNet | 学习Lyapunov证书保证稳定 |
| Barrier函数 | CBF-RL | 控制障碍函数阻止不安全动作 |
| 屏蔽（Shielding） | Verified Shield | 形式化验证阻断不安全动作 |
| 可认证安全 | Certifiable Safe RLHF | 提供数学安全证书 |

**Safe RLHF**效果：有害响应从53.08%（Alpaca-7B）降至2.45%，同时帮助性Elo提升+244.91[citation:6]。

**医疗应用**（WME-ORL）：在46,337名ICU患者的MIMIC-IV数据上，世界模型增强离线RL将预测RRT启动率降低31.9%，临床规则违反率<5%[citation:22]。

---

## 9. 十项横评表：方法 × 能力矩阵

| 方法 | 推理能力 | 对齐质量 | 样本效率 | 训练稳定性 | 安全保证 | 可扩展性 | 工程复杂度 | 数据需求 | 适用模型规模 | 综合推荐度 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **PPO+RLHF** | ★★★★ | ★★★★★ | ★★ | ★★★ | ★★★★ | ★★★ | 高 | 人类偏好 | 7B–70B | ★★★★ |
| **DPO** | ★★★ | ★★★★ | ★★★★ | ★★★★★ | ★★★ | ★★★★ | 低 | 偏好对 | 7B–70B | ★★★★ |
| **GRPO+RLVR** | ★★★★★ | ★★★ | ★★★ | ★★★★ | ★★ | ★★★★ | 中 | 可验证数据 | 7B–70B | ★★★★★ |
| **DAPO** | ★★★★★ | ★★★ | ★★★★ | ★★★★★ | ★★ | ★★★★ | 中 | 可验证数据 | 32B+ | ★★★★★ |
| **GSPO** | ★★★★★ | ★★★ | ★★★★ | ★★★★★ | ★★ | ★★★★★ | 中 | 可验证数据 | MoE/大尺度 | ★★★★★ |
| **DreamerV3** | ★★ | N/A | ★★★★★ | ★★★★ | ★★ | ★★★ | 高 | 环境交互 | 专用 | ★★★★ |
| **MuZero** | ★★ | N/A | ★★★★ | ★★★ | ★★ | ★★★★ | 高 | 环境交互 | 专用 | ★★★★ |
| **Cal-QL** | N/A | N/A | ★★★★ | ★★★★ | ★★★ | ★★★ | 中 | 离线数据 | 专用 | ★★★★ |
| **Safe RLHF** | ★★★ | ★★★★★ | ★★ | ★★★ | ★★★★★ | ★★★ | 高 | 人类偏好 | 7B–70B | ★★★★ |
| **Agentic RL** | ★★★★★ | ★★★★ | ★★★ | ★★★ | ★★★ | ★★★★ | 高 | 多模态 | 8B–70B | ★★★★★ |

---

## 10. 场景选型表：一句话告诉你该用什么

| 场景 | 首选方案 | 备选方案 | 关键理由 |
|---|---|---|---|
| **数学推理模型** | GRPO + RLVR | DAPO / F-GRPO | 可验证奖励 + 组相对优化，DeepSeek-R1验证有效 |
| **代码生成** | RLVR + 执行反馈 | GRPO + 单元测试 | 编译器/测试提供天然可验证信号 |
| **通用对齐（有帮助且安全）** | DPO → RLHF → Safe RLHF | KTO / SimPO | 多阶段管线，先对齐再安全 |
| **机器人控制** | DreamerV3 / TD-MPC2 | SAC + 离线预训练 | 世界模型样本高效，潜空间规划 |
| **自动驾驶** | 扩散世界模型 + 安全约束 | Imagine-2-Drive | 高保真模拟 + 安全屏障 |
| **医疗决策** | Cal-QL → 在线微调 | WME-ORL | 离线安全 + 贝叶斯不确定性 |
| **电力/能源系统** | Safe RL + CMDP | 拉格朗日方法 | 硬安全约束 + 多智能体协调 |
| **GUI智能体** | Agentic RL + 工具使用 | ARPO | 多步交互 + 自适应探索 |
| **知识密集型Agent** | RAG + Agentic RL | OPRL过程奖励 | 检索增强 + 长程信用分配 |
| **小模型推理增强** | POPO / GOPO | F-GRPO | 正样本/排序方法，小模型友好 |

---

## 11. FAQ：五个关键问题

**Q1：RLHF是不是已经"死了"？**

没有，但角色变了。RLHF仍是安全对齐（helpful + harmless）的主力，尤其在RLVR处理不了的开放域任务上。最佳实践是**RLVR sharpen推理 → RLHF/RLAIF保持有用和安全**，两者互补[citation:3][citation:4]。

**Q2：GRPO和PPO到底差在哪？**

PPO需要Critic网络估计每个状态的价值，GRPO用**同一prompt的多个采样回答的统计量**替代Critic。显存省40–50%，但要求能生成多个候选（适合推理任务，不适合实时控制）[citation:3][citation:10]。

**Q3：RLVR真的能让模型变"更聪明"吗？**

有争议。RLVR确实提升pass@1（单次成功率），但可能在大数据k时反而缩小探索范围——它让模型更确信地走已知好路径，而非发现全新解法。"隐形缰绳"理论指出RLVR受限于基础模型的分布支持[citation:4][citation:12]。

**Q4：世界模型和直接RL有什么区别？**

直接RL（如PPO）边交互边学策略；世界模型（如DreamerV3）先学环境动力学模型，再在**想象的潜空间**中训练策略。优势是样本效率极高（想象rollout免费），劣势是需要足够好的世界模型[citation:46][citation:54]。

**Q5：离线RL为什么不直接用在线RL？**

医疗、电力、自动驾驶等领域**在线探索代价太高或太危险**。离线RL从历史数据中学策略，但面临分布偏移和过估计挑战。Cal-QL、CPQL等方法让离线预训练 + 安全在线微调成为可能[citation:19][citation:28]。

---

## 12. 总结与展望

2025–2026年的强化学习经历了一次**范式跃迁**：

1. **从人类反馈到可验证奖励**：RLVR用确定性验证器替代学习型奖励模型，让推理能力可以通过"更多RL计算"持续缩放
2. **从四模型到两模型**：PPO（Actor+Critic+RM+Ref）→ GRPO（Actor+Ref），工程复杂度断崖式下降
3. **从专用到通用**：DreamerV3一套超参数横扫150+任务，登上Nature
4. **从单步到Agentic**：LLM训练被重新定义为时序MDP，工具使用、规划、自反思成为可训练能力
5. **从性能到安全**：CMDP、Lyapunov、Barrier函数进入主流，医疗/电力/驾驶开始部署RL

**未来值得关注的方向**：
- **预训练阶段的RL**（RPT、PretrainZero）：把RL信号前移到预训练
- **多目标对齐**（PAMA）：同时优化多个目标不互相损害
- **物理信息RL**：将物理约束嵌入世界模型
- **持续学习世界模型**：终身学习而非每次从头训练
- **可验证推理**：把数学/代码的验证技术推广到更开放的领域

---

## 13. 参考文献

[1] Ouyang, L., et al. "Training language models to follow instructions with human feedback." *NeurIPS* 2022.

[2] Luo, B., et al. "多智能体强化学习控制与决策研究综述." *自动化学报* 2025, 51(3): 510-539.

[3] MegaOne AI. "RLHF Is Officially Dead — GRPO, DAPO, and RLVR Took Over AI Training." 2025.

[4] EmergentMind. "RLVR: Reinforcement Learning with Verifiable Rewards." 2025–2026.

[5] Qwen Team. "GSPO: Group Sequence Policy Optimization." arXiv:2507.18071, 2025.

[6] Papers Luna. "Reinforcement Learning." 2025–2026.

[7] CallSphere. "RLHF Evolution in 2026: From PPO to DPO, RLAIF, and Beyond." 2026.

[8] EmergentMind. "LLM RLVR: Optimizing with Verifiable Rewards." 2025–2026.

[9] ByteDance Seed + Qwen. "DAPO: Direct Alignment Policy Optimization." arXiv 2025.03.

[10] CSDN. "2026强化学习技术路线全景:从PPO到GRPO,再到DAPO/GSPO." 2026.

[11] TuringPost. "State of Reinforcement Learning 2025: RLHF, RLVR, GRPO & Trends." 2025.

[12] EmergentMind. "LLM RLVR: Exploration, Exploitation & Generalization." 2025.

[13] Hafner, D., Pasukonis, J., Ba, J., et al. "Mastering diverse control tasks through world models." *Nature* 2025. DOI: 10.1038/s41586-025-08744-2.

[14] CSDN. "651篇论文全景:大模型强化学习技术深度研报." 2025–2026.

[15] Nakamoto, M., et al. "Cal-QL: Calibrated Offline RL Pre-Training for Efficient Online Fine-Tuning." *NeurIPS* 2023.

[16] Li, Q., Zhou, Z., Levine, S. "Reinforcement Learning with Action Chunking." *NeurIPS* 2026, 38: 55518-55553.

[17] Ni, T., et al. "Long-Horizon Model-Based Offline RL Without Explicit Conservatism (NEUBAY)." *ICML* 2026.

[18] Kim, B., Oh, M. "Conservative Peng's Q(λ) for Offline RL (CPQL)." *ICLR* 2026.

[19] DIB Lab. "2026年5月第二期论文推荐:离线-在线强化学习." 2026.

[20] Zhang, B., Mi, Y. "World Model Enhanced Offline RL for Sequential Intervention in Acute Kidney Injury." *AI Medicine* 2026, 3(1): 2.

[21] Yang, Y., et al. "OPRIDE: Offline Preference-based RL via In-Dataset Exploration." *ICLR* 2026. arXiv:2604.02349.

[22] Neggatu, N.S., et al. "Action-Free Offline-to-Online RL via Discretised State Policies." *ICLR* 2026. arXiv:2602.00629.

[23] EmergentMind. "Agentic RL: Autonomous Agents via Extended RL." 2025–2026.

[24] CSDN. "DeepSeek-R1技术深度解析:强化学习驱动的强推理范式." 2025.

[25] WalkingLabs. "RL Scaling Laws and Foundation Model RL." 2025–2026.

[26] Kushwaha, A., et al. "A Survey of Safe Reinforcement Learning and Constrained MDPs." arXiv:2505.17342, 2025.

[27] Kushwaha, D.S., Biron, Z.A. "A Review On Safe RL Using Lyapunov and Barrier Functions." arXiv:2508.09128, 2025.

[28] Xie, Y. "A Survey of Safe Reinforcement Learning Methods in Robotics." *ITM Web Conf.* 2025, 78: 01014.

[29] Asad, R., et al. "Revisiting Actor-Critic Methods in Discrete Action Off-Policy RL." arXiv:2509.09838, 2025.

[30] Ma, X., et al. "OGER: A Robust Offline-Guided Exploration Reward for Hybrid RL." arXiv:2604.18530, 2026.

[31] Schrittwieser, J., et al. "Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model (MuZero)." *Nature* 2020.

[32] Malmsten, E., Böhmer, W. "TransZero: Parallel Tree Expansion in MuZero using Transformer Networks." arXiv:2509.11233, 2025.

[33] VoiceClone. "Model-Based RL / World Models Timeline." 2025–2026.

[34] Mienye, I.D., et al. "Deep Reinforcement Learning in the Era of Foundation Models: A Survey." *Computers* 2026, 15(1): 40.

[35] HuggingFace. "Reinforcement Learning." 2025–2026.

[36] Tsinghua iDLab. "DSAC-D: Distributional Soft Actor-Critic with Diffusion Policy." *IEEE ITSC* 2025 (Best Student Paper Nominee).

[37] Swarma. "Nature: DeepMind新一代Dreamer架构突破强化学习泛化瓶颈." 2025.

[38] CSDN. "DeepSeek-R1展现出的推理Scaling Law." 2025.

[39] Jin, M. "Reinforcement Learning Meets the Power Grid." *Foundations and Trends in Electric Energy Systems* 2025, 8(3-4): 169-316.

[40] OpenReview. "DreamerV3 Extensions: Dynamics-Aligned Latent Imagination (DALI)." 2025.

---

> **写给你的一句话**
>
> 2025–2026年的RL不再是一个需要大量调参的"黑魔法"，而是一套**有清晰工程路线的工具箱**：推理用RLVR+GRPO家族，控制用DreamerV3/TD-MPC2，对齐用DPO+Safe RLHF，Agent用Agentic RL。**选对路线比调参重要十倍。**

---

*最后更新：2026年8月*
*许可：CC BY 4.0*
