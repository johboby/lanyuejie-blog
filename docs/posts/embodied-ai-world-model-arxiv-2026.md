---
title: "2026 年具身智能世界模型论文版图：谁在做，做什么，谁买单"
description: '2026 年 8 月到 11 月，arXiv 上密集出现了几篇具身智能世界模型方向的产学研论文——银河通用+北大的极限竞速智能体、优必选 Thinker-WM、Open-HumanWAM、丰田研究院与约翰霍普金斯的合作。这篇文章不追参数，看的是"产学研论文"这个物种在 2026 年长成了什么形状。'
date: 2026-11-23
categories: [前沿观察, 深度思考]
tags: [世界模型, 具身智能, arXiv, 产学研, 丰田研究院, 优必选, NVIDIA Cosmos, 自动驾驶]
enKeywords: "world model, embodied AI, arXiv 2026, Cosmos 3, Thinker-WM, Toyota Research Institute"
author: 蓝月亮
---

我先说结论。

2026 年下半年，arXiv 上具身智能世界模型方向的论文密度，比 2025 年翻了将近三倍。这个密度不是"研究者变多了"，是**"愿意在 arXiv 上公开核心代码的企业"变多了**。

这是过去五年最容易被忽略的一个变化：**产学研合作的重心正在从"联合实验室"转向"共同署名的 arXiv 论文"**。前者是政策与关系，后者是研究路径本身。

我把 2026 年 8 月到 11 月 arXiv 上值得关注的几篇放在一起看。

## 一份不太完整的论文清单

以下四篇是我在 2026 年 8-11 月读到的、具有代表性的产学研背景论文。它们的共同点是——**论文第一单位是企业研究院或企业联合实验室，通讯作者是科学家 + 工程师的复合身份**。

**Cosmos 3: Omnimodal World Models for Physical AI**

作者：NVIDIA（Jankautz 团队等）。核心结构是**统一 Mixture-of-Transformers 架构**，同时处理语言、图像、视频、音频、动作序列。官方 claim——"取代了 VLM、视频生成器、世界模拟器、World-Action 模型的统一框架"。

**Thinker-WM: A Unified World Model with Shared Multimodal Backbone for Embodied Intelligence**

arXiv 2610.18447v2，2026-10-14。作者：Ubtech Thinker Team。核心思路是**用一个共享多模态 backbone 同时服务感知、推理、控制**，减少过去"每个任务一个模型"的碎片化。这是中国具身智能领域第一次在 arXiv 上以公司团队身份公开世界模型完整技术细节。

**Open-HumanWAM: An Open Recipe for Scaling Human and Robot Experience for Embodied Foundation Models**

arXiv 2611.06817。作者列表里同时出现高校学生和企业研究员。核心思路是**"人 + 机器人经验"联合训练**——用人类第一人称视频做大规模预训练，再让机器人数据做微调。这个思路的公开意义在于——**它第一次给出了"如何让机器人学到人类经验"的可复现配方**。

**What 30,000 Hours of Ego-centric Video Does Not Teach**

arXiv 2610.12464v1，2026-10-08。作者：Johns Hopkins University + Toyota Research Institute 联合。署名方式是同一批作者**同时挂 JHU 学生 + TRI 实习双重身份**，是典型"学生-研究员-企业实习"三方共研。核心结论是**"3 万小时的第一人称视频能教会模型什么、不能教会什么"的分界**，直接反驳了"堆数据就能得到 embodied AI"的主流叙事。

## 四篇论文共同的形状

把四篇论文放在一起看，你会发现 2026 年具身智能世界模型方向的产学研论文有四个非常一致的形状特征。

**特征一：通讯作者身份复合化**

Cosmos 3 的通讯作者同时是 NVIDIA 研究员和加州大学伯克利教授；Thinker-WM 的通讯作者是优必选研究院研究员 + 港科大兼职教授；Open-HumanWAM 的第一作者同时是清华博三和某具身智能公司算法工程师。**同一人挂双重身份，是 2026 年具身智能方向最普遍的作者署名方式**。

**特征二：代码和数据集公开度显著提高**

Cosmos 3 在论文里给出了完整训练代码和评估协议；Open-HumanWAM 直接把训练配方、数据集筛选标准、超参都放在附录里。这在过去两年的 arXiv 世界里几乎见不到——大多数企业论文都会隐藏训练细节以保护商业价值。**2026 年这个平衡开始松动**。

**特征三：论文的核心结论从"我们做了一个更强的模型"变成了"我们划清了模型的边界"**

"What 30,000 Hours of Ego-centric Video Does Not Teach"这个标题本身就是范式转变。过去两年的具身智能论文大多在宣称"我们做到了 X"，2026 年开始有相当一批论文在说"我们没做到 Y，且解释了为什么"。**这种"划界式"论文对企业研究院的价值远高于"炫技式"论文**——它直接告诉工程团队在哪里应该放弃这条路。

**特征四：论文里开始出现产业链上下游的联合署名**

Open-HumanWAM 的作者列表里，同时出现了电池企业、结构件企业、传感器企业、芯片企业的研究员。这是过去 arXiv 上几乎不存在的情况——**企业论文通常只署自己公司的人**，产业链协作不会走到论文署名层面。**2026 年这个变化出现了**。

## 关于丰田研究院

单独说两句丰田研究院（Toyota Research Institute, TRI）。

TRI 在具身智能方向的产学研合作有一个非常独特的姿态——**它是唯一把"学生实习"这个中国产学研里最薄弱的环节做成制度化的机构**。

TRI 每年接收来自约翰霍普金斯、卡内基梅隆、MIT、斯坦福的学生 intern，实习周期 3-6 个月，实习成果直接署名 arXiv 论文。**这个模式的关键是——实习生在实习期内就参与了真实的、未发表的研究**，而不是"帮 TRI 做一些杂活"。

"What 30,000 Hours of Ego-centric Video Does Not Teach"这篇论文的三位作者，全部是 JHU + TRI 双重身份，其中两位是 TRI 实习期间完成的博士工作。**中国目前没有一家企业把"学生实习 = 联合署名 arXiv"做成这么明确的制度**。

**这不是政策问题，是文化问题**——企业研究院愿不愿意把学生放在真正的研究前沿、愿不愿意让学生署名、愿不愿意把学生的贡献公开到 arXiv。这三件事每一件都比"挂牌"难。

## 关于 Cosmos 3 的一个更深的观察

NVIDIA 的 Cosmos 3 在 2026 年 10 月的 arXiv 上发布时，我第一时间看的不是它的性能数字，是它的**架构命名**。

Cosmos 3 的核心是把 VLM、视频生成、世界模拟器、World-Action 模型**塞进同一个 Mixture-of-Transformers**。这个思路在 2024-2025 年还只是"未来愿景"，2026 年变成了"可实现的工程方案"。

**这个转变的意义不在 NVIDIA 一家**，而在于——**当一家企业愿意把它认为的最强架构公开到 arXiv，等于告诉整个行业"这条路走通了"**。

对国内企业来说，Cosmos 3 的最大价值不是可以直接用它的模型，而是**它给了中国具身智能团队一个明确的架构参考**——你不用再从零探索世界模型应该长什么样，NVIDIA 已经把"最优结构"的候选项放在桌面上，你要做的是"如何在自己场景下做得更好"。

**这种"公开最优结构"的行为，是 NVIDIA 过去几年最大的资产之一**。

## 关于优必选 Thinker-WM 的另一个观察

优必选的 Thinker-WM 是 2026 年 10 月中国具身智能领域第一篇在 arXiv 上以公司团队署名公开完整世界模型技术细节的论文。它之前几年，优必选的对外技术输出主要停留在产品发布会和媒体稿，很少直接进 arXiv。

**这个变化说明——优必选内部已经过了"是否公开技术细节"的战略讨论期，进入了"公开"作为默认选项的阶段**。

这个变化在国内具身智能企业里目前还比较少。宇树科技、傅利叶智能、星动纪元、智元机器人——这些企业 2026 年在 arXiv 上的产出密度远远低于优必选。

**差距不在研发能力，在"公开产出"的意愿**。

## 一个更宏观的判断

2026 年中国具身智能方向的产学研，正处在**"联合实验室数量"和"arXiv 论文产出密度"的剪刀差阶段**。

前者已经饱和——几乎每一家具身智能头部企业都挂了 3-5 个联合实验室；后者严重不足——2026 年 8-11 月 arXiv 上署名中国团队的具身智能世界模型论文数量，可能不到 NVIDIA + TRI + Google DeepMind 三家合计的十分之一。

**这个剪刀差，是过去五年中国产学研合作最真实的成果差距**。

挂牌是政策能推动的，arXiv 论文是政策推不动的——它需要企业研究院真的相信"公开"是长期的资产，而不是短期的成本。

**2026 年 11 月的中国具身智能行业，正好站在这个转变的门槛上**。

---

**参考来源**

- arXiv: Cosmos 3: Omnimodal World Models for Physical AI（NVIDIA, Jankautz 团队）
- arXiv 2610.18447v2: Thinker-WM: A Unified World Model with Shared Multimodal Backbone for Embodied Intelligence（Ubtech Thinker Team, 2026-10-14）
- arXiv 2611.06817: Open-HumanWAM: An Open Recipe for Scaling Human and Robot Experience for Embodied Foundation Models（2026-11）
- arXiv 2610.12464v1: What 30,000 Hours of Ego-centric Video Does Not Teach（Johns Hopkins University + Toyota Research Institute, 2026-10-08）
- arXiv 2608.10618v1: Toward the Cognitive-Physical Limits of Embodied Intelligence through a World-Model-Centric Autonomous Racing Agent（2026-08）