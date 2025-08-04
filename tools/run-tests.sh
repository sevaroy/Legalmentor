#!/bin/bash

# 测试运行脚本
# 用法: ./tools/run-tests.sh [unit|integration|e2e|all]

set -e

TEST_TYPE=${1:-all}

echo "🧪 运行测试: $TEST_TYPE"

case $TEST_TYPE in
  "unit")
    echo "运行单元测试..."
    if [ -f "tests/unit/test_fastapi.py" ]; then
      python tests/unit/test_fastapi.py
    fi
    ;;
  "integration")
    echo "运行集成测试..."
    if [ -f "tests/integration/test_ragflow_connection.py" ]; then
      python tests/integration/test_ragflow_connection.py
    fi
    if [ -f "tests/integration/test-knowledge-api.js" ]; then
      node tests/integration/test-knowledge-api.js
    fi
    ;;
  "e2e")
    echo "运行端到端测试..."
    if [ -f "tests/e2e/quick-strategy-test.js" ]; then
      node tests/e2e/quick-strategy-test.js
    fi
    if [ -f "tests/e2e/test-all-features.js" ]; then
      node tests/e2e/test-all-features.js
    fi
    ;;
  "all")
    echo "运行所有测试..."
    $0 unit
    $0 integration
    $0 e2e
    ;;
  *)
    echo "用法: $0 [unit|integration|e2e|all]"
    exit 1
    ;;
esac

echo "✅ 测试完成!"