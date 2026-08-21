---
title: "AI气象大模型：从数据驱动预报到地球系统智能"
description: "全面梳理2024-2026年AI气象大模型的技术演进，涵盖GraphCast、Pangu-Weather、FuXi、Aurora、NeuralGCM等核心模型，以及扩散模型、物理-AI融合、数据同化、极端天气预测等前沿方向"
date: "2026-08-17"
author: "AI Research"
tags: ["AI气象", "天气预报", "深度学习", "GraphCast", "Pangu-Weather", "FuXi", "Aurora", "NeuralGCM", "扩散模型", "物理-AI融合"]
reading_time: "约28分钟"
toc: true
---

# AI气象大模型：从数据驱动预报到地球系统智能

> **一句话概括**：过去四年，AI把一门七十年的气象老手艺重写了一遍——从"解偏微分方程"变成"学数据里的时空规律"，推理速度提升万倍，精度全面超越运行了半个世纪的超级计算机数值模式。但极端天气、物理一致性和"黑箱"信任问题，仍是待解的硬骨头。

---

## 目录

- [先说结论](#先说结论)
- [一、为什么气象是AI的"终极试验场"](#一为什么气象是ai的终极试验场)
- [二、范式转变：从求解方程到学习数据](#二范式转变从求解方程到学习数据)
- [三、六大核心架构深度解析](#三六大核心架构深度解析)
  - [3.1 FourCastNet：傅里叶神经算子的先行者](#31-fourcastnet傅里叶神经算子的先行者)
  - [3.2 Pangu-Weather：3D Transformer的突破](#32-pangu-weather3d-transformer的突破)
  - [3.3 GraphCast：图神经网络登顶Science](#33-graphcast图神经网络登顶science)
  - [3.4 FuXi家族：级联Transformer的中国路线](#34-fuxi家族级联transformer的中国路线)
  - [3.5 Aurora：13亿参数的地球系统基础模型](#35-aurora13亿参数的地球系统基础模型)
  - [3.6 ClimaX：气候基础模型的先行者](#36-climax气候基础模型的先行者)
- [四、概率与集合预报：从确定性到不确定性量化](#四概率与集合预报从确定性到不确定性量化)
  - [4.1 GenCast：扩散模型颠覆集合预报](#41-gencast扩散模型颠覆集合预报)
  - [4.2 EPT系列：能源气象的专用基础模型](#42-ept系列能源气象的专用基础模型)
  - [4.3 AIFS：ECMWF的官方AI答案](#43-aifsecmwf的官方ai答案)
- [五、扩散模型与生成式气象](#五扩散模型与生成式气象)
  - [5.1 CorrDiff：残差校正扩散降尺度](#51-corrdiff残差校正扩散降尺度)
  - [5.2 StormCast/StormScope：公里级对流允许模拟](#52-stormcaststormscope公里级对流允许模拟)
  - [5.3 IPSL-AID与Apeliotes：气候降尺度新范式](#53-ipsl-aid与apeliotes气候降尺度新范式)
- [六、物理-AI融合：混合模型的崛起](#六物理-ai融合混合模型的崛起)
  - [6.1 NeuralGCM：可微分动力核+神经参数化](#61-neuralgcm可微分动力核神经参数化)
  - [6.2 混合模型的科学验证](#62-混合模型的科学验证)
  - [6.3 PseudospectralNet与置信度引导混合](#63-pseudospectralnet与置信度引导混合)
- [七、数据同化：AI打通"观测→预报"全链路](#七数据同化ai打通观测预报全链路)
  - [7.1 XiChen：4DVar梯度引导的灵活同化](#71-xichen4dvar梯度引导的灵活同化)
  - [7.2 HealDA：秒级生成初始条件](#72-healda秒级生成初始条件)
  - [7.3 长窗口4DVar可微分再分析](#73-长窗口4dvar可微分再分析)
- [八、极端天气AI预测](#八极端天气ai预测)
  - [8.1 台风路径预报的中国方案](#81-台风路径预报的中国方案)
  - [8.2 WeatherNext Cyclones：飓风预报新标杆](#82-weathernext-cyclones飓风预报新标杆)
  - [8.3 极端事件的评估困境与加权CRPS](#83-极端事件的评估困境与加权crps)
- [九、PINN在气象中的应用](#九pinn在气象中的应用)
  - [9.1 HW-OPINN：海洋热浪预测](#91-hw-opinn海洋热浪预测)
  - [9.2 温室气候状态重建](#92-温室气候状态重建)
- [十、多模态融合与AI智能体](#十多模态融合与ai智能体)
  - [10.1 "风和"：千亿参数气象大语言模型](#101-风和千亿参数气象大语言模型)
  - [10.2 "妈祖"：全球智能预警方案](#102-妈祖全球智能预警方案)
  - [10.3 Earthlink：自主科学发现智能体](#103-earthlink自主科学发现智能体)
- [十一、评估基准的演进](#十一评估基准的演进)
  - [11.1 WeatherBench 2与StationBench](#111-weatherbench-2与stationbench)
  - [11.2 RealBench：面向业务现实的评测](#112-realbench面向业务现实的评测)
  - [11.3 AI-MIP：气候模型的"CMIP时刻"](#113-ai-mip气候模型的cmip时刻)
- [十二、可解释性：打开气象AI的黑箱](#十二可解释性打开气象ai的黑箱)
- [十三、十种方法横评](#十三十种方法横评)
- [十四、按场景选型指南](#十四按场景选型指南)
- [十五、未来方向与挑战](#十五未来方向与挑战)
- [FAQ](#faq)
- [参考文献](#参考文献)

---

## 先说结论

1. **AI气象已从"学术好奇"进入"业务化运行"阶段**。GraphCast、Pangu-Weather、FuXi、Aurora等模型在确定性预报精度上全面超越ECMWF的IFS系统，推理速度从"数小时/超级计算机"变为"数秒/单张GPU"，提速1万倍以上[citation:35][citation:40]。

2. **架构之争尘埃渐定：没有银弹，各有战场**。Transformer系（Pangu、Aurora、FuXi）擅长大规模预训练和多任务迁移；GNN系（GraphCast）在球面几何上天然优雅但硬件利用率低；傅里叶神经算子（FourCastNet）速度最快但精度略逊；扩散模型（GenCast、CorrDiff）在概率预报和降尺度上独占鳌头[citation:43]。

3. **物理-AI融合是未来十年的主旋律**。纯数据驱动模型在极端天气外推、长期气候模拟和物理一致性上存在根本性缺陷。NeuralGCM、PseudospectralNet、XiChen等混合模型将物理方程的可解释性和守恒性质与AI的学习能力结合，代表最有希望的前进方向[citation:51][citation:57]。

4. **评估体系正在经历"去ERA5依赖"的范式转移**。WeatherBench 2奠定了标准化基础，但RealBench揭示了"在ERA5上刷分"与"在真实观测和业务分析中表现"之间的巨大鸿沟。AI模型在站点观测验证下的RMSE比ERA5评估高0.3–0.5 K[citation:85]。

5. **中国力量不可忽视**。Pangu-Weather、FuXi、FengWu、AIFS的实战部署、华为盘古2.0的大气-海洋-污染全耦合、中国气象局的"风"系列矩阵和"妈祖"全球预警方案，标志着中国从跟随者变为领跑者之一[citation:52][citation:56]。

---

## 一、为什么气象是AI的"终极试验场"

气象预报的本质，是在一个高维、非线性、混沌的动力学系统中，从不完全的观测中预测未来状态。传统数值天气预报（NWP）依赖超级计算机求解 Navier-Stokes 方程及其简化形式，每一步都受限于计算资源和物理参数化的近似误差。

AI的介入并非要"颠覆"物理学，而是提供了一条**互补路径**：

- **计算效率的降维打击**：一个10天全球预报，传统IFS需要数千CPU核心跑1小时，GraphCast在单张TPU上只需不到1分钟，能耗降低99.9%[citation:40][citation:69]。
- **从"第一性原理"到"数据里的规律"**：AI不需要手工编写云微物理参数化方案，它直接从39年（GraphCast）或100万小时（Aurora）的再分析数据中学习大气演化的统计规律[citation:93][citation:102]。
- **概率预报的自然框架**：扩散模型天生适合生成"多个可能的未来"，恰好匹配气象决策需要的"不确定性量化"[citation:69][citation:79]。

但气象也是AI最苛刻的考场：一场台风的路径偏差30公里就可能导致完全不同的防灾决策；一个虚假的极端降水预报可能引发数百万美元的经济损失。**精度、可靠性、可解释性**三者缺一不可。

---

## 二、范式转变：从求解方程到学习数据

传统NWP的核心流程是：

```
观测数据 → 数据同化（4DVar/EnKF）→ 初始条件 → 数值模式积分（求解PDE）→ 预报产品
```

每一步都有深厚的物理学根基，但也都有瓶颈：同化窗口长达12小时、模式分辨率受计算力限制、参数化方案是"经验公式的垃圾箱"。

AI气象模型将这条流水线压缩为：

```
历史数据（ERA5/卫星/雷达）→ 神经网络训练 → 初始条件 → 自回归推理 → 预报产品
```

关键区别在于：**训练阶段吃算力，推理阶段几乎免费**。一个训练好的模型可以在单张GPU上以秒级速度生成全球预报，这让"为每个决策跑100个集合成员"从奢望变成日常[citation:34][citation:42]。

但这条路径也有自己的陷阱：
- **训练数据偏差**：ERA5本身是用旧版IFS生成的，模型可能学到的是"IFS的偏见"而非"大气的真理"[citation:86]。
- **自回归误差累积**：每往前推6小时就多一层误差，10天预报的尾部精度急剧下降[citation:43]。
- **极端事件稀缺**：训练数据里飓风、热浪是少数派，模型倾向于"预测平均态"——安全但平庸[citation:63]。

---

## 三、六大核心架构深度解析

### 3.1 FourCastNet：傅里叶神经算子的先行者

FourCastNet（Pathak et al., 2022）是第一个证明"用神经网络跑全球预报"可行的工作。其核心创新是**自适应傅里叶神经算子（AFNO）**：

$$\mathcal{F}^{-1} \left[ R \cdot \mathcal{F}[u] \right]$$

即在傅里叶空间中做参数化的线性变换，用全局卷积捕获长程空间依赖，同时避免自注意力的$O(N^2)$复杂度。

**关键数据**：
- 训练数据：ERA5，0.25°分辨率，1979–2017
- 推理速度：单GPU约2秒生成6小时预报
- 精度：在Z500和T850上接近IFS HRES，但降水预报偏弱

**为什么重要**：FourCastNet证明了"数据驱动全球预报"不是天方夜谭，直接启发了后续所有模型[citation:32]。

### 3.2 Pangu-Weather：3D Transformer的突破

华为Pangu-Weather（Bi et al., 2023, Nature）是**首个在确定性预报精度上全面超越IFS的AI模型**[citation:36]。

**架构核心**：
- **3D Earth-specific Transformer**：将地球表面划分为384×384像素的规则网格，垂直方向引入13个等压层（1000–50 hPa），构建69通道的3D数据立方体
- **Cube Embedding**：用3D卷积（核2×4×4，步幅相同）将69×720×1440降维到C×180×360，大幅减少计算量
- **U-Transformer骨干**：48个Swin Transformer V2块，下采样到C×90×180再上采样回来
- **层次化时间聚合（Hierarchical Temporal Aggregation）**：这是Pangu最被低估的创新——训练多个模型分别处理不同时间步（1h/3h/6h/24h），用粗模型迭代生成大时间步预报场，再作为细模型的条件输入进行精化

**关键数据**：
- 单次全球预报：1.4秒（Ascend 910集群）
- 精度：15个测试变量（Z500、T850、U850、V850、T2M、U10等）的RMSE全部低于IFS
- 台风路径预报准确率约90%

**局限**：
- 规则网格在极区像素密集，极地过程（海冰、极涡）预报偏弱
- 纯确定性输出，不提供概率信息
- ERA5再分析的偏差会传导到极端事件预报中[citation:36][citation:56]

### 3.3 GraphCast：图神经网络登顶Science

Google DeepMind的GraphCast（Lam et al., 2023, Science）采用**二十面体多分辨率网格+图神经网络**的方案[citation:102]。

**架构三阶段**（编码器-处理器-解码器）：

1. **编码器**：将0.25°经纬网格上的气象变量通过GNN层投影到多分辨率网格节点。每个节点承载227个变量（6个地表+5个变量×37个气压层）。

2. **处理器**：16层不共享的GNN消息传递层，在约40,962个节点的多分辨率网格上操作。网格从正二十面体（12节点）经6次细分得到，边权重由高斯核定义：

$$w_{ij}^{(l)} = \exp\left(-\frac{|\mathbf{x}_i - \mathbf{x}_j|^2}{2(\sigma^{(l)})^2}\right), \quad \sigma^{(l)} \approx 1.5 R_l$$

其中$R_l$是层级$l$的局部网格尺度。每个节点在6跳之内即可"触及"半个地球。

3. **解码器**：将处理后的网格特征映射回经纬网格，输出为对最近输入状态的残差更新。

**关键创新**：
- 球面几何天然适配，无极点奇异性
- 多分辨率边让"局部精细+全局传播"在同一步内完成
- 自回归展开：将预测反馈为输入，可生成任意长度轨迹

**性能数据**（WeatherBench 2）[citation:54]：
- 在1380个验证目标中，超过90%优于ECMWF HRES
- 单GPU 60秒完成10天全球预报
- 2025年大西洋飓风季，72小时气旋路径误差较HRES降低约15%

**已知问题**：
- GNN消息传递的硬件利用率仅约1%（H100上），36倍低于Aurora的37.2%[citation:43]
- 长程预报中图节点特征趋向同质化（"过平滑"），损失局部细节
- 训练成本：约10万GPU小时

### 3.4 FuXi家族：级联Transformer的中国路线

复旦大学开发的FuXi（Chen et al., 2023）走了一条**级联多模型**的差异化路线[citation:96]。

**架构核心**：
- **三个独立U-Transformer模型**：FuXi-Short（0–5天）、FuXi-Medium（5–10天）、FuXi-Long（10–15天），各司其职
- 每个模型骨干：48个Swin Transformer V2块
- 输入：70个气象变量（5个地表+5个变量×13个气压层），时间步长6小时
- 推理时按目标Lead Time选择对应模型，避免单模型在不同时效上的精度-稳定性冲突

**FuXi生态扩展**（2024–2026）[citation:92][citation:100]：

| 模型 | 定位 | 关键能力 |
|---|---|---|
| FuXi-Extreme | 极端天气专项 | 台风强度、降水极值、大气河流，准确率提升约10% |
| FuXi-Nowcast | 0–6小时短临 | 对流启动预报，填补NWP空白 |
| FuXi-Weather | 端到端系统 | 可微分4DVar同化+预报全链条 |
| FuXi-CNOPs | 台风集合预报 | 非线性动力学扰动，路径误差降16.5%，强度误差降59.7% |
| 风顺（基于FuXi） | 次季节预测 | 3分钟完成60天预测，ECMWF竞赛全球第一 |

**核心突破**：FuXi内置自动微分模块，无需额外开发伴随模式即可分析误差来源——这是AI模型通过大气科学"图灵测试"的关键[citation:56]。

### 3.5 Aurora：13亿参数的地球系统基础模型

微软Aurora（Bodnar et al., 2025, Nature）是**第一个真正意义上的地球系统基础模型**[citation:93][citation:97]。

**架构三件套**：

1. **3D Perceiver编码器**：将不同分辨率、变量、气压层的异构输入映射到统一的3D潜空间表示。使用傅里叶位置编码捕获空间位置和尺度特征。

2. **3D Swin Transformer处理器**（13亿参数）：层级式窗口注意力在局部窗口内操作，每两层之间平移窗口，模拟物理信息在球面上的传播。对称的U-Net上下采样结构实现多尺度特征融合。

3. **动态Perceiver解码器**：将潜变量反向映射为任意目标变量和分辨率的预测，支持缺失数据建模（如海浪数据在陆地区域的空白）。

**训练策略**：
- **预训练**：在超过100万小时的地球物理数据上训练（ERA5、CAMS、MERRA-2等），32块A100 GPU跑约2.5周，共15万步，优化6小时Lead Time的MAE
- **微调**：在同一骨干上微调出四个下游任务——空气质量（0.4°）、海浪（0.25°）、热带气旋追踪（0.25°）、高分辨率天气（0.1°）

**性能数据**[citation:93][citation:42]：

| 任务 | Aurora表现 | 对比基线 |
|---|---|---|
| 5天空气质量（0.4°） | 74%目标优于数值模式 | CAMS ENS |
| 10天海浪（0.25°） | 86%目标优于数值模式 | WAM/HRES-WAM |
| 5天热带气旋路径 | 100%目标优于7个预报中心 | ECMWF/NHC/JTWC等 |
| 10天天气（0.1°） | 92%目标优于数值模式 | IFS HRES |

**Aurora的开源**：2026年7月，微软开源了13亿参数版本的Aurora权重，可通过Hugging Face获取[citation:40]。

### 3.6 ClimaX：气候基础模型的先行者

微软与UCLA联合开发的ClimaX（Nguyen et al., 2023）是**第一个专为"天气+气候"双任务设计的基础模型**[citation:95][citation:99]。

**核心设计**：
- 在CMIP6多模型气候数据上自监督预训练
- 扩展Transformer架构，引入**变量编码块**（Variable Encoding Block）和**聚合块**（Aggregation Block），可处理不同变量集、不同空间分辨率和不同时间覆盖率的数据
- 预训练后可在天气 forecasting、气候降尺度、气候预估三种任务上微调

**与Aurora的区别**：ClimaX更强调"从气候模拟数据学习"而非"从再分析数据学习"，目标是跨时间尺度的统一建模。

---

## 四、概率与集合预报：从确定性到不确定性量化

确定性预报给出一个"最佳猜测"，但气象决策需要的是"各种可能性的概率分布"。2024–2026年的核心进展是**用生成式AI做概率预报**。

### 4.1 GenCast：扩散模型颠覆集合预报

Google DeepMind的GenCast（Price et al., 2024, Nature）将**条件扩散模型**引入全球集合预报[citation:69]。

**核心思路**：
- 不再预测"一个未来"，而是学习"未来状态的条件概率分布" $p(\mathbf{x}_{t+\Delta t} | \mathbf{x}_t)$
- 训练时使用去噪扩散目标：逐步向真实大气状态添加高斯噪声，让网络学习逆向去噪过程
- 推理时从纯噪声出发，经50步去噪生成完整的全球大气场
- 每次从不同的随机种子出发，天然得到集合成员

**性能数据**[citation:69][citation:34]：
- 在CRPS（连续排序概率评分）上全面超越ECMWF ENS（50个集合成员）
- 飓风Milton：50个成员中42个落在Tampa Bay±30km登陆窗口内
- 飓风Helene：提前84小时发出"快速增强"高概率警报
- 2025年大西洋飓风季，NHC首次将AI预报作为**主要参考**而非辅助工具

**GenCast到WeatherNext的演进**（2025–2026）[citation:79]：
- **WeatherNext 2**（2025年11月）：高分辨率逐小时预报
- **WeatherNext Cyclones**（2026年8月）：专为热带气旋设计，比前代模型多提供1天有效预报信息
- 已开源：GitHub - google-deepmind/weathernext

### 4.2 EPT系列：能源气象的专用基础模型

Jua AI开发的Earth Physics Transformer（EPT）系列是**面向能源行业的专用气象基础模型**[citation:34]。

**EPT-2核心技术**（arXiv:2507.09703）：
- 通用时空Transformer架构，潜空间表示前向积分
- 训练数据：8块H100 GPU跑10天（比Aurora的32块A100跑18天节省4倍算力）
- 支持**任意Δt预报**（native any-Δt forecasting），不必固定6小时步长
- 输出变量：10m风速、100m风速、2m温度、地表太阳辐射（SSRD）

**基准表现**[citation:50]：
- WeatherBench 2上全时段（0–240小时）全面超越ECMWF HRES
- EPT-2在10m风速上优于Aurora（Aurora无SSRD输出）
- EPT-2e（30成员集合版）在RMSE和CRPS上均优于50成员的ECMWF ENS
- StationBench（10,000+真实地面站验证）：欧洲风速和温度上优于GraphCast、FuXi、Pangu-Weather

### 4.3 AIFS：ECMWF的官方AI答案

欧洲中期天气预报中心（ECMWF）的AIFS（Artificial Intelligence Forecasting System）是**传统气象机构拥抱AI的标杆**[citation:88]。

**发展历程**：
- 2024年：AIFS确定性版本首次纳入ECMWF每日业务预报流程
- 2025年：AIFS集合版本上线，与IFS ENS并行运行
- 2026年5月：AIFS v2上线，新增**数据驱动的海浪和积雪覆盖预报**，11个海浪变量

**关键优势**：
- 直接接入ECMWF数十年积累的高质量分析场数据
- 与现有业务化流程（数据同化、集合系统）无缝集成
- AIFS v2训练适配IFS Cycle 50r1，与物理模式同步升级

---

## 五、扩散模型与生成式气象

### 5.1 CorrDiff：残差校正扩散降尺度

NVIDIA的CorrDiff（Mardani et al., 2024–2025）开创了**"确定性回归+随机校正"的双阶段扩散方案**[citation:2][citation:18]。

**工作原理**：
1. 先用确定性模型（如FourCastNet）生成粗分辨率（25km）预报
2. 再用扩散模型学习"粗预报与高分辨率真值之间的残差"
3. 推理时，确定性预测提供骨架，扩散模型填充精细纹理

**性能声明**（NVIDIA官方）[citation:41]：
- 比CPU数值方法快500–1000倍
- 已部署于以色列气象局，每日最高8次高频更新
- 在台湾中央气象署完成台风预报验证

### 5.2 StormCast/StormScope：公里级对流允许模拟

StormCast是**全球首个公里级对流允许生成式模拟器**（Pathak et al., 2026, Science Advances）[citation:2][citation:6]。

**技术细节**：
- 基于NVIDIA Earth-2研究架构和PhysicsNeMo模型库
- 采用生成式扩散模型，3km分辨率，自回归模拟大气对流和降水
- 输入：GOES静止卫星多波段影像+地面雷达
- 输出：10分钟时间分辨率、6km空间分辨率的0–6小时预报

**为什么重要**：对流启动（convective initiation）是NWP运行了50年都没完全攻克的难题。StormCast直接在观测空间中操作，不需要传统的"雷达回波外推"，而是学习对流系统本身的动力学[citation:6][citation:76]。

**StormScope**（NVIDIA, 2026年1月发布）[citation:6][citation:72]：
- Transformer-based生成式扩散模型
- 美国本土（CONUS）公里级0–6小时预报
- 首个在短临降水预报上超越传统物理模式的AI模型
- 可生成大集合成员，实现概率性短时预报

### 5.3 IPSL-AID与Apeliotes：气候降尺度新范式

**IPSL-AID**（Kishanthan et al., 2026, arXiv:2604.03275）[citation:10]：
- 去噪扩散概率模型
- 从粗分辨率（~100km）全球数据生成0.25°区域场
- 对温度、风、降水建模概率分布，可生成多个合理情景
- 准确重建统计分布、极端事件、功率谱和空间结构

**Apeliotes**（Frastali et al., 2026, arXiv:2607.17037）[citation:14]：
- 框架级方案：预训练全球基础模型 + 区域训练生成式扩散模型
- 预测垂直风廓线误差<3%
- 10m风速相关0.91，2m温度相关0.99
- NRMSE：风速0.42，温度0.17

---

## 六、物理-AI融合：混合模型的崛起

纯数据驱动模型的致命伤在于：**它不知道自己在违反物理定律**。2025–2026年最清晰的共识是——混合模型才是正确的前进方向[citation:51][citation:57]。

### 6.1 NeuralGCM：可微分动力核+神经参数化

Google Research的NeuralGCM（Kochkov et al., 2023–2025）是**混合建模的标杆**[citation:69][citation:80]。

**架构设计**：
- **可微分动力核（Differentiable Dynamical Core）**：用传统数值方法（谱变换）求解大尺度动力过程，保证质量、能量守恒
- **神经网络参数化**：用MLP学习小尺度过程（云、对流、辐射）的"闭合关系"，直接从数据中学而非手工编写
- 两者在PyTorch/TensorFlow中端到端联合训练，可用自动微分

**关键成果**：
- 1–15天天气预报匹配或超越强基线
- 用ERA5训练后，能复现真实的多年代际气候统计
- 季节预测：100个模拟天≈8分钟/单GPU
- 北大西洋和东太平洋 basin 的TC频率预测与观测显著相关（r≈0.7）[citation:66]
- 降水预报：相比IPCC报告中的领先全球大气模式，平均误差降低40%[citation:73]

**已部署**：2026年起，ECMWF将NeuralGCM纳入IFS核心集合成员之一[citation:69]。

### 6.2 混合模型的科学验证

Chen et al.（2026, AGU Advances）对NeuralGCM做了**分层测试**[citation:57][citation:80]：

| 测试层级 | 结果 |
|---|---|
| 天气尺度（1–15天） | 与物理GCM相当 |
| 年际尺度（ENSO响应） | 可复现降水缩放和热带对流层上部的放大增暖 |
| +2K/+4K升温实验 | 部分辐射和 Stratospheric 行为偏离预期 |
| 陆地表面 | 缺少土壤湿度、蒸散、植被反馈，热浪振幅低估 |

**核心结论**：混合架构在训练数据约束充分的**对流层大尺度动力学**上最强，在**平流层、辐射过程和陆地耦合**上仍需改进。

### 6.3 PseudospectralNet与置信度引导混合

**PseudospectralNet（PSN）**（Gelbrecht et al., 2025, JAMES）[citation:61]：
- 准地转物理动力核 + UNet数据驱动核
- 每步在时间域和谱域之间来回变换，模仿传统伪谱解法
- 结果：加入物理动力核后，短期可预测性和长期数值稳定性均改善

**置信度引导混合**（Heuer et al., 2025–2026, arXiv:2510.08107）[citation:53]：
- 核心思想：让神经网络**预测自己的误差**
- 当NN对某个区域的预测置信度低时，自动切换回传统对流参数化方案
- 在ICON-A模式中实现稳定20年以上的混合模拟
- 改进了降水统计，且过程可解释（约束了水汽、低层稳定度和地理条件）

---

## 七、数据同化：AI打通"观测→预报"全链路

传统数据同化（4DVar、EnKF）是NWP的"隐形功臣"——它把零散的卫星、雷达、探空、浮标观测融合成一致的大气初始场。但同化窗口长达12小时、计算昂贵，且高分辨率下难以扩展[citation:78]。

### 7.1 XiChen：4DVar梯度引导的灵活同化

XiChen（Wang et al., 2026, arXiv:2507.09202）提出了一种**全新的端到端观测到预报ML系统**[citation:70]：

**核心洞察**：4DVar代价函数的**梯度**是一个物理上有意义的接口——它将异构观测映射到统一的状态空间。

$$\nabla J = \nabla \left[ \frac{1}{2}(\mathbf{x} - \mathbf{x}_b)^T \mathbf{B}^{-1}(\mathbf{x} - \mathbf{x}_b) + \frac{1}{2}(\mathbf{y} - \mathcal{H}(\mathbf{x}))^T \mathbf{R}^{-1}(\mathbf{y} - \mathcal{H}(\mathbf{x})) \right]$$

XiChen用这个梯度作为"通用翻译器"，灵活同化不同类型的观测（常规站、卫星辐射率、GPS掩星），无需为每种观测源重新设计编码器。

### 7.2 HealDA：秒级生成初始条件

NVIDIA的HealDA（2026年1月发布）是Earth-2平台的**全球数据同化模型**[citation:41][citation:72]：

- 输入：多源观测数据
- 输出：全球温度、风速、湿度、气压的瞬时快照
- 速度：GPU上数秒完成，超级计算机需要数小时
- 与Earth-2 Medium Range组合，构成"首个完全开放的端到端AI气象流水线"

### 7.3 长窗口4DVar可微分再分析

Hakim et al.（2026, arXiv:2608.11515）做了**开创性实验**[citation:74]：

- 用NeuralGCM作为可微分天气预报模型
- 在2–7天的重叠窗口上做长窗口4DVar
- 省略传统的背景误差项（无模型误差假设）
- 结果：4天窗口的分析误差比20CRv3（用集合Kalman滤波同化相同观测）**小55%**

**意义**：这证明了"可微分AI天气预报模型+自动微分"可以彻底简化再分析系统，不再需要手工推导伴随模式。

### 7.4 ECMWF的机器学习背景误差协方差

ECMWF技术备忘录936（Pan et al., 2026）提出用**条件生成模型**从5成员集合模拟50成员EDA的背景误差方差场[citation:81]：

- 训练：映射5成员集合方差 → 50成员EDA方差
- 部署：在混合Ensemble-4DVar系统中替代昂贵的全集合协方差估计
- 结果：用极少集合大小复现了全集合的分析影响

---

## 八、极端天气AI预测

极端天气是AI气象模型的"高考"——也是当前最薄弱的环节[citation:63]。

### 8.1 台风路径预报的中国方案

中国在台风AI预报上已形成**全球领先的"4+1"格局**[citation:60]：

| 模型 | 机构 | 核心路线 | 关键数据 |
|---|---|---|---|
| **风乌GHR** | 上海AI实验室 | 纯数据驱动，单GPU 30秒10天全球预报 | 有效预报11.25天，全球首个突破10天的中期AI模型 |
| **伏羲** | 复旦/上智院 | 级联Transformer + 自动微分 | 台风集合路径误差降16.5%，强度误差降59.7% |
| **海司** | 上海台风研究所 | 物理模式+AI深度融合 | 26个台风24h路径误差85km，比国际水平低12% |
| **盘古** | 华为 | 3D Transformer + 层次化聚合 | 香港天文台台风路径误差<50km业务化 |
| **AI-TRANS** | 中国气象科学研究院 | AI全球背景场+区域高分辨率 | 台风Maysak 24h路径误差73km，强度误差2.9m/s |

**AI-TRANS的三重突破**（2026年升级版）[citation:71]：
1. **理念上**：用AI模型提供大尺度环流背景场，识别台风生成和发展的环境前兆
2. **方法上**：省去传统"全球→区域"级联链，AI模型直接从单个分析场生成侧边界和初始条件
3. **技术上**：初始场质量大幅提升，精确捕捉快速增强、结构突变和路径微调

**实战数据**（2026年台风季）[citation:71]：
- 台风Maysak：24h路径误差73km，强度MAE 2.9m/s；72h路径误差75km
- 台风Bavi：24h路径误差低至44km，120h长时效路径误差仅160km

### 8.2 WeatherNext Cyclones：飓风预报新标杆

Google DeepMind的WeatherNext Cyclones（2026年8月发布）[citation:79]：

- 比主要预报模型平均多提供**1天有效预报信息**
- 路径、强度、风结构的预报精度达到state-of-the-art
- 2025年飓风季：对Jamaica登陆的Hurricane Melissa提前预测增强和登陆
- 为每个发展中的热带气旋预报1000种不同情景
- 已开源：WeatherNext 2 + WeatherNext Cyclones

### 8.3 极端事件的评估困境与加权CRPS

传统的均方误差（MSE）对极端事件极不友好——一个完美的热带气旋预报可能被海量"平静网格点"的平均误差淹没[citation:18]。

**加权潜在CRPS（Weighted Potential CRPS）**（arXiv:2606.21170）[citation:58]：
- 用保序分布回归（IDR/EasyUQ）对确定性AI模型输出做统计后处理
- 在CRPS上施加权重，聚焦于极端结果（如超过历史阈值的事件）
- 结论：**FuXi在极端天气预报信息量上最为突出**，AI模型有潜力全面超越NWP

---

## 九、PINN在气象中的应用

物理信息神经网络（PINN）将控制方程作为软约束嵌入损失函数，在气象领域找到了独特的应用场景。

### 9.1 HW-OPINN：海洋热浪预测

海洋热浪（Marine Heatwave, MHW）是气候变化的尖锐信号，但传统数值模式计算成本高且误差累积[citation:3]。

**HW-OPINN三重创新**（Remote Sens. 2026, 18(5), 723）：

1. **Boltzmann分布自适应采样**：根据历史损失模式，动态将配置点分配到高梯度区域
2. **残差自适应权重更新**：训练过程中自动调节物理约束在不同空间区域的贡献
3. **贝叶斯超参数优化**：用高斯过程代理模型平衡物理约束与数据拟合

**性能数据**（地中海验证）[citation:3]：
- 测试MSE：0.009138（比ConvLSTM基线改善43.9%，比标准PINN改善44.8%）
- RMSE：0.0956°C
- 事件频率MAE：0.822次/年
- 平均持续时间MAE：3.999天

### 9.2 温室气候状态重建

Biswas et al.（2026, arXiv:2605.02524）提出**耦合PINN**用于温室温湿度重建[citation:7]：

- 将能量平衡和水分平衡方程嵌入神经网络
- 在稀疏传感器测量下同时重建温度和相对湿度
- 插值验证：温度RMSE 0.4495°C，R² 0.9636
- 同时识别物理可解释的参数（如热传导系数、蒸散率）

### 9.3 PINN气候-政策系统

Adel（2026, Int. J. Dynamics Control）用PINN求解**四状态气候-政策动力学模型**[citation:11]：

- 状态变量：大气温度、海洋热含量、CO₂浓度、政策压力变量
- 政策机制：当温度超过阈值时激活减排反馈
- 无需任何观测/合成数据，纯从方程约束学习轨迹
- 结果与ode45高精度数值解高度一致

---

## 十、多模态融合与AI智能体

### 10.1 "风和"：千亿参数气象大语言模型

2026年7月17日，中国气象局在WAIC气象专会上发布**"风和"**——全球首个千亿参数级开源气象大语言模型[citation:29][citation:33]。

**核心能力**：
- 基于地球系统数据资源基座
- 训练5000万tokens高质量气象服务语料
- 已完成生成式AI备案
- 提供中英文智能问答、天气查询、风险评估

**全球开源计划**[citation:37]：
- 已在GitHub、Hugging Face、ModelScope开放完整模型权重
- 同步开放标准化API、云服务和定制化部署方案
- 深度融入联合国"全民早期预警"倡议
- 国际版已上线，融入"妈祖"智能预警方案

### 10.2 "妈祖"：全球智能预警方案

"妈祖"（MAZU）是全球首个响应联合国"全民早期预警"倡议的国家级行动方案[citation:16][citation:52]。

**技术栈**：
- 整合风云气象卫星多源观测数据
- 搭载"风雷""风清""风顺""风和"等系列AI模型
- 覆盖交通、能源、农业、低空经济等场景

**妈祖吉布提2.0**（2026年7月交付）[citation:16]：
- 空间分辨率从9km精细至3km
- 预报时效3天，更新频次6小时
- 覆盖"天—空—地—模—芯—端"全链条
- 已有40多国气象部门通过云端使用，7国定制落地

### 10.3 Earthlink：自主科学发现智能体

南京信息工程大学罗京佳团队提出的**AI智能体理念**[citation:44][citation:51]：

- Earthlink能自主设计和运行实验
- 生成和验证假设
- 从多源数据中学习动力学规律
- 对CMIP6模式模拟的亚洲月降水季节循环进行自动评估

**愿景**：AI不仅是"预测工具"，更是从"自主发现者"——标志着从"工具赋能"到"智能体驱动科学发现"的范式变革。

---

## 十一、评估基准的演进

### 11.1 WeatherBench 2与StationBench

**WeatherBench 2**（Rasp et al., 2023–2026）是当前AI气象模型的**事实标准基准**[citation:54][citation:62]：

- 公开可用的云优化数据集（Zarr格式）
- 开源评估代码（基于Xarray-Beam）
- 持续更新的在线排行榜
- 评估指标：RMSE、ACC、Bias、空间活动度

**2026年WeatherBench 2部分排名**（T850 RMSE @ day 10, 越低越好）[citation:54]：

| 排名 | 模型 | T850 RMSE @ day 10 |
|---|---|---|
| 1 | UNFGN (oper.) | 2.60 |
| 2 | UN Tianji | 2.67 |
| 3 | GenCast (oper.) | 2.69 |
| 4 | IFS ENS | 2.76 |
| 5 | Aurora (oper.) | 2.98 |
| 6 | GraphCast | 3.36 |
| 7 | Pangu-Weather | 3.57 |

**StationBench**（Jua AI）[citation:50]：
- 10,000+真实地面站验证（无后处理、无站点微调）
- 更严格的标准：模型必须泛化到未见过的观测位置
- EPT-2在欧洲风速和温度上全面领先

### 11.2 RealBench：面向业务现实的评测

RealBench（Li et al., 2026, arXiv:2605.24945）揭示了**"刷分"与"实战"的鸿沟**[citation:85][citation:89]：

**核心设计**：
- 严格OOD测试集：2025年全年（杜绝数据泄露）
- 多源验证：ECMWF业务分析（±3h 4DVar）+ 11,539个WEATHER-10K站点
- 极端事件专用指标：热浪/寒潮/台风的对象化CSI、POD、FAR

**关键发现**：
- AI模型在站点观测上的RMSE比ERA5评估高0.3–0.5 K
- 热浪CSI从day 1的0.513降至day 10的0.215
- AI模型系统性高估台风强度
- 不同模型评测结果高度依赖评测数据集——"在你的数据上验证"是不可省略的步骤

### 11.3 AI-MIP：气候模型的"CMIP时刻"

罗京佳团队（NSR, 2026）提出**AI模型比较计划（AI-MIP）**[citation:44][citation:51]：

- 类比传统气候领域的CMIP（Coupled Model Intercomparison Project）
- 标准化数据集 + 明确定义的任务目标 + 严格评估协议
- 覆盖从短临预报到气候预估的全尺度评测
- 纳入物理一致性、极端事件捕捉等核心指标

---

## 十二、可解释性：打开气象AI的黑箱

气象AI的"黑箱"问题不只是学术争议——它直接影响**科学信任和决策可靠性**[citation:55]。

### 12.1 梯度归因与WassersteinGrad

Essafouri et al.（2026, arXiv:2604.22580）提出**WassersteinGrad**[citation:91]：

- 问题：对动态物理场做扰动时，归因图不是"幅度噪声"而是"几何位移"
- 逐点平均会模糊这些空间错位的特��
- 解法：用**熵正则化Wasserstein重心**提取扰动归因图的几何共识
- 在区域气象数据和气象学家验证的神经网络上验证有效

### 12.2 KAN-SAE：非线性稀疏自编码器

Cheon（2026, arXiv:2605.17493）提出**KAN-SAE**[citation:87]：

- 传统SAE假设严格线性特征叠加——不适合高度非线性的大气动力学
- KAN-SAE用Kolmogorov-Arnold网络的B样条激活替代ReLU
- 在Sonny模型上发现975个活跃特征（线性基线仅566个，提升72%）
- 无监督发现了西欧热浪特征+西太平洋台风追踪特征
- 经因果引导实验验证

### 12.3 Craig et al.（2026）：AI天气模型的"潜空间物理学"

arXiv:2605论文提出大胆假设[citation:83]：

- 确定性AI天气模型可能实现了**潜空间粒子描述**和**向学习自由能泛函的梯度流**
- 证据：GraphCast变体间CKA > 0.94，GraphCast-Aurora CKA > 0.73
- GraphCast和Aurora的处理器层从大空间尺度逐步移动到小空间尺度
- **注意**：作者明确将此定位为"假设"而非"推导"

---

## 十三、十种方法横评

下表对10种主流AI气象方法在9个维度上进行星级评估（★越多越好）：

| 方法 | 预报精度 | 推理速度 | 概率输出 | 极端天气 | 物理一致 | 可解释 | 开源程度 | 业务部署 | 计算成本 |
|---|---|---|---|---|---|---|---|---|---|
| **GraphCast** | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★☆ |
| **Pangu-Weather** | ★★★★★ | ★★★★★ | ★☆☆☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | ★★★★★ |
| **FuXi** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ |
| **Aurora** | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ |
| **GenCast** | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ |
| **NeuralGCM** | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| **FourCastNet** | ★★★☆☆ | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★★★ | ★★★☆☆ | ★★★★★ |
| **AIFS** | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| **CorrDiff** | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **StormCast** | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ |

---

## 十四、按场景选型指南

| 场景 | 首选方案 | 备选方案 | 关键理由 |
|---|---|---|---|
| 全球中期确定性预报（3–7天） | Pangu-Weather / GraphCast | FuXi / Aurora | 速度最快或精度最高 |
| 概率预报与不确定性量化 | GenCast / EPT-2e | AIFS ENS | 扩散模型/集合天生适合 |
| 台风/飓风路径与强度 | FuXi-CNOPs / WeatherNext Cyclones | AI-TRANS / GraphCast | 集合+快速增强捕捉 |
| 短临预报（0–6小时） | StormScope / NowcastNet | FuXi-Nowcast | 公里级对流模拟 |
| 高分辨率降尺度 | CorrDiff / Apeliotes | IPSL-AID | 扩散模型重建精细结构 |
| 次季节预测（15–60天） | 风顺 / NeuralGCM | FuXi-Long | 气候态+AI长程建模 |
| 气候模拟与长期投影 | NeuralGCM / ClimaX | PseudospectralNet | 物理约束保证长期稳定 |
| 能源气象（风电/光伏） | EPT-2 / Aurora | Pangu-Weather | 100m风速+SSRD原生输出 |
| 区域高分辨率（地形复杂） | 可变分辨率STGNN | FuXi + 区域微调 | 非均匀网格适配地形 |
| 气象服务与公众沟通 | "风和"LLM | "妈祖"工具箱 | 自然语言交互+预警 |
| 数据同化与初始场 | XiChen / HealDA | 长窗口4DVar | 可微分+秒级生成 |
| 极端事件研究 | GenCast + 加权CRPS | FuXi-Extreme | 概率覆盖+极端指标 |

---

## 十五、未来方向与挑战

### 15.1 技术前沿

1. **物理约束的硬嵌入**：将质量守恒、能量守恒作为硬约束（而非软惩罚）写入网络架构，从根本上杜绝"非物理预报"[citation:57]。

2. **可微分端到端系统**：从卫星原始观测→同化→预报→决策建议的全链路可微分，用自动微分替代手工伴随模式[citation:74]。

3. **多圈层耦合**：当前模型大多只做"大气-only"。加入海洋、陆面、海冰、碳循环的耦合反馈是下一个十年[citation:57][citation:80]。

4. **视频生成式地球模拟**：NVIDIA Earth-2的愿景——用生成式AI做"迷你地球"模拟，可嵌入游戏引擎和教育可视化[citation:76]。

### 15.2 治理与伦理

- **UNFCCC《AI透明气候建模》协议**（2026年4月草案）：建议建立开源模型库、标准化元数据、定期独立审计[citation:59]
- **数据出处与偏差**：卫星传感器漂移、云层遮挡、轨道衰减都可能影响模型输出[citation:59]
- **计算资源极化**：训练SOTA模型需要数百万GPU小时，可能加剧"气象AI鸿沟"[citation:36]

### 15.3 六条待解挑战

1. 极端天气的频率和强度系统性低估
2. 长期气候模拟中的"漂移"问题
3. 训练数据分辨率的"天花板"（0.25°≈28km无法解析台风眼墙）
4. 不同AI模型"互相证明"而非"独立验证"的风险
5. 可解释性与决策信任的鸿沟
6. 全球南方国家的技术可及性

---

## FAQ

**Q1：AI气象模型会取代传统数值预报吗？**

短期内不会完全取代。当前最佳实践是"AI+NWP并行"——AI提供速度和经济性，NWP提供物理可解释性和极端事件的可信度。NOAA 2025年12月部署的AI全球预报系统就是"传统物理模型与AI混合集合"，表现优于两者单独使用[citation:40]。

**Q2：为什么ERA5不是完美的训练数据？**

ERA5本身是用2016年版IFS（Cycle 41r2）做4DVar同化生成的。它有三类问题：①同化窗口12小时导致"未来信息泄露"；②降水等变量与雨量计实测差异大；③极区和高层大气约束较弱[citation:86]。

**Q3：AI模型能预测"百年一遇"的极端天气吗？**

这是当前最大的挑战。极端事件在训练数据中天然稀缺，模型倾向于预测"平均态"。改进方向包括：扩散模型的概率覆盖、极端加权的损失函数、物理约束的硬嵌入，以及更大规模的训练数据[citation:63][citation:58]。

**Q4：中国AI气象模型的国际地位如何？**

在台风路径预报精度上，中国已处于国际领先。风乌GHR、伏羲、盘古、海司等自主模型形成"4+1"格局。华为盘古2.0的大气-海洋-污染全耦合是全球首创。"妈祖"方案已在7国定制落地、40多国云端使用[citation:52][citation:60]。

**Q5：一个普通开发者能跑AI气象模型吗？**

完全可以。GraphCast、GenCast/WeatherNext、Aurora、FourCastNet、ClimaX、CorrDiff均已开源。NVIDIA Earth-2模型通过Hugging Face和GitHub提供。单张消费级GPU即可运行推理[citation:41][citation:68]。

---

## 参考文献

[1] Pathak, J. et al. "FourCastNet: A Global Data-driven High-resolution Weather Model using Adaptive Fourier Neural Operators." *arXiv:2202.11214* (2022).

[2] Bi, K. et al. "Pangu-Weather: A 3D High-resolution Model for Fast and Accurate Global Weather Forecast." *Nature* 619, 533–538 (2023).

[3] Lam, R. et al. "GraphCast: Learning Skillful Medium-range Global Weather Forecasting." *Science* 382, 6677 (2023).

[4] Chen, L. et al. "FuXi: A Cascade Transformer-based AI Model for 15-day Global Weather Forecast." *arXiv:2306.12873* (2023).

[5] Price, I. et al. "GenCast: Diffusion-based Ensemble Forecasting for Medium-range Weather." *Nature* (2024).

[6] Bodnar, C. et al. "A Foundation Model for the Earth System." *Nature* (2025). https://doi.org/10.1038/s41586-025-09005-y

[7] Nguyen, T. et al. "ClimaX: A Foundation Model for Weather and Climate." *arXiv:2301.10343* (2023).

[8] Kochkov, D. et al. "Neural General Circulation Models for Weather and Climate." *Nature* (2023/2025).

[9] Zhang, G. et al. "Advancing Seasonal Prediction of Tropical Cyclone Activity with a Hybrid AI-Physics Climate Model." *Environ. Res. Lett.* 20 (2025). https://doi.org/10.1088/1748-9326/adf864

[10] Hakim, G.J. et al. "Long-window 4DVar for Reanalysis Using a Differentiable Weather Model." *arXiv:2608.11515* (2026).

[11] Wang, W. et al. "XiChen: A Global Weather Observation-to-Forecast ML System via 4DVar Gradient-Guided Flexible Assimilation." *arXiv:2507.09202* (2026).

[12] Pan, W. et al. "Data-Driven Emulation of Background-Error Variance in Variational Data Assimilation." *ECMWF Tech. Memo. 936* (2026).

[13] Pappenberger, F. et al. "Significant Update to ECMWF's IFS Cycle 50r1 and AIFS v2 Goes Live." *ECMWF News* (2026).

[14] Mardani, M. et al. "CorrDiff: Corrective Diffusion for Kilometer-scale Weather Forecasting." *NVIDIA Research* (2024–2025).

[15] Pathak, J. et al. "StormCast: Kilometer-Scale Convection Allowing Model Emulation using Generative Diffusion Modeling." *Science Advances* (2026).

[16] Frastali, E.R. et al. "Apeliotes: A Diffusion-Based Modeling Framework for km-scale Multi-Level Atmospheric Fields." *arXiv:2607.17037* (2026).

[17] Kishanthan, K. et al. "IPSL-AID: Generative Diffusion Models for Climate Downscaling from Global to Regional Scales." *arXiv:2604.03275* (2026).

[18] "Diffusion Models for Cloud Nowcasting (0–3h)."
*Artificial Intelligence for the Earth Systems* 5(3) (2026). https://doi.org/10.1175/AIES-D-25-0046.1

[19] Li, R. et al. "RealBench: Benchmarking Data-Driven Numerical Weather Forecasting Under Operational Conditions and Extreme Event Challenges." *arXiv:2605.24945* (2026).

[20] "Towards Fair Comparisons of AI- and Physics-Based Weather Models for Extreme Events via the Weighted Potential CRPS." *arXiv:2606.21170* (2026).

[21] Gelbrecht, M. et al. "PseudospectralNet: Toward Hybrid Atmospheric Models for Climate Simulations." *J. Adv. Modeling Earth Systems* 17(10) (2025). https://doi.org/10.1029/2025MS004969

[22] Heuer, H. et al. "Beyond the Training Data: Confidence-Guided Mixing of Parameterizations in a Hybrid AI-Climate Model." *arXiv:2510.08107* (2025/2026).

[23] Chen, Z. et al. "Hierarchical Testing of a Hybrid Machine Learning-Physics Global Atmosphere Model." *AGU Advances* 7 (2026). https://doi.org/10.1029/2025AV002075

[24] Yu, Y. et al. "Scaling Laws of Global Weather Models." *ICML 2026*. https://openreview.net/

[25] Zou, X. "Traditional Data Assimilation and Its Effective Integration with Meteorological Deep Learning." *Engineering* (2025). https://doi.org/10.1016/j.eng.2025.11.023

[26] NVIDIA. "Earth-2 Open Models Span the Whole Weather Stack." (2026). https://research.nvidia.com/

[27] "WeatherBench 2: A Benchmark for the Next Generation of Data-Driven Global Weather Models." *Google Research* (2023–2026). https://github.com/google-research/weatherbench2

[28] "EPT-2: Earth Physics Transformer for Energy-critical Weather Variables." *Jua AI* (2026). arXiv:2507.09703

[29] Cheon, M. "Beyond Linear Superposition: Discovering Climate Features in AI Weather Models with KAN-SAE." *arXiv:2605.17493* (2026).

[30] Essafouri, Y. et al. "WassersteinGrad: Explanation of Dynamic Physical Field Predictions." *arXiv:2604.22580* (2026).

[31] Biswas, S. et al. "A Coupled Physics-Informed Neural Network for Greenhouse Climate State Reconstruction." *arXiv:2605.02524* (2026).

[32] Adel, W. "Physics-informed Neural Network Simulation of a Nonlinear Climate-Policy System." *Int. J. Dynamics Control* 14, 118 (2026).

[33] Wu, Z. "Spatiotemporal Weather Forecasting via Multi-scale Graph Neural Networks and Latent Diffusion Models." *PLoS ONE* 21(6), e0348354 (2026).

[34] Li, D. et al. "A Variable-resolution Unstructured Spatio-Temporal Graph Neural Network for Very Short-Range Weather Forecasting in Guangdong." *Geoscience Letters* 13, 11 (2026).

[35] Su, Y. et al. "Mixed-Order Relation Learning Spatio-Temporal Graph Neural Network for Weather Forecasting." *Expert Systems with Applications* 300 (2026).

[36] Miralles, O. et al. "Observation-Guided Interpolation Using Graph Neural Networks for High-Resolution Operational Nowcasting in Switzerland." *Artificial Intelligence for the Earth Systems* (2026).

[37] "HW-OPINN: A Heat Wave-Optimized Physics-Informed Neural Network for Marine Heatwave Prediction." *Remote Sens.* 18(5), 723 (2026).

[38] "Fenghe Global Open-Source Initiative." *China Meteorological Administration* (2026). https://www.cma.gov.cn/

[39] "AI-TRANS Upgraded Typhoon Forecasting System." *Chinese Academy of Meteorological Sciences* (2026).

[40] "MAZU Global Early Warning Initiative." *World Meteorological Organization* (2026).

[41] "Google DeepMind WeatherNext Cyclones." (2026). https://deepmind.google/blog/weathernext

[42] "NVIDIA Earth-2 Nowcasting with StormScope." (2026). https://research.nvidia.com/

[43] "AIFS Cycle 50r1 and AIFS v2 Live." *ECMWF* (2026). https://www.ecmwf.int/

[44] Luo, J. et al. "AI for Atmosphere-Ocean Sciences: Advancements, Challenges, and Ways Forward." *National Science Review* (2026).

[45] "AI Meteorological Model Performance Evaluation." *ControlRun / 气象要闻* (2026).

[46] Hersbach, H. et al. "The ERA5 Global Reanalysis." *Quarterly J. Royal Meteorological Society* (2020).

[47] Rasp, S. et al. "WeatherBench 2: A Benchmark for the Next Generation of Data-Driven Global Weather Models." *AGU JAMES* (2023).

[48] "A Foundation Model for the Earth System (Aurora)." *Nature* (2025). https://doi.org/10.1038/s41586-025-09005-y

[49] "FuXi Weather: End-to-End Data Assimilation and Forecasting." *MindSpore Earth / arXiv* (2024–2026).

[50] "EPT-2 vs Aurora vs GraphCast vs Pangu-Weather Benchmarks." *Jua AI* (2026).

[51] "RealBench: Operational Evaluation of AI Weather Models." *EmergentMind* (2026).

[52] "气象大模型全景梳理." *梅林空间 / 中国气象局* (2026).

[53] "伏羲气象大模型入选中国十大气象科技进展." *复旦大学 / 澎湃新闻* (2026).

[54] "台风巴威来袭：AI如何预测台风." *人工智能技术前沿* (2026).

[55] "AI杀进天气与气候建模." *36氪* (2026).

[56] "AI-TRANS台风预报系统升级." *中国气象局* (2026).

[57] "NeuralGCM: Hybrid Differentiable GCM Evaluation." *EmergentMind* (2026).

[58] "Google NeuralGCM Precipitation Forecasting Breakthrough." *Science Advances* (2026).

[59] "AI Climate Models:辅助工具而非万能灵药." *tsight.io* (2026).

[60] "风乌、伏羲、盘古——AI气象大模型的江浙沪卡位战." *江浙沪创投社* (2026).

[61] "扶摇AI气象预报模型亮相." *上海科学智能研究院* (2026).

[62] "GraphCast Explained: Google's Weather AI." *SciRouter* (2026).

[63] "Aurora vs GraphCast vs Pangu-Weather: 2026 AI Weather Benchmark." *SciRouter* (2026).

[64] "Foundation Models for Climate Science 2026: The Landscape." *SciRouter* (2026).

[65] "Scaling Laws of Global Weather Models." *Lacuna / ICML 2026*.

[66] "AI天气预报刷分时代终结? RealBench重新定义评估标准." *气象学家* (2026).

[67] "广东省2026年汛期气象服务新技术新产品." *广州日报* (2026).

[68] "NVIDIA Earth-2 Open Models on Hugging Face." (2026).

[69] "Google DeepMind Hurricane Forecast Models Achieve Record Performance." (2025–2026).

[70] "Earth-2 Nowcasting StormScope Technical Details." *NVIDIA Research* (2026).

---

*本文档最后更新于2026年8月17日。由于AI气象领域发展极快，部分数据可能在数月内被新成果超越。建议以各模型官方技术报告和同行评审论文为准。*
