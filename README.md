# BI可视化工具 (BI Visualization Tool)

一个功能完整的前端BI数据分析和可视化平台，支持数据源管理、指标定义、维度配置、可视化卡片设计和报表创建。

## 🌟 功能特性

- **数据源管理** - 支持多种数据源连接和管理
- **指标定义** - 灵活的指标计算和自定义公式
- **维度配置** - 时间、业务、地理等多维度分析
- **可视化卡片** - KPI、图表、表格、地图等多种可视化组件
- **报表设计** - 拖拽布局、筛选条件、响应式设计
- **本地存储** - 使用LocalStorage保存配置和数据

## 🚀 快速开始

### 环境要求
- 现代浏览器（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）
- 无需服务器，纯前端应用
- 支持本地文件访问或HTTP服务器部署

### 安装和运行

#### 方式一：直接打开HTML文件
```bash
# 克隆或下载项目后，直接在浏览器中打开index.html
google-chrome index.html  # 或使用其他浏览器
```

#### 方式二：使用本地HTTP服务器（推荐）
```bash
# 使用Python内置服务器（Python 3）
python3 -m http.server 8000
# 访问 http://localhost:8000

# 使用Node.js的http-server
npx http-server -p 8000

# 使用PHP内置服务器
php -S localhost:8000
```

## 📁 项目结构

```
bi可视化/
├── index.html              # 主页面，系统概览和工作流程
├── datasource.html         # 数据源管理页面
├── metrics.html           # 指标定义页面
├── dimensions.html        # 维度配置页面
├── datacards.html         # 数据卡片设计页面
├── reports.html           # 报表配置页面
├── demo-report-drag.html  # 拖拽布局演示
├── check_localstorage.html # 本地存储检查工具
├── js/                    # JavaScript逻辑文件
│   ├── app.js            # 主应用逻辑
│   ├── dataConfig.js     # 数据配置管理
│   ├── datasource.js     # 数据源管理逻辑
│   ├── metrics.js        # 指标定义逻辑
│   ├── dimensions.js     # 维度配置逻辑
│   ├── datacards.js      # 数据卡片逻辑
│   ├── reports.js        # 报表配置逻辑
│   └── index.js          # 首页逻辑
├── styles/               # 样式文件
│   ├── main.css          # 主样式文件
│   ├── drag-layout.css   # 拖拽布局样式
│   └── dimension-cards.css # 维度卡片样式
└── docs/                 # 文档
    └── PRD.md            # 产品需求文档
```

## 🔧 使用指南

### 1. 数据源管理 (`datasource.html`)
- 添加和管理数据源连接
- 支持数据库、API接口、文件数据源
- 测试连接状态和数据预览

### 2. 指标定义 (`metrics.html`)
- 基于数据源定义业务指标
- 支持基础计算（SUM、COUNT、AVG等）
- 自定义公式和表达式

### 3. 维度配置 (`dimensions.html`)
- 配置时间、业务、地理等维度
- 支持层级维度定义
- 设置维度属性和格式

### 4. 数据卡片 (`datacards.html`)
- 创建各种可视化卡片类型
- 配置卡片样式和交互
- 预览和测试卡片效果

### 5. 报表配置 (`reports.html`)
- 拖拽组合数据卡片
- 设置筛选条件和布局
- 生成和分享报表

## 💡 核心功能

### 数据卡片类型
- **KPI卡片** - 关键指标展示
- **图表卡片** - 折线图、柱状图、饼图等
- **表格卡片** - 数据表格展示
- **地图卡片** - 地理数据可视化

### 数据管理
- **本地存储** - 使用浏览器LocalStorage持久化配置
- **数据导入/导出** - 支持配置数据备份和恢复
- **模板管理** - 预置常用报表模板

### 交互功能
- **拖拽布局** - 灵活的报表布局设计
- **实时预览** - 配置即时生效
- **响应式设计** - 适配不同屏幕尺寸

## 🛠️ 开发说明

### 技术栈
- **前端框架**：纯HTML/CSS/JavaScript
- **数据存储**：浏览器LocalStorage
- **可视化库**：原生Canvas/Chart.js（可扩展）
- **样式框架**：自定义CSS，响应式设计

### 扩展开发
项目采用模块化设计，易于扩展：
- 添加新的数据源类型
- 扩展可视化组件
- 集成后端API
- 添加用户权限管理

### 数据格式
主要数据模型存储在LocalStorage中：
- `dataSources` - 数据源配置
- `metrics` - 指标定义
- `dimensions` - 维度配置
- `dataCards` - 数据卡片
- `reports` - 报表配置

## 📊 演示功能

项目包含完整的演示数据，可以直接体验：
- 示例数据源和指标
- 预置的可视化卡片
- 拖拽布局演示
- 本地存储检查工具

## 🔍 故障排除

### 常见问题
1. **页面无法正常显示**
   - 检查浏览器控制台是否有错误信息
   - 确保文件路径正确
   - 尝试使用HTTP服务器而非直接打开文件

2. **数据丢失**
   - 检查浏览器是否清除了LocalStorage
   - 使用`check_localstorage.html`检查数据状态

3. **功能异常**
   - 刷新页面重新初始化
   - 检查浏览器兼容性
   - 查看控制台错误信息

### 调试工具
- `check_localstorage.html` - 检查本地存储数据
- `reset_data_cards.html` - 重置数据卡片配置
- 浏览器开发者工具 - 查看控制台和网络请求

## 📄 许可证

本项目仅供学习和演示使用。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

---

**开始使用**：打开 `index.html` 或访问部署的地址开始创建您的BI可视化报表！
