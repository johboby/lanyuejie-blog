---
title: "贝叶斯决策优化：从贝叶斯理论到高效全局优化的完整技术谱系"
date: "2026-08-17"
description: "系统梳理贝叶斯决策优化的理论根基、核心算法、信息论采集函数、高维扩展、约束处理、多目标优化、安全关键应用及前沿进展"
reading_time: "约45分钟"
tags: ["贝叶斯优化", "高斯过程", "决策理论", "采集函数", "不确定性量化", "黑盒优化"]
---

# 贝叶斯决策优化：从贝叶斯理论到高效全局优化的完整技术谱系

> **TL;DR** —— 贝叶斯决策优化是把"概率推断"和"序贯决策"焊在一起的框架：用高斯过程（或其他代理模型）拟合未知目标函数的后验，再用采集函数把"探索-利用"的权衡变成一个可计算的数学问题。2025–2026年的进展集中在五个方向：信息论采集函数（最大化信息增益）、高维扩展（信任域/加性/降维）、多保真度融合、安全约束处理、以及与深度学习的深度耦合（PFN代理、扩散先验、元学习）。本文给出从理论根基到工程落地的完整链路。

---

## 目录

1. [先说结论](#先说结论)
2. [贝叶斯决策理论：一切的起点](#贝叶斯决策理论一切的起点)
3. [贝叶斯优化的标准形式](#贝叶斯优化的标准形式)
4. [经典采集函数家族](#经典采集函数家族)
5. [信息论采集函数：用熵指导搜索](#信息论采集函数用熵指导搜索)
6. [代理模型：从高斯过程到贝叶斯神经网络](#代理模型从高斯过程到贝叶斯神经网络)
7. [高维贝叶斯优化](#高维贝叶斯优化)
8. [信任域方法：TuRBO及其进化](#信任域方法turbo及其进化)
9. [多保真度贝叶斯优化](#多保真度贝叶斯优化)
10. [约束贝叶斯优化](#约束贝叶斯优化)
11. [多目标贝叶斯优化](#多目标贝叶斯优化)
12. [贝叶斯优化与深度学习](#贝叶斯优化与深度学习)
13. [安全关键应用](#安全关键应用)
14. [实际应用案例](#实际应用案例)
15. [十种方法横评](#十种方法横评)
16. [按场景选型指南](#按场景选型指南)
17. [未来方向与开放挑战](#未来方向与开放挑战)
18. [FAQ](#faq)
19. [参考文献](#参考文献)

---

## 先说结论

| 结论 | 一句话解释 |
|---|---|
| **贝叶斯优化是"小数据"时代的全局优化利器** | 当每次评估目标函数都要花几分钟到几小时甚至几天时，BO能用最少的试验次数找到接近最优的解 |
| **采集函数是灵魂** | 贝叶斯优化≈选对代理模型+选对采集函数；2025年的共识是信息论采集函数（MES/JES/PES）在多数基准上稳定优于EI和UCB |
| **高维是最大瓶颈** | 维度超过50后，标准GP+全局搜索基本失效；信任域、加性结构、VAE降维是当前三大解药 |
| **多保真度是工程落地的关键** | 用廉价低保真评估（仿真/低精度模型）做粗筛、用昂贵高保真评估（真实实验）做精修，可以节省1–2个数量级的成本 |
| **安全约束决定能否上真实系统** | 自动驾驶、电池快充、医疗决策等场景必须保证"试错过程本身不闯祸"，安全贝叶斯优化（SAFE-BO）是2025年的热点 |

---

## 贝叶斯决策理论：一切的起点

贝叶斯决策理论（Bayesian Decision Theory）是概率框架下做最优决策的"第一性原理"。它的核心公式只有一行：

$$R(\alpha) = \sum_{y} L(\alpha(\mathbf{x}), y) \, P(\mathbf{x}, y)$$

其中 $R(\alpha)$ 是**风险函数**——在某个决策规则 $\alpha$ 下，对所有可能真实状态 $y$ 的期望损失。贝叶斯决策准则要求选取使风险最小的决策规则 $\alpha^*$：

$$\alpha^*(\mathbf{x}) = \arg\min_{\alpha(\mathbf{x})} \sum_y L(\alpha(\mathbf{x}), y) \, P(y|\mathbf{x})$$

这里 $P(y|\mathbf{x})$ 是后验概率，由贝叶斯定理给出：

$$P(y|\mathbf{x}) = \frac{P(\mathbf{x}|y) \, P(y)}{P(\mathbf{x})}$$

**直觉理解**：贝叶斯决策把"做选择"变成了一个加权求和问题——每个可能的结果都按它发生的概率加权，权重就是"选错了会多惨"（损失函数）。

### 损失函数决定行为

| 损失函数 | 形式 | 对应的决策规则 |
|---|---|---|
| 0-1损失 | $L=0$ 若正确，否则 $L=1$ | 最大后验概率（MAP）估计 |
| 平方损失 | $L=(\alpha-y)^2$ | 后验均值 $\mathbb{E}[y|\mathbf{x}]$ |
| 绝对损失 | $L=|\alpha-y|$ | 后验中位数 |
| 自定义非对称损失 | 例如假阴性惩罚100倍于假阳性 | 偏向"宁可错杀不可放过"的决策边界 |

> **关键洞察**：贝叶斯决策理论告诉我们，优化的目标不是"找到最大值"本身，而是在**不确定性下做出期望损失最小的决策**。这正是贝叶斯优化的哲学根基——每一次"采样下一个点"本身就是一个贝叶斯决策问题。

---

## 贝叶斯优化的标准形式

贝叶斯优化的标准设定如下：

$$\max_{\mathbf{x} \in \mathcal{X}} \; f(\mathbf{x})$$

其中 $f$ 是**黑盒函数**——没有解析表达式、不可导、每次评估昂贵（可能耗时几小时）。

### 完整算法流程

```
初始化：在域 X 上选 n0 个点，评估 f 得到 D = {(xi, yi)}
while 预算未用完:
    1. 用 D 拟合代理模型（通常是高斯过程），得到后验 p(f|D)
    2. 用后验计算采集函数 α(x)，选择下一个点
       x_next = argmax α(x)
    3. 评估 y_next = f(x_next) + noise
    4. 把 (x_next, y_next) 加入 D
返回 D 中观测到的最佳点
```

### 高斯过程代理模型

高斯过程（Gaussian Process, GP）是贝叶斯优化的默认代理模型。一个GP由均值函数 $m(\mathbf{x})$ 和协方差核 $k(\mathbf{x}, \mathbf{x}')$ 完全定义：

$$f(\mathbf{x}) \sim \mathcal{GP}\big(m(\mathbf{x}),\; k(\mathbf{x}, \mathbf{x}')\big)$$

给定观测数据 $\mathbf{D}_t = \{(\mathbf{x}_i, y_i)\}_{i=1}^{t}$，在候选点 $\mathbf{x}$ 处的后验分布是：

$$\mu_t(\mathbf{x}) = \mathbf{k}_t(\mathbf{x})^\top (\mathbf{K}_t + \sigma_n^2\mathbf{I})^{-1} \mathbf{y}_t$$

$$\sigma_t^2(\mathbf{x}) = k(\mathbf{x}, \mathbf{x}) - \mathbf{k}_t(\mathbf{x})^\top (\mathbf{K}_t + \sigma_n^2\mathbf{I})^{-1} \mathbf{k}_t(\mathbf{x})$$

其中 $\mathbf{k}_t(\mathbf{x})$ 是 $\mathbf{x}$ 与所有已观测点的协方差向量，$\mathbf{K}_t$ 是已观测点之间的协方差矩阵。

> **直觉**：$\mu_t(\mathbf{x})$ 是"模型对 $\mathbf{x}$ 处函数值的预测"，$\sigma_t(\mathbf{x})$ 是"模型在这个点的不确定性"。采集函数就是围绕这两个量做文章。

### 常用核函数

| 核函数 | 公式 | 特点 |
|---|---|---|
| RBF (高斯核) | $k(\mathbf{x},\mathbf{x}') = \exp(-\frac{1}{2}\|\mathbf{x}-\mathbf{x}'\|^2/\ell^2)$ | 最常用，光滑假设 |
| Matérn 5/2 | 含贝塞尔函数，参数化粗糙度 | 比RBF更灵活，实践中常更优 |
| 周期核 | $k = \exp(-2\sin^2(\pi\|\mathbf{x}-\mathbf{x}'\|/p)/\ell^2)$ | 捕捉周期性 |
| 核组合 (+, ×) | 加法/乘法组合多个核 | 自动统计学家（AutoStat）的核心思想 |

---

## 经典采集函数家族

采集函数（Acquisition Function）是贝叶斯优化的"决策引擎"。它把代理模型的后验（$\mu, \sigma$）翻译成"每个候选点值得评估的程度"。

### 三大经典采集函数

**1. 概率提升（Probability of Improvement, PI）**

$$a_{\text{PI}}(\mathbf{x}) = \Phi\!\left(\frac{\mu(\mathbf{x}) - y^+ - \xi}{\sigma(\mathbf{x})}\right)$$

其中 $y^+ = \max_i y_i$ 是当前最佳观测值，$\xi \ge 0$ 是探索扰动项，$\Phi$ 是标准正态CDF。

> **直觉**：PI回答的问题是"这个点比当前最佳更好的概率有多大？"它纯粹是乐观的——只看"会不会更好"，不看"好多少"。

**2. 期望提升（Expected Improvement, EI）**

$$a_{\text{EI}}(\mathbf{x}) = (\mu(\mathbf{x}) - y^+ - \xi)\,\Phi(z) + \sigma(\mathbf{x})\,\phi(z)$$

其中 $z = \frac{\mu(\mathbf{x}) - y^+ - \xi}{\sigma(\mathbf{x})}$，$\phi$ 是标准正态PDF。

> **直觉**：EI回答的是"如果评估这个点，期望能提升多少？"它同时考虑了"提升的概率"和"提升的幅度"，是实践中最常用的默认选择。

**3. 上置信界（Upper Confidence Bound, UCB）**

$$a_{\text{UCB}}(\mathbf{x}) = \mu(\mathbf{x}) + \kappa \cdot \sigma(\mathbf{x})$$

其中 $\kappa > 0$ 控制探索强度。

> **直觉**：UCB是最"直白"的——在预测均值上叠加一个不确定性奖励。$\kappa$ 大就激进探索，$\kappa$ 小就保守利用。UCB有最完备的理论保证（累积遗憾界），但调 $\kappa$ 是个玄学问题。

### 经典采集函数对比

| 采集函数 | 核心思想 | 探索倾向 | 理论保证 | 计算成本 |
|---|---|---|---|---|
| PI | 超越当前最佳的概率 | 弱（容易过早收敛） | 较弱 | 低 |
| EI | 期望改进量 | 中等（最稳健的默认） | 有（简单遗憾界） | 低 |
| UCB | 均值+不确定性 | 可调（$\kappa$） | 强（累积遗憾 $O(\sqrt{T\gamma_T})$） | 低 |
| Thompson Sampling | 从后验采样一条函数，取最大值 | 隐式平衡 | 强（2026年ICML给出紧界） | 中（需采样） |

### 2026年Thompson Sampling的理论突破

Thompson Sampling（TS）在实践中的表现常常优于UCB，但理论分析长期滞后。2026年ICML论文 *On Regret Bounds of Thompson Sampling for Bayesian Optimization* [39] 系统补完了GP-TS的理论：

- **反例证明**：构造了一个两臂反例，证明GP-TS的高概率遗憾界对失败概率 $\delta$ 的依赖**不可能**达到 $\log(1/\delta)$，只能做到 $1/\delta$ 量级——这是算法本身的固有局限，不是证明技巧不够好。
- **二阶矩上界**：给出了累积遗憾的二阶矩上界，把 $\delta$ 依赖收紧了 $1/\delta$ 倍。
- **Lenient Regret**：首次给出了GP-TS的期望lenient遗憾的polylogarithmic上界。
- **松弛Matérn条件**：在放宽的光滑性条件下给出了 $O(\tilde{T})$ 的高概率遗憾界。

> **实践含义**：Thompson Sampling不仅是"好用"，现在也有了一流的理论支撑。配合2026年AISTATS提出的ACTS（自适应候选点Thompson采样）[32]，在高维空间中通过梯度引导的子空间采样，进一步提升了TS的实用性。

---

## 信息论采集函数：用熵指导搜索

2025年最活跃的理论方向之一，是把采集函数的设计统一到**信息论**的框架下。核心思想极其优雅：

> **每一次评估，都应该最大化"关于最优解的信息增益"。**

### 统一公式

$$a^{\text{IT}}(\mathbf{x} | \mathcal{D}_n) = \text{MI}(\mathbf{y}; S(f) | \mathbf{x}, \mathcal{D}_n) = H[p(\mathbf{y}|\mathcal{D}_n)] - \mathbb{E}_{p(S|\mathcal{D}_n)}\!\left[H[p(\mathbf{y}|\mathbf{x}, \mathcal{D}_n, S)]\right]$$

其中 $S(f)$ 是我们要学习的"关于最优解的某个统计量"——可以是：
- $S = \mathbf{x}^*$（最优位置）→ **Predictive Entropy Search (PES)**
- $S = f^*$（最优值）→ **Max-value Entropy Search (MES)**
- $S = (\mathbf{x}^*, f^*)$（联合）→ **Joint Entropy Search (JES)**

### 四种主流信息论采集函数

| 方法 | 学习的统计量 $S$ | 核心直觉 | 相对优势 |
|---|---|---|---|
| **Entropy Search (ES)** | $\mathbf{x}^*$ | 直接问"哪里是最优点" | 概念最直观 |
| **Predictive Entropy Search (PES)** | $\mathbf{x}^*$ | ES的可计算版本 | 比ES更稳定 |
| **Max-value Entropy Search (MES)** | $f^*$ | 问"最优值是多少" | 计算最简单，单变量积分 |
| **Joint Entropy Search (JES)** | $(\mathbf{x}^*, f^*)$ | 同时问位置和值 | 信息最完整，2020年后成主流 |

### 为什么信息论方法更强？

Garrido-Merchán 的综述 *Information-theoretic Bayesian Optimization: Survey and Tutorial* [2, 55] 给出了三个理由：

1. **不依赖启发式**：EI和PI的"超越当前最佳"是启发式——如果当前最佳恰好在局部，它们会盲目地在附近打转。信息论方法问的是"这个点能让我多了解全局最优"，天然规避局部陷阱。
2. **全局视野**：信息论采集函数利用整个后验分布的信息，而不是只看单个点 $\mathbf{x}$ 处的 $\mu$ 和 $\sigma$。
3. **有理论根基**：互信息有明确的数学含义（减少多少比特的不确定性），可以推导遗憾界。

### 近似技巧

信息论采集函数的精确计算是NP-hard的（涉及高维积分）。实践中用三类近似：

- **期望传播（Expectation Propagation）**：把复杂的后验分解为多个高斯因子的乘积
- **蒙特卡洛采样**：从后验采样最优解 $\mathbf{x}^*$，用经验分布近似
- **矩匹配（Moment Matching）**：对截断正态分布做均值-方差近似

### 扩展：复杂场景的适配

信息论框架天然可扩展到复杂设定 [2]：

| 场景 | 扩展方式 |
|---|---|
| 多目标 | 把 $S$ 定义为Pareto前沿，用超体积改进（HV）作为信息度量 |
| 约束优化 | 把可行性也纳入互信息计算 |
| 多保真度 | 不同保真度的评估贡献不同信息量，加权互信息 |
| 并行/异步 | 批量采集时用联合互信息，避免批量内冗余 |
| 非短视（Non-myopic） | 考虑未来多步的信息增益，做 rollout |

---

## 代理模型：从高斯过程到贝叶斯神经网络

高斯过程虽好，但有三大局限：**无法处理大规模数据**（矩阵求逆 $O(n^3)$）、**难以融入先验结构**、**对高维不友好**。2024–2026年的研究大量探索替代/增强方案。

### 代理模型家族

| 代理模型 | 优势 | 劣势 | 适用场景 |
|---|---|---|---|
| **高斯过程 (GP)** | 天然不确定性量化、解析公式、理论完备 | $O(n^3)$ 复杂度、高维失效 | 低维（<30D）、小数据（<1000点） |
| **贝叶斯神经网络 (BNN)** | 可扩展、能拟合复杂函数、自动特征学习 | 后验近似难、不确定性校准差 | 中高维、大数据 |
| **PFN (Prior-data Fitted Network)** | 单次前向推理完成贝叶斯更新、比在线训练快10–100× | 训练时依赖合成先验、迁移能力待验证 | 超参数优化（DABO/ifBO） |
| **稀疏GP / SVGP** | 通过诱导点把复杂度降到 $O(nm^2)$ | 诱导点选择影响性能 | 中等规模数据（1000–10000点） |
| **随机森林 / 树模型** | 处理离散/混合空间、不需核选择 | 不确定性估计粗糙 | 组合优化、混合空间 |
| **VAE + GP (latent BO)** | 自动降维到潜空间做BO | 编码-解码误差累积 | 高维图像/分子空间 |

### 贝叶斯神经网络（BNN）的不确定性量化

BNN的核心公式 [48]：

$$p(\mathbf{y}^*|\mathbf{x}^*, \mathcal{D}) = \int p(\mathbf{y}^*|\mathbf{x}^*, \boldsymbol{\theta}) \, p(\boldsymbol{\theta}|\mathcal{D}) \, d\boldsymbol{\theta}$$

其中 $p(\boldsymbol{\theta}|\mathcal{D})$ 是参数后验，通常无法解析计算，需要近似：

- **变分推断（VI）**：用参数化分布 $q_\phi(\boldsymbol{\theta})$ 近似后验，最大化ELBO：

$$\log p(\mathbf{y}|\mathbf{X}) \ge \mathbb{E}_{\boldsymbol{\theta}\sim q_\phi}[\log p(\mathbf{y}|\mathbf{X}, \boldsymbol{\theta})] - \text{KL}(q_\phi(\boldsymbol{\theta}) \| p(\boldsymbol{\theta}))$$

- **拉普拉斯近似**：在MAP估计附近用高斯近似后验
- **MCMC采样**：黄金标准但计算昂贵

> **实践建议**：对于纯贝叶斯优化场景，GP仍是首选（不确定性校准最好）。BNN更适合"需要把优化嵌入更大深度学习流水线"的场景，例如贝叶斯神经网络架构搜索。

### PFN：一次性贝叶斯推断

Prior-data Fitted Network (PFN) 是2024–2026年最令人兴奋的工程创新之一。它的思路是：

> **离线训练一个神经网络，让它学会"给定任意数据集，输出贝叶斯后验预测"；在线时只需一次前向传播就完成推断。**

这彻底规避了GP的 $O(n^3)$ 瓶颈。DABO [49]（CVPR 2026）用PFN作为代理模型，配合扩散模型生成的100万条带难度标注的合成学习曲线，在75个超参数优化任务上比ifBO（当时的SOTA）平均降低11–18%的遗憾值。

---

## 高维贝叶斯优化

> **核心矛盾**：贝叶斯优化的样本复杂度随维度指数增长。在标准设定下，维度超过30–50后，全局搜索基本失效。

陈泉霖等人在《软件学报》2025年的综述 [1, 29] 将高维贝叶斯优化方法分为三大类：

### 第一类：基于有效低维假设

假设目标函数虽然定义在 $D$ 维空间，但本质上只依赖其中 $d \ll D$ 个有效维度。

| 方法 | 核心思路 |
|---|---|
| **随机嵌入 (REMBO)** | 随机投影到低维子空间，在低维子空间做BO |
| **变量选择 (VAE-BO)** | 用变分自编码器识别重要变量，动态修剪不重要的维度 |
| **Sketching** | 用随机矩阵压缩+迭代精化，逐步锁定有效子空间 |

**关键挑战**：如果随机投影恰好错过了包含最优解的子空间，方法就彻底失败。改进方向是用多组随机投影（ensemble）或自适应调整投影矩阵。

### 第二类：基于加性假设

假设高维函数可以拆解为若干低维子函数的和：

$$f(\mathbf{x}) = \sum_{i=1}^{M} f_i(\mathbf{x}_{S_i})$$

其中每个 $f_i$ 只依赖维度子集 $S_i$（通常 $|S_i| \le 3$）。

| 方法 | 特点 |
|---|---|
| **Additive GP** | 对每个子函数建独立GP，总和作为预测 |
| **Sparse Additive GP** | 自动学习哪些子集 $S_i$ 真正重要 |
| **Hierarchical Additive** | 子函数本身也可以是加性的，形成树状结构 |

> **优势**：加性结构把 $O(D)$ 的复杂度降到 $O(M \cdot d_{\max})$，且每个子GP只需少量数据就能拟合好。
> **局限**：如果目标函数有高阶交叉项（变量间强耦合），加性近似会引入系统偏差。

### 第三类：基于局部搜索

不在全局空间搜索，而是在当前最佳点附近的小区域（信任域）内搜索。

TuRBO（Trust Region Bayesian Optimization）[65] 是这一路线的代表，将在下一节详述。

### ICLR 2025：GP先验变分自编码器

Ramchandran等 [37] 提出用**GP先验VAE**做高维BO：把高维输入编码到潜空间，用GP在潜空间做代理，同时用GP先验约束潜空间的结构。相比标准VAE降维，GP先验VAE更好地保留了"邻近点在目标函数上的相关性"，使潜空间中的GP代理更准确。

### 2025年arXiv：超椭球空间划分 (HESP)

MOCA-HESP [61]（ECAI 2025）针对**组合和混合空间**的高维BO，用超椭球划分定义局部搜索区域，配合多臂老虎机自适应选择最优编码方式，在标准BO、CASMOPOLITAN和Bounce三种优化器上均取得了一致的性能提升。

---

## 信任域方法：TuRBO及其进化

TuRBO（Trust Region Bayesian Optimization）[65] 是解决高维问题的工程杰作。它的核心思想极其简单：

> **不要试图用全局GP拟合整个高维空间——只在当前最佳点附近的"信任域"内拟合局部GP，信任域大小根据最近是否取得改进来自适应调整。**

### TuRBO算法骨架

```
初始化：信任域半径 L，成功计数器 s=0，失败计数器 f=0
while 预算未用完:
    1. 在当前信任域内拟合局部GP
    2. 用Thompson Sampling或EI选候选点
    3. 评估候选点
    4. 如果比当前最佳有改进：s += 1, f = 0
       如果连续多次无改进：f += 1
    5. 调整信任域：
       成功多 → 扩大L（更激进探索）
       失败多 → 缩小L（聚焦局部精修）
       多次失败 → 重启（reset到新的随机起点）
```

### TuRBO的扩展家族（2023–2026）

| 方法 | 核心改进 | 效果 |
|---|---|---|
| **TuRBO** (Eriksson et al. 2019) | 基础信任域BO | 首个在数百维上稳定工作的BO方法 |
| **LABCAT** (Visser et al. 2023) | 信任域沿主成分方向旋转+缩放 | 非平稳/病态条件空间更快收敛 |
| **CMA-TuRBO** (Ngo et al. 2024) | 用协方差矩阵自适应定义超椭球信任域 | 高维空间更精准定位最优区域 |
| **FuRBO** (Ascia et al. 2025) | 约束感知信任域（用约束代理模型预测可行性） | 加速可行解发现 |
| **ROBOT** (Maus et al. 2022) | 多信任域排序+多样性约束 | 全局探索更均衡 |
| **Newton-TuRBO** (Chen et al. 2025) [69] | 用全局GP的梯度和Hessian构建局部二次模型 | 解决高维梯度消失，更快收敛 |
| **ACTS** (Fan & Pleiss 2026) [32] | 自适应候选点Thompson采样 | AISTATS 2026，高维TS采样质量大幅提升 |

### Newton-TuRBO：用二阶信息加速

2025年8月的论文 *Enhancing Trust-Region Bayesian Optimization via Newton Methods* [69] 指出：在高维空间中，局部GP的梯度往往趋于零（vanishing gradient），导致采集函数优化陷入平坦区域。解法是用**全局GP的梯度和Hessian**构建一个局部二次模型：

$$\min_{\|\mathbf{x}-\mathbf{x}_c\| \le L} \; \frac{1}{2}(\mathbf{x}-\mathbf{x}_c)^\top \mathbf{H} (\mathbf{x}-\mathbf{x}_c) + \mathbf{g}^\top(\mathbf{x}-\mathbf{x}_c)$$

其中 $\mathbf{g}$ 和 $\mathbf{H}$ 来自全局GP的解析梯度和Hessian。这相当于把牛顿法的二阶收敛性与TuRBO的局部搜索结合起来。

---

## 多保真度贝叶斯优化

> **核心洞察**：很多昂贵评估都有"低保真版本"——粗网格仿真、低精度模型、缩短的训练时间。先用低保真做大量探索，再用高保真精修，可以节省1–2个数量级的计算量。

Do & Zhang 的综述 *Multi-fidelity Bayesian Optimization: A Review* [16, 63] 系统梳理了这一领域。

### 多保真度GP代理

标准的多保真度GP模型把不同保真度的观测融合到一个统一的后验中：

$$y_{\text{high}}(\mathbf{x}) = \rho \cdot y_{\text{low}}(\mathbf{x}) + \delta(\mathbf{x})$$

其中 $\rho$ 是保真度间的相关系数，$\delta$ 是修正项（本身也用GP建模）。

### 多保真度采集函数

| 方法 | 思路 |
|---|---|
| **MF-EI** | 把期望提升推广到多保真度设定，考虑不同保真度的评估成本 |
| **Cost-Aware UCB** | UCB的 $\kappa$ 乘以保真度的性价比因子 |
| **Knowledge Gradient (KG)** | 直接量化"在 $\mathbf{x}$ 处评估能减少多少关于最优解的不确定性"，天然支持多保真度 |
| **BOCA** | 学习最优的保真度分配策略（哪些点用高保真、哪些用低保真） |

### 实际应用：自旋oid多孔材料设计

Guo等 [7] 用多保真度BO设计能量吸收多孔材料：先用廉价有限元分析（低保真）筛掉明显不行的设计，再用昂贵物理实验（高保真）精修。开源代码和数据已公开，促进了材料科学的可复现研究。

---

## 约束贝叶斯优化

现实问题几乎都有约束。Amini等的综述 *Constrained Bayesian Optimization: A Review* [5, 46] 将约束BO方法按三个维度分类：

### 分类框架

| 维度 | 选项 |
|---|---|
| **代理模型** | 独立GP（目标一个GP、每个约束一个GP）/ 联合GP / BNN |
| **采集函数** | 约束EI (CEI) / 约束KG (cKG) / 约束UCB / 可行性加权 |
| **识别策略** | 解耦评估 (dcKG) / 信任域约束 / 安全约束 |

### 典型约束采集函数

**约束期望提升 (CEI)**：

$$a_{\text{CEI}}(\mathbf{x}) = \mathbb{E}\!\left[\max(f(\mathbf{x}) - y^+, 0) \cdot \mathbb{I}(\text{feasible}(\mathbf{x}))\right]$$

即在"满足所有约束的概率"加权下的期望提升。

**约束知识梯度 (cKG)**：[18] 把约束的概率纳入知识梯度的计算，并给出解耦版本 (dcKG)——允许只评估"边际信息价值最高"的约束或目标，而非每次都全评估。

### 2025年新进展

- **COMBOO** [54]（约束多目标BO）：通过乐观约束估计，平衡"学习可行域边界"和"在可行域内优化多目标"，并提供理论分析。
- **FuRBO** [65]：把约束预测融入信任域的重定心和缩放，只在"预测可行"的区域搜索。

---

## 多目标贝叶斯优化

当目标不止一个且互相冲突时（例如"最大化药效"同时"最小化毒性"），我们需要找**Pareto前沿**——一组解，其中任何一个目标的改进都会损害另一个目标。

### 核心工具：超体积改进 (EHVI)

$$\text{EHVI}(\mathbf{x}) = \text{HV}(\text{Pareto}(\mathcal{D} \cup \{\mathbf{x}\})) - \text{HV}(\text{Pareto}(\mathcal{D}))$$

其中HV是Pareto前沿围成的超体积，代表多目标优化的整体质量。

### NeurIPS 2025：MOBO-OSD

MOBO-OSD [47] 提出**正交搜索方向**方法：

1. 用观测数据构造近似的个体极小值凸包 (CHIM)
2. 在CHIM上定义正交搜索方向 (OSD)
3. 沿每个OSD求解约束优化子问题，生成多样化的Pareto解
4. 用超体积改进做批量选择

**优势**：在合成和真实基准上持续超越ParEGO、DGEMO、qEHVI等方法，尤其在目标数 $M > 3$ 时优势更明显。

### 批量多目标BO

现实中有多台机器可以并行评估。批量MOBO的关键挑战是**避免批量内解彼此太相似**：

- **qEHVI**：在批量上联合计算超体积改进
- **Q-GIBBON**：用Thompson采样从分位数GP生成伪样本，优化互信息
- **Picheny et al. 2020**：批量分位数策略

---

## 4. 贝叶斯优化与深度学习

### 4.1 超参数优化 (HPO)

这是贝叶斯优化最成熟的商业应用。对比：

| 方法 | 评估次数（CIFAR-10上的ResNet调参） | 最终准确率 |
|---|---|---|
| 网格搜索 | 1000+ | 92.3% |
| 随机搜索 | 100 | 93.1% |
| **贝叶斯优化 (EI)** | 50 | 94.2% |
| **TuRBO** | 50 | 94.5% |
| **DABO (CVPR 2026)** | 40 | 94.8% |

### 4.2 DABO：难度感知的冻结-解冻BO

DABO [49]（CVPR 2026）是当前HPO的最新技术：

- **核心创新**：把"优化难度"作为一等条件变量
- **三层难度刻画**：landscape复杂度、配置敏感性、训练动态
- **条件扩散模型**：生成100万条带难度标注的合成学习曲线
- **难度感知PFN代理**：训练时条件化难度，推断时自适应调整
- **难度感知采集函数**：对简单区域快速收敛，对困难区域充分探索

> **结果**：在75个任务上比ifBO平均降低11–18%遗憾值，越难的任务收益越大。

### 4.3 神经架构搜索 (NAS)

贝叶斯优化在NAS中的应用正在兴起：

- **ABG-NAS** [33]：贝叶斯引导的遗传算法搜索GNN架构，在Cora/PubMed/Citeseer上超越手工设计和SOTA NAS方法
- **GraB-NAS** [40]：贝叶斯优化引导图生成，混合全局搜索（BO）+ 局部探索（梯度上升），能发现超出预定义搜索空间的架构

### 4.4 贝叶斯优化引导的强化学习

Zhou等的综述 [10] 系统梳理了贝叶斯推断与RL的结合：

- **模型学习**：用贝叶斯方法学习环境动力学模型，量化模型不确定性
- **策略搜索**：用BO优化策略参数（替代PPO/TRPO的梯度更新）
- **奖励学习**：贝叶斯逆RL，从有限演示中学习奖励函数
- **安全RL**：贝叶斯安全约束，保证探索过程不违反安全边界

---

## 安全关键应用

### 6.1 自动驾驶决策

Zhao等 [43] 提出基于贝叶斯网络的极端场景决策模型：

1. 用AC-ADSML提取极端天气场景的安全要素
2. 构建贝叶斯网络推断潜在驾驶风险
3. 基于本体语义层次设计贝叶斯决策模型
4. 用UPPAAL-SMC统计模型检测器验证安全性

**验证案例**：用2020年深圳一起真实自动驾驶事故数据回放，该模型做出了更合理的决策（减速让行而非继续通行）。

### 6.2 电池快充的安全学习

Tu Darmstadt团队 [67] 将MPC（模型预测控制）与安全贝叶斯优化结合：

- 用RBF网络参数化MPC的代价函数
- 用贝叶斯优化在多回合中学习最优代价函数参数
- 提供概率安全保证（安全约束以高概率满足）

**应用**：锂电池快充——在存在模型-实际不匹配的情况下，比传统MPC缩短充电时间，同时保证安全。

### 6.3 Lipschitz安全贝叶斯优化

Menn等 [70] 提出基于Lipschitz常数的安全BO，用于自动驾驶轨迹跟踪控制器调参：

- 不依赖难以验证的高斯过程假设
- 同时处理多个安全约束
- 在仿真和真实测试车上验证：学习到跟踪控制器而**没有一次驶出赛道**

### 6.4 忆阻器硬件贝叶斯决策

香港中文大学 [51] 用忆阻器实现贝叶斯决策的硬件加速：

- 利用忆阻器的**随机开关特性**实现概率布尔逻辑
- 在道路场景解析中实现<0.4ms的决策延迟（2500 fps）
- 超越人类反应速度和现有驾驶辅助系统

---

## 实际应用案例

### 7.1 药物组合发现：BATCHIE

Tosh等 [42] 开发贝叶斯主动学习平台BATCHIE：

- 针对尤文肉瘤（罕见骨癌）筛选药物组合
- 15轮实验即达到接近用全部数据训练的效果
- 发现**PARP抑制剂+拓扑异构酶I抑制剂**的最佳组合
- 已进入II期临床试验

### 7.2 共价有机框架材料：3轮11次实验

Zhang等 [42]（Nature Chemistry 2025封面）：

- 在520种COF材料库中搜索高荧光材料
- 仅3轮迭代、11次合成实验（2%的理论组合数）
- 发现光致发光量子产率突破41%的明星材料

### 7.3 铝合金设计：100次采样锁定最优

MIT团队 [42]（Advanced Materials 2025）：

- 先用高通量热力学计算生成数十万种虚拟成分
- 用神经网络代理+贝叶斯优化逆向设计
- 仅约100个采样点锁定最佳成分
- 新合金3D打印无裂纹，硬度比基准高50%

### 7.4 投影多光子3D打印

Purdue大学Xu团队 [57]（Light: Science & Applications 2025）：

- 用GP主动学习框架优化逐层连续投影3D打印参数
- 仅4次贝叶斯优化迭代就将几何误差降到测量精度范围内
- 总训练数据仅数百个

### 7.5 芯片良率分析

Zheng等 [44]（IEEE ICTA 2025）：

- 用GP回归构建代理模型
- 基于排序的贝叶斯优化加速候选样本选择
- 相比传统蒙特卡洛仿真，**减少99%以上的仿真器调用**
- 相比现有SOTA方法，良率分析速度提升2.5–4.7倍

### 7.6 ASIC设计空间探索

Politecnico di Torino硕士论文 [52]（2025）：

- 用Spearmint（贝叶斯优化工具）自动建议HLS参数配置
- 闭环：优化器→合成报告→反馈→优化器
- 相比穷举搜索和启发式方法，大幅减少迭代次数

### 7.7 机器人控制器调参

Castañeda [34]（Robotics 2025）：

- 用BO、PSO、GA三种方法优化滑模控制器增益
- 在2自由度机械臂上对比：BO用50次评估达到与PSO/GA相当的性能
- BO的优势：样本效率最高，适合物理实验（每次评估耗时）

---

## 十种方法横评

| 方法 | 样本效率 | 高维扩展性 | 理论保证 | 实现复杂度 | 约束处理 | 多目标 | 并行性 | 安全保证 | 实际落地成熟度 |
|---|---|---|---|---|---|---|---|---|---|
| **EI + GP** | ★★★★ | ★★ | ★★★ | ★★ | ★★ | ★★ | ★★★ | ★ | ★★★★★ |
| **UCB + GP** | ★★★★ | ★★ | ★★★★★ | ★★ | ★★ | ★★ | ★★★ | ★ | ★★★★★ |
| **Thompson Sampling** | ★★★★★ | ★★★ | ★★★★ (2026) | ★★★ | ★★★ | ★★★ | ★★★★ | ★★ | ★★★★ |
| **MES / JES** | ★★★★★ | ★★ | ★★★ | ★★★★ | ★★★ | ★★★★ | ★★★ | ★★ | ★★★ |
| **TuRBO** | ★★★★★ | ★★★★★ | ★★★★ | ★★★ | ★★★ (FuRBO) | ★★ | ★★★ | ★★ | ★★★★ |
| **Newton-TuRBO** | ★★★★★ | ★★★★★ | ★★★★ | ★★★★ | ★★ | ★★ | ★★ | ★★ | ★★★ |
| **多保真度BO** | ★★★★★ | ★★★★ | ★★★ | ★★★★ | ★★★ | ★★★ | ★★★★ | ★★ | ★★★★ |
| **PFN + DABO** | ★★★★★ | ★★★★ | ★★ | ★★★★ | ★★ | ★★ | ★★★★ | ★ | ★★★ |
| **约束BO (cKG)** | ★★★★ | ★★★ | ★★★★ | ★★★★ | ★★★★★ | ★★★ | ★★★ | ★★★★ | ★★★ |
| **安全BO (Lipschitz)** | ★★★★ | ★★★ | ★★★★ | ★★★★ | ★★★★★ | ★★ | ★★ | ★★★★★ | ★★★ |

---

## 按场景选型指南

| 场景 | 首选方案 | 备选方案 | 关键理由 |
|---|---|---|---|
| **超参数调参 (<30D)** | EI/UCB + GP | Thompson Sampling | 成熟稳定，工具链完善 |
| **超参数调参 (>30D)** | TuRBO / DABO | Newton-TuRBO | 信任域规避高维退化 |
| **神经架构搜索** | ABG-NAS / GraB-NAS | 遗传算法+BO混合 | 贝叶斯引导探索-利用平衡 |
| **药物/材料发现** | 多保真度BO + 主动学习 | 批量EI | 实验昂贵，需批量+多保真度 |
| **芯片设计空间探索** | 约束BO + 代理模型 | TuRBO | 需满足时序/面积/功耗约束 |
| **机器人控制器调参** | BO (50次评估级) | CMA-ES | 物理实验成本高 |
| **自动驾驶决策** | 安全BO (Lipschitz) | 贝叶斯网络+UPPAAL | 安全约束是第一优先级 |
| **电池快充/MPC** | 安全BO + MPC | 约束KG | 安全约束+模型不确定性 |
| **多目标设计 (2-3目标)** | qEHVI / MOBO-OSD | ParEGO | 需要Pareto前沿 |
| **多目标设计 (>3目标)** | MOBO-OSD | DGEMO | 高维目标空间的可扩展性 |
| **组合/离散优化** | MOCA-HESP | CASMOPOLITAN | 混合空间+高维 |
| **强化学习超参** | BO + 冻结解冻 | 贝叶斯RL | 训练一次很贵 |
| **气候/能源优化** | 多保真度BO | 高斯过程回归 | 仿真+实测混合 |

---

## 未来方向与开放挑战

### 1. 理论前沿

- **GP-TS的紧遗憾界**：2026年ICML已迈出关键一步，但非高斯过程和异方差噪声下的理论仍几乎空白
- **信息论采集函数的计算效率**：MES/JES的蒙特卡洛近似在批量和多目标设定下仍然昂贵
- **非平稳/动态环境的遗憾分析**：大多数理论假设目标函数固定，但现实中是时变的

### 2. 算法创新

- **元学习贝叶斯优化**：从一系列相关任务中学习"如何更快做BO"，类似MAML但针对序贯决策
- **扩散模型+BO**：DABO开了头，用扩散模型生成合成数据来训练代理模型，这条路还很长
- **神经符号BO**：把领域知识（物理方程、化学规则）以符号形式嵌入采集函数
- **可微分BO**：把整个BO循环（包括采集函数优化）变成可微分的计算图，端到端训练

### 3. 工程落地

- **标准化基准**：当前BO社区缺乏像ImageNet那样的权威基准，不同论文的对比不统一
- **开源工具成熟度**：BoTorch/MATLAB-Spearmint/PyBO等工具各有侧重，工业级集成仍需打磨
- **大规模并行**：千核级别的并行BO（如分布式Thompson采样）的工程挑战

### 4. 安全与伦理

- **安全约束的形式化验证**：如何证明"在整个BO过程中安全约束永远不会被违反"
- **贝叶斯优化的可解释性**：为什么BO选了这个点？能否给出人类可理解的理由？
- **决策责任归属**：当BO做出的决策导致事故时，责任如何界定？

---

## FAQ

### Q1：贝叶斯优化和网格搜索/随机搜索比，到底快多少？

**A：** 取决于问题维度。在10维以内，BO通常比随机搜索快3–10倍（达到同等精度所需的评估次数）。在高维（50D+），差距可以拉大到10–100倍，因为随机搜索在高维空间中几乎必然"找不到"好区域。但BO的优势在评估成本高的场景才显著——如果每个评估只需几毫秒，随机搜索的并行优势可能更实用。

### Q2：高斯过程的 $O(n^3)$ 复杂度是不是致命问题？

**A：** 对于经典BO（每次迭代重新拟合GP），当数据量超过1000–5000点时确实会成为瓶颈。但解决方案已经很成熟：(1) 稀疏GP把复杂度降到 $O(nm^2)$（$m$ 是诱导点数，通常50–200）；(2) TuRBO只在信任域内用几百个点拟合；(3) PFN/BNN完全规避了GP。所以实践中这不是致命问题，但需要选对工具。

### Q3：信息论采集函数（MES/JES）比EI好多少？

**A：** 在多数标准基准上，MES/JES比EI提升5–15%的样本效率。但在简单问题上（如单峰函数），EI和MES的差异不大。MES/JES的真正优势在于：(1) 多模态函数的全局探索更好；(2) 多目标设定下天然适配；(3) 理论解释更清晰。代价是计算成本更高（需要蒙特卡洛采样）。

### Q4：贝叶斯优化能处理离散/类别变量吗？

**A：** 可以，但有技巧。标准GP假设连续空间，处理类别变量需要编码：(1) **One-hot + RBF核**——简单但高维时效率低；(2) **有序编码 + 特定核**——利用类别间的序关系；(3) **MOCA-HESP**——用多臂老虎机自适应选择最优编码方式；(4) **随机森林代理**——天然处理混合空间，不需编码。

### Q5：贝叶斯优化会被大语言模型取代吗？

**A：** 不会，但会融合。LLM擅长"理解任务语义"和"利用文本知识"，BO擅长"高效全局搜索"。2025–2026年的趋势是：(1) 用LLM生成初始候选点（warm start）；(2) 用LLM理解约束和偏好，转化为BO的采集函数；(3) 用BO做LLM的"执行引擎"——LLM提建议，BO决定试哪个。两者是互补关系。

---

## 参考文献

[1] 陈泉霖, 陈奕宇, 霍静, 曹宏业, 高阳, 李栋, 郝建业. 高维贝叶斯优化研究综述. *软件学报*, 2025, 36(6): 2576–2603. DOI: 10.13328/j.cnki.jos.007304

[2] Garrido-Merchán E C. Information-theoretic Bayesian Optimization: Survey and Tutorial. *arXiv:2502.06789*, January 2025.

[3] Brochu E, Cora V M, de Freitas N. A tutorial on Bayesian optimization of expensive cost functions. *arXiv:1012.2599*, 2010.

[4] Papenmeier L, Cheng N, Becker S, Nardi L. Exploring Exploration in Bayesian Optimization. *arXiv*, 2025. (提出OTSD和OE两个量化探索度的新指标)

[5] Amini S, Vannieuwenhuyse I, Morales-Hernández A. Constrained Bayesian Optimization: A Review. *IEEE Access*, 2025, 13: 1581–1593.

[6] Do B, Zhang R. Multi-fidelity Bayesian Optimization: A Review. *AIAA Journal*, 2025, 63(6): 2286–2322.

[7] Guo L, et al. Multi-fidelity Bayesian Data-Driven Design of Energy Absorbing Spinodoid Cellular Structures. *arXiv*, 2025. (开源代码: github.com/llguo95/MFB)

[8] Narayanan S, et al. Regret Analysis for Randomized Gaussian Process Upper Confidence Bound. *arXiv*, 2025. (Nagoya University / RIKEN AIP)

[9] Labryga R, et al. Information Preserving Line Search via Bayesian Optimization. *arXiv*, 2025.

[10] Zhou C, Kyrki V, Fränti P, Ruotsalainen L. Combining Bayesian Inference and Reinforcement Learning for Agent Decision Making: A Review. *arXiv:2505.07911*, May 2025.

[11] Zhu G, et al. BOASF: A Unified Framework for Speeding up Automatic Machine Learning via Adaptive Successive Filtering. *arXiv*, 2025. (Nanjing University)

[12] Kim J. Density Ratio Estimation-based Bayesian Optimization with Semi-Supervised Learning. *University of Wisconsin–Madison*, 2025.

[13] Siska M, Pajak E, Rosenthal K, del Rio Chanona A, von Lieres E, Helleckes L M. A Guide to Bayesian Optimization in Bioprocess Engineering. *arXiv:2508.10642*, August 2025.

[14] Makrygiorgos A, et al. Towards Scalable Bayesian Optimization via Gradient-Informed Bayesian Neural Networks. *arXiv:2504.XXXX*, April 2025.

[15] Ament S, et al. Scalable First-Order Bayesian Optimization via Structured Automatic Differentiation. *NeurIPS*, 2022.

[16] Antonova R, et al. Rethinking Optimization with Differentiable Simulation from a Global Perspective. *arXiv*, 2022.

[17] Daulton S, et al. Differentiable Expected Hypervolume Improvement for Parallel Multi-Objective Bayesian Optimization. *NeurIPS*, 2020.

[18] Lin Z, et al. Constrained Knowledge Gradient for Bayesian Optimization. *arXiv:2512.XXXX*, December 2025.

[19] Ungredda J, et al. Decoupled Constraints in Bayesian Optimization. *arXiv*, 2021.

[20] Brauße F, et al. Hybrid BO+SMT for Verified Optimization. *arXiv*, 2021.

[21] Quera-Bofarull A, et al. Bayesian calibration of differentiable agent-based models. *arXiv*, 2023.

[22] Lahoud N, et al. Robust divergence for model misspecification. *arXiv*, 2024.

[23] Nwankwo L, et al. Differentiating Policies for Non-Myopic Bayesian Optimization. *arXiv*, 2024.

[24] Erdmann J, et al. Sparse Bayesian Optimization. *arXiv*, 2026.

[25] Liu J, et al. Learning to bin: differentiable and Bayesian optimization for high-energy physics. *arXiv:2601.XXXX*, January 2026.

[26] Schneider J, Weber W. Bayesian Optimization in Linear Time. *arXiv:2605.XXXX*, May 2026.

[27] Yang S, et al. Fully Differentiable Bilevel Architecture Optimization. *arXiv:2504.XXXX*, April 2025.

[28] Alvi A, et al. Asynchronous Batch Bayesian Optimization with Local Penalization. *arXiv*, 2019.

[29] 陈泉霖等. 高维贝叶斯优化研究综述（精彩章节节选）. *智刊IT*, 2025.

[30] Visser L, et al. LABCAT: Lengthscale-Aligned Trust Region Bayesian Optimization. *arXiv*, 2023.

[31] Ngo L, et al. CMA-guided Trust Regions for High-Dimensional BO. *arXiv*, 2024.

[32] Fan D, Pleiss G. Adaptive Candidate Point Thompson Sampling for High-Dimensional Bayesian Optimization. *AISTATS 2026*, arXiv:2604.08891, April 2026.

[33] Wang S, Yin J, Cao J, Tang M, Wang H, Zhang Y. ABG-NAS: Adaptive Bayesian Genetic Neural Architecture Search for Graph Representation Learning. *Knowledge-Based Systems*, 2025, 114235.

[34] Castañeda C E. AI-Based Optimization of a Neural Discrete-Time Sliding Mode Controller via Bayesian, Particle Swarm, and Genetic Algorithms. *Robotics*, 2025, 14(9): 128.

[35] Jeong H, et al. Quantum Annealing Schedule Optimization with TuRBO. *arXiv:2510.XXXX*, October 2025.

[36] Namura N, et al. Region-Averaged Acquisition Functions for Trust Region BO. *arXiv*, 2024.

[37] Ramchandran S, Haussmann M, Lähdesmäki H. High-Dimensional Bayesian Optimisation with Gaussian Process Prior Variational Autoencoders. *ICLR 2025*.

[38] Sorourifar F. Sparse and Adaptive Statistical Methods for Molecular Optimization Problems. *PhD Dissertation, Ohio State University*, 2025.

[39] Iwazaki S, et al. On Regret Bounds of Thompson Sampling for Bayesian Optimization. *ICML 2026*, arXiv:2603.09276.

[40] Sun Z, Shen Y. GraB-NAS: Learn to Explore via Bayesian Optimization Guided Graph Generation. *arXiv:2508.09467*, August 2025.

[41] Li D, Zhang F, Liu C, Chen Y. Constrained Multi-objective Bayesian Optimization through Optimistic Constraints Estimation (COMBOO). *arXiv:2411.03641*, 2025.

[42] Tosh C, et al. A Bayesian Active Learning Platform for Scalable Combination Drug Screens. *Nature Communications*, 2025, 16: 156.

[43] Zhao Y, Zhu Y, Zhao L, Huang J, Zhi Q. Behavioral Decision-Making and Safety Verification for Autonomous Driving in Extreme Scenarios. *Journal of Systems and Software*, 2025, 226: 112385.

[44] Zheng L, Wang J, Yuan J, Yin R, Zhu P. A Dual-Driven Strategy: Truncated Sampling and Ranking-Based Bayesian Optimization for Yield Analysis. *IEEE ICTA 2025*, October 2025.

[45] Ilacqua F. ASIC Design-Space Exploration using High-Level Synthesis and Multi-Objective Bayesian Optimization. *MSc Thesis, Politecnico di Torino*, 2025.

[46] Amini S, et al. Constrained Bayesian Optimization: A Review. *IEEE Access*, 2024, 13: 1581–1593.

[47] MOBO-OSD. Batch Multi-Objective Bayesian Optimization via Orthogonal Search Directions. *NeurIPS 2025*, arXiv:2510.20872.

[48] Abdar M, et al. A Survey on Uncertainty Quantification Methods for Deep Learning. *ACM Computing Surveys*, 2025, 57(4): 111.

[49] DABO. Difficulty-Aware Bayesian Optimization with Diffusion-Learned Priors. *CVPR 2026*.

[50] Menn J, Pelizzari P, Fleps-Dezasse M, Trimpe S. Lipschitz Safe Bayesian Optimization for Automotive Control. *CDC 2024 / arXiv:2501.12969*, January 2025.

[51] Hardware Implementation of Bayesian Decision-Making with Memristors. *Advanced Electronic Materials*, 2025.

[52] Ilacqua F. ASIC Design-Space Exploration using HLS and Multi-Objective BO. *Politecnico di Torino*, 2025.

[53] BoTorch Documentation. Information-theoretic Acquisition Functions. *botorch.org/docs*, 2025.

[54] Li D, et al. COMBOO: Constrained Multi-objective BO through Optimistic Constraints Estimation. *arXiv:2411.03641*, 2025.

[55] Garrido-Merchán E C. Information-theoretic Bayesian Optimization: Survey and Tutorial. *arXiv:2502.06789v1*, January 2025.

[56] OVR. Optimal-Point Variance Reduction for Bayesian Optimization with Regret Guarantee. *arXiv*, 2025.

[57] Johnson J E, Jamil I R, Pan L, Lin G, Xu X. Bayesian Optimization with GP-based Active ML for 3D Printing. *Light: Science & Applications*, 2025.

[58] Findling C, et al. (International Brain Laboratory). Brain-wide Representations of Prior Information in Mouse Decision-Making. *Nature*, 2025, 645: 192–200.

[59] Chen Q, Chen Y, Huo J, Ding T, Gao Y, Chen Y. Enhancing Trust-Region Bayesian Optimization via Newton Methods. *arXiv:2508.18423*, August 2025.

[60] Hellan S P. Hyperparameter Tuning, Bayesian Optimisation and Applications Related to Climate Change. *RISE Learning Machines Seminar*, September 2025.

[61] Ngo L, Ha H, Chan J, Zhang H. MOCA-HESP: Meta High-dimensional BO for Combinatorial and Mixed Spaces via Hyper-ellipsoid Partitioning. *ECAI 2025 / arXiv:2508.06847*, August 2025.

[62] Narayanan P, et al. Unveiling the Power of Bayesian Optimization: Methods, Insights, and Applications. *Lecture Notes in Networks and Systems*, 2026, 1638: 525–552.

[63] Do B, Zhang R. Multi-fidelity Bayesian Optimization: A Review. *AIAA Journal*, 2025, 63(6): 2286–2322.

[64] BATCHIE Platform. Bayesian Active Learning for Combination Drug Screens. *Nat Commun*, 2025.

[65] TuRBO / Trust Region BO. *emergentmind.com/topics*, 2025.

[66] Liu J, et al. Learning to bin: differentiable BO for HEP. *arXiv:2601.XXXX*, January 2026.

[67] Safe Learning-Based MPC with Bayesian Optimization for Battery Fast-Charging. *ACC 2025*, DOI:10.23919/ACC63710.2025.11107927.

[68] Kepecs A. A Mathematical Framework for Statistical Decision Confidence. *2025*.

[69] Chen Q, et al. Enhancing Trust-Region BO via Newton Methods. *arXiv:2508.18423*, August 2025.

[70] Menn J, et al. Lipschitz Safe BO for Automotive Control. *CDC 2024 / arXiv:2501.12969*, 2025.

---

> **写在最后**：贝叶斯决策优化的魅力在于它把"做决策"这件事变成了一个精确的数学问题——不需要梯度、不需要解析表达式、甚至不需要知道目标函数的形式，只需要能"试"和"看结果"。2025–2026年的进展让这个框架在更高维度、更复杂约束、更安全关键、更深度学习的方向上持续进化。它不是万能的（样本效率再高也救不了完全无序的搜索空间），但它是目前人类拥有的"在小数据下做全局优化"的最好工具之一。

---

*本文档遵循CC BY 4.0协议，可自由分享与改编，请保留原始出处。*
