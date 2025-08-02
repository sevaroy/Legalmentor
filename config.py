#!/usr/bin/env python3
"""
RAGFlow 配置文件
"""

import os
from typing import Optional

# RAGFlow 服務配置
RAGFLOW_API_URL: str = os.getenv('RAGFLOW_API_URL', 'http://localhost:9380')
RAGFLOW_API_KEY: str = os.getenv('RAGFLOW_API_KEY', 'your-api-key-here')

# FastAPI 服務配置
FASTAPI_HOST: str = os.getenv('FASTAPI_HOST', '0.0.0.0')
FASTAPI_PORT: int = int(os.getenv('FASTAPI_PORT', '8000'))
FASTAPI_RELOAD: bool = os.getenv('FASTAPI_RELOAD', 'true').lower() == 'true'

# 會話管理配置
SESSION_MAX_AGE_HOURS: int = int(os.getenv('SESSION_MAX_AGE_HOURS', '24'))
SESSION_CLEANUP_INTERVAL_SECONDS: int = int(os.getenv('SESSION_CLEANUP_INTERVAL_SECONDS', '3600'))

# 日誌配置
LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')

# CORS 配置
ALLOWED_ORIGINS: list = os.getenv('ALLOWED_ORIGINS', '*').split(',')

print(f"🔧 RAGFlow API URL: {RAGFLOW_API_URL}")
print(f"🔧 FastAPI 服務: {FASTAPI_HOST}:{FASTAPI_PORT}")