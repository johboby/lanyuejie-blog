---
title: "七种神经元模型：从生物物理到人工智能的计算谱系"
subtitle: "LIF · Izhikevich · Hodgkin-Huxley · AdEx · FitzHugh-Nagumo · Morris-Lecar · Hindmarsh-Rose"
date: "2026-08-17"
reading_time: "约 35 分钟"
tags: ["神经元模型", "脉冲神经网络", "计算神经科学", "SNN", "神经形态计算", "生物物理建模"]
---

> **TL;DR** — 这篇文章系统梳理了七种经典神经元模型，从最简单的漏积分发放（LIF）到支持三种发放模式的 Hindmarsh-Rose（HR），覆盖了从**工程实用**到**生物精确**的完整光谱。每种模型都给出核心方程、参数含义、典型发放模式、在 AI/SNN 中的应用与局限。文章末尾提供横评表、选型指南和完整参考文献。

---

## 目录

- [先说结论](#先说结论)
- [一、为什么需要这么多神经元模型？](#一为什么需要这么多神经元模型)
- [二、模型一：LIF — 漏积分发放神经元](#二模型一lif--漏积分发放神经元)
- [三、模型二：Izhikevich — 七种神经元类型](#三模型二izhikevich--七种神经元类型)
- [四、模型三：Hodgkin-Huxley — 生物物理黄金标准](#四模型三hodgkin-huxley--生物物理黄金标准)
- [五、模型四：AdEx — 自适应指数整合发放](#五模型四adex--自适应指数整合发放)
- [六、模型五：FitzHugh-Nagumo — 相平面上的极简主义](#六模型五fitzhugh-nagumo--相平面上的极简主义)
- [七、模型六：Morris-Lecar — 两类兴奋性统一框架](#七模型六morris-lecar--两类兴奋性统一框架)
- [八、模型七：Hindmarsh-Rose — 三种簇发放模式](#八模型七hindmarsh-rose--三种簇发放模式)
- [九、七模型横评对比](#九七模型横评对比)
- [十、按应用场景选型](#十按应用场景选型)
- [十一、SNN 训练方法速览](#十一snn-训练方法速览)
- [十二、未来方向](#十二未来方向)
- [FAQ](#faq)
- [参考文献](#参考文献)

---

## 先说结论

1. **没有"最好"的神经元模型，只有"最合适"的模型。** 选模型本质上是在**生物保真度、计算成本、可训练性**三者之间做权衡。
2. **LIF 是工程首选**——简单、可微、硬件友好，但生物学上粗糙，无法产生簇发放。
3. **Izhikevich 是性价比之王**——两方程四参数，能复现 20 种已知皮层神经元放电模式，是大规模 SNN 仿真的甜点。
4. **Hodgkin-Huxley 是黄金标准**——四变量、离子通道级精度，但计算昂贵（比 LIF 贵约 1000×），适合小网络精细仿真。
5. **AdEx 是 HH 与 LIF 之间的优雅折中**——指数项捕获尖峰启动的非线性，自适应项捕获发放频率适应，相平面分析成熟。
6. **FHN、Morris-Lecar、Hindmarsh-Rose 是"相平面三剑客"**——二维或三维系统，适合研究分岔、簇发放、同步等动力学现象，而非直接做 AI 推理。
7. **2025–2026 年的趋势**：可学习内部神经元参数（LIF 精度提升 13.5pp）、超离散化（UltraLIF 消除代理梯度）、AdEx 在边缘设备上的能效优势。

---

## 一、为什么需要这么多神经元模型？

### 1.1 生物神经元的复杂性

一个真实的生物神经元同时处理数十种离子通道电流（Na⁺、K⁺、Ca²⁺、Cl⁻…），每种通道有独立的电压依赖开关动力学。Hodgkin 和 Huxley 在 1952 年用四个变量的微分方程描述了这一切——这是辉煌的起点，也是计算噩梦的开端。

> 一个拥有 10⁴ 个神经元的 HH 网络，每个时间步要求解 ~4×10⁴ 个 ODE。实时仿真需要超级计算机。

### 1.2 三种抽象层级

| 抽象层级 | 代表模型 | 变量数 | 计算成本 | 典型用途 |
|---|---|---|---|---|
| **现象学/工程级** | LIF, Izhikevich | 1–2 | 极低 | 大规模 SNN、 neuromorphic 芯片 |
| **介观/折中级** | AdEx, FHN, Morris-Lecar | 2 | 低–中 | 计算神经科学、动力学分析 |
| **生物物理级** | Hodgkin-Huxley | 4+ | 高 | 离子通道研究、药物筛选 |

### 1.3 选择模型的核心问题

- **你要模拟多少个神经元？** 10 个 → 用 HH；10⁶ 个 → 用 LIF/Izhikevich。
- **你需要哪些放电模式？** 仅紧张性发放 → LIF 够用；需要簇发放、适应、共振 → Izhikevich/AdEx。
- **你的硬件是什么？** GPU 训练 → 任何可微模型；Loihi/TrueNorth 芯片 → LIF 最优；FPGA 定制 → FHN 有成熟方案。

---

## 二、模型一：LIF — 漏积分发放神经元

### 2.1 核心方程

LIF（Leaky Integrate-and-Fire）是最简单的脉冲神经元模型，本质是一个**带泄漏的 RC 电路**：

$$C \frac{dV}{dt} = -g_L (V - E_L) + I(t)$$

或等价地（无量纲形式）：

$$\tau_m \frac{dV}{dt} = -(V - V_{rest}) + R \cdot I(t)$$

其中：
- $C$：膜电容
- $g_L$：泄漏电导
- $E_L$ 或 $V_{rest}$：静息电位
- $\tau_m = RC$：膜时间常数
- $I(t)$：输入电流

**发放规则**：当 $V(t) \geq V_{th}$ 时，神经元发放一个脉冲（spike），然后膜电位被重置为 $V_{reset}$，并进入一段不应期。

离散时间版本（深度学习中最常用）：

$$V[t] = \lambda V[t-1] + I[t]$$
$$S[t] = \Theta(V[t] - V_{th})$$
$$V[t] \leftarrow V[t] \cdot (1 - S[t]) + V_{reset} \cdot S[t]$$

其中 $\lambda = e^{-\Delta t / \tau_m}$ 是泄漏因子，$\Theta$ 是 Heaviside 阶跃函数。

### 2.2 为什么 LIF 是 SNN 的"默认选项"

| 优势 | 说明 |
|---|---|
| **计算极简** | 每层只需 512 个 LIF 神经元即可在 MNIST 上达到高准确率 [26] |
| **天然可微近似** | 用 surrogate gradient（如 arctan 近似）可端到端训练 [37] |
| **硬件原生支持** | Intel Loihi、SpiNNaker、BrainScaleS 均以 LIF 为原生指令 |
| **能量效率** | Loihi 比 GPU 节能约 1000× [37] |

### 2.3 局限

- **无簇发放**：LIF 只能产生紧张性（tonic）发放，无法模拟生物神经元丰富的放电模式。
- **无自适应**：发放频率不随时间适应，缺少真实神经元的关键特征。
- **需要更多神经元**：相同任务下，LIF 网络需要 4–8× 更多神经元才能达到其他模型同等精度 [26]。

### 2.4 2025–2026 最新进展

- **UltraLIF**（2026.02）：用超离散化（ultradiscretization）和 max-plus 代数替代 surrogate gradient，实现前向-后向完全一致的梯度，在 $T=1$ 单步推理上优势尤其明显 [37]。
- **可学习内部参数**（2025.08）：联合优化突触权重和 LIF 内部参数（τ, Vth, Vreset），分类精度提升最高 **13.5 个百分点** [31]。
- **CuAdLIF**（2025.04）：电流型自适应 LIF，引入延迟响应和膜电位适应，提升首脉冲编码的时间特征提取能力 [43]。

---

## 三、模型二：Izhikevich — 七种神经元类型

### 3.1 核心方程

Izhikevich 模型（2003）用一个**二维非线性系统**压缩了 Hodgkin-Huxley 的丰富动力学：

$$\frac{dv}{dt} = 0.04v^2 + 5v + 140 - u + I$$
$$\frac{du}{dt} = a(bv - u)$$

**发放后重置**：
$$\text{if } v \geq 30 \text{ mV, then } v \leftarrow c,\; u \leftarrow u + d$$

其中：
- $v$：膜电位（mV）
- $u$：恢复变量（recovery variable），模拟 K⁺ 激活和 Na⁺ 失活的联合效应
- $a$：恢复变量的时间尺度（越小越慢）
- $b$：$u$ 对 $v$ 的亚阈值敏感性
- $c$：发放后 $v$ 的重置值
- $d$：发放后 $u$ 的增量

### 3.2 七种神经元类型参数表

| 神经元类型 | 缩写 | a | b | c | d | 生物学对应 |
|---|---|---|---|---|---|---|
| **规则发放** | RS | 0.02 | 0.2 | -65 | 8 | 皮层锥体神经元（最常见） |
| **快速发放** | FS | 0.1 | 0.2 | -65 | 2 | 抑制性中间神经元 |
| **低阈值发放** | LTS | 0.02 | 0.25 | -65 | 2 | 丘脑中继神经元 |
| **Chattering** | CH | 0.02 | 0.2 | -50 | 2 | 皮层 2/3 层 γ 振荡神经元 |
| **固有爆发** | IB | 0.02 | 0.2 | -55 | 4 | 海马/皮层爆发神经元 |
| **丘脑-皮层** | TC | 0.02 | 0.25 | -65 | 0.05 | 丘脑皮层中继细胞 |
| **共振器** | RZ | 0.1 | 0.25 | -65 | 2 | 具有亚阈值振荡的共振神经元 |

### 3.3 参数语义深度解读

**参数 a（恢复时间尺度）**：
- $a = 0.02$（慢恢复）→ 适合兴奋性神经元，产生明显的频率适应
- $a = 0.1$（快恢复）→ 适合抑制性中间神经元，几乎无适应

**参数 b（共振强度）**：
- $b > a$ → 神经元是"共振器"（resonator），对特定频率输入敏感
- $b < a$ → 神经元是"积分器"（integrator），对输入总量敏感

**参数 c（重置电位）**：
- $c = -65$（深重置）→ 强后超极化，产生规则发放
- $c = -50$（浅重置）→ 允许快速连续发放，产生 chattering

**参数 d（恢复跳变）**：
- $d = 8$（大跳变）→ 每次发放后强负反馈，频率快速下降（RS 的标志）
- $d = 2$（小跳变）→ 弱适应，维持高频发放（FS/CH 的特征）

### 3.4 七种类型的行为特征

#### RS（Regular Spiking）— 规则发放
> 皮层中最常见的兴奋性神经元。给一个持续电流刺激，先以短间隔快速发放几 spikes，然后间隔逐渐拉长——这就是**频率适应**（spike frequency adaptation）。参数 $d=8$ 的大跳变在每次发放后强力推高恢复变量 $u$，产生越来越强的负反馈。

#### FS（Fast Spiking）— 快速发放
> 抑制性中间神经元，能以 100+ Hz 持续发放而几乎不减速。$a=0.1$ 让恢复变量快速衰减回基线，$d=2$ 的弱跳变意味着每次发放只产生微弱的适应。

#### LTS（Low-Threshold Spiking）— 低阈值发放
> 对弱刺激敏感（$b=0.25$ 的大值使亚阈值振荡更明显），但发放后有延迟——适合**时间积分和门控**任务。

#### CH（Chattering）— 颤发放
> 以 30–40 Hz 的高频爆发一串 spikes，每次爆发间隔约 10–25 ms。浅重置 $c=-50$ 让神经元在重置后几乎立即再次达到阈值。被认为是皮层 γ 振荡的重要贡献者。

#### IB（Intrinsically Bursting）— 固有爆发
> 先发一串紧密的 burst，然后转为单 spikes。机制：$c=-55$ 的浅重置允许初始 burst，但 $d=4$ 的恢复跳变逐渐累积 $u$，最终将动力学从爆发态切换到单发放态。

#### TC（Thalamo-Cortical）— 丘脑-皮层
> $d=0.05$ 几乎为零，意味着发放后恢复变量几乎不跳变。这模拟了丘脑神经元在睡眠纺锤波和觉醒状态间的特殊转换行为。

#### RZ（Resonator）— 共振器
> $a=0.1, b=0.25$ 使 $b > a$，产生明显的亚阈值振荡。这种神经元对与自身固有频率匹配的周期性输入特别敏感——像一个调谐了的"共振器"。

### 3.5 在 AI 中的应用

- **模式识别**：七种类型混合网络在语音识别、计算机视觉中展现互补优势 [35]
- **FPGA 硬件实现**：Izhikevich 模型因其两方程四参数的简洁性，是 FPGA/ASIC  neuromorphic 芯片的首选 [35]
- **华为 Ascend 架构**：已将 Izhikevich 神经元作为可配置 NPU 核的一部分 [35]
- **多感官概念学习**：Frontiers in Neuroscience 2026 工作中，七种 Izhikevich 类型被混合使用来学习跨模态概念表示 [51]

### 3.6 局限

- 模型本身是**现象学**的，参数没有直接的生物物理对应关系
- 不能模拟多离子通道交互、药物效应等需要通道级精度的场景

---

## 四、模型三：Hodgkin-Huxley — 生物物理黄金标准

### 4.1 历史地位

1952 年，Alan Hodgkin 和 Andrew Huxley 在枪乌贼巨轴突上做了电压钳实验，提出了描述动作电位的微分方程系统。这项工作于 1963 年获诺贝尔奖，是**计算神经科学的基石**。

### 4.2 核心方程

$$C \frac{dV}{dt} = -g_{Na} m^3 h (V - E_{Na}) - g_K n^4 (V - E_K) - g_L (V - E_L) + I_{ext}$$

三个门控变量的动力学：

$$\frac{dm}{dt} = \alpha_m(V)(1-m) - \beta_m(V)m$$
$$\frac{dh}{dt} = \alpha_h(V)(1-h) - \beta_h(V)h$$
$$\frac{dn}{dt} = \alpha_n(V)(1-n) - \beta_n(V)n$$

其中 $m$（Na⁺ 激活）、$h$（Na⁺ 失活）、$n$（K⁺ 激活）各自服从一级动力学，速率函数 $\alpha_x(V), \beta_x(V)$ 是电压依赖的指数函数。

### 4.3 动作电位的产生机制

| 阶段 | 主导电流 | 发生了什么 |
|---|---|---|
| **去极化上升支** | Na⁺ 内流（$m^3$ 快速打开） | 正反馈：$V↑ → m↑ → Na⁺ 内流↑ → V↑$ |
| **峰值** | Na⁺ 失活（$h$ 慢慢关闭） | 负反馈接管 |
| **复极化下降支** | K⁺ 外流（$n^4$ 慢慢打开） | K⁺ 外流将膜电位拉回负值 |
| **后超极化** | K⁺ 持续外流 | $n$ 尚未完全关闭，产生 undershoot |
| **不应期** | $h$ 和 $n$ 恢复 | 神经元暂时无法再次发放 |

### 4.4 在 AI 中的角色

HH 模型在 AI 中并非用于推理，而是作为**生物保真度的金标准**和**可学习动力学的基准**：

- **DeepONet / FNO 学习 HH 动力学**（2024）：用算子学习方法从电流输入直接预测 HH 膜电位轨迹，绕过 ODE 求解 [47]
- **Likelihood-free inference**：用神经网络 emulator 学习 HH 模型的参数后验分布 [42]
- **OpenWorm 项目**：用 HH 级神经元模拟完整线虫（C. elegans）的 302 个神经元 [50]

### 4.5 计算成本对比

| 模型 | 每毫秒 FLOPs（估计） | 相对成本 |
|---|---|---|
| IF | ~5 | 1× |
| LIF | ~10 | 2× |
| Izhikevich | ~20 | 4× |
| AdEx | ~25 | 5× |
| **HH** | **~1000** | **200×** |

> 一个 10⁴ 神经元的 HH 网络仿真 1 秒生物时间，在 CPU 上可能需要数小时。

### 4.6 局限

- 计算昂贵，不适合大规模网络
- 原始 HH 只描述 squid 轴突，扩展到其他神经元类型需要重新拟合所有速率函数
- 不能直接用标准反向传播训练（4 个非线性的 ODE + 阈值不连续）

---

## 五、模型四：AdEx — 自适应指数整合发放

### 5.1 设计哲学

AdEx（Adaptive Exponential Integrate-and-Fire）由 Brette 和 Gerstner（2005）提出，核心思路是：

> 用**一个指数项**捕获尖峰启动的非线性 + **一个线性适应电流**捕获频率适应 = 用最少变量复现最丰富的放电模式。

### 5.2 核心方程

$$C \frac{dV}{dt} = -g_L(V - E_L) + g_L \Delta_T \exp\left(\frac{V - V_T}{\Delta_T}\right) - w + I(t)$$
$$\tau_w \frac{dw}{dt} = a(V - E_L) - w$$

**发放规则**：当 $V$ 发散（实践中 $V > 0$ mV 或 $+30$ mV）时：
$$V \leftarrow V_r, \quad w \leftarrow w + b$$

参数含义：
| 参数 | 含义 | 典型值 |
|---|---|---|
| $C$ | 膜电容 | 281 pF |
| $g_L$ | 泄漏电导 | 30 nS |
| $E_L$ | 静息/反转电位 | -70.6 mV |
| $V_T$ | 阈值电位 | -50.4 mV |
| $\Delta_T$ | 斜率因子（控制尖峰启动的陡峭度） | 2–4 mV |
| $a$ | 亚阈值适应耦合 | 4 nS |
| $b$ | 发放触发的适应跳变 | 0.08 nA |
| $\tau_w$ | 适应时间常数 | 144 ms |

### 5.3 AdEx 能产生的六种放电模式

通过调节参数，单个 AdEx 方程可复现：

| 模式 | 特征 | 关键参数 |
|---|---|---|
| **紧张性发放**（Tonic Spiking） | 恒定频率的持续发放 | 适中 $a$, 小 $b$ |
| **适应性发放**（Adapting） | 频率逐渐降低 | 大 $a$, 大 $b$ |
| **初始爆发**（Initial Bursting） | 先一个 burst 再转入规则发放 | 适中 $a$, 大 $b$ |
| **爆发式发放**（Bursting） | 交替的活跃期和静默期 | 大 $a$, 大 $\tau_w$ |
| **瞬时发放**（Phasic Spiking） | 仅对阶跃电流产生 1–2 个 spikes | 大 $b$, 适中 $\tau_w$ |
| **延迟发放**（Delayed Spike） | 刺激后延迟一段时间才发放 | 大 $a$, 大 $\tau_w$, 适中 $b$ |

### 5.4 相平面分析

AdEx 的动力学可以在 $(V, w)$ 相平面上完全可视化：

- **$V$-nullcline**（$dV/dt = 0$）：一条 S 形曲线，因指数项而在阈值附近急剧上升
- **$w$-nullcline**（$dw/dt = 0$）：$w = a(V - E_L)$，一条直线
- **平衡点**：两条 nullcline 的交点
- **尖峰**：轨迹沿 $V$-nullcline 快速上升 → 触发放置 → 重置到左下角 → 缓慢恢复

相平面分析揭示了为什么 AdEx 能产生如此多样的放电模式——**nullcline 的几何关系**决定了轨迹是产生单个 spike、一串 burst 还是持续振荡。

### 5.5 在 AI/SNN 中的应用

- **小脑启发 SNN**（Frontiers in Neuroscience, 2022）：用 AdEx 精确拟合大鼠小脑颗粒细胞（GrC）和浦肯野细胞（PC）的放电记录，用于机器人轨迹预测 [32]
- **睡眠呼吸暂停检测**（2025）：AdEx 在 ECG 信号分类上优于 LIF，balacc 更高，但 LIF 延迟更低、能耗更小——经典的**精度-能效权衡** [27]
- **心律失常分类**：3 层全连接 SNN，AdEx 用 10 个隐藏神经元达到 **85.94%** 准确率，LIF 用 15 个神经元仅达 81.65% [38]
- **相平面分析工具**（2025.11）：最新研究系统分析了 AdEx 六种放电模式的相平面机制，为 neuromorphic 硬件的参数配置提供理论指导 [48]

### 5.6 AdEx vs Izhikevich：微妙的差异

| 维度 | AdEx | Izhikevich |
|---|---|---|
| 生物可解释性 | 高（指数项 = Na⁺ 通道激活的泰勒展开） | 低（纯现象学） |
| 参数数量 | 7–9 个 | 4 个 |
| 尖峰上升沿 | 指数式（生物真实） | 二次式（人为构造） |
| 硬件实现 | 需要指数函数单元 | 仅需乘法和加法 |
| 拟合真实神经元 | 更优（Brette & Gerstner 2005 验证） | 较好但略逊 |

---

## 六、模型五：FitzHugh-Nagumo — 相平面上的极简主义

### 6.1 历史渊源

1961 年，Richard FitzHugh 将 Hodgkin-Huxley 的四维系统**降维**为两个变量：用 $v$ 替代膜电位 $V$，用 $w$ 替代所有慢速恢复动力学的叠加。1962 年，Nagumo 等人用**隧道二极管电路**在硬件上实现了这个模型——这是世界上第一个电子神经元。

### 6.2 核心方程

$$\frac{dv}{dt} = v - \frac{v^3}{3} - w + I_{ext}$$
$$\frac{dw}{dt} = \varepsilon(v + a - bw)$$

常见参数：$\varepsilon = 0.08$, $a = 0.7$, $b = 0.8$。

### 6.3 降维的关键洞察

FitzHugh 的观察：
1. HH 中 $m$（Na⁺ 激活）极快 → 近似为 $m \approx m_\infty(V)$（准静态近似）
2. $h$（Na⁺ 失活）和 $n$（K⁺ 激活）高度相关 → $h \approx 0.89 - 1.1n$
3. 将两者合并为一个恢复变量 $w$ → 四维变二维

### 6.4 相平面几何

| 几何元素 | 含义 |
|---|---|
| **$v$-nullcline**（$dv/dt = 0$） | N 形三次曲线 $w = v - v^3/3 + I$ |
| **$w$-nullcline**（$dw/dt = 0$） | 直线 $w = (v+a)/b$ |
| **平衡点** | 两线交点，可稳定可不稳定 |
| **极限环** | 闭合轨迹 = 周期性尖峰发放 |

**六种可被 FHN 解释的生物学现象** [5]：

1. **无全或无阈值**：弱刺激 → 小幅亚阈值响应；强刺激 → 大幅超阈值响应。不存在绝对的阈值。
2. **兴奋传导阻滞**：过强电流反而阻止发放（trajectory 被推到 N 形曲线的上支稳态）。
3. **阳极断点兴奋**：负电流脉冲结束后，膜电位反弹并发放。
4. **尖峰适应**：重复刺激下频率逐渐降低。
5. **行波传播**：FHN 的扩散耦合版本可模拟动作电位沿轴突的传播。
6. **阈值的可塑性**：nullcline 的相对位置随 $I$ 变化，"阈值"是动态的。

### 6.5 硬件实现

FHN 因其简单的多项式形式，是**模拟电路实现**的理想选择：

- **FPGA 数字实现**（2025）：用 CORDIC 算法计算非线性项，无需乘法器，16 位定点数，面积和成本比前代方案优 4× 和 15× [30]
- **模拟 PSoC 实现**：Cypress 可编程片上系统，利用运放和乘法器直接积分微分方程 [30]
- **忆阻器突触耦合**：用忆阻器实现 FHN 神经元间的突触连接，研究同步和混沌 [30]

### 6.6 在 AI 中的角色

FHN 不直接用于深度学习推理，但它在以下场景有价值：
- ** neuromorphic 芯片的单元神经元**：简单、可解析、适合大规模耦合
- **图像处理和模式形成**：FHN 的扩散耦合网络可模拟视网膜-like 图像处理
- **混沌和同步研究**：FHN 网络是研究同步转变、混沌通信的理想试验台

---

## 七、模型六：Morris-Lecar — 两类兴奋性统一框架

### 7.1 生物背景

1981 年，Morris 和 Lecar 在研究**藤壶肌肉纤维**的电活动时提出了这个模型。与 HH 不同，Morris-Lecar 只包含两种离子电流：
- **Ca²⁺ 内流**（快速、不灭活）—— 对应 HH 的 Na⁺ 电流
- **K⁺ 外流**（慢速、不灭活）—— 对应 HH 的 K⁺ 电流

### 7.2 核心方程

$$C \frac{dV}{dt} = I_{ext} - g_L(V - V_L) - g_{Ca} m_\infty(V)(V - V_{Ca}) - g_K w(V - V_K)$$
$$\frac{dw}{dt} = \varphi \frac{w_\infty(V) - w}{\tau_w(V)}$$

其中：
$$m_\infty(V) = 0.5\left[1 + \tanh\left(\frac{V - V_1}{V_2}\right)\right]$$
$$w_\infty(V) = 0.5\left[1 + \tanh\left(\frac{V - V_3}{V_4}\right)\right]$$
$$\tau_w(V) = \frac{1}{\cosh\left(\frac{V - V_3}{2V_4}\right)}$$

标准参数：$V_L = -0.5$, $V_K = -0.7$, $V_{Ca} = 1.0$, $g_L = 0.5$, $g_K = 2$, $g_{Ca} = 1.33$, $V_1 = -0.01$, $V_2 = 0.15$, $V_3 = 0.1$, $V_4 = 0.145$, $\varphi = 1/3$。

### 7.3 两类兴奋性

Morris-Lecar 最被称道的特点是：**通过调节一个参数，可以在两类兴奋性之间切换**。

| 特性 | Class I | Class II |
|---|---|---|
| **分岔类型** | 鞍结分岔（SNIC） | 亚临界 Hopf 分岔 |
| **起始频率** | 趋近 0 Hz | 有限频率（如 20 Hz） |
| **编码方式** | 积分器（对输入总量编码） | 共振器（对频率敏感） |
| **对应生物神经元** | 皮层锥体神经元 | 某些中间神经元 |
| **关键参数** | $V_3$ 偏负 | $V_3$ 偏正 |

> **Tsumoto et al.（2006）** 在五维参数空间中系统分析了 Morris-Lecar 的分岔结构，发现**半激活电位参数 $V_3$** 是控制两类兴奋性切换的关键旋钮 [28]。

### 7.4 三类稳态行为

对固定的 $I_{ext}$，Morris-Lecar 可展现：
1. **静息态**：稳定平衡点，小扰动后回到原点
2. **周期性发放**：稳定极限环，产生规律性 spikes
3. **双稳态**：同时存在两个稳定态（如静息 + 极限环），初始条件决定最终归宿

### 7.5 扩展版：加入 Ca²⁺ 动力学

原始两变量模型加上第三个变量（细胞内 Ca²⁺ 浓度）和 Ca²⁺ 依赖的 K⁺ 电流后，可以模拟**多种簇发放行为**——这使其成为研究胰岛素分泌细胞（胰腺 β 细胞）节律的重要工具。

### 7.6 在 AI 中的角色

- **网络同步研究**：Morris-Lecar 的简单性使其成为研究耦合神经元同步的首选 [28]
- **生物物理可解释性**：比 FHN 更接近真实离子通道（Ca²⁺/K⁺ 有明确生物对应），比 HH 更轻量
- **类 I 兴奋性的重要性**：大多数哺乳动物皮层神经元是 Class I（积分器），Morris-Lecar 是模拟这类神经元大规模网络的最简选择

---

## 八、模型七：Hindmarsh-Rose — 三种簇发放模式

### 8.1 模型背景

Hindmarsh 和 Rose（1984）提出了这个三变量模型，专门用来描述**海兔（Aplysia）R15 神经元**的爆发现象。R15 神经元能产生一种被称为"square-wave bursting"的放电模式：发放期突然开始、突然结束，中间是一串几乎等间隔的 spikes。

### 8.2 核心方程

$$\frac{dx}{dt} = y - ax^3 + bx^2 - z + I$$
$$\frac{dy}{dt} = c - dx^2 - y$$
$$\frac{dz}{dt} = r[s(x - x_0) - z]$$

变量含义：
| 变量 | 对应生物量 | 时间尺度 |
|---|---|---|
| $x$ | 膜电位 | 快 |
| $y$ | Na⁺/K⁺ 电流的联合（快恢复） | 快 |
| $z$ | 慢 Ca²⁺ 依赖的 K⁺ 电流 | 慢 |

标准参数：$a=1, b=3, c=1, d=5, s=4, x_0=-1.6, r=0.01$。

### 8.3 三种簇发放模式

Hindmarsh-Rose 是**唯一一个能在单一框架内产生三种经典簇发放模式**的模型：

#### ① Square-Wave Bursting（方波簇）
> **特征**：发放突然开始、突然结束。频率在 burst 开始时瞬间达到有限值，结束前显著减慢。
> **分岔机制**：鞍结分岔（saddle-node）启动发放 → 同宿分岔（homoclinic）终止发放。
> **生物学对应**：胰腺 β 细胞、某些下丘脑神经元。
> **参数条件**：$z$ 的反馈适中，$r$ 较小。

#### ② Parabolic Bursting（抛物线簇）
> **特征**：频率-时间曲线呈抛物线形——从接近零频率逐渐加速到峰值，再对称减速回零。起止平滑。
> **分岔机制**：两次 SNIC（saddle-node on invariant circle）分岔，分别在 fast 子系统中启动和终止发放。
> **生物学对应**：Aplysia R15 神经元（原始实验对象）。
> **参数条件**：需要两个慢变量（原始 HR 需扩展为四维）[34]。

#### ③ Elliptic Bursting（椭圆簇）
> **特征**：脉冲振幅呈现平滑的增长和衰减，像纺锤形。起始和终止频率都是有限的。
> **分岔机制**：亚临界 Hopf 分岔 + 极限环的折叠分岔（fold of limit cycles），涉及滞后现象。
> **生物学对应**：各种感觉神经元。
> **参数条件**：$r$ 适中，使系统处于双稳态边界附近。

### 8.4 慢-快分解（Slow-Fast Dissection）

理解 HR 模型的核心方法是**慢-快分解**：

1. 将系统分为快子系统 $(x, y)$ 和慢变量 $z$
2. 对固定的 $z$，分析快子系统的分岔图（ bifurcation diagram）
3. 慢变量 $z$ 像一个"旋钮"，缓慢扫过快子系统的不同参数区域
4. 当 $z$ 扫过 Hopf 点或 saddle-node 点时，系统从静息跳到发放（或反之）

> **2025 年最新实验**：Lateral Habenula（外侧缰核）神经元中同时观察到了 square-wave、parabolic 和 triangular（混合型）三种簇发放模式，用扩展版 HR 模型完美复现 [34]。

### 8.5 在 AI 中的角色

- **簇发放编码研究**：生物神经元用 burst 编码比单 spike 携带更多信息，HR 是研究这种编码的理想模型
- **多时间尺度动力学**：HR 的快-慢结构启发了深度学习中的**多时间尺度 RNN** 设计
- **分岔控制**：HR 是测试神经反馈控制算法（如深部脑刺激参数优化）的标准测试平台
- **神经形态硬件**：HR 的三次方项可以用 FPGA 的 DSP 块高效实现

---

## 九、七模型横评对比

### 9.1 综合性能表

| 维度 | LIF | Izhikevich | Hodgkin-Huxley | AdEx | FitzHugh-Nagumo | Morris-Lecar | Hindmarsh-Rose |
|---|---|---|---|---|---|---|---|
| **变量数** | 1 | 2 | 4+ | 2 | 2 | 2–3 | 3 |
| **参数数** | 3–4 | 4 | 10+ | 7–9 | 3–4 | 8–10 | 7–8 |
| **生物保真度** | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ |
| **计算效率** | ★★★★★ | ★★★★☆ | ★☆☆☆☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ |
| **硬件友好度** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ |
| **可训练性（SG）** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★☆☆☆ |
| **簇发放能力** | ✗ | ✓ | ✓ | ✓ | 有限 | ✓ | ✓★★★ |
| **频率适应** | ✗ | ✓ | ✓ | ✓ | 有限 | 有限 | ✓ |
| **亚阈值振荡** | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **解析可处理性** | 高 | 高 | 低 | 高 | 高 | 高 | 中 |

### 9.2 精度基准（Frontiers in Computational Neuroscience 2023）

| 模型 | 分类准确率 | 错误率 |
|---|---|---|
| **AdEx** | **90.05%** | 0.10% |
| IF-SFA | 84.30% | 0.14% |
| LIF | 71.20% | 0.32% |
| NLIF | 66.55% | 0.35% |
| QIF | 70.70% | 0.27% |
| ThetaNeuron | 58.55% | 0.42% |
| **HH** | **49.55%** | **0.50%** |
| Izhikevich | 50.05% | 0.50% |
| SRM | 49.95% | 0.50% |

> ⚠️ 注意：HH 和 Izhikevich 在这个特定基准上精度低，不是因为它们"差"，而是因为该基准的任务特性和网络规模更适合 AdEx 的动态范围。模型选择永远是任务相关的。

### 9.3 能效基准（睡眠呼吸暂停检测，2025）

| 模型 | 准确率 | 推理延迟 | 能量代理 |
|---|---|---|---|
| **AdEx** | **最高** | 中 | 中 |
| **LIF** | 较低 | **最低** | **最低** |

> 结论：AdEx 适合精度优先的端侧诊断；LIF 适合延迟和能耗极端受限的场景 [27]。

---

## 十、按应用场景选型

| 场景 | 首选模型 | 备选 | 理由 |
|---|---|---|---|
| **大规模图像分类 SNN** | LIF | CuAdLIF | 硬件原生、可微、Loihi 优化 |
| **时序信号分类（ECG/EEG）** | AdEx | LIF | AdEx 适应性强，精度高 |
| **机器人轨迹预测** | AdEx | Izhikevich | 小脑电路需要多种神经元类型 |
| **多模态概念学习** | Izhikevich（混合 7 型） | LIF | 不同类型编码不同时间特征 |
| **FPGA  neuromorphic 芯片** | Izhikevich / FHN | LIF | 乘加即可，无指数运算 |
| **离子通道研究** | Hodgkin-Huxley | Morris-Lecar | 需要通道级精度 |
| **簇发放/同步研究** | Hindmarsh-Rose | Morris-Lecar | 三种簇模式 + 慢-快分解 |
| **Class I/II 兴奋性分析** | Morris-Lecar | AdEx | 单参数切换两类兴奋性 |
| **可解释 AI（神经科学验证）** | AdEx | Izhikevich | 相平面分析成熟 |
| **边缘设备超低功耗** | LIF（UltraLIF） | CuAdLIF | 亚毫瓦级 epilepsy 检测已实现 |
| **混沌通信/加密** | FHN | HR | 简单、可解析、耦合动力学丰富 |
| **理论/教学/相平面** | FHN | Morris-Lecar | 二维可视化，几何直觉强 |

---

## 十一、SNN 训练方法速览

### 11.1 三种主流学习规则

| 方法 | 原理 | 优点 | 缺点 |
|---|---|---|---|
| **Surrogate Gradient（代理梯度）** | 用光滑函数近似 Heaviside 的梯度 | 端到端训练、与 BP 兼容 | 前向-后向不匹配 |
| **STDP（脉冲时间依赖可塑性）** | 基于前后神经元 spike 时间差调整权重 | 生物学合理、本地学习规则 | 难以训练深度网络 |
| **Tempotron** | 训练神经元在指定时间窗口内至少发放一次 | 时序分类简单有效 | 仅适用于浅层网络 |

### 11.2 2025–2026 新进展

- **UltraLIF**（2026）：用 log-sum-exp 替代 surrogate，前向后向完全一致，理论上梯度有界且非零 [37]
- **可学习内部参数**（2025.08）：不仅学权重，还学每个神经元的 $\tau, V_{th}, V_{reset}$，LIF 精度 +13.5pp [31]
- **LZC 分类器**（2025）：用 Lempel-Ziv 复杂度量化 spike train 的复杂度，作为 SNN 输出层的分类特征，达到 99.5% 准确率 [31]
- **SpikeYOLO**（2025）：将 meta SNN 块嵌入 YOLO 目标检测，减少 spike 退化 [26]

---

## 十二、未来方向

### 12.1 自适应神经元参数
当前 SNN 中神经元的内部参数（时间常数、阈值、重置电位）通常是手动设定的全局常数。未来的方向是让**每个神经元自主学习和适应**其内部参数，类似生物发育过程中离子通道表达的个体差异。

### 12.2 异构神经元网络
大多数 SNN 使用单一类型的神经元（通常是 LIF）。生物学告诉我们，大脑皮层由数十种神经元类型组成。未来的架构可能像 Izhikevich 七类型混合网络一样，让**不同类型的神经元承担不同的计算角色**。

### 12.3 神经形态硬件-算法协同设计
FHN 在 FPGA 上的成功表明，**为特定神经元模型定制硬件**可以带来数量级的能效提升。未来的趋势是：算法设计者提出新模型 → 硬件团队用模拟/数字混合电路实现 → 形成闭环。

### 12.4 从离散到连续时间的统一
目前 SNN 仿真用离散时间步（Δt = 0.1–1 ms），但生物神经元在连续时间中运行。UltraLIF 的超离散化方法暗示了一个方向：**用 max-plus 代数统一离散和连续时间 SNN 的理论框架**。

### 12.5 可解释性与验证
随着 SNN 在医疗（癫痫检测、心律失常分类）中的部署，**模型的可解释性**变得至关重要。AdEx 和 Izhikevich 的相平面分析为 SNN 决策提供了直观的几何解释——这是 ANN 难以做到的。

---

## FAQ

**Q1：为什么不直接用 Hodgkin-Huxley？它最准确啊。**
A：HH 的精度是有代价的。一个 10⁴ 神经元的 HH 网络仿真 1 秒生物时间可能需要数小时 CPU 时间。而且 HH 的梯度通过 4 个不连续门控变量反向传播极其困难。大多数 AI 应用不需要离子通道级精度——就像你不需要量子力学来设计桥梁一样。

**Q2：LIF 这么简单，为什么还在 2026 年用它？**
A：因为简单就是力量。LIF 是 Intel Loihi、BrainScaleS、SpiNNaker 等所有主流 neuromorphic 芯片的**原生指令**。UltraLIF 让 LIF 在单步推理上也能达到竞争性精度。在边缘设备上，LIF 的亚毫瓦级功耗是无可替代的。

**Q3：Izhikevich 和 AdEx 看起来很像，该选哪个？**
A：看你的约束。需要**硬件效率**（FPGA/ASIC）→ Izhikevich（只有乘加）。需要**拟合真实神经元数据**或**相平面可解释性** → AdEx（指数项有生物含义）。两者精度相当，差异在工程和生物学细节上。

**Q4：FHN、Morris-Lecar、Hindmarsh-Rose 这三种该用谁？**
A：做**教学或理论分析** → FHN（最简单，几何直觉最强）。研究**兴奋性类型切换或 Ca²⁺ 动力学** → Morris-Lecar。研究**簇发放模式或慢-快时间尺度交互** → Hindmarsh-Rose。三者本质上是同一家族的不同成员。

**Q5：这些模型能用在普通的深度学习框架（PyTorch/TensorFlow）里吗？**
A：可以。LIF、AdEx、Izhikevich 都有 PyTorch 实现（如 snntorch、BindsNET、Spyx）。关键是用 surrogate gradient 让 spike 生成可微。HH 也可以在 PyTorch 中用 torchdiffeq 求解，但速度较慢。

---

## 参考文献

[1] Hodgkin, A. L., & Huxley, A. F. (1952). A quantitative description of membrane current and its application to conduction and excitation in nerve. *The Journal of Physiology*, 117(4), 500–544.

[2] FitzHugh, R. (1961). Impulses and physiological states in theoretical models of nerve membrane. *Biophysical Journal*, 1(6), 445–466.

[3] Nagumo, J., Arimoto, S., & Yoshizawa, S. (1962). An active pulse transmission line simulating nerve axon. *Proceedings of the IRE*, 50(10), 2061–2070.

[4] Morris, C., & Lecar, H. (1981). Voltage oscillations in the barnacle giant muscle fiber. *Biophysical Journal*, 35(1), 193–213.

[5] Hindmarsh, J. L., & Rose, R. M. (1984). A model of neuronal bursting using three coupled first order differential equations. *Proceedings of the Royal Society of London B*, 221(1222), 87–102.

[6] Izhikevich, E. M. (2003). Simple model of spiking neurons. *IEEE Transactions on Neural Networks*, 14(6), 1569–1572.

[7] Izhikevich, E. M. (2004). Which model to use for cortical spiking neurons? *IEEE Transactions on Neural Networks*, 15(5), 1063–1070.

[8] Izhikevich, E. M., & FitzHugh, R. (2006). FitzHugh-Nagumo model. *Scholarpedia*, 1(9), 1349.

[9] Brette, R., & Gerstner, W. (2005). Adaptive exponential integrate-and-fire model as an effective description of neuronal activity. *Journal of Neurophysiology*, 94(5), 3637–3642.

[10] Gerstner, W., & Brette, R. (2009). Adaptive exponential integrate-and-fire model. *Scholarpedia*, 4(6), 8427.

[11] Rinzel, J., & Ermentrout, B. (1989). Analysis of neural excitability and oscillations. In *Methods in Neural Modeling* (pp. 135–169). MIT Press.

[12] Rinzel, J. (1987). A formal classification of bursting mechanisms in excitable systems. In *Proceedings of the International Congress of Mathematicians* (pp. 1578–1593).

[13] Tsumoto, K., Kitajima, H., Yoshinaga, T., Aihara, K., & Kawakami, H. (2006). Bifurcations in Morris–Lecar neuron model. *Neurocomputing*, 69(4–6), 293–316.

[14] Izhikevich, E. M. (2007). *Dynamical Systems in Neuroscience: The Geometry of Excitability and Bursting*. MIT Press.

[15] Rössert, C., et al. (2015). Galileo: a fast and adaptive spiking neural network model for cerebellar function. *Frontiers in Computational Neuroscience*, 9, 1–19.

[16] Naud, R., Marcille, N., Clopath, C., & Gerstner, W. (2008). Firing patterns in the adaptive exponential integrate-and-fire model. *Biological Cybernetics*, 99(4–5), 335–347.

[17] Davies, M., et al. (2018). Loihi: A neuromorphic manycore processor with on-chip learning. *IEEE Micro*, 38(1), 82–99.

[18] Roy, K., Jaiswal, A., & Panda, P. (2019). Towards spike-based machine intelligence with neuromorphic computing. *Nature*, 575(7784), 607–617.

[19] Neftci, E. O., Mostafa, H., & Zenke, F. (2019). Surrogate gradient learning in spiking neural networks. *IEEE Signal Processing Magazine*, 36(6), 61–63.

[20] Zenke, F., & Vogels, T. P. (2021). The remarkable robustness of surrogate gradient learning for training spiking neural networks. *Neuron*, 109(18), 2861–2862.

[21] Dan, et al. (2025). Residual-based SNN with dynamic threshold for MNIST classification. *Neural Networks*, 2025.

[22] Luo, S., et al. (2025). SpikeYOLO: Spiking neural networks for real-time object detection. *IEEE Transactions on Neural Networks and Learning Systems*, 2025.

[23] Zhao, et al. (2025). High-performance neuromorphic processing unit for SNN. *Computers in Biology and Medicine*, 2025.

[24] Liu, S., & Dragotti, P. L. (2025). Enhanced accuracy in first-spike coding using current-based adaptive LIF neuron. *Neural Networks*, 184, 107043.

[25] Patankar, et al. (2025). Tempotron and STDP for medical data classification with LIF-based SNN. *Neuroinformatics*, 2025.

[26] Rudnicka, Z., Szczepanski, J., & Pregowska, A. (2025). Learning internal biological neuron parameters for improved SNN performance. *arXiv:2508.11674*.

[27] (2025). Automatic detection of sleep apnea from single-lead ECG using SNN: LIF vs AdEx comparison. *Biomedical Signal Processing and Control*, 2025.

[28] Vijayan, S., et al. (2017). Cerebellum-inspired spiking neural network for pattern classification. *Frontiers in Neuroscience*, 11, 152.

[29] (2025). AdEx-based SNN for ECG arrhythmia classification. *IEEE EMBS*, 2025.

[30] Kobayashi, F. (2025). Space-and-cost-efficient FHN neuron model implementation using analog FPGA. *IEEE Transactions on Circuits and Systems*, 2025.

[31] (2025). Digital circuit implementation of FitzHugh-Nagumo model with CORDIC. *PMC*, 2025.

[32] (2025). Phase plane analysis of firing patterns in the AdEx model. *arXiv:2511.20670*.

[33] (2025). Multiple bursting patterns in Lateral Habenula neurons: experiments and computational model. *bioRxiv:2025.01.23.634464*.

[34] Minoza, J. M. A. (2026). UltraLIF: Fully differentiable spiking neural networks via ultradiscretization and max-plus algebra. *arXiv:2602.11206*.

[35] Sanaullah, et al. (2023). Exploring spiking neural networks: a comprehensive analysis of mathematical models and applications. *Frontiers in Computational Neuroscience*, 17, 1215824.

[36] (2026). Benchmarking brain-inspired computing: a roadmap for algorithm evaluation in biomedical research. *Neuroscitek*, 2026.

[37] Lueckmann, J. M., et al. (2019). Likelihood-free inference with emulator networks. *Proceedings of Machine Learning Research*, 96, 1–10.

[38] (2024). Learning the Hodgkin-Huxley model with operator learning techniques. *arXiv:2406.02173*.

[39] (2025). Multisensory concept learning framework based on spiking neural networks. *Frontiers in Neuroscience*, 2025.

[40] Gerstner, W., & Kistler, W. M. (2002). *Spiking Neuron Models: Single Neurons, Populations, Plasticity*. Cambridge University Press.

[41] Gygax, J., & Zenke, F. (2025). Understanding surrogate gradient learning in spiking neural networks. *Nature Machine Intelligence*, 2025.

[42] Kingma, D. P., & Ba, J. (2014). Adam: a method for stochastic optimization. *arXiv:1412.6980*.

[43] (2026). A quarter of a century of neuromorphic architectures on FPGAs. *ACM Computing Surveys*, 58(3), 1–38.

[44] (2025). Hardware implementation of Izhikevich neuron models. *Patsnap Technology Report*.

[45] (2025). Spike-based neuromorphic computing: from neurons to systems. *CWI Repository*.

---

*最后更新：2026-08-17*
*字数：约 12,000 字*
*模型覆盖：LIF · Izhikevich(7型) · Hodgkin-Huxley · AdEx(6模式) · FitzHugh-Nagumo · Morris-Lecar(Class I/II) · Hindmarsh-Rose(3种簇)*
