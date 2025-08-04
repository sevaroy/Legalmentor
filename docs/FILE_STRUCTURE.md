# 项目文件结构说明

## 目录结构

```
morphic/
├── app/                    # Next.js 应用页面
├── components/             # React 组件
├── lib/                    # 核心库文件
├── hooks/                  # React Hooks
├── public/                 # 静态资源
├── ragflow_fastapi/        # RAGFlow FastAPI 服务
├── tests/                  # 测试文件 (新整理)
│   ├── unit/              # 单元测试
│   ├── integration/       # 集成测试
│   └── e2e/               # 端到端测试
├── tools/                  # 工具脚本 (新整理)
├── config/                 # 配置文件 (新整理)
├── docs/                   # 文档文件 (重新整理)
└── scripts/                # 构建和部署脚本
```

## 文件分类说明

### tests/ 目录
- `unit/` - 单元测试文件
  - `test_fastapi.py` - FastAPI 单元测试
- `integration/` - 集成测试文件
  - `test_ragflow_connection.py` - RAGFlow 连接测试
  - `test-knowledge-api.js` - 知识库 API 测试
- `e2e/` - 端到端测试文件
  - `interactive-test.js` - 交互式测试
  - `quick-strategy-test.js` - 快速策略测试
  - `test-all-features.js` - 全功能测试

### tools/ 目录
- `check-env.sh` - 环境检查脚本
- `start-local.sh` - 本地启动脚本
- `stop-local.sh` - 本地停止脚本
- `test-setup.sh` - 测试环境设置脚本

### config/ 目录
- `docker-compose.yaml` - Docker 编排配置
- `searxng-limiter.toml` - SearXNG 限制配置
- `searxng-settings.yml` - SearXNG 设置配置

### docs/ 目录
- `intelligent-search-strategy.md` - 智能搜索策略文档
- `TEST_PROMPTS.md` - 测试提示文档
- `TESTING_GUIDE.md` - 测试指南
- `STRATEGY_TEST_SUMMARY.md` - 策略测试总结
- `LOCAL_SETUP.md` - 本地设置指南
- `CHECKLIST.md` - 检查清单
- `README_LEGALMENTOR.md` - LegalMentor 说明
- `CLAUDE.md` - Claude 相关文档

## 运行测试

```bash
# 单元测试
python tests/unit/test_fastapi.py

# 集成测试
python tests/integration/test_ragflow_connection.py
node tests/integration/test-knowledge-api.js

# 端到端测试
node tests/e2e/interactive-test.js
node tests/e2e/quick-strategy-test.js
node tests/e2e/test-all-features.js
```

## 使用工具脚本

```bash
# 检查环境
./tools/check-env.sh

# 启动本地服务
./tools/start-local.sh

# 停止本地服务
./tools/stop-local.sh

# 设置测试环境
./tools/test-setup.sh
```