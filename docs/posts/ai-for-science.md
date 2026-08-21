---
title: "AI for Science：当人工智能成为科学家的'第三只眼'"
subtitle: "从第五范式到自主发现——2025–2026年度技术全景"
reading_time: "约22分钟"
last_updated: "2026-08"
tags: ["AI for Science", "第五范式", "基础模型", "AlphaFold", "神经算子", "自动定理证明", "AI Scientist", "科学发现"]
---

> **TL;DR** —— 科学研究正在经历从"人用工具"到"人机共生"再到"自主智能体"的三级跳。2024年诺贝尔化学奖颁给AlphaFold的创造者，2025年AI agents在IMO拿下金牌，Sakana的AI Scientist在Nature发文——这些不是demo，而是信号。本文梳理AI for Science在**生命科学、材料科学、物理学、数学、地球科学、天文学**六大领域的核心方法、代表性系统和可验证成果，并讨论它面临的**幻觉引文、复现危机、可观测性**三大暗礁。

---

## 目录

1. [先说结论](#1-先说结论)
2. [什么是AI for Science：第五范式的来临](#2-什么是ai-for-science第五范式的来临)
3. [方法谱系：从专用模型到基础模型](#3-方法谱系从专用模型到基础模型)
4. [生命科学：从结构预测到药物设计](#4-生命科学从结构预测到药物设计)
5. [材料科学：生成式AI重塑发现流程](#5-材料科学生成式ai重塑发现流程)
6. [物理学：神经算子与AI加速仿真](#6-物理学神经算子与ai加速仿真)
7. [数学：自动定理证明的黄金时代](#7-数学自动定理证明的黄金时代)
8. [地球与气候科学：AI天气模型上岗](#8-地球与气候科学ai天气模型上岗)
9. [天文学：百亿星系的自动化分类](#9-天文学百亿星系的自动化分类)
10. [AI Scientist：全自动科研智能体](#10-ai-scientist全自动科研智能体)
11. [医学AI：从辅助诊断到循证推理](#11-医学ai从辅助诊断到循证推理)
12. [暗礁：幻觉、复现危机与信任赤字](#12-暗礁幻觉复现危机与信任赤字)
13. [未来方向：可信AI科学的方法论](#13-未来方向可信ai科学的方法论)
14. [十项横评表](#14-十项横评表)
15. [按场景选型表](#15-按场景选型表)
16. [FAQ](#16-faq)
17. [参考文献](#17-参考文献)

---

## 1. 先说结论

- **AI for Science不是"AI辅助科研"的升级版，而是科学方法论的范式跃迁。** 2024年诺贝尔化学奖颁给AlphaFold的Hassabis、Jumper和Baker，标志着AI从"工具"被正式承认为"发现者"[citation:30]。
- **2025年是拐点之年。** 这一年，AI完成了从"加速单步流程"到"替代整条工作流"的跨越——端到端天气预报、全自动分子动力学、自主定理证明、AI生成论文通过同行评审，全部成为现实[citation:30]。
- **基础模型（Foundation Model）是核心引擎。** 但科学领域的基础模型与通用LLM有本质区别：token是氨基酸/原子/网格点而非文字，对称性被硬编码进架构，目标函数不是next-token prediction而是扩散去噪或物理残差[citation:38]。
- **最大的风险不是技术不够强，而是信任跑赢了验证。** 2025年起数万篇论文可能混入AI生成的"幻觉引文"；2026年ICML复现审查显示仅37%的论文能复现超四成结论[citation:58][citation:63]。
- **未来属于"人机协同"而非"AI替代"。** 张钹院士在清华"创新清华"对话中强调：从LLM迈向AGI，需要逐步提升性价比、发展多模态能力，最终实现与物理世界交互的具身智能[citation:53]。

---

## 2. 什么是AI for Science：第五范式的来临

### 2.1 科研范式的四步演进

| 范式 | 名称 | 核心特征 | 代表 |
|---|---|---|---|
| 第一范式 | 经验科学 | 观察自然、归纳记录 | 伽利略实验 |
| 第二范式 | 理论科学 | 数学建模、方程推导 | 牛顿力学、麦克斯韦方程 |
| 第三范式 | 计算科学 | 数值模拟、超级计算机 | 气候模型、有限元分析 |
| 第四范式 | 数据密集型科学 | 大数据驱动、统计发现 | 基因组学、LHC数据分析 |
| **第五范式** | **AI驱动科学** | **通用模型+自主智能体+人机协同** | **AlphaFold、AI Scientist** |

日本文部科学省2025年10月的政策文件将"AI for Science"明确定义为"将AI技术应用于科学研究的所有阶段"，并将其定位为第五科研范式[citation:26]。清华大学2025年4月的"创新清华"对话进一步指出，第五范式的核心是"主体转变：从人类主导到人机协同，形成'人类直觉+机器智能'的双引擎驱动"[citation:57][citation:65]。

### 2.2 两条互补的主线

整个AI for Science领域可以拆成两条交织的主线：

- **AI → Science（AI赋能科学）**：用AI技术解决各学科的具体问题——预测蛋白质结构、模拟流体、发现新材料、证明定理。
- **Science → AI（科学反哺AI）**：科学研究中产生的数据、理论和约束，反过来推动AI方法本身的进步——物理信息神经网络、神经算子、符号-神经混合推理。

欧盟2025年10月发布的《科学中AI战略》将这两条线整合为"RAISE（欧洲研究与AI科学）"虚拟研究所构想[citation:26]。

---

## 3. 方法谱系：从专用模型到基础模型

### 3.1 四种技术路线

| 路线 | 核心思想 | 代表系统 | 适用场景 |
|---|---|---|---|
| **专用AI模型** | 针对单一任务设计网络架构 | AlphaFold3、MatterGen | 蛋白质结构、材料生成 |
| **领域基础模型** | 大规模预训练+微调，跨任务迁移 | ESM-2、MACE、Aurora | 多任务生物/物理/气候 |
| **通用LLM+工具** | 大模型调用专业工具链 | MDCrow、ADAM、AI Scientist | 跨领域科研工作流 |
| **自主智能体** | 多agent协作，端到端自动科研 | AI Scientist-v2、AlphaEvolve | 全自动发现循环 |

### 3.2 科学基础模型的四大结构性差异

虽然底层都用了Transformer/扩散/GNN，但科学基础模型与通用LLM有本质不同[citation:38]：

1. **Token不是文本** —— 氨基酸残基、原子类型、晶格参数、物理场网格点。
2. **对称性硬编码** —— SE(3)/E(3)-等变网络将旋转平移不变性嵌入架构，通用LLM必须从数据中学习。
3. **目标函数不是next-token** —— 掩码建模（ESM）、扩散去噪（AlphaFold3、MatterGen）、物理残差损失（PINNs可零标注训练）。
4. **规模小1–2个量级** —— 蛋白质/材料基础模型是百万到十亿参数级，而非前沿LLM的万亿级，用归纳偏置换取数据效率。

### 3.3 关键抉择三问

学者选择技术路线时，本质是在回答三个问题[citation:38]：

- **有没有足够的自监督数据来预训练基础模型？**（蛋白质序列有，偏微分方程没有）
- **问题是否受硬物理约束？**（受约束→专用模型+物理先验；否则可考虑通用模型）
- **有没有低成本的验证回路？**（DFT计算、实验验证——能验证才能信任大规模生成）

---

## 4. 生命科学：从结构预测到药物设计

### 4.1 AlphaFold3：统一的全原子生物分子预测

2024年底发布的AlphaFold3是整个领域的标志性事件。它用扩散模型替代了AlphaFold2的SE(3)-等变结构模块，将Pairformer替代Evoformer，直接在原始原子坐标上进行去噪[citation:40]。其核心突破：

- **统一建模蛋白质-蛋白质、蛋白质-核酸、蛋白质-小分子、离子、翻译后修饰**的相互作用[citation:32]。
- 在蛋白质-配体和蛋白质-核酸相互作用上，相比前代方法**精度提升≥50%**[citation:32]。
- 计算复杂度**降低38%**，减少了对MSA（多序列比对）的依赖[citation:40]。

**但AlphaFold3并非完美。** 2025年的多项独立验证揭示了它的局限：

- 对**长链RNA**的结构预测随序列长度增加而显著恶化[citation:28]。
- 在蛋白质-配体相互作用中，有时将小分子放到正确位置是**依赖远处区域模式而非真实分子相互作用**——Masters等人发现，即使突变掉结合位点残基，AF3仍把ATP和heme放到"该在的地方"[citation:28]。
- 对**非Watson-Crick相互作用**的预测不够稳定[citation:28]。

> **启示**：即使是SOTA模型，也需要在关键应用中配合实验验证——AI预测是起点，不是终点。

### 4.2 BioEmu-1：模拟蛋白质构象空间

微软研究院2025年在*Science*发表的BioEmu-1，用扩散模型结合AlphaFold的Evoformer编码器和二阶积分采样，从蛋白质构象分布中高效采样[citation:29]。它能在单张GPU上每小时生成上千个独立蛋白质结构，训练数据包括AlphaFold数据库静态结构、超过200ms的分子动力学模拟数据和50万条蛋白质稳定性实验数据。

### 4.3 药物设计：从"不可成药"到"AI可设计"

AI正在打破药物发现的多个天花板：

| 系统/公司 | 突破 | 来源 |
|---|---|---|
| Insilico Medicine INS018_055 | 靶点和分子均由AI发现设计，进入临床试验 | [citation:33] |
| 斯坦福虚拟实验室 | AI首席科学家领导专家agent团队，数天设计新冠纳米抗体 | [citation:37] |
| ED2Mol（上海交大） | 从全局化学空间"从无到有"生成先导分子 | [citation:37] |
| BindCraft（EPFL/MIT） | 功能性蛋白质结合剂"一次性设计"，平均成功率46.3% | [citation:37] |
| Absci | 生成式AI从头设计抗体 | [citation:33] |

行业数据显示：AI驱动的药物研发可将临床前候选阶段时间**缩短40%**，成本**降低30%**；采用AI优先策略的公司Phase I临床试验成功率高达**80-90%**（传统为40-65%）[citation:33]。

### 4.4 SciReasoner：让AI"读懂"结构

上海人工智能实验室2025年发布的SciReasoner，首次实现大模型对分子、蛋白质和晶体三维结构的**原生推理**，构建起可审查、可溯源的科学推理链路[citation:27]。在覆盖蛋白、核酸、小分子和无机晶体的86项测试中，67项达到SOTA。

---

## 5. 材料科学：生成式AI重塑发现流程

### 5.1 MatterGen：从"筛选"到"生成"

微软研究院的MatterGen是基于扩散模型的晶体材料生成模型，发表于*Nature*[citation:29]。它的范式转变极其深刻：

> 传统方式：在数百万已知材料中筛选 → 像翻旧照片找灵感
> MatterGen方式：直接按目标性质生成新材料 → 像用文字描述让AI画新图

具体数据：生成材料的**稳定性是此前AI生成结构的2.9倍**，距离最优能量配置的偏差缩小**17.5倍**[citation:33]。

### 5.2 GNoME：18个月完成人类8000年的工作

DeepMind的Graph Networks for Materials Exploration（GNoME）用图神经网络势函数，从DFT计算的220万晶体出发，预测了380万稳定结构，其中**发现8种潜在超导体和52种低热膨胀材料**[citation:2]。时间对比：18个月 vs 人类8000年。

### 5.3 TXL Fusion：门控融合突破拓扑材料发现

2026年安徽大学团队提出的TXL Fusion框架，将大语言模型与物理、化学描述符深度融合[citation:39]。三类信息——材料组成的化学信息、对称性和电子结构等物理描述符、LLM对材料文本信息的表征——通过**可学习的门控机制**自适应融合。相比单一信息源模型，对拓扑绝缘体的识别提升尤为明显。

### 5.4 机器学习力场：打破精度-效率的死锁

AI驱动的分子动力学正在经历"第二春"[citation:14]：

- **DeepMD-kit**：通过图神经网络高精度拟合原子间相互作用势。
- **GPUMD**：我国自主研发，全球领先的AI+MD平台，依托GPU异构架构实现第一性原理精度。
- **2025年湖南大学王锋团队**：在国产ARMv8超算上实现**5亿原子规模**的深度学习分子动力学模拟[citation:14]。
- **TrajCast（2026, Nature Machine Intelligence）**：自回归等变网络直接更新原子位置和速度，**跳过力计算步骤**，预测间隔比传统MD时间步大30倍，每天可生成15ns轨迹[citation:10]。
- **MDtrajNet**：等变网络+Transformer架构，跨化学空间直接生成MD轨迹，比同级别ML势函数训练的方案更准确，加速达两个数量级[citation:18]。

---

## 6. 物理学：神经算子与AI加速仿真

### 6.1 神经算子家族：从FNO到PDE-FM

物理仿真是AI for Science中技术最密集的方向之一。核心思路是用神经网络学习**算子（Operator）**——从输入条件到输出物理场的映射，而非单次求解。

| 模型 | 团队 | 核心创新 | 年份 |
|---|---|---|---|
| FNO | Anandkumar组 | 傅里叶域卷积，首个通用神经算子 | 2020 |
| DeepONet | Brown Univ | 分支-主干网络，理论保证 | 2020 |
| POSEIDON | ETH Zurich | 多尺度算子Transformer，大规模预训练 | 2024 |
| Aurora | 微软 | 3D Swin Transformer，大气基础模型 | 2024 |
| PDEformer-2 | 北京大学 | 公式编码：PDE→计算图 | 2025 |
| PI-MFM | Yale (Lu Lu) | 物理信息多模态，符号PDE残差损失 | 2025 |
| Flow Marching | MIT | 流匹配+算子，支持不确定性建模 | 2025 |
| PDE-FM | IBM/UA | Mamba状态空间 backbone，跨物理迁移 | 2025 |
| OmniArch | 北航 | 统一多物理架构+跨维度联合预训练 | 2025 |

PDE-FM在The Well基准的12个2D/3D数据集（流体动力学、辐射传输、弹性力学、天体物理）上评估，**在6个领域达到SOTA，平均VRMSE相对降低46%**[citation:13]。

### 6.2 物理信息神经网络（PINNs）

PINNs的核心是将PDE残差作为无标注损失项，使模型在**零标注数据**下也能训练。但2025-2026年的研究也指出其局限：残差惩罚是软约束而非硬保证，在配点覆盖区域外仍可能违反守恒定律[citation:5]。

### 6.3 混合求解器：FEM + DeepONet

2025年香港理工大学团队提出**时间推进神经算子-FE耦合框架**[citation:9]：
- 用Schwarz交替法耦合FEM子域和DeepONet子域
- 将Newmark-Beta时间推进方案嵌入DeepONet架构
- 自适应子域演化策略使ML解析区域动态扩展
- 在线性弹性、超弹性和弹性动力学问题上，**收敛速度提升20%，误差始终低于3%**

### 6.4 多相流：界面感知的神经算子

2026年AAAI发表的IANO（Interface-Aware Neural Operator）针对多相流模拟中**相界面处的谱偏差**和**高分辨率数据稀缺**两大难题[citation:17]，利用易获取的界面拓扑和位置信息作为辅助输入，精度比现有神经算子基线**提升约10%**，在低数据和高噪声条件下泛化能力突出。

---

## 7. 数学：自动定理证明的黄金时代

### 7.1 从Silver到Gold：AI攻克竞赛数学

| 系统 | 团队 | 成就 | 年份 |
|---|---|---|---|
| AlphaProof | DeepMind | IMO 2024银牌（28/42分），用RL训练80M形式化问题 | 2024[citation:3] |
| AlphaGeometry 2 | DeepMind | 配合AlphaProof达银牌水平 | 2024 |
| Gauss AI | Math Inc. | 3周形式化强素数定理（人类18个月未完成） | 2025[citation:3] |
| Seed-Prover | 字节跳动 | IMO 2025金牌水平 | 2025[citation:3] |
| Aristotle | Harmonic | IMO 2025金牌 + 独立形式化多个Erdős问题 | 2025[citation:15] |
| DeepSeek-Prover-V2 | 深度求索 | MiniF2F 88.9% pass@1，开源 | 2025[citation:11] |
| Goedel-Prover-V2 | Princeton | MiniF2F 90.4% pass@32（开源SOTA） | 2025[citation:15] |
| Numina-Lean-Agent | 中科院数学院 | 形式化证明2025 Putnam全部12题，ICML 2026接收 | 2026[citation:7] |

### 7.2 关键方法：神经-符号混合

自动定理证明的成功几乎全部依赖**神经-符号混合架构**[citation:52]：

```
神经网络（快速直觉）         符号引擎（严格验证）
    │                              │
    ▼                              ▼
提出构造/策略 ──→ Lean/Isabelle验证 ──→ 通过？──→ 已验证证明
                                        │
                                        否
                                        ▼
                                  重试/修正策略
```

DeepMind的AlphaProof将预训练语言模型与AlphaZero风格的强化学习结合，用"产品节点"处理证明子目标，并对最难的问题采用**Test-Time RL**——在推理时生成和学习数百万个相关变体[citation:3]。

### 7.3 AI解决Erdős猜想

2025-2026年，AI在多个长期未解的Erdős问题上取得突破[citation:11][citation:15]：
- **Erdős #728**：2026年1月6日由Barreto和ChatGPT-5.2解决，Lean验证通过——陶哲轩称之为"里程碑"。
- **Erdős #729和#205**：2026年1月8-11日由Barreto和Leeham用ChatGPT+Aristotle解决。

### 7.4 中国力量

中科院数学院刘俊杞、何伟昆、支丽红等提出的**Numina-Lean-Agent**，在形式化定理证明和自动形式化方面达到世界SOTA，成功形式化证明2025年Putnam数学竞赛全部12道试题，与AxiomMath闭源系统AxiomProver持平，优于Aristotle和Seed-Prover 1.5[citation:7]。该工作已被**ICML 2026接收**。

---

## 8. 地球与气候科学：AI天气模型上岗

### 8.1 2025：AI天气模型进入业务化运行

| 模型 | 团队 | 亮点 |
|---|---|---|
| Aurora | 微软 | 100万+小时地球物理数据训练，5天气旋路径预测准确率100%，10天预报准确率92%，超越7个专业预报中心[citation:16] |
| Aardvark Weather | 英国 | 首次端到端替代传统数值预报全流程[citation:30] |
| FourCastNet 3 | NVIDIA | 60天全球预报<4分钟，比前代快8-60倍[citation:30] |
| DLESyM | 华盛顿大学+图宾根大学 | 深度学习大气+海洋耦合，单GPU数小时完成传统百万CPU小时的模拟[citation:4] |
| ORBIT-2 | 橡树岭国家实验室+AMD | 0.9km超分辨率降尺度，Gordon Bell Prize 2025决赛入围[citation:12] |

DLESyM在单块GPU上**仅需数小时**即可完成传统模式需百万CPU小时才能实现的1000年气候模拟，速度提升三个量级，且模拟的全球平均升温趋势、厄尔尼诺/拉尼娜现象均与真实观测高度一致[citation:4]。

### 8.2 中国的AI气象大模型

国内盘古、风乌、伏羲等AI气象大模型已在台风预测、短期气候预报中展现能力[citation:8]。复旦大学穆穆院士团队利用大模型通过海表温度和风场数据找到ENSO敏感区，对厄尔尼诺现象的预测时长**突破18个月**，远超传统动力模型[citation:8]。

### 8.3 物理信息+AI：仍在磨合

值得注意的是，深度学习大气模型虽然短期预报准确，但在**长时间模拟中容易出现过度平滑、物理不真实或不稳定**等问题[citation:4]。DLESyM通过**异步耦合**深度学习大气和海洋模块来缓解这个问题，但仍处于早期阶段。

---

## 9. 天文学：百亿星系的自动化分类

### 9.1 Euclid任务：AI是必需品

欧空局Euclid卫星预计6年成像超过**15亿个星系**，每天传回约100GB数据[citation:67]。如此规模使AI从"可选项"变为"必需品"。

- **Zoobot算法**：结合9976名公民科学志愿者标记+Euclid数据训练，已发布首批**38万+星系**的形态分类目录（仅为总目标的0.4%）[citation:67]。
- **强引力透镜搜索**：AI初筛+公民科学检查+专家建模，首批发布**500个**星系-星系强透镜候选体，几乎全部为新发现[citation:67]。

### 9.2 LSST：每晚20TB的天文数据洪流

Vera C. Rubin天文台的LSST项目从2025年开始，每几天扫描一次整个南天，10年拍摄**200亿个星系**，每晚产生约**20TB数据**——相当于每天下载两次美国国会图书馆[citation:71]。

DESC（暗能量科学合作组织）白皮书指出，AI/ML已嵌入所有主要宇宙学探针流程：光度红移估计、瞬变源分类、弱引力透镜形状测量[citation:71]。但核心挑战是**可信的不确定性量化**和**协变量偏移（covariate shift）**——模拟永远无法完美匹配真实数据，仪器老化也会引入分布漂移。

### 9.3 SPHEREx模拟加速900倍

NASA的SPHEREx任务从2025年5月开始进行全天空红外光谱巡天，2年将绘制约**4.5亿个星系**的位置和红移。亚利桑那大学团队构建的神经网络emulator将功率谱建模计算**加速900倍**，且参数轮廓层面与解析模型高度一致[citation:75]。

---

## 10. AI Scientist：全自动科研智能体

### 10.1 从v1到Nature：一场范式革命

Sakana AI的AI Scientist项目是2024-2026年最具标志性的进展之一[citation:68][citation:72]：

| 版本 | 里程碑 | 时间 |
|---|---|---|
| AI Scientist-v1 | 首次展示LLM agent端到端完成ML研究（写代码→跑实验→写论文） | 2024.08 |
| AI Scientist-v2 | 生成论文通过ICLR 2025 workshop盲审（平均分6.33，超55%人类论文） | 2025.04 |
| **Nature论文** | "The AI Scientist: Towards Fully Automated AI Research"正式发表 | **2026.03** |

Nature论文的核心贡献[citation:72][citation:76]：
1. **系统架构全公开**：idea生成→文献调查→agentic tree search实验设计→并行执行→LaTeX论文撰写→自动图表检查。
2. **自动审稿系统**：遵循NeurIPS官方指南，多审稿人结果整合为"Area Chair"角色，平衡准确率达69%，F1超过人类审稿人之间的一致性。
3. **科学Scaling Law**：用自动审稿系统评估不同基础模型生成的论文——**基础模型越强，生成论文质量越高**，呈清晰的幂律关系。

### 10.2 递归自我改进（RSI）：下一个前沿

Sakana AI在2026年正式成立**RSI Lab（递归自我改进实验室）**[citation:68]：
- **LLM²（2024）**：LLM发明更好的LLM训练方法，产出DiscoPOP偏好优化算法。
- **Darwin Gödel Machine（2025）**：开放-ended持续自我改进，SWE-bench软件工程性能提升超30个百分点。
- **ShinkaEvolve（2025）**：仅用150个样本解决复杂优化问题，发现改进MoE模型的负载均衡损失函数。
- **Digital Red Queen（2026）**：与MIT合作，在Core War图灵完备沙盒中实现开放-ended对抗共同进化。

### 10.3 但AI Scientist还远非完美

Sakana团队在Nature论文中坦诚列出了当前局限[citation:72]：
- 可能提出**缺乏原创性或不够深入**的想法
- 在**复杂代码的严格实现**上会遇到困难
- 出现**不准确引用和图表重复**等幻觉
- 但历史告诉我们：一旦新能力萌芽，初期的限制往往会被快速突破

---

## 11. 医学AI：从辅助诊断到循证推理

### 11.1 DeepRare：全球首个罕见病循证推理系统

2026年2月上海交大与新华医院联合团队在*Nature*发表**DeepRare**[citation:66]：
- **"中枢-分身"架构**：模拟人类医生"提出假设→验证证据→自我纠正"的推理逻辑
- 仅凭临床表型，首次诊断准确率达**57.18%**（较国际最优提升23.79个百分点）
- 结合基因数据后，复杂病例综合准确率突破**70.61%**
- 推理报告获**95.40%**医生满意度
- 已上线服务全球**600+医院**

### 11.2 Prima：脑部MRI秒级分析

密歇根大学2026年2月在*Nature Biomedical Engineering*发表**Prima**[citation:74]：
- 视觉语言模型，实时整合影像数据、文本信息和患者病史
- 对50多种神经系统疾病诊断性能优于多种先进AI模型
- 自动评估病例优先级，对脑出血、中风等紧急预警
- 测试超过3万例MRI检查

### 11.3 血液病：从细胞识别到靶向药筛选

| 系统 | 突破 | 来源 |
|---|---|---|
| CytoDiffusion（剑桥） | 扩散模型分析血涂片，异常细胞检出灵敏度>90%、特异性96%，图灵测试正确率仅52.3% | [citation:78] |
| AlloHeme（哥伦比亚） | 外周血AI预警移植后复发，灵敏度85%，提前41天 | [citation:78] |
| μPharma（犹他大学） | 芯片+AI 4小时锁定儿童白血病靶向药 | [citation:78] |

### 11.4 中国"磐石"科学基础大模型体系

中国科学院2025-2026年发布的"磐石"系列展现了国家层面的布局[citation:31][citation:35]：

| 模型 | 领域 | 核心能力 |
|---|---|---|
| 磐石·科学基础大模型2.0 | 通用 | "通专一体"，800万条科学推理数据，60+任务超越通用旗舰模型 |
| 磐石·赛博士 | 粒子物理 | 北京谱仪实验分析效率提升 |
| 磐石·祝融 | 材料 | 新材料"按需设计、精准制备" |
| 磐石·金乌 | 天文 | 太阳耀斑自动化智能预测 |
| 磐石·禹衡 | 气候 | 全球首个全景式碳排放核算系统 |
| 磐石·数字细胞 | 生命科学 | **30天发现3个未知药物靶点，全部通过湿实验验证** |

---

## 12. 暗礁：幻觉、复现危机与信任赤字

### 12.1 "幻觉引文"正在侵蚀科学信任

2025年《自然》杂志一项分析预测：**自2025年起，可能有数万篇学术出版物混入AI生成的无效引文**[citation:50][citation:63]。

典型案例：法国图卢兹大学计算机科学家Guillaume Cabanac收到谷歌学术通知，称其文章被《国际牙科杂志》一篇论文引用——但他的研究主题是识破伪造论文，与牙科毫无关系[citation:63]。

> "幻觉引文"与传统的引文错误有本质区别：后者是拼写错误或张冠李戴，前者是彻头彻尾的虚构——参考文献列表中出现的条目在现实中根本不存在[citation:63]。

### 12.2 复现危机的新维度

科学研究的可复现性本就岌岌可危：
- 2015年发现仅**36%**的心理学研究可复现[citation:62]
- *Nature*调查超1500名科学家，超**70%**曾复现他人实验失败[citation:62]
- **2026年ICML专项审查**：92篇可验证论文中仅34篇能复现超四成结论，复现八成以上结论的仅8篇[citation:58]

AI的介入让问题更复杂：代码文件缺失、依赖环境断裂、模型已下线无法获取、开源参数与宣传性能不符[citation:58]。

### 12.3 科学同质化风险

斯坦福2026 AI Index报告警告：当大量研究者使用**相似的模型、训练于相似的文献**时，可能生成高度相似的假设，降低科学多样性[citation:50]。而科学突破往往恰恰来自**非主流的异质思路**。

### 12.4 计算资源集中化

2025年超过**90%的知名前沿模型由产业界产出**[citation:50]。这种集中化可能让大型科技公司和资金雄厚的研究机构，对"生成科学知识所用的工具"拥有不成比例的影响力。

---

## 13. 未来方向：可信AI科学的方法论

### 13.1 可观测性（Observability）是第一原则

2026年METR研究表明：AI agent能以50%可靠性完成的任务长度，每7个月翻一倍，2024-2025年加速到每4个月翻一倍[citation:62]。如果agent能力每4-7个月翻倍而人类验证能力不变，5年内验证缺口可能扩大**250-30000倍**。

解决方案是**by-default可观测的工作流**：完整的日志、指标和追踪（logs, metrics, traces）[citation:62]。

### 13.2 生成与验证分离

有效做法是将**生成**和**验证**解耦[citation:50]：
- 形式化证明检查器验证数学论证
- 模拟测试工程设计
- 实验室实验验证预测材料
- 统计审查识别薄弱证据

### 13.3 神经-符号混合：第三波AI

2025-2026年，神经-符号AI（Neurosymbolic AI）强势回归[citation:52][citation:56]：
- Amazon在Vulcan仓库机器人和Rufus购物助手中部署神经-符号方法
- AWS在2025年8月推出Automated Reasoning服务，声称准确率高达99%
- IBM构建开源Neuro-Symbolic AI Toolkit（40+代码库）
- Yann LeCun 2026年3月以10.3亿美元种子轮创立AMI Labs， thesis正是"LLM是死胡同"

核心循环（Garcez定义）[citation:56]：
```
翻译(Translate) → 提取(Extract) → 测量保真度(Measure) → 重新注入(Re-instil)
```

### 13.4 数据溯源与AI素养

材料科学领域2026年的立场论文提出多维框架[citation:54]：
- 强制提交结构化原始仪器文件
- AI驱动的欺诈检测系统
- 跨学科教育培养"批判性AI素养"
- 所有AI生成内容必须添加**水印（watermark）**[citation:72]

---

## 14. 十项横评表

| 方法/系统 | 任务通用性 | 物理一致性 | 可解释性 | 数据效率 | 不确定性量化 | 验证严格度 | 开源程度 | 部署成熟度 | 跨域迁移 | 总评 |
|---|---|---|---|---|---|---|---|---|---|---|
| AlphaFold3 | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★☆☆☆☆ | ★★★★★ | ★★☆☆☆ | 3.5 |
| MatterGen | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | ★★☆☆☆ | 3.2 |
| PDE-FM | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | 3.8 |
| PINNs | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★★★ | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★☆☆☆ | 3.7 |
| Aurora | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ | 3.8 |
| AlphaProof | ★★☆☆☆ | N/A | ★★★★★ | ★☆☆☆☆ | ★★★★☆ | ★★★★★ | ★☆☆☆☆ | ★★☆☆☆ | ★☆☆☆☆ | 3.0 |
| MDCrow | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | 3.3 |
| AI Scientist | ★★★☆☆ | ★★☆☆☆ | ★☆☆☆☆ | ★★☆☆☆ | ★☆☆☆☆ | ★★☆☆☆ | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ | 2.4 |
| DeepRare | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★★★ | ★☆☆☆☆ | ★★★★☆ | ★☆☆☆☆ | 3.5 |
| 磐石2.0 | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | ★☆☆☆☆ | ★★★★☆ | ★★★★☆ | 3.6 |

---

## 15. 按场景选型表

| 场景 | 首选方案 | 备选方案 | 关键考量 |
|---|---|---|---|
| 蛋白质结构预测 | AlphaFold3 Server | Boltz-1、Chai-1 | 是否需要全原子复合物 |
| 新材料发现 | GNoME + DFT验证 | MatterGen | 稳定性优先还是性质定制优先 |
| 药物分子设计 | RFdiffusion2 + 湿实验 | Insilico平台 | 是否需要从头设计 |
| 流体/物理仿真 | PDE-FM / FNO | PINNs | 是否有大量仿真数据 |
| 气候/天气预测 | Aurora / FourCastNet3 | DLESyM | 是否需要业务化部署 |
| 数学定理证明 | Lean 4 + AlphaProof | DeepSeek-Prover-V2 | 是否需要形式化验证 |
| 天文数据分析 | Zoobot + 公民科学 | LSST DESC管线 | 数据规模与标注成本 |
| 医学诊断辅助 | DeepRare / Prima | CytoDiffusion | 可解释性是否关键 |
| 全自动科研 | AI Scientist框架 | AlphaEvolve | 领域是否已有自动评估 |
| 跨学科基础模型 | 磐石2.0 / ESM-2 | Aurora | 任务覆盖广度需求 |

---

## 16. FAQ

**Q1：AI for Science和"用AI辅助科研"有什么区别？**
本质区别在于主动性。传统"AI辅助"是人类主导、AI执行单步任务（如预测一个结构、画一张图）。AI for Science是AI参与**假设生成→实验设计→执行→分析→迭代**的全流程，甚至自主完成（如AI Scientist）。第五范式的关键词是"人机协同"而非"AI工具"[citation:57][citation:65]。

**Q2：为什么科学基础模型不直接用GPT类大模型？**
四个结构性差异决定了专用模型的必要性：token类型不同（原子vs文字）、对称性需要硬编码、目标函数不是next-token prediction、规模小1-2个量级但数据效率高[citation:38]。通用LLM擅长推理和代码，但嵌入物理约束需要专用架构。

**Q3：AlphaFold3会取代实验结构生物学吗？**
不会，但会**重新分配实验资源**。AI预测成为默认起点，实验资源从"确定基本结构"转向"验证预测+测试候选化合物"[citation:36]。对复杂构象变化和动态过程，实验仍然不可替代。

**Q4：AI生成的论文可信吗？**
目前**部分可信**。AI Scientist在Nature发表的论文证明了端到端自动科研的可行性，但其生成的论文仍存在引用幻觉、想法不够深入等问题[citation:72]。关键不在"谁写的"，而在"是否可验证"——形式化证明、实验复现、代码开源才是信任基础。

**Q5：中国在国际AI for Science版图中的位置？**
多领域接近领先水平但缺乏标志性突破[citation:29]。具体亮点：中科院"磐石"系列覆盖6+学科、上海AI Lab的SciReasoner、清华/北大在神经算子和定理证明的 contributions、湖南大学5亿原子MD模拟。政策层面，中国将AI for Science纳入第七期科技基本计划重点[citation:26]。

---

## 17. 参考文献

[1] Abramson, J. et al. (2024). Accurate structure prediction of biomolecular interactions with AlphaFold 3. *Nature*.

[2] Aftalion, B. et al. (2025). AI-driven quantum chemistry and molecular dynamics: feasibility analysis. *HPC Top*.

[3] AlphaProof Team, DeepMind (2025). AlphaProof: Formal Proof with AlphaZero. *Nature*. https://www.nature.com/articles/s41586-025-09833-y

[4] Wang, X. et al. (2025). DLESyM: Deep Learning Earth System Model. *AGU Advances*. https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2025AV001706

[5] Wang, W. et al. (2025). Time-marching neural operator–FE coupling. *Computer Methods in Applied Mechanics and Engineering*, 446, 118319.

[6] Campbell, Q. et al. (2026). MDCrow: automating molecular dynamics workflows with LLMs. *Machine Learning: Science and Technology*, 7, 025037.

[7] 刘俊杞, 何伟昆, 支丽红等 (2026). Numina-Lean-Agent: 面向形式化数学的开源通用智能体推理系统. *ICML 2026 accepted*.

[8] 穆穆 (2025). AI洞悉"天机" 风云不再"莫测". *科技日报*, 2025-10-24.

[9] Wang, X. et al. (2025). ORBIT-2: Scaling Exascale Vision Foundation Models for Weather and Climate Downscaling. *SC25 Proceedings*. Gordon Bell Prize Finalist.

[10] Thiemann, F. L. et al. (2026). Force-free molecular dynamics through autoregressive equivariant networks. *Nature Machine Intelligence*, 8, 764-776.

[11] DeepSeek-AI (2025). DeepSeek-Prover-V2: Open-Source LLM for Formal Theorem Proving in Lean 4.

[12] Adamo, J. et al. (2025). AI-accelerated galaxy power spectrum emulator for SPHEREx. *arXiv preprint*.

[13] Soares, E. et al. (2025). PDE-FM: A Foundation Model for PDEs Across Physics Domains. *AAAI 2026 AI2ASE Workshop*. arXiv:2511.21861

[14] 王锋团队 (2025). 5亿原子深度学习分子动力学模拟. *GPUMD / 国产超算*.

[15] Princeton NLP Group (2025). Goedel-Prover-V2: Verifier-Guided Self-Correction for Theorem Proving.

[16] Microsoft Research (2025). Aurora: A Foundation Model for the Earth System. *Nature*. https://www.nature.com/articles/s41586-025-09005-y

[17] Wang, Z. et al. (2026). Cross-field Interface-Aware Neural Operators for Multiphase Flow Simulation. *AAAI 2026*, Paper 2986.

[18] Ge, F. & Dral, P. O. (2025). MDtrajNet: AI for Direct Prediction of Molecular Dynamics Across Chemical Space. *J. Chem. Theory Comput.*

[19] Lu, C. et al. (2024-2026). The AI Scientist: Towards Fully Automated AI Research. *Nature* (2026). https://www.nature.com/articles/s41586-026-10265-5

[20] Sakana AI (2026). Introducing the RSI Lab. https://sakana.ai/rsi-lab

[21] Eger, S. et al. (2026). Transforming Science with Large Language Models: A Survey. *ACM Computing Surveys*. arXiv:2502.05151

[22] Stanford HAI (2026). AI Index Report 2026, Chapter 5: Science. https://hai.stanford.edu/ai-index-report-2026

[23] JST-CRDS (2026). AI for Science の動向2026. https://www.mext.go.jp/content/20260224-mxt_sinkou01-000047519_10.pdf

[24] 张钹等 (2025). "创新清华"对话：AI如何影响科学研究. *清华大学*. https://www.tsinghua.edu.cn/info/1002/118130.htm

[25] 中国科学院 (2026). 磐石·科学基础大模型2.0发布. *中科院官网*. https://www.cas.cn/yx/202607/t20260721_5115936.shtml

[26] 中国科学院 (2026). AI赋能科学研究由"单兵作战"迈向"集团冲锋". *科技日报*. https://www.cas.cn/cm/202604/t20260429_5108385.shtml

[27] 上海人工智能实验室 (2025). SciReasoner: 微观结构与性质推理模型. *上海科技报*.

[28] EBI Training (2025). How have AlphaFold 3's predictions been validated? https://www.ebi.ac.uk/training/online/courses/alphafold/

[29] 腾讯网 (2025). AI for Science年度盘点：人工智能驱动科学革命的10大进展.

[30] 新华网 (2025). AI洞悉"天机" 风云不再"莫测". http://www.xinhuanet.com/tech/20251024/

[31] ESA (2025). Euclid opens data treasure trove. https://www.esa.int/Science_Exploration/Space_Science/Euclid/

[32] NanoHelix (2025). 2025 Guide to AI-Driven Protein Design.

[33] AI Shortlist (2025). AI Transforms Scientific Discovery in 2025.

[34] Trotta, R. (2025). AI and the production of knowledge. *Nature Astronomy*.

[35] Cabanac, G. et al. (2026). "幻觉引文"侵蚀科学信任. *Nature / 人民网*.

[36] Reeves-McLaren, N. & Moth-Lund Christensen, S. (2026). Data integrity in materials science in the era of AI. *Journal of Materials Chemistry A*, 14, 276-283.

[37] 刘俊杞等 (2026). Numina-Lean-Agent详情. *中科院数学院*. https://amss.cas.cn/kyjz1/202602/

[38] Jimmy Research (2025-2026). AI for Science — Landscape & Method Spectrum. https://jimmyresearch.com/modules/ai-for-science

[39] 安徽大学 (2026). TXL Fusion加速拓扑材料发现. *科学网*. https://paper.sciencenet.cn/

[40] Bernard, T. et al. (2025). Benchmarking AlphaFold 3 on RNA structure prediction. *bioRxiv*.

[41] 密歇根大学 (2026). Prima: 脑部MRI秒级分析. *Nature Biomedical Engineering*. https://www.nature.com/articles/s41551-025-01608-0

[42] 上海交大/新华医院 (2026). DeepRare: 罕见病循证推理系统. *Nature*.

[43] ECAS (2025). 微软Aurora天气预报AI模型. https://ecas.cas.cn/xxkw/kbcd/201115_147878/

[44] EU Commission (2025). European AI in Science Strategy. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52025DC0724

[45] 苏州卫健委 (2026). AI全科医生上线满2月. *苏州市卫健委*.

[46] 广西医科大学 (2026). "铁捕快"地贫铁过载检测系统.

[47] 张守营 (2025). 人工智能+之于科研就是最强大的助手. *中国发展网*.

[48] 中国网 (2025). 首场"创新清华"对话举行.

[49] 科技导报 (2025). 科学研究智能化转型：基于AI的新范式.

[50] Economy Insights (2026). How AI Is Transforming Mathematics and Scientific Research.

[51] 中国科学院 (2025). 美德研究团队DLESyM深度学习地球系统模型. https://ecas.cas.cn/xxkw/kbcd/201115_148189/

[52] PixelBrix (2025-2026). Neurosymbolic AI — Sound Reasoning, Knowledge Reuse.

[53] DAICE Labs (2025). The Quiet Return of Neurosymbolic AI.

[54] 人民网 (2026). "幻觉引文"悄然侵蚀公众对科学的信任.

[55] 宣讲家网 (2025). 人工智能赋能科学研究要防范"机器幻觉".

[56] White, A. D. et al. (2026). MDCrow: LLM agents for molecular dynamics. *Mach. Learn.: Sci. Technol.*, 7, 025037.

[57] 清华大学 (2025). "创新清华"对话科学系列活动. https://www.tsinghua.edu.cn/info/1002/118130.htm

[58] SDENews (2026). AI深度介入科研审查 顶刊论文错漏集中暴露.

[59] 中科院网信办 (2025). 微软推出天气预报AI模型Aurora. https://ecas.cas.cn/xxkw/kbcd/201115_147878/

[60] 高性能计算网 (2025). AI驱动的量子化学与分子动力学全景分析.

[61] Arizona Astronomy (2025). Turbocharging SPHEREx with AI. https://astro.arizona.edu/node/1706

[62] arXiv (2026). Position: The Age of AI Agents Demands A New Scientific Paradigm. arXiv:2607.26064

[63] 人民网 (2026). "幻觉引文"侵蚀科学信任. https://finance-app.people.cn/n1/2026/0411/

[64] 智慧医疗网 (2026). AI赋能血液病诊疗实现4小时内精准定策.

[65] 今日头条 (2025). 从经验到智能驱动：AI如何开启第5科研范式.

[66] 中国科技网 (2026). Nature重磅！全球首个医学循证推理智能体DeepRare.

[67] ESA (2025). Euclid opens data treasure trove. https://www.esa.int/Science_Exploration/Space_Science/Euclid/

[68] Sakana AI (2026). Introducing the RSI Lab. https://sakana.ai/rsi-lab

[69] Artificial Intelligence Dynamics (2026). The AI Scientist Published in Nature.

[70] EuroHPC (2026). pop-cosmos: AI-accelerated Bayesian inference for 41M galaxies.

---

> **写在最后** —— AI for Science不是要取代科学家，而是让科学家从重复劳动中解放出来，专注于真正需要人类直觉和创造力的部分。但信任不能跑在验证前面：每一行AI生成的代码、每一个AI预测的结构、每一篇AI起草的论文，都需要可追溯、可复现、可质疑。科学的本质从来不是"正确答案"，而是"可质疑的求真过程"——这一点，无论工具如何进化，都不会改变。

---

*本文档采用Markdown格式编写，可直接用任何Markdown编辑器或GitHub渲染阅读。文中所有引用均标注来源编号，对应文末参考文献列表。*
