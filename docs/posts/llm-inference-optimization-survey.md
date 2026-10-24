---
title: 大模型推理优化技术综述：从量化到端侧部署的完整图谱
enTitle: A Survey of LLM Inference Optimization: From Quantization to Edge Deployment
description: 大模型推理正在成为 AI 产业的核心瓶颈。2026 年的前沿进展集中在三条主线上：阶段感知量化（prefill 和 decode 解耦）、推理电路保护压缩、以及端侧弹性推理。这篇文章梳理了关键技术脉络和代表性论文，给出一个可落地的技术决策框架。
enDescription: LLM inference has become the core bottleneck of the AI industry. The 2026 frontier progress concentrates on three main lines: phase-aware quantization (decoupling prefill and decode), reasoning-circuit protection compression, and edge elastic inference. This article maps out the key technical trajectories and representative papers, and provides a practical decision framework.
date: 2026-10-24
category: 技术原理
tags: [推理优化, 量化, 端侧AI, 大模型, LLM, 智能体, 推理引擎, 部署]
author: 蓝月亮
---

大模型推理正在从"能用"走向"好用"，这个过程中，推理优化技术是整个行业最活跃的研究方向之一。2026 年这一方向的进展，可以用一句话概括：从"一刀切"的全局压缩，走向"分阶段、分电路、分场景"的精细化优化。

这篇文章梳理了当前最值得关注的几条技术主线，并给出一个工程选型时的判断框架。

## 主线一：阶段感知量化（Phase-Aware Quantization）

这是 2026 年最实用的一个发现。核心洞察是：大模型推理分两个阶段——prefill（处理输入上下文）和 decode（逐 Token 生成输出），这两个阶段的计算特征完全不同。

Prefill 阶段是计算密集型（compute-bound），处理的是大量输入 Token，吞吐量优先；decode 阶段是访存密集型（memory-bound），逐 Token 串行生成，延迟优先。传统量化方案对两个阶段一视同仁，结果往往是 prefill 加速了，但 decode 精度损失严重。

**Mix-Quant（NUS，2026 年 5 月）** 是这个方向的代表性工作。它的思路很直接：prefill 阶段用 NVFP4（4-bit 浮点）量化，大幅加速计算；decode 阶段保持 BF16 精度，保证生成质量。两个阶段解耦部署，各取所长。实验结果：prefill 阶段最高 3 倍加速，任务性能几乎无损。

这个框架的价值在于，它把"量化"从一个全局决策变成了一个阶段级决策，对 Agent 这类长上下文、多轮推理场景尤其有效。Agent 工作流中输入 Token 是输出的几十倍甚至几百倍，prefill 开销是主要瓶颈，Mix-Quant 恰好在这个环节做文章。

## 主线二：推理电路保护压缩（Reasoning-Aware Compression）

这条主线解决的问题更微妙：均匀量化会损伤关键推理电路。

**Carnegie Mellon 的工作（2026 年 8 月）** 做了一个精细化的实验：对 DeepSeek-R1 和 R1-Llama-8B 在 196-224 个（层，投影）对上做逐模块扰动扫描，识别出哪些电路对 INT4 量化最敏感，然后只把最敏感的 Top-K 电路恢复到 FP16，其余维持 INT4。

三个重要发现：

1. **INT4 量化可能反而增加能耗**。因为量化后推理链变长，25% 的功耗降低在 GSM8K 上变成净能耗增加。这个反直觉的结论对端侧部署尤为关键。
2. **脆弱性是任务相关的**。数学推理对注意力投影更敏感，逻辑推理的敏感模式因架构而异。没有"万能敏感层"，必须按任务校准。
3. **选择性压缩能到达均匀量化到不了的帕累托点**。R1-Qwen-7B 在 ProofWriter 上 Top-10% 方案，精度比 FP16 还高 12 个百分点，能耗反而降 9.7%。

这个方法的实践意义在于：它把"压缩"从一刀切变成了"诊断 + 精准治疗"，对需要保精度又必须降显存的端侧推理场景（8-16GB 手机内存）非常关键。

## 主线三：激活稀疏 + 低比特混合（SharQ 类方法）

**SharQ（2026 年 6 月）** 代表了一个更细粒度的方向：把激活值稀疏化和 FP4 量化桥接起来。

它的核心观察是：激活值里有输入依赖的离群值（outliers），这些离群值主导了 FP4 量化块的 scale，导致整体量化误差被放大。SharQ 的做法是在线生成一个 N:M 稀疏 mask，把离群值提取成稀疏骨架，对骨架做 FP4 量化，再对残差做 dense FP4 GEMM 补偿。两条路径共享同一个 FP4 权重 payload，用一个融合 kernel 吸收 mask 生成、残差构造和层归一化。

效果：在 Llama-3.1-8B、Qwen2.5-7B、Qwen3-30B-A3B 上恢复 43-63% 的 NVFP4-to-FP16 精度差距，RTX 5090 上 2.2-2.4 倍延迟降低，比 FP8 吞吐高 1.2-1.4 倍。无需校准数据、无需重训练。

这条主线的价值在于"免校准"——对生产环境部署来说，不需要为每个模型单独跑一遍校准流程，工程成本大幅降低。

## 主线四：端侧弹性推理（Token-Adaptive Elastic Inference）

**MoBiQuant（2026 年 2 月）** 提出了"Token 感知"的弹性推理：根据当前 Token 的敏感度，动态选择该 Token 使用几位精度。核心机制是一个 token-aware router，决定每个 Token 用几个残差比特切片。

这个思路把"模型级量化"推进到了"Token 级量化"，理论上可以在保证关键 Token 精度的同时，大幅压缩不敏感 Token 的显存占用。对端侧（手机、端侧 NPU）场景尤其有意义，因为端侧的显存/内存约束远比云端严格。

## 一个工程选型判断框架

把这些技术放到一起，可以提炼出一个实用的决策树：

**场景 1：云端高吞吐推理服务（MaaS）**
- 优先 Mix-Quant 类阶段感知方案，prefill 用 NVFP4，decode 保持 BF16
- 结合 P/D 解耦部署（prefill 和 decode 在不同节点）
- 关注每瓦 Token 产出指标

**场景 2：端侧 8-16GB 内存部署**
- 优先推理电路保护压缩方案，先做逐模块扰动扫描
- 用 Top-K 恢复敏感电路，其余 INT4
- 注意：INT4 可能增加能耗，必须做端到端能耗实测

**场景 3：端侧低延迟实时交互（语音、视觉）**
- 优先 SharQ 类免校准方法
- 结合激活稀疏 + FP4 混合
- 目标 2.2-2.4 倍延迟降低，同时保持任务精度

**场景 4：Agent 长上下文多轮推理**
- 优先 Mix-Quant，Agent 的 prefill 开销占 80%+
- 结合 KV cache 量化（主流推理引擎已支持）
- 关注 Token 级弹性推理（MoBiQuant），对上下文长度极敏感的场景有额外收益

## 量化精度的当前格局

把 2026 年主流量化方案的精度-效率 tradeoff 画出来，格局大致是：

- **INT8**：精度损失 <1%，已完全成熟，适合对精度不敏感的场景
- **INT4 / NVFP4**：精度损失 1-3%，是当前大规模部署的主流选择，但需要阶段感知或电路保护
- **FP4 / HiF4**：精度损失 3-5%，适合端侧和小模型，需要混合精度策略
- **3-bit 及以下**：精度损失 >5%，仍在探索阶段，适合极小模型或特定任务

## 写在最后

推理优化不是"一个论文解决所有问题"的方向，而是一个持续细化的过程。2026 年的核心趋势是：**从全局策略走向局部策略，从统一精度走向 Token 级自适应，从云端独占走向端云协同**。

对工程团队来说，现在最值得投入的三件事是：第一，建立逐模块扰动扫描工具链，识别自家模型的敏感电路；第二，在 prefill/decode 解耦架构上试验阶段感知量化；第三，在端侧部署前做能耗实测，不要只看显存占用。这三件事做完，能覆盖 80% 的工程痛点。
