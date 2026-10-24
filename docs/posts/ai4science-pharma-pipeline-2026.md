---
title: "AI4Science 制药 2026：从蛋白结构到 Phase 3 的十年路径走到哪了"
description: 'AlphaFold 3 让"预测蛋白结构"从难题变成日常。但结构 ≠ 药物。这篇文章把 2026 年 10 月的 AI 制药公司管线、蛋白结构模型、抗体设计模型、生物医学 LLM 评测放在一起，用一条清晰的时间线回答"AI 制药到底走到哪了"。'
date: 2026-10-24
categories: [前沿观察, 行业分析]
tags: [AI4Science, AI 制药, AlphaFold, 蛋白设计, 抗体设计, Isomorphic, Insilico, Recursion, Xaira, 深势, 晶泰]
enKeywords: "AI4Science, AI drug discovery, AlphaFold 3, protein design, antibody design, Isomorphic Labs, Insilico Medicine, Recursion, Xaira, XtalPi, DeepModeling"
author: 蓝月亮
---

AI 制药是过去三年最热、也是过去三年最"故事性叙事"的领域之一。它热的原因很简单——AlphaFold 2 让"预测蛋白结构"这个难题在 2020 年被解开，人们自然希望"预测蛋白质结构"能一路推到"设计出新药"。它故事性强的原因也很简单——**结构 ≠ 药物**，中间还隔着靶点验证、结合亲和力、毒性、可制造性、临床效果一整套硬骨头。

我把 2026 年 10 月的 AI 制药管线、蛋白模型、LLM 评测放到一起，用"结构预测 → 蛋白设计 → 靶点验证 → 临床候选 → 临床读出"这条时间线，看看 AI 制药到底走到哪了。

> **数据诚实声明**：本文引用的临床数据均来自公司官方披露（IR、SEC 10-Q、ClinicalTrials.gov 注册号），蛋白/抗体模型数据来自 Nature/Science/bioRxiv 论文或公司官方发布。市场规模数据来自多家咨询机构，口径差异较大（2026 年市场规模从 $2.9B 到 $5.09B 不等），全部保留。BCG 2024 分析与 Insilico Nat Med 2025 原文均指出"AI 药 Phase 2 成功率与传统药无显著差异"，这一"负面事实"是本文的锚点之一。

## 时间线：从结构预测到 Phase 3

**结构预测（2020-2024）**：AlphaFold 2（2020）→ 开源、免费、覆盖 2 亿结构；AlphaFold 3（2024-05，Nature）→ 支持蛋白-配体、蛋白-核酸、抗体-抗原、离子、修饰残基。Protenix v1（字节，2025-01）Apache 2.0 开源。SeedFold（字节 Anew，2025-12）揭示 scaling law：宽度优于深度、线性三角注意力。Boltz-1/2（深势科技，2024-2025）Apache 2.0 开源，Boltz-2 首次支持结合亲和力预测。

**结论**：**"预测蛋白结构"这个任务，2024 年基本结束**。开源社区已经能追平 AlphaFold 3，字节 SeedFold 已经在部分 FoldBench 上超越。

**蛋白设计 / 抗体生成（2024-2026）**：RFdiffusion2（Baker Lab，Nat Methods 2025-12）→ 原子级活性位点支架，41/41 靶点（前代 16/41）；RFdiffusion3（Science 2026，10.1126/science.aeh2982）→ 计算量降 10 倍；Chai-2（bioRxiv 10.1101/2025.07.05.663018）→ 16% de novo 抗体命中率、50% 靶点成功、20 样本/靶点、**100 倍于前代 <0.1%**；Chai-2 mAb（2025-11-19）→ 86% drug-like IgG、首个 GPCR AI 结合剂、pMHC；RFD4-Proteina（IPD + NVIDIA，2026-10-21）→ 5-10× 设计成功率、BSD-3 完全开源。

**结论**：**"设计能结合的抗体"这个任务，2026 年进入可验证阶段**。Chai-2 的 16% de novo 命中率和 100 倍前代提升，是这个任务"从学术问题变成工程问题"的转折点。

**靶点验证 / 临床候选（2024-2026）**：这是 AI 制药真正的分水岭，也是过去两年最混乱的地方。

| 公司 | 核心资产 | 阶段 | 2026 年最新节点 |
| --- | --- | --- | --- |
| Insilico Medicine | Rentosertib (ISM001-055) | **Phase 3** | Nat Med 2025 显示 Phase 2a FVC +98.4mL vs -20.3；NCT07687459 Phase 3 于 2026-07-07 注册，320 例，Est. start 2026-08-30 |
| Isomorphic Labs | IsoDDE（Diffusion DDE，Nature 2025-02） | 无临床候选披露 | Series B $2.1B（2026-05）；Lilly $1.75B、Novartis $2B+、Exelixis；Hassabis "clinical trials by end of 2026"（已推迟） |
| Recursion | REC-4881 (MEK1/2)、REC-617、REC-7735 | Phase 2 / Phase 2 / IND 待批 | Q2 2026 REC-4881 FAP 息肉负担 -43~53%；REC-7735 >100× 突变选择性，H2 2026 递交 IND；现金 opex <$375M |
| Generate Biomedicines | **GB-0895** (抗 TSLP, golukibart) | **Phase 3** | SOLAIRIA-1/2 全球 42 国计划、33 国获批、~1600 例、52 周；GB-4362 Phase 1 首例给药（MMAE 中和剂）；现金 $457.4M |
| Xaira Therapeutics | XA-1（onco 抗体）、XA-4（难治 GPCR） | 首个 AI 抗体管线 | 2026-10-02 X-Design Vega：182 VHH de novo → 18 结合体（10%）→ **7 周到 lead**；XA-4 首个 AI 打到"undruggable" GPCR |
| Relay Therapeutics | RLY-2608 (CD3×CD19) | Phase 3 ReDiscover-2 | 2025-05 IPO (NASDAQ: RLAY) |
| Absci | ABS-101 (IL-23) | Phase 1 IBD | 首个 AI-designed 生物药 Phase 1 |
| Schrödinger | SGR-1505 (LYNK0102) | Phase 2a/2b 淋巴瘤 | **22% ORR 淋巴瘤**；SGR-2921 因两例死亡 2025-08 停用 |

**结论**：**2026 年首次有 AI-first 药物进入 Phase 3 阶段**（Rentosertib NCT07687459、GB-0895 SOLAIRIA-1/2）。**但 Phase 2 成功率问题没有解决**——BCG 2024 分析指出"AI 分子 Phase 1 成功率 80-90%，Phase 2 成功率约 40%，与传统无显著差异"。Insilico Nat Med 2025 原文在展示 Rentosertib 正面结果的同时，也承认"尚无 AI 药进入 Phase 3 完成读出"。

**中国 AI 制药**：

| 公司 | 核心资产 | 融资 / 上市 | 2026 节点 |
| --- | --- | --- | --- |
| XtalPi 晶泰科技 | DoveTree 合作，>20 项目 PCC | 港股 02847 | DoveTree 合作 upfront $51M + 里程碑 $5.99B；2026-05-29 第 2 期款 $19M；2026-H1 收入 RMB 394M（-24%）、研发 RMB 368M（+66%）、现金 RMB 8,671M |
| DeepModeling 深势科技 | Boltz-1/2、Uni-Lab-OS 1.0、DPA4、RiDYMO® | C 轮 >RMB 8 亿（2025-12-24，估值 RMB 26 亿） | DPA4 登顶 **Matbench Discovery（2026-05）**，材料侧 AI |

## 生物医学 LLM 的评测

大模型对生医领域的影响在 2026 年也进入可评测阶段：

| 模型 | MedQA | GPQA Diamond | SWE-bench Verified | 其他关键 |
| --- | --- | --- | --- | --- |
| GPT-5.1（2025-11-13） | **96.2%** | 88.1% | 76.3% | 24h 扩展缓存 |
| Gemini 3 Pro（2025-11-18） | 94.6% | – | – | MIR 2026 Flash 199/200 |
| Claude Opus 4.5（2025-11-24） | – | 87.0% | 80.9% | Terminal-Bench 2.0 59.3%、ASL-3、200K context |
| Claude Sonnet 4.5（2025-09-30） | 91.4% | – | – | Protocol QA 0.83 vs 人类 0.79；OSWorld 61.4% |

**评测体系在扩展**：LiveMedBench（2756 例跨 38 科室、周更新防污染，arXiv 2602.10367）、BioMedArena（166 基准 / 75 工具，arXiv 2605.06177）。**BioMysteryBench、MolBench、GPQA Bio 未找到公开完整榜单**——这些领域的评测体系还在建立中。

## 市场规模：口径差异大到不能引用单一数据

| 来源 | 2026 | 2030/2035 | CAGR |
| --- | --- | --- | --- |
| MarketsandMarkets（2026-10-16） | $5.09B | 2031 $17.56B | 28.1% |
| Grand View Research（2026-09-14） | $2.9B | 2033 $13.8B | 24.8% |
| Straits Research | $3.12B | 2034 $25.28B | 29.9% |
| Global Market Insights | $4.0B | 2035 $43.9B | 30.5% |
| Fortune Business Insights | ~$5B | – | – |

**2026 年市场规模从 $2.9B 到 $5.09B 都有权威机构在说，这个差距本身就说明这个市场还没有明确的定义边界**——是"AI 制药平台"、"AI 制药服务"、"AI 制药软件"、还是"AI 制药全栈"，每个机构的统计口径不同。

累计投资：自 2019 年以来约 $60B（IntuitionLabs AI-Discovered Drugs 2026-07-31）；在研 AI 资产（ASCO 2026 分析）117 项 / 63 家公司，Phase 1 完成 60（51.3%）、Phase 2 完成仅 8（6.8%）。

## 关键挑战：一个"AI 药 Phase 2 成功率"的问题

BCG 2024 分析的结论很硬：**AI 分子 Phase 1 成功率 80-90%，但 Phase 2 成功率约 40%，与传统药物无显著差异**。IntuitionLabs 2026 综合分析同样指出，Rentosertib Phase 3 启动（2026-07）是"首个 AI-first 药物进入 Phase 3"——**这个"首个"用了 5 年**。

原因是——**"设计能结合蛋白的分子"和"设计一个能通过临床的药物"之间，隔着 5 个硬挑战**：

**挑战 1：湿实验闭环**。Xaira X-Automate、DeepModeling Uni-Lab-OS 是主流方向，但**多数公司的湿实验周期仍占研发时间的 50%+**。Xaira XA-1 用 7 周到 lead 已属最优情况。

**挑战 2：数据稀缺 + 因果性**。主流药企数据多为相关性；Xaira 强调用"扰动响应"训练模型捕捉因果；Chai 用 20 样本/靶点的自采样克服稀缺。

**挑战 3：靶点验证**。AlphaFold 类模型给结构 ≠ 给可成药性；Xaira X-Cell、Recursion-Roche 40 项合作是核心投资点。

**挑战 4：毒性 / 可制造性**。Schrödinger SGR-2921 因死亡终止、Relay RLY-4008 Phase 2 未及终点，都提示 AI 早期信号不能替代临床毒理。GB-0895 通过可开发性筛选 86% drug-like 是目前公开最好水平。

**挑战 5：临床读出**。2026 年 10 月为止，**尚无 AI-first 药物完成 Phase 3 读出**。Rentosertib Phase 3 结果预计 2028-2029 才有。

## 我的判断

**AI 制药在 2026 年的位置是"结构预测成熟、抗体设计可行、靶点验证可行、Phase 1 有效、Phase 2 未验证、Phase 3 首个启动"**——这是一个非常具体、也非常诚实的位置。它不是"AI 替代传统制药"，而是"AI 让某些阶段变得更快"。

**判断 1：下一个决定性的技术节点是"AI-first 药物 Phase 3 读出"，最早 2028-2029 年**。Rentosertib（2026-07 启动）和 GB-0895（SOLAIRIA-1/2，2025-12 启动）是两个信号。任何一个的 Phase 3 结果，都会重新定义市场对 AI 制药的信心——**如果读出正面，"AI 药 30% 加速"变成常识；如果读出失败，整个行业的估值逻辑要重新审视**。

**判断 2：蛋白设计这条线，2026 年进入工程化阶段**。Chai-2 的 16% de novo 命中率、100 倍于前代提升，RFD4-Proteina 完全开源（BSD-3），意味着**"AI 设计抗体"从"论文"变成"工程"**。这不是终点，而是"AI 设计抗体 + 湿实验验证 + 可开发性筛选"这条流水线的起点。

**判断 3：中国 AI 制药的差异化在"材料 + 计算"**。DeepModeling 深势科技 DPA4 登顶 Matbench Discovery，说明中国在**计算化学 + 材料科学**这条 AI4Science 支线上有独立竞争力。这条支线与药物设计相邻但不重合——它是"计算化学的 AI 化"，而不是"AI 制药本身"。XtalPi 晶泰科技的 DoveTree 合作里程碑 $5.99B，是中国 AI 制药公司**第一个"跨 10 亿美元级"的合作**，也是这个领域"从学术项目到产业合作"的转折点。

**判断 4：生物医学 LLM 的评测体系还在建立中**。MedQA、GPQA、MIR 这些通用医学评测已经开始饱和（GPT-5.1 MedQA 96.2%），LiveMedBench、BioMedArena 这类"周更新防污染"、"多工具多任务"的新评测开始出现。**BioMysteryBench、MolBench、GPQA Bio 这些更专的评测尚无完整公开榜单**——这是学术界的机会窗口。

**判断 5：AI 制药的"叙事"和"事实"之间有一个巨大的差距，这个差距不会消失**。AlphaFold 2 在 2020 年让人们相信"预测结构 = 设计药物"，2026 年的现实是**"预测结构 = 结构"**——这两个词之间隔着 5 个技术挑战，需要 10 年才能验证。任何"AI 制药会颠覆医药行业"的叙事，都需要用"AI 药 Phase 3 读出"这个具体事件去检验，而不是"AI 药 Phase 1 成功率 80-90%"这种早期数据。

**如果你现在做 AI 制药相关的产品或投资，我建议**：

**别只看"AI 设计的药物进临床"，要看"AI 加速了哪个环节"**。AlphaFold 3 加速了结构预测（时间从月降到小时）、Chai-2 加速了抗体设计（100 倍于前代），这些是**可验证、可量化**的加速。**"AI 设计的药物临床有效"是终局指标，需要 3-5 年才能验证**。

**盯住"Phase 2 成功率"这个负面事实**。BCG 2024 分析的结论是"AI 药 Phase 2 成功率约 40%，与传统无差异"——这个数字意味着**AI 在早期发现阶段的优势，到了临床阶段就被吃掉了**。谁能把这个差异打回来，谁才是真正的赢家。

**中国市场看 DeepModeling 和 XtalPi**，**它们代表了两条不同的路径**——一个是"计算化学 + 材料科学"的开源社区路径，一个是"AI 制药 + 传统药企合作"的商业路径。两条路径在 2026 年都跑通了，接下来看谁能跑得更远。

**开源社区的机会窗口是"蛋白设计"**。RFD4-Proteina（BSD-3 完全开源，2026-10-21）和 Boltz-2（结合亲和力预测）让"开源 AI 设计抗体"从"论文复现"变成"工具开箱即用"。这个方向还没有出现"AlphaFold 级别的社区共识"，但已经过了"能不能做"这个门槛。

## 主要参考资料

- Nature AF3 论文 · Abramson et al.（2024-05）
- Isomorphic Labs IsoDDE Nature 2025-02
- Chai-2 bioRxiv 10.1101/2025.07.05.663018、Chai-2 mAb bioRxiv 10.1101/2025.11.29.691346
- RFdiffusion2 Nat Methods 2025-12-03、RFdiffusion3 Science 2026（10.1126/science.aeh2982）
- Protenix bioRxiv 10.1101/2025.01.08.631967、SeedFold arXiv 2512.24354、Boltz-1/2 bioRxiv
- Insilico Medicine Rentosertib Nat Med 2025、NCT07687459 Phase 3 注册（2026-07-07）、Nat Biotechnol 2026-09-07 aging clocks
- Recursion IR Q2 2026、Recursion-Roche-Genentech $216M 已付、40 项 >$300M 各
- Generate Biomedicines Q2 2026 SEC EX-99.1、SOLAIRIA-1/2 2025-12-01 启动、GB-0895 300mg SC q6m
- Xaira Therapeutics X-Design Vega（2026-10-02）、X-Scientist（2026-10-21）
- Schrödinger SGR-1505 Phase 2a/2b 淋巴瘤 22% ORR
- XtalPi 晶泰科技 DoveTree $5.99B 合作、DeepModeling C 轮 RMB 8 亿（2025-12-24）
- IntuitionLabs AI-Discovered Drugs Clinical Trials 2026（2026-07-31）
- OpenAI GPT-5.1（2025-11-13）、Claude for Life Sciences（2025-10-20）、Claude Opus 4.5（2025-11-24）、Claude for Healthcare（2026-01-11）
- LiveMedBench arXiv 2602.10367、BioMedArena arXiv 2605.06177
- MarketsandMarkets（2026-10-16）、Grand View Research（2026-09-14）
- BCG 2024 AI Drug Analysis
