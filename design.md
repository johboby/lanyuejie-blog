

# AI Vibe Coding Design System v3  
## 从“设计防御体系”升级为“AI 可执行的设计操作系统”

---





> **面向 AI Agent 的通用设计操作系统。**

它需要同时解决四个问题：

1. **可执行性**：AI Agent 能读懂并稳定执行。
2. **通用性**：适用于 Web、移动端、后台、官网、AI 产品、SaaS、移动应用等。
3. **专业审美**：不只是不错，而是有高级感、有品牌记忆。
4. **人机交互质量**：符合认知、可访问性、任务效率、错误恢复、多输入方式等专业标准。

---

# 三、v3 的设计哲学

## 1. 从“移除决策”升级为“分层决策”

v2 的核心哲学是：

> 把审美决策从 AI 推理过程中移除。

这非常正确，但还不够。

v3 应升级为：

> **把决策分层：哪些必须确定，哪些可以受控变化，哪些需要 AI 判断。**

### 决策分层模型

| 层级          | 决策类型                         | 是否允许 AI 自由发挥 | 示例                                   |
| ------------- | -------------------------------- | -------------------- | -------------------------------------- |
| L0 不可变规则 | 法律、可访问性、安全、可用性底线 | 不允许               | 对比度、焦点可见、label 关联、触控目标 |
| L1 品牌基础   | 色彩、字体、圆角、阴影、图形语言 | 不允许               | 主色、字体、品牌圆角                   |
| L2 设计系统   | 间距、栅格、组件状态、布局模式   | 有限允许             | 在令牌尺度内选择                       |
| L3 页面构成   | 信息层级、模块排列、节奏         | 可受控生成           | 首页 section 排布                      |
| L4 内容表达   | 文案、图像、微交互               | 可创造但需评估       | 空状态文案、引导语                     |
| L5 体验创新   | 新交互模式、新视觉表达           | 可实验但需门禁       | 新导航模式、新数据可视化               |

这样既保证稳定性，又避免所有页面都变成同一种“安全但无聊”的设计。

---

## 2. 从“防止丑”升级为“实现有意图的美”

专业级设计不是单纯“没有错误”，而是：

1. **有意图**
   - 这个页面要让用户感受到什么？
   - 要用户完成什么任务？
   - 要传递什么品牌气质？

2. **有层级**
   - 用户第一眼看到什么？
   - 第二眼看到什么？
   - 行动点是否足够清晰？

3. **有节奏**
   - 留白是否有呼吸感？
   - 模块之间是否有张弛？
   - 信息密度是否合理？

4. **有品牌**
   - 不是所有 SaaS 都长成一个样子。
   - 颜色、字体、图形、动效、文案共同构成品牌识别。

5. **有可用性**
   - 看得见
   - 看得懂
   - 点得到
   - 知道发生了什么
   - 出错能恢复

---

# 四、v3 总体架构：七层设计操作系统

建议将 v2 的五层防御体系升级为 **七层架构**。

```text
┌────────────────────────────────────────────────────────────┐
│ Level 7: 治理与观测层 Governance & Telemetry               │
│ 设计债务、生产行为数据、A/B、质量趋势、规则演进            │
├────────────────────────────────────────────────────────────┤
│ Level 6: 评估与门禁层 Evaluation & Quality Gates           │
│ 可访问性、视觉审美、品牌一致性、交互质量、性能、内容质量    │
├────────────────────────────────────────────────────────────┤
│ Level 5: 感知反馈层 Perception & Feedback Loop             │
│ 截图、VLM、GUI Agent、可访问性树、交互测试、回溯机制        │
├────────────────────────────────────────────────────────────┤
│ Level 4: 交互行为层 Interaction & Motion Contracts         │
│ 焦点管理、键盘、手势、状态机、反馈、错误恢复、动效策略      │
├────────────────────────────────────────────────────────────┤
│ Level 3: 组件合约层 Component Contracts                    │
│ API、Slots、States、A11y、Content、Analytics、Tests        │
├────────────────────────────────────────────────────────────┤
│ Level 2: 上下文令牌层 Context-Aware Design Tokens          │
│ 品牌、语义、组件、主题、密度、平台、语言、对比度、动效      │
├────────────────────────────────────────────────────────────┤
│ Level 1: 意图与品牌层 Intent & Brand Personality           │
│ 用户目标、品牌原型、情绪板、视觉关键词、内容语气            │
└────────────────────────────────────────────────────────────┘
```

---

# 五、Level 1：意图与品牌层

这是 v2 最薄弱但最关键的一层。

AI 生成界面时，如果只给“做一个 dashboard”，它会自动回退到统计均值。  
所以 v3 必须要求每个页面先生成 **设计意图合约**。

---

## 1. Intent Contract：设计意图合约

每个页面、每个功能、每个组件生成前，必须先定义：

```yaml
intent:
  page_name: "Project Overview"
  user_goal: "让用户在 10 秒内判断项目是否健康，并知道下一步该处理什么"
  primary_task: "识别异常项目并进入处理流程"
  secondary_tasks:
    - "查看关键指标趋势"
    - "快速创建项目"
    - "筛选团队或时间范围"
  success_criteria:
    - "首屏必须显示项目健康状态"
    - "异常项必须比正常项更突出"
    - "主要操作不超过 2 次点击"
  emotional_tone:
    - "专业"
    - "克制"
    - "可信赖"
    - "不喧闹"
  non_goals:
    - "不要过度营销"
    - "不要使用装饰性插画占据首屏"
    - "不要让图表多于 3 个"
```

这个合约必须成为 AI 生成的第一输入。

---

## 2. Brand Personality：品牌个性向量

为了避免所有 AI 生成界面都变成同一种“高级灰 + 紫色”，需要引入品牌个性向量。

```json
{
  "brand_personality": {
    "trustworthy": 0.9,
    "innovative": 0.7,
    "minimal": 0.85,
    "expressive": 0.4,
    "technical": 0.75,
    "friendly": 0.55,
    "luxury": 0.35,
    "playful": 0.2
  }
}
```

这些向量会影响：

| 设计维度   | 高信任 | 高表达 |    高技术 |   高友好 |
| ---------- | -----: | -----: | --------: | -------: |
| 色彩饱和度 |   中低 |     高 |      中高 |       中 |
| 圆角       |   中小 |     大 |        小 |       大 |
| 字体       |   稳重 | 个性化 | 几何/等宽 |     人文 |
| 动效       |   轻微 |   明显 |      精确 |     柔和 |
| 文案       |   清晰 | 有态度 |      精确 |     亲切 |
| 图形       |   简洁 | 强视觉 | 网格/线框 | 有机形态 |

---

## 3. 风格原型系统

建议保留 v2 的 5 种风格方向，但升级为 **风格原型系统**。

| 风格原型         | 关键词                   | 适用产品                | 视觉策略                         |
| ---------------- | ------------------------ | ----------------------- | -------------------------------- |
| Swiss Editorial  | 克制、排版、网格、信任   | SaaS、B2B、文档、金融   | 强排版、留白、低饱和、清晰层级   |
| Tech Brutalist   | 精确、工程、终端、开发者 | DevTool、API、AI Infra  | 等宽字体、硬边、高对比、数据密度 |
| Friendly Organic | 温暖、人文、亲和         | 教育、健康、社区        | 暖色、柔和圆角、自然图形         |
| Minimal Luxury   | 精致、稀缺、高端         | 品牌、电商、高端服务    | 大留白、细线、低饱和、精致动效   |
| Industrial Data  | 高效、密度、监控         | 后台、监控、数据平台    | 高密度、表格、图表、状态色       |
| AI Native        | 智能、流动、可信         | AI 产品、Agent、Copilot | 柔和光感、状态反馈、不确定性表达 |
| Consumer Vibrant | 年轻、活力、传播         | 社交、娱乐、消费应用    | 高饱和点缀、强图形、大按钮       |

每个风格原型应包含：

1. 色彩策略
2. 字体配对
3. 圆角策略
4. 阴影策略
5. 动效策略
6. 图形语言
7. 文案语气
8. 禁用项
9. 推荐组件形态
10. 示例页面结构

---

# 六、Level 2：上下文感知设计令牌

v2 的令牌体系已经很好，但主要是静态令牌。  
v3 需要升级为 **上下文感知令牌系统**。

---

## 1. 令牌五层模型

```text
Global Tokens
  ↓
Semantic Tokens
  ↓
Component Tokens
  ↓
Context Tokens
  ↓
Policy Tokens
```

### 示例

```text
global.color.blue.600
  ↓
semantic.color.action.primary
  ↓
component.button.background.primary
  ↓
context.button.background.primary.hover
  ↓
policy.button.contrast.min = APCA Lc 45
```

---

## 2. 新增上下文令牌维度

| 上下文维度 | 说明                          | 示例                                         |
| ---------- | ----------------------------- | -------------------------------------------- |
| theme      | 亮色/暗色/高对比              | `data-theme="dark"`                          |
| density    | 信息密度                      | compact / comfortable / spacious             |
| platform   | Web / iOS / Android / Desktop | 触控目标、间距、动效不同                     |
| locale     | 多语言、RTL、文字长度         | 阿拉伯语 RTL、德语长单词                     |
| motion     | 动效偏好                      | reduced-motion / full-motion                 |
| contrast   | 对比度偏好                    | standard / high-contrast                     |
| input      | 输入方式                      | mouse / touch / keyboard / voice             |
| brand      | 品牌主题                      | brand-a / brand-b / sub-brand                |
| surface    | 表面层级                      | base / raised / overlay / sticky             |
| state      | 组件状态                      | default / hover / focus / disabled / loading |

---

## 3. v3 令牌示例

```json
{
  "color": {
    "action": {
      "primary": {
        "$value": "{color.brand.primary}",
        "$type": "color",
        "$description": "主要行动色，用于主按钮、关键链接、重要状态。"
      },
      "primary-hover": {
        "$value": "{color.brand.primary-strong}",
        "$type": "color"
      },
      "on-primary": {
        "$value": "{color.neutral.white}",
        "$type": "color",
        "$extensions": {
          "contrast": {
            "against": "color.action.primary",
            "minAPCA": 75
          }
        }
      }
    },
    "surface": {
      "base": { "$value": "#FAFBFC", "$type": "color" },
      "raised": { "$value": "#FFFFFF", "$type": "color" },
      "subtle": { "$value": "#F5F7FA", "$type": "color" },
      "inverse": { "$value": "#111418", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "#171A1F", "$type": "color" },
      "secondary": { "$value": "#5B6472", "$type": "color" },
      "disabled": { "$value": "#9AA3B2", "$type": "color" },
      "inverse": { "$value": "#FFFFFF", "$type": "color" }
    },
    "status": {
      "success": { "$value": "#10B981", "$type": "color" },
      "warning": { "$value": "#F59E0B", "$type": "color" },
      "danger": { "$value": "#E5484D", "$type": "color" },
      "info": { "$value": "#3B82F6", "$type": "color" }
    }
  },
  "space": {
    "unit": { "$value": "4px", "$type": "dimension" },
    "scale": {
      "0": { "$value": "0px", "$type": "dimension" },
      "1": { "$value": "4px", "$type": "dimension" },
      "2": { "$value": "8px", "$type": "dimension" },
      "3": { "$value": "12px", "$type": "dimension" },
      "4": { "$value": "16px", "$type": "dimension" },
      "5": { "$value": "20px", "$type": "dimension" },
      "6": { "$value": "24px", "$type": "dimension" },
      "8": { "$value": "32px", "$type": "dimension" },
      "10": { "$value": "40px", "$type": "dimension" },
      "12": { "$value": "48px", "$type": "dimension" },
      "16": { "$value": "64px", "$type": "dimension" },
      "20": { "$value": "80px", "$type": "dimension" },
      "24": { "$value": "96px", "$type": "dimension" }
    }
  },
  "typography": {
    "display": {
      "family": { "$value": "Fraunces, Georgia, serif", "$type": "fontFamily" },
      "size": { "$value": "56px", "$type": "dimension" },
      "lineHeight": { "$value": 1.05, "$type": "number" },
      "weight": { "$value": 650, "$type": "fontWeight" },
      "letterSpacing": { "$value": "-0.02em", "$type": "string" }
    },
    "title": {
      "family": { "$value": "Inter Tight, system-ui, sans-serif", "$type": "fontFamily" },
      "size": { "$value": "24px", "$type": "dimension" },
      "lineHeight": { "$value": 1.25, "$type": "number" },
      "weight": { "$value": 600, "$type": "fontWeight" }
    },
    "body": {
      "family": { "$value": "Inter Tight, system-ui, sans-serif", "$type": "fontFamily" },
      "size": { "$value": "16px", "$type": "dimension" },
      "lineHeight": { "$value": 1.6, "$type": "number" },
      "weight": { "$value": 400, "$type": "fontWeight" }
    },
    "caption": {
      "family": { "$value": "Inter Tight, system-ui, sans-serif", "$type": "fontFamily" },
      "size": { "$value": "13px", "$type": "dimension" },
      "lineHeight": { "$value": 1.45, "$type": "number" },
      "weight": { "$value": 500, "$type": "fontWeight" }
    }
  },
  "radius": {
    "sm": { "$value": "6px", "$type": "dimension" },
    "md": { "$value": "10px", "$type": "dimension" },
    "lg": { "$value": "14px", "$type": "dimension" },
    "xl": { "$value": "20px", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  },
  "elevation": {
    "0": { "$value": "none", "$type": "shadow" },
    "1": { "$value": "0 1px 2px rgba(15, 23, 42, 0.06)", "$type": "shadow" },
    "2": { "$value": "0 8px 24px rgba(15, 23, 42, 0.08)", "$type": "shadow" },
    "3": { "$value": "0 16px 48px rgba(15, 23, 42, 0.12)", "$type": "shadow" }
  },
  "motion": {
    "duration": {
      "instant": { "$value": "100ms", "$type": "duration" },
      "fast": { "$value": "160ms", "$type": "duration" },
      "standard": { "$value": "240ms", "$type": "duration" },
      "slow": { "$value": "400ms", "$type": "duration" }
    },
    "easing": {
      "standard": { "$value": "cubic-bezier(0.2, 0, 0, 1)", "$type": "cubicBezier" },
      "emphasized": { "$value": "cubic-bezier(0.3, 0, 0, 1)", "$type": "cubicBezier" }
    }
  },
  "context": {
    "density": {
      "compact": {
        "space": {
          "control-y": { "$value": "{space.2}", "$type": "dimension" }
        }
      },
      "comfortable": {
        "space": {
          "control-y": { "$value": "{space.3}", "$type": "dimension" }
        }
      },
      "spacious": {
        "space": {
          "control-y": { "$value": "{space.4}", "$type": "dimension" }
        }
      }
    },
    "motion": {
      "reduced": {
        "duration": {
          "standard": { "$value": "0ms", "$type": "duration" }
        }
      }
    }
  }
}
```

---

## 4. 令牌使用铁律升级版

| 规则                                 | 级别   | 说明                                        |
| ------------------------------------ | ------ | ------------------------------------------- |
| 所有颜色必须来自语义令牌             | MUST   | 禁止直接写 hex                              |
| 所有间距必须来自 spacing scale       | MUST   | 允许 4px 基础，但优先 8px                   |
| 所有组件必须使用 component token     | MUST   | 组件样式不能直接绑定 global token           |
| 所有文字必须满足 APCA 阈值           | MUST   | 正文 Lc ≥ 75，大字 ≥ 45                     |
| 所有交互态必须定义                   | MUST   | hover / focus / active / disabled / loading |
| 所有动效必须支持 reduced motion      | MUST   | 不能让用户无法关闭强烈动效                  |
| 所有主题必须通过 token override 实现 | MUST   | 不允许重复写暗色样式                        |
| 所有品牌切换必须通过 brand token     | MUST   | 不允许硬编码品牌色                          |
| 所有密度变化必须通过 density token   | SHOULD | 后台表格可用 compact                        |
| 所有平台差异必须通过 platform token  | SHOULD | iOS/Android/Web 可微调                      |

---

# 七、Level 3：组件合约层

v2 的组件规范需要升级为 **Component Contract**。

组件不只是“长什么样”，而是：

1. 什么时候用
2. 什么时候不用
3. 有哪些状态
4. 如何响应输入
5. 如何表达错误
6. 如何支持键盘
7. 如何支持屏幕阅读器
8. 如何埋点
9. 如何测试
10. 如何适配多端

---

## 1. 组件合约模板

```yaml
component: Button
version: 3.0.0
intent: "触发一个明确动作"
usage:
  allowed:
    - "提交表单"
    - "打开对话框"
    - "开始流程"
    - "确认危险操作"
  not_allowed:
    - "页面跳转，应使用 Link"
    - "纯装饰性点击"
    - "替代文本链接承载长段落"
variants:
  - primary
  - secondary
  - tertiary
  - ghost
  - destructive
states:
  - default
  - hover
  - focus-visible
  - active
  - disabled
  - loading
  - success
  - error
tokens:
  background: "color.action.primary"
  foreground: "color.action.on-primary"
  radius: "radius.md"
  padding-x: "space.4"
  padding-y: "space.3"
  min-height: "44px"
interaction:
  keyboard:
    - "Enter 触发"
    - "Space 触发"
  pointer:
    - "点击后 100ms 内给出视觉反馈"
  loading:
    - "异步操作必须显示 loading"
    - "loading 时禁用重复提交"
    - "保持按钮宽度稳定，避免布局跳动"
accessibility:
  role: "button"
  focus: "必须有 focus-visible ring"
  aria:
    - "icon-only button 必须有 aria-label"
    - "loading 时设置 aria-busy=true"
  contrast:
    - "文本对背景 APCA Lc ≥ 75"
content:
  label:
    - "使用动词开头"
    - "不超过 3 个词"
    - "避免模糊词如 Submit / Click here"
  examples:
    good:
      - "Save changes"
      - "Create project"
      - "Delete file"
    bad:
      - "Submit"
      - "Click here"
      - "OK"
analytics:
  events:
    - "button_click"
    - "button_loading_start"
    - "button_error"
tests:
  - "键盘可聚焦"
  - "Enter/Space 可触发"
  - "disabled 不可触发"
  - "loading 不可重复触发"
  - "触控目标 ≥ 44px"
  - "focus ring 可见"
```

---

## 2. 必须纳入 v3 的核心组件合约

### 基础组件

1. Button
2. IconButton
3. Link
4. Input
5. Textarea
6. Select
7. Checkbox
8. Radio
9. Switch
10. Label
11. Badge
12. Tag
13. Avatar
14. Tooltip
15. Skeleton

### 复合组件

1. FormField
2. FormGroup
3. Dialog
4. Drawer
5. Toast
6. Alert
7. EmptyState
8. ErrorState
9. LoadingState
10. DataTable
11. Pagination
12. Tabs
13. Stepper
14. Wizard
15. CommandPalette
16. NavigationBar
17. Sidebar
18. Breadcrumb
19. FileUpload
20. SearchInput

### AI 原生组件

这是 v3 必须新增的。

1. ChatMessage
2. PromptInput
3. StreamingResponse
4. ToolCallCard
5. AgentStatus
6. ConfidenceIndicator
7. CitationCard
8. SuggestionChips
9. AIErrorBoundary
10. HumanApprovalDialog

---

# 八、Level 4：交互行为层

专业级设计不只是视觉，而是交互行为稳定。

v3 需要增加 **Interaction Contract**。

---

## 1. 状态反馈原则

所有用户动作都必须有反馈。

| 用户动作  | 系统反馈                                     |
| --------- | -------------------------------------------- |
| 点击按钮  | 100ms 内出现 hover/active/loading 反馈       |
| 提交表单  | 显示 loading，成功后明确反馈，失败后给出原因 |
| 删除对象  | 危险操作需要确认，删除后允许撤销             |
| 加载数据  | 使用 skeleton 或 spinner，不能空白           |
| 空数据    | 提供解释和下一步动作                         |
| 错误发生  | 说明发生了什么、为什么、如何修复             |
| 长任务    | 显示进度、可取消、可后台继续                 |
| 复制成功  | 显示 toast 或状态变化                        |
| 导航切换  | 保持焦点合理，不丢失上下文                   |
| AI 生成中 | 显示 streaming、可停止、可重试               |

---

## 2. 焦点管理规范

| 场景        | 规则                                   |
| ----------- | -------------------------------------- |
| 页面加载    | 焦点应落在合理起点                     |
| 打开 Dialog | 焦点移入 Dialog 内第一个可交互元素     |
| 关闭 Dialog | 焦点返回触发元素                       |
| Drawer      | 焦点限制在 Drawer 内                   |
| Toast       | 不应抢焦点，除非包含关键操作           |
| 表单错误    | 焦点跳到第一个错误字段                 |
| 路由切换    | 主内容区域应可被屏幕阅读器感知         |
| 键盘操作    | 所有交互元素必须可到达、可操作、可离开 |

---

## 3. 错误恢复设计

专业级 HCI 必须要求错误可恢复。

### 错误状态四要素

```text
1. 发生了什么？
2. 为什么发生？
3. 用户现在能做什么？
4. 如何避免再次发生？
```

### 示例

```text
❌ 普通错误：
Something went wrong.

✅ 专业错误：
We couldn’t save your changes.
Your connection was interrupted. Your draft is saved locally.
Try again, or continue editing and sync later.
```

---

## 4. 表单设计专业规范

| 规则                     | 说明                                 |
| ------------------------ | ------------------------------------ |
| 每个输入必须有可见 label | placeholder 不能替代 label           |
| 错误信息必须靠近字段     | 不能只在顶部显示                     |
| 必填/选填必须明确        | 推荐只标注必填                       |
| 输入格式要提前提示       | 日期、电话、金额等                   |
| 支持自动保存             | 长表单必须防丢失                     |
| 提交按钮要表达结果       | Save / Publish / Invite，不要 Submit |
| 危险操作要二次确认       | 删除、停用、付款                     |
| 成功后要有明确路径       | 返回、查看、继续创建                 |
| 禁用按钮要解释原因       | 不能只灰掉                           |
| 长表单分步骤             | 显示进度和可返回                     |

---

## 5. 动效设计原则

动效不是装饰，而是解释空间关系和状态变化。

| 原则     | 规则                                   |
| -------- | -------------------------------------- |
| 快       | 标准动效 160–240ms                     |
| 轻       | 避免弹跳、闪烁、过度位移               |
| 有意义   | 表达进入、退出、层级、方向             |
| 可关闭   | 支持 prefers-reduced-motion            |
| 不阻塞   | 不延迟用户操作                         |
| 一致     | 同类组件使用同一动效曲线               |
| 空间连续 | Drawer、Dialog、Tab 切换要保持空间逻辑 |

---

# 九、Level 5：感知反馈层

v2 已经有截图反馈，v3 需要升级为 **多模态感知反馈**。

---

## 1. 五类反馈信号

```text
1. Visual Screenshot Feedback
   截图 → VLM 分析视觉质量

2. Accessibility Tree Feedback
   解析可访问性树，检查 landmark、role、label、focus order

3. GUI Agent Feedback
   自动点击、填表、导航，验证任务流

4. Runtime Console Feedback
   检查 React key warning、hydration error、console error

5. Performance Feedback
   LCP、CLS、INP、bundle size、动画掉帧
```

---

## 2. AI Agent 迭代循环升级版

```text
Intent Contract
  ↓
Generate UI
  ↓
Build & Render
  ↓
Capture Screenshots (375 / 768 / 1024 / 1280 / 1536)
  ↓
Analyze Visual Quality
  ↓
Analyze Accessibility Tree
  ↓
Run GUI Agent Tasks
  ↓
Check Performance & Console
  ↓
Score & Judge
  ↓
If score low → backtrack to best snapshot
If fixable → apply targeted fixes
If pass → commit
```

---

## 3. VLM 视觉评审 Prompt 升级

```markdown
You are a senior product designer and HCI reviewer.

Evaluate this UI screenshot for:
1. Visual hierarchy
2. Brand quality
3. Typography rhythm
4. Spacing and alignment
5. Color harmony
6. Contrast and readability
7. Component consistency
8. Interaction affordance
9. Cognitive load
10. Mobile/desktop suitability

Context:
- Product type: {product_type}
- Page intent: {page_intent}
- Brand personality: {brand_personality}
- Target viewport: {viewport}
- Theme: {theme}

Output JSON:
{
  "first_impression": "",
  "overall_score": 0,
  "scores": {
    "hierarchy": 0,
    "typography": 0,
    "spacing": 0,
    "color": 0,
    "brand_fit": 0,
    "accessibility": 0,
    "interaction_clarity": 0,
    "cognitive_load": 0
  },
  "critical_issues": [],
  "minor_issues": [],
  "fixes": [
    {
      "issue": "",
      "severity": "critical|major|minor",
      "selector": "",
      "recommendation": "",
      "token_to_use": ""
    }
  ]
}
```

---

# 十、Level 6：评估与门禁层

v2 的质量门禁需要升级为 **Design Quality Index 2.0**。

---

## 1. DQI 2.0：设计质量指数

```text
DQI 2.0 =
  0.20 × Accessibility Score
+ 0.20 × Interaction Quality Score
+ 0.18 × Visual Aesthetic Score
+ 0.12 × Brand Coherence Score
+ 0.10 × Content Quality Score
+ 0.10 × Performance Score
+ 0.05 × Responsive Robustness Score
+ 0.05 × State Completeness Score
```

---

## 2. 各维度评分细则

### Accessibility Score

| 检查项          | 权重 |
| --------------- | ---: |
| APCA 对比度合规 |  25% |
| landmark 完整   |  15% |
| label 关联      |  20% |
| 键盘可达        |  20% |
| focus-visible   |  10% |
| alt text        |  10% |

### Interaction Quality Score

| 检查项           | 权重 |
| ---------------- | ---: |
| loading 状态完整 |  20% |
| empty 状态完整   |  15% |
| error 状态完整   |  20% |
| GUI 任务流通过   |  25% |
| 反馈及时         |  10% |
| 无键盘陷阱       |  10% |

### Visual Aesthetic Score

| 检查项            | 权重 |
| ----------------- | ---: |
| 视觉层级          |  20% |
| 排版节奏          |  15% |
| 间距对齐          |  20% |
| 色彩和谐          |  15% |
| 留白密度          |  10% |
| UIClip/VLM 综合分 |  20% |

### Brand Coherence Score

| 检查项             | 权重 |
| ------------------ | ---: |
| 使用品牌令牌比例   |  30% |
| 字体使用合规       |  20% |
| 图形/圆角/阴影一致 |  20% |
| 文案语气一致       |  15% |
| 风格原型匹配       |  15% |

### Content Quality Score

| 检查项           | 权重 |
| ---------------- | ---: |
| 文案清晰         |  30% |
| 无 lorem ipsum   |  20% |
| 错误文案可恢复   |  20% |
| 空状态有行动引导 |  15% |
| 多语言长度适配   |  15% |

### Performance Score

| 检查项      | 权重 |
| ----------- | ---: |
| LCP         |  30% |
| CLS         |  25% |
| INP         |  25% |
| Bundle size |  10% |
| 动画帧率    |  10% |

---

## 3. 质量门禁阈值

```json
{
  "quality_gate": {
    "blocking": {
      "accessibility_score_min": 0.95,
      "interaction_task_pass_rate": 1.0,
      "critical_a11y_violations": 0,
      "hardcoded_color_violations": 0,
      "hardcoded_spacing_violations": 0,
      "focus_visible_missing": 0,
      "missing_form_labels": 0
    },
    "warning": {
      "visual_aesthetic_score_min": 0.75,
      "brand_coherence_score_min": 0.8,
      "content_quality_score_min": 0.75,
      "performance_score_min": 0.8
    },
    "overall": {
      "DQI_min": 0.82
    }
  }
}
```

---

# 十一、Level 7：治理与观测层

v2 主要是 CI 前门禁，v3 需要增加生产环境闭环。

---

## 1. 生产环境设计观测指标

| 指标                   | 含义                         |
| ---------------------- | ---------------------------- |
| Task success rate      | 用户是否完成核心任务         |
| Time to first action   | 用户多久开始第一次有效操作   |
| Error rate             | 表单错误、接口错误、交互错误 |
| Rage clicks            | 用户是否反复点击无效区域     |
| Dead clicks            | 点击后无反馈                 |
| Form abandonment       | 表单放弃率                   |
| Keyboard usage         | 键盘用户是否受阻             |
| Screen reader errors   | 可访问性问题                 |
| Motion disable rate    | 用户是否关闭动效             |
| Zoom breakage          | 放大 200% 后是否破版         |
| Mobile overflow        | 移动端是否横向溢出           |
| Empty state conversion | 空状态是否引导成功           |

---

## 2. 设计债务分类

| 类型         | 示例                       | 严重级别 |
| ------------ | -------------------------- | -------- |
| 可访问性债务 | 缺 label、焦点丢失         | Critical |
| 交互债务     | 无 loading、无错误恢复     | Critical |
| 视觉债务     | 硬编码颜色、间距不一致     | Major    |
| 品牌债务     | 使用非品牌字体/图形        | Major    |
| 内容债务     | 文案模糊、错误信息不可操作 | Major    |
| 性能债务     | CLS、动画卡顿              | Major    |
| 组件债务     | 重复造组件、绕过设计系统   | Moderate |
| 令牌债务     | 未使用 token、私改 token   | Moderate |

---

# 十二、高级审美系统升级

专业级审美不能只靠“不要紫色渐变”。  
需要建立可计算、可配置、可品牌化的高级审美模型。

---

## 1. 高级审美的八个维度

| 维度                | 说明                 | 检测方式                       |
| ------------------- | -------------------- | ------------------------------ |
| Hierarchy 层级      | 用户是否知道先看哪里 | 视觉显著性、字号、颜色、位置   |
| Rhythm 节奏         | 模块是否有张弛       | section spacing 方差、密度变化 |
| Density 密度        | 信息是否过载或过空   | 组件面积占比                   |
| Alignment 对齐      | 是否在网格上         | 边缘对齐率                     |
| Contrast 对比       | 重点是否突出         | APCA、字号差、尺寸差           |
| Harmony 和谐        | 色彩是否统一         | 色相距离、饱和度统一性         |
| Restraint 克制      | 是否过度装饰         | 颜色数、字体数、阴影数、动效数 |
| Memorability 记忆点 | 是否有品牌识别       | 品牌图形、字体、色彩、动效特征 |

---

## 2. 高级感的来源：克制 + 差异

专业级设计通常遵循：

```text
70% 稳定系统
20% 品牌差异
10% 惊喜表达
```

### 70% 稳定系统

- 网格
- 间距
- 组件
- 可访问性
- 状态
- 响应式

### 20% 品牌差异

- 品牌色
- 字体
- 圆角
- 图形
- 图标风格
- 文案语气

### 10% 惊喜表达

- 微交互
- 空状态插画
- 加载动画
- 成功反馈
- 特殊页面视觉

---

## 3. 通用高级默认主题：Modern Editorial Neutral

如果需要一个通用、专业、适配多数产品的默认主题，建议使用：

### 色彩

```json
{
  "brand": {
    "primary": "#1F4B62",
    "primary-strong": "#173A4C",
    "accent": "#D97742",
    "accent-subtle": "#F6E8DF"
  },
  "neutral": {
    "0": "#FFFFFF",
    "50": "#FAFAF9",
    "100": "#F4F4F2",
    "200": "#E7E7E4",
    "300": "#D6D6D2",
    "400": "#A8A8A3",
    "500": "#7C7C78",
    "600": "#55554F",
    "700": "#3A3A36",
    "800": "#262624",
    "900": "#171716"
  },
  "status": {
    "success": "#2F855A",
    "warning": "#B7791F",
    "danger": "#C53030",
    "info": "#2B6CB0"
  }
}
```

### 字体

```css
--font-display: "Fraunces", Georgia, serif;
--font-body: "Inter Tight", system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

### 间距

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96
```

### 圆角

```text
input: 8px
card: 12px
dialog: 16px
button: 10px
```

### 阴影

```css
--shadow-1: 0 1px 2px rgba(23, 23, 22, 0.06);
--shadow-2: 0 8px 24px rgba(23, 23, 22, 0.08);
--shadow-3: 0 16px 48px rgba(23, 23, 22, 0.12);
```

### 动效

```css
--duration-fast: 160ms;
--duration-standard: 240ms;
--easing-standard: cubic-bezier(0.2, 0, 0, 1);
```

这个主题的优点是：

- 不像 AI 默认紫色
- 适合 B2B、SaaS、AI、后台、官网
- 有专业感
- 容易扩展暗色模式
- 容易叠加品牌色

---

# 十三、人机交互专业级规则升级

## 1. 认知负荷控制

| 规则           | 说明                       |
| -------------- | -------------------------- |
| 每屏一个主任务 | 不要让多个 CTA 竞争        |
| 分组清晰       | 相关功能靠近               |
| 渐进披露       | 高级选项默认收起           |
| 默认值合理     | 减少用户决策               |
| 避免过多选择   | 一级选项不超过 5–7 个      |
| 信息分块       | 长表单、长列表要分段       |
| 状态可见       | 用户随时知道当前在哪里     |
| 减少记忆       | 选择项可见，不要求用户记住 |

---

## 2. 可点击性规范

| 元素            | 规则                                |
| --------------- | ----------------------------------- |
| Button          | 看起来能点，有 hover/active         |
| Link            | 文本链接用于导航                    |
| Card            | 如果整卡可点，必须有明确 affordance |
| Icon button     | 必须有 tooltip 或 aria-label        |
| Disabled        | 必须解释为什么禁用                  |
| Loading         | 必须防止重复点击                    |
| Touch target    | 最小 44×44px                        |
| Hover-only 操作 | 必须同时支持键盘和触控              |

---

## 3. 导航设计规范

| 规则                    | 说明                             |
| ----------------------- | -------------------------------- |
| 当前位置可见            | 高亮当前导航项                   |
| 层级不超过 3 层         | 深层路径需要面包屑               |
| 核心任务 1–2 次点击可达 | 不要埋太深                       |
| 返回路径明确            | 不能进入死胡同                   |
| 移动端导航可收起        | 但不应丢失关键入口               |
| 全局搜索                | 复杂系统建议提供 Command Palette |

---

## 4. 数据表格专业规范

后台产品尤其重要。

| 规则          | 说明                        |
| ------------- | --------------------------- |
| 列对齐        | 数字右对齐，文本左对齐      |
| 密度可切换    | compact / comfortable       |
| 空状态        | 没有数据时引导创建          |
| 加载态        | skeleton                    |
| 错误态        | 可重试                      |
| 批量操作      | 选择后出现明确操作栏        |
| 筛选          | 筛选条件可见、可清除        |
| 排序          | 当前排序状态明确            |
| 分页/虚拟滚动 | 大数据量不能卡              |
| 行操作        | 高频操作可见，低频收进 menu |
| 危险操作      | 删除需确认或可撤销          |

---

## 5. AI 产品交互规范

这是 v3 必须新增的重点。

| 规则              | 说明                       |
| ----------------- | -------------------------- |
| AI 输出必须可识别 | 明确哪些内容是 AI 生成     |
| 不确定性必须表达  | 不确定的结果不能伪装成事实 |
| 引用来源          | 有依据时展示 citation      |
| 可停止生成        | streaming 时必须可停止     |
| 可重试            | 失败后提供重试             |
| 可编辑            | AI 生成内容应允许用户修改  |
| 可解释            | 说明为什么这样建议         |
| 高风险操作需确认  | AI 不能静默执行危险动作    |
| 工具调用透明      | Agent 调用工具时展示状态   |
| 避免过度拟人      | 不要假装 AI 是人类         |

---

# 十四、通用性升级：跨平台设计内核

为了让系统不只适用于 Web，需要拆分为：

```text
design-core/
  tokens/
  contracts/
  policies/
  patterns/
  evaluation/

adapters/
  web/
  react/
  vue/
  tailwind/
  shadcn/
  ios/
  android/
  flutter/
  email/
  docs/
```

---

## 1. 核心与适配器分离

| 层                | 内容                                     | 是否平台无关 |
| ----------------- | ---------------------------------------- | ------------ |
| Design Core       | 令牌、规则、组件合约、交互模式、评估标准 | 是           |
| Platform Adapter  | CSS / SwiftUI / Compose / Flutter 实现   | 否           |
| Framework Adapter | React / Vue / Svelte 组件                | 否           |
| Brand Adapter     | 品牌主题                                 | 是           |
| Content Adapter   | 文案、多语言                             | 是           |

---

## 2. 多端差异策略

| 维度     | Web         | iOS                  | Android          |
| -------- | ----------- | -------------------- | ---------------- |
| 触控目标 | ≥ 44px      | ≥ 44pt               | ≥ 48dp           |
| 返回     | 浏览器/路由 | 手势返回             | 系统返回         |
| Dialog   | 居中        | Action Sheet / Sheet | Material Dialog  |
| 字体     | CSS font    | Dynamic Type         | Typography scale |
| 动效     | CSS/JS      | SwiftUI animation    | Motion spec      |
| 焦点     | 键盘焦点    | Full Keyboard Access | Focus system     |
| 滚动     | 自定义      | 原生弹性             | 原生滚动         |

---

# 十五、文件结构升级

建议从 v2 的目录升级为：

```text
design-system/
├── design/
│   ├── intent/
│   │   ├── product-intent.md
│   │   ├── page-intents/
│   │   │   ├── home.md
│   │   │   ├── dashboard.md
│   │   │   ├── settings.md
│   │   │   └── ai-chat.md
│   ├── brand/
│   │   ├── brand-personality.json
│   │   ├── voice-and-tone.md
│   │   ├── visual-language.md
│   │   └── themes/
│   │       ├── default/
│   │       ├── dark/
│   │       └── high-contrast/
│   ├── tokens/
│   │   ├── global.json
│   │   ├── semantic.json
│   │   ├── component.json
│   │   ├── context.json
│   │   └── policy.json
│   ├── components/
│   │   ├── button.md
│   │   ├── input.md
│   │   ├── dialog.md
│   │   ├── data-table.md
│   │   ├── empty-state.md
│   │   └── ai-chat.md
│   ├── patterns/
│   │   ├── forms.md
│   │   ├── navigation.md
│   │   ├── search.md
│   │   ├── filters.md
│   │   ├── error-recovery.md
│   │   ├── loading.md
│   │   └── ai-agent-ui.md
│   ├── policies/
│   │   ├── accessibility.md
│   │   ├── interaction.md
│   │   ├── motion.md
│   │   ├── content.md
│   │   ├── performance.md
│   │   └── anti-patterns.md
│   ├── evaluation/
│   │   ├── dqi.yaml
│   │   ├── vlm-prompts/
│   │   ├── gui-agent-tasks/
│   │   └── quality-budget.json
│   ├── DESIGN.md
│   ├── AGENTS.md
│   └── CLAUDE.md
├── adapters/
│   ├── web/
│   ├── react/
│   ├── vue/
│   ├── tailwind/
│   ├── ios/
│   ├── android/
│   └── flutter/
├── scripts/
│   ├── build-tokens.js
│   ├── verify-contrast.js
│   ├── evaluate-aesthetics.py
│   ├── evaluate-dqi.js
│   ├── screenshot-all.js
│   └── generate-report.js
├── tests/
│   ├── visual/
│   ├── a11y/
│   ├── interaction/
│   └── performance/
└── reports/
    └── design/
```

---

# 十六、AGENTS.md 升级版

下面是一个可以直接使用的 v3 版本核心片段。

```markdown
# AGENTS.md — AI Agent Design Operating Rules v3

You are generating product UI inside a governed design system.
You must produce professional, accessible, brand-consistent, and interaction-complete interfaces.

## 0. Generation Protocol

Before writing any UI code:

1. Read `design/DESIGN.md`.
2. Read the relevant page intent file in `design/intent/page-intents/`.
3. Read the relevant component contracts in `design/components/`.
4. Read `design/policies/accessibility.md` and `design/policies/interaction.md`.
5. Identify:
   - user goal
   - primary task
   - emotional tone
   - required states
   - accessibility constraints
   - responsive constraints

If intent is unclear, ask clarifying questions before generating UI.

## 1. Hard Rules — MUST

### Tokens
- ALL colors MUST use semantic design tokens.
- ALL spacing MUST use the spacing scale.
- ALL typography MUST use the type scale.
- ALL radius, shadow, and motion MUST use tokens.
- NEVER hardcode hex, rgb, hsl, px spacing outside scale, or arbitrary font sizes.

### Accessibility
- EVERY page MUST have one `<main>` landmark.
- EVERY interactive element MUST be keyboard accessible.
- EVERY input MUST have a visible associated label.
- EVERY icon-only button MUST have `aria-label`.
- EVERY focusable element MUST have visible `:focus-visible` style.
- EVERY text pair MUST satisfy APCA:
  - body text: Lc >= 75
  - large text: Lc >= 45
  - UI elements: Lc >= 30
- Touch targets MUST be at least 44x44px on web and 44pt/48dp on mobile.

### States
- EVERY async action MUST have loading state.
- EVERY list MUST have loading, empty, error, and success states.
- EVERY form MUST have validation, error, submitting, success, and failure states.
- EVERY destructive action MUST require confirmation or provide undo.
- EVERY disabled control MUST explain why it is disabled.

### Feedback
- User actions MUST receive feedback within 100ms.
- Long operations MUST show progress or streaming status.
- Errors MUST explain:
  1. what happened
  2. why
  3. what the user can do next

### Responsive
- MUST support at least:
  - 375px
  - 768px
  - 1024px
  - 1280px
  - 1536px
- MUST avoid horizontal overflow at 375px.
- Tables MUST scroll or transform into readable layouts on small screens.
- Long words MUST wrap or truncate safely.

### Content
- Buttons MUST use clear verbs.
- Avoid generic labels like Submit, Click here, OK.
- Empty states MUST explain what the user can do next.
- Do not use lorem ipsum in final UI.

### AI UI
- AI-generated content MUST be identifiable.
- AI uncertainty MUST be disclosed when relevant.
- AI actions that modify data MUST require explicit user approval.
- Streaming AI responses MUST allow stop/cancel.
- AI errors MUST allow retry and fallback.

## 2. Strong Recommendations — SHOULD

- Prefer one primary action per view.
- Prefer progressive disclosure over showing everything.
- Prefer skeleton loaders over spinners for content-heavy areas.
- Prefer undo over destructive confirmation when possible.
- Use container queries where component layout depends on container width.
- Vary section rhythm; do not make all sections identical spacing.
- Keep color usage restrained:
  - 1 primary action color
  - 1 accent color
  - neutral system
  - semantic status colors only

## 3. Forbidden Patterns — MUST NOT

- MUST NOT use default AI purple gradients.
- MUST NOT use centered hero + three icon cards as default layout.
- MUST NOT use placeholder as label.
- MUST NOT use div with onClick instead of button.
- MUST NOT create keyboard traps.
- MUST NOT hide critical actions only behind hover.
- MUST NOT use color as the only indicator of state.
- MUST NOT let AI silently perform destructive actions.
- MUST NOT output final UI without loading/empty/error states.

## 4. After Generation Checklist

After generating UI, you MUST verify:

- [ ] Intent is satisfied
- [ ] Primary action is obvious
- [ ] Visual hierarchy is clear
- [ ] Tokens are used everywhere
- [ ] APCA contrast passes
- [ ] Keyboard navigation works
- [ ] Screen reader semantics are correct
- [ ] Loading/empty/error states exist
- [ ] Mobile 375px works
- [ ] Form errors are recoverable
- [ ] AI actions are transparent and controllable
- [ ] No hardcoded styles remain
- [ ] Run design lint, a11y audit, screenshot review, and DQI score
```

---

# 十七、DESIGN.md 升级版结构

```markdown
---
designSystem:
  name: "Universal Professional Design System"
  version: "3.0.0"
  philosophy: "Intent-driven, accessible, brand-aware, AI-executable"

brand:
  personality:
    trustworthy: 0.9
    minimal: 0.85
    technical: 0.75
    friendly: 0.55
    expressive: 0.4
  voice:
    tone: "clear, calm, professional, helpful"
    avoid:
      - "hype"
      - "jargon"
      - "fake friendliness"
      - "overly playful language"

tokens:
  color:
    primary: "#1F4B62"
    accent: "#D97742"
    surface-base: "#FAFAF9"
    text-primary: "#171716"
  typography:
    display: "Fraunces"
    body: "Inter Tight"
    mono: "JetBrains Mono"
  space:
    base: 4
    scale: [0,4,8,12,16,20,24,32,40,48,64,80,96]
  radius:
    sm: 6
    md: 10
    lg: 14
    xl: 20
  motion:
    fast: 160ms
    standard: 240ms
    reduced-motion: required

quality:
  contrast: APCA
  body_text_min_lc: 75
  large_text_min_lc: 45
  ui_element_min_lc: 30
  dqi_min: 0.82
  accessibility_score_min: 0.95
  interaction_task_pass_rate: 1.0

antiPatterns:
  - "purple AI gradients"
  - "centered hero + 3 icon cards"
  - "placeholder as label"
  - "missing loading/empty/error states"
  - "hardcoded colors"
  - "hardcoded spacing"
  - "invisible focus states"
  - "AI silent destructive actions"
---

# Design Philosophy

This design system creates professional interfaces by combining:
1. Clear user intent
2. Strong visual hierarchy
3. Restrained brand expression
4. Complete interaction states
5. Accessibility by default
6. Measurable quality gates

## Visual Principles

- Calm over decorative
- Clarity over cleverness
- Hierarchy over uniformity
- Consistency over novelty
- Feedback over silence
- Recovery over failure

## AI Agent Instructions

Before generating UI:
1. Understand the user's goal.
2. Choose the correct page pattern.
3. Use only design tokens.
4. Implement all required states.
5. Verify accessibility and interaction quality.
6. Screenshot, evaluate, and iterate.
```

---

# 十八、质量预算文件升级

```json
{
  "budget": {
    "hardcodedColors": 0,
    "hardcodedSpacing": 0,
    "hardcodedFontSizes": 0,
    "missingLabels": 0,
    "missingFocusVisible": 0,
    "criticalA11yViolations": 0,
    "keyboardTraps": 0,
    "missingLoadingStates": 0,
    "missingEmptyStates": 0,
    "missingErrorStates": 0,
    "mobileOverflow": 0,
    "deadClicks": 0,
    "aiSilentDestructiveActions": 0
  },
  "scores": {
    "DQI_min": 0.82,
    "accessibility_min": 0.95,
    "interaction_min": 0.9,
    "visual_aesthetic_min": 0.75,
    "brand_coherence_min": 0.8,
    "content_quality_min": 0.75,
    "performance_min": 0.8
  },
  "warnings": {
    "maxColorTokensPerPage": 12,
    "maxFontFamilies": 2,
    "maxShadowLevels": 3,
    "maxPrimaryButtonsPerView": 1,
    "maxNavigationItemsPrimary": 7
  }
}
```

---

# 十九、CI/CD 升级：从四道门禁到六道门禁

```text
Gate 1: Intent & Content Lint
  检查页面意图、文案、空状态、错误文案

Gate 2: Token & Component Lint
  检查硬编码、组件合规、令牌使用

Gate 3: Accessibility Audit
  axe-core、APCA、keyboard、screen reader checks

Gate 4: Interaction Test
  GUI Agent 执行真实任务流

Gate 5: Visual & Brand Review
  截图、VLM、视觉回归、品牌一致性

Gate 6: Performance & DQI Report
  Lighthouse、INP、CLS、最终 DQI 分数
```

---

## GitHub Actions 示例结构

```yaml
name: Design Quality Gate v3

on:
  pull_request:
    paths:
      - "src/**"
      - "design/**"
      - "tests/**"

jobs:
  intent-content-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint:intent
      - run: npm run lint:content

  token-component-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint:tokens
      - run: npm run lint:components

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run audit:a11y
      - run: npm run audit:apca

  interaction:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:interaction

  visual-brand:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run test:visual
      - run: npm run evaluate:brand

  performance-dqi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run audit:lighthouse
      - run: npm run evaluate:dqi
      - uses: actions/upload-artifact@v4
        with:
          name: design-quality-report
          path: reports/design/
```

---

# 二十、实施路线图：从 v2 到 v3

## Phase 1：建立意图与品牌层

目标：让 AI 不再只“做页面”，而是“实现意图”。

任务：

1. 为产品写 `product-intent.md`
2. 为核心页面写 page intent
3. 定义品牌个性向量
4. 定义 voice & tone
5. 选择风格原型
6. 建立默认主题和暗色主题

验收：

- AI 生成页面前能读取意图文件
- 生成结果符合品牌气质
- 不再出现默认 AI 紫色风格

---

## Phase 2：升级令牌系统

目标：从静态令牌升级为上下文感知令牌。

任务：

1. 拆分 global / semantic / component / context / policy tokens
2. 增加 density、motion、contrast、platform、theme tokens
3. 生成 CSS / Tailwind / iOS / Android 适配
4. 建立 token showcase
5. 验证暗色模式和高对比模式

验收：

- 所有颜色、间距、字体、圆角、阴影、动效都来自 token
- 切换主题不需要改组件代码
- 暗色模式无对比度失败

---

## Phase 3：建立组件合约

目标：组件不只是样式，而是行为合约。

任务：

1. 为 20 个核心组件写 contract
2. 增加 loading / empty / error / disabled / focus / keyboard 规范
3. 增加 content 规范
4. 增加 analytics 和 test 要求
5. 建立 Storybook 或组件文档

验收：

- 每个组件都有完整状态
- AI 生成组件时不再遗漏状态
- 表单、Dialog、Table、EmptyState 均符合专业标准

---

## Phase 4：建立交互行为层

目标：让系统具备专业 HCI 质量。

任务：

1. 写 interaction patterns
2. 定义焦点管理
3. 定义错误恢复
4. 定义动效策略
5. 定义 AI UI 交互规范
6. 建立 GUI Agent 测试任务

验收：

- 核心任务流可自动测试
- 键盘用户可完成主要流程
- 错误状态可恢复
- AI 操作透明可控

---

## Phase 5：建立评估引擎

目标：从主观评审变成可量化质量。

任务：

1. 实现 DQI 2.0
2. 集成 APCA
3. 集成 axe-core
4. 集成 Playwright 视觉回归
5. 集成 VLM 截图评审
6. 生成设计质量报告

验收：

- 每个 PR 都有 DQI 报告
- Critical a11y 问题会阻断合并
- 视觉硬编码会阻断合并
- 交互任务失败会阻断合并

---

## Phase 6：生产观测与持续演进

目标：让设计系统成为活的系统。

任务：

1. 接入生产行为数据
2. 追踪 rage click、dead click、form abandonment
3. 追踪设计债务趋势
4. 每月审查 token 使用率
5. 每季度更新 anti-pattern 和风格原型
6. 根据真实用户数据调整规则

验收：

- 设计系统不只服务生成，也服务优化
- 能发现生产环境中的 UX 问题
- 规则能持续演进

---

# 二十一、最终建议：v3 的最小可用版本

如果你希望快速落地，不需要一次做完所有东西。  
建议先做以下 **最小可用 v3**：

## 1. 必备文件

```text
design/
  DESIGN.md
  AGENTS.md
  tokens/
    semantic.json
  components/
    button.md
    input.md
    form-field.md
    dialog.md
    empty-state.md
    data-table.md
  policies/
    accessibility.md
    interaction.md
    anti-patterns.md
  evaluation/
    quality-budget.json
```

## 2. 必备规则

1. 所有颜色、间距、字体必须使用 token。
2. 所有页面必须有 main landmark。
3. 所有输入必须有 label。
4. 所有交互元素必须有 focus-visible。
5. 所有异步操作必须有 loading。
6. 所有列表必须有 empty / error / loading。
7. 所有表单必须有错误恢复。
8. 所有危险操作必须确认或可撤销。
9. 所有 AI 操作必须透明、可停止、可重试。
10. 所有页面必须通过 375px 移动端检查。

## 3. 必备门禁

```text
Token Lint
Accessibility Audit
APCA Contrast Check
Playwright Interaction Test
Screenshot Visual Review
DQI Score Report
```

---

# 二十二、总结：v3 的本质升级

你可以把 v2 理解为：

> **AI 设计质量防御系统。**

而 v3 应该成为：

> **AI 可执行的专业设计操作系统。**

它的核心升级是：

| 从 v2              | 到 v3                                |
| ------------------ | ------------------------------------ |
| 防止 AI 生成丑界面 | 引导 AI 生成有意图的专业界面         |
| 设计规则           | 设计操作系统                         |
| 静态令牌           | 上下文感知令牌                       |
| 组件样式规范       | 组件行为合约                         |
| 视觉反馈           | 多模态感知反馈                       |
| 可访问性检查       | 完整人机交互质量体系                 |
| CI 门禁            | 生产环境设计观测闭环                 |
| Web 设计系统       | 跨平台通用设计内核                   |
| 反模式黑名单       | 分层决策与受控创造                   |
| 审美评分           | 品牌、审美、交互、内容、性能综合 DQI |

最终目标不是让 AI“更像设计师”，而是：

> **让 AI 在明确意图、品牌、令牌、组件合约、交互规范和质量门禁下，稳定生成专业级产品界面。**

这样它既能通用，又能保持高级审美；既符合人机交互专业标准，又能在真实工程中持续运行和演进。