# Salesforce-proxy

[![GitHub stars](https://img.shields.io/github/stars/proxystar4u/Salesforce-proxy?style=social)](https://github.com/proxystar4u/Salesforce-proxy/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/proxystar4u/Salesforce-proxy)](https://github.com/proxystar4u/Salesforce-proxy/issues)
[![GitHub license](https://img.shields.io/github/license/proxystar4u/Salesforce-proxy)](https://github.com/proxystar4u/Salesforce-proxy/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-red)](https://playwright.dev/)
[![Jest](https://img.shields.io/badge/Jest-30.4.2-red)](https://jestjs.io/)

## Project Overview

Salesforce-proxy is an AI-powered Salesforce automation system that uses an intelligent browser agent to automate complex Salesforce workflows. It combines browser automation, LLM-based planning (NVIDIA Nemotron-3-Ultra), visual verification (OCR + object detection), and self-healing recovery to complete Salesforce tasks autonomously.

## Architecture

The project consists of the following components:

- [engine](https://github.com/proxystar4u/Salesforce-proxy/tree/main/engine): Core Node.js automation engine (browser observation, planning, execution, verification)
- [Salesforce-Agent](https://github.com/proxystar4u/Salesforce-proxy/tree/main/Salesforce-Agent): Salesforce-specific automation logic
- [memory](https://github.com/proxystar4u/Salesforce-proxy/tree/main/memory): Vector memory adapters (ChromaDB, Qdrant)
- [extension](https://github.com/proxystar4u/Salesforce-proxy/tree/main/extension): Browser extension (popup UI)
- [tests](https://github.com/proxystar4u/Salesforce-proxy/tree/main/tests): Unit, integration, browser, benchmark tests

## Features

- **Browser Automation**: Playwright-powered browser control with full DOM interaction
- **AI-Driven Planning**: NVIDIA Nemotron-3-Ultra LLM for intelligent task planning
- **Visual Verification**: OCR (Tesseract.js) and object detection for UI validation
- **Self-Healing Recovery**: Automatic error detection and recovery mechanisms
- **Audit Logging**: Comprehensive action logging and traceability
- **Health Monitoring**: Real-time system health dashboard
- **Vector Memory**: Experience replay with ChromaDB/Qdrant for learning
- **Browser Extension**: Manifest V3 extension for seamless integration

## Prerequisites

- Node.js >= 20.x
- TypeScript >= 6.0
- Playwright >= 1.x
- NVIDIA Nemotron-3-Ultra API access
- ChromaDB or Qdrant (vector database)
- Jest >= 30.x
- Python >= 3.11 (for tooling)

## Installation

### Root

```bash
npm install
```

### Engine

```bash
cd engine
npm install
```

### Salesforce-Agent

```bash
cd Salesforce-Agent
npm install
```

## Configuration

1. Copy environment example files:

```bash
cp .env.example .env
cp engine/.env.example engine/.env
```

2. Configure API keys and endpoints in `.env` files:

```env
# NVIDIA Nemotron API
NEMOTRON_API_KEY=your_api_key_here
NEMOTRON_MODEL=nvidia/nemotron-3-ultra-550b-a55b

# Vector Database (choose one)
CHROMA_API_KEY=your_chroma_key
# or
QDRANT_API_KEY=your_qdrant_key

# Salesforce (optional)
SALESFORCE_USERNAME=your_username
SALESFORCE_PASSWORD=your_password
SALESFORCE_SECURITY_TOKEN=your_token
```

## Usage Examples

### CLI

```bash
npm run cli
```

### HTTP Proxy

```bash
npm run http-proxy
```

### Direct API

```bash
npm run api
```

## Project Structure Overview

```
engine/           # Core Node.js automation engine
Salesforce-Agent/ # Salesforce-specific automation logic
memory/           # Vector memory adapters (ChromaDB, Qdrant)
extension/        # Browser extension (popup UI)
tests/            # Unit, integration, browser, benchmark tests
src/              # TypeScript source files
```

## Testing Commands

- **Unit tests**: `npm run test:unit`
- **Integration tests**: `npm run test:integration`
- **Browser tests**: `npm run test:browser`
- **Benchmark tests**: `npm run test:benchmark`
- **All tests with coverage**: `npm run test:coverage`

## Building/Deployment

- **Build**: `npm run build`
- **Deploy**: `npm run deploy`
- **Start**: `npm start`

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/proxystar4u/Salesforce-proxy/blob/main/LICENSE) file for details.

## Links to Docs/Contracts

- [Documentation](https://github.com/proxystar4u/Salesforce-proxy/blob/main/docs/README.md)
- [Contracts](https://github.com/proxystar4u/Salesforce-proxy/blob/main/contracts/README.md)
- [API Reference](https://github.com/proxystar4u/Salesforce-proxy/blob/main/docs/API.md)

## Language Switcher

- [English](#english)
- [Spanish](#spanish)
- [French](#french)
- [German](#german)
- [Chinese (Simplified)](#chinese-simplified)
- [Japanese](#japanese)
- [Portuguese](#portuguese)
- [Korean](#korean)

---

## English

[](https://github.com/proxystar4u/Salesforce-proxy#english)

### Project Overview

Salesforce-proxy is an AI-powered Salesforce automation system that uses an intelligent browser agent to automate complex Salesforce workflows. It combines browser automation, LLM-based planning (NVIDIA Nemotron-3-Ultra), visual verification (OCR + object detection), and self-healing recovery to complete Salesforce tasks autonomously.

### Key Features

- **Intelligent Browser Automation**: Playwright-powered browser control with full DOM interaction
- **AI Planning Engine**: NVIDIA Nemotron-3-Ultra LLM for intelligent task decomposition
- **Visual Verification**: OCR (Tesseract.js) and object detection for UI validation
- **Self-Healing Recovery**: Automatic error detection and recovery mechanisms
- **Audit Logging**: Comprehensive action logging and traceability
- **Health Monitoring**: Real-time system health dashboard
- **Vector Memory**: Experience replay with ChromaDB/Qdrant for learning
- **Browser Extension**: Manifest V3 extension for seamless integration

### Getting Started

```bash
# Clone the repository
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy

# Install dependencies
npm install

# Install engine dependencies
cd engine && npm install && cd ..

# Install Salesforce-Agent dependencies
cd Salesforce-Agent && npm install && cd ..

# Configure environment
cp .env.example .env
cp engine/.env.example engine/.env

# Edit .env files with your API keys
```

### Quick Start

```bash
# Build the project
npm run build

# Start the engine
npm start

# Or run tests
npm test
```

### Architecture

The system follows an observe-plan-execute-verify loop:

1. **Observation**: Capture browser state (DOM, screenshots, accessibility tree)
2. **Planning**: LLM generates action plan based on goal and observations
3. **Execution**: Playwright executes planned actions
4. **Verification**: Visual + DOM verification confirms success
5. **Recovery**: Self-healing on failure (retry, replan, escalate)

### Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEMOTRON_API_KEY` | Yes | - | NVIDIA Nemotron API key |
| `NEMOTRON_MODEL` | No | `nvidia/nemotron-3-ultra-550b-a55b` | Model identifier |
| `CHROMA_API_KEY` | Conditional | - | ChromaDB API key (if using Chroma) |
| `QDRANT_API_KEY` | Conditional | - | Qdrant API key (if using Qdrant) |
| `SALESFORCE_USERNAME` | No | - | Salesforce username for automation |
| `SALESFORCE_PASSWORD` | No | - | Salesforce password |
| `SALESFORCE_SECURITY_TOKEN` | No | - | Salesforce security token |

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npx jest tests/unit

# Run in watch mode
npm run test:watch
```

### Deployment

```bash
# Build for production
npm run build

# Deploy
npm run deploy
```

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](https://github.com/proxystar4u/Salesforce-proxy/blob/main/CONTRIBUTING.md) for guidelines.

### License

MIT License - see [LICENSE](https://github.com/proxystar4u/Salesforce-proxy/blob/main/LICENSE) for details.

---

## Spanish

[](https://github.com/proxystar4u/Salesforce-proxy#spanish)

### Descripción del Proyecto

Salesforce-proxy es un sistema de automatización de Salesforce impulsado por IA que utiliza un agente de navegador inteligente para automatizar flujos de trabajo complejos de Salesforce. Combina automatización del navegador, planificación basada en LLM (NVIDIA Nemotron-3-Ultra), verificación visual (OCR + detección de objetos) y recuperación automática para completar tareas de Salesforce de forma autónoma.

### Características Principales

- **Automatización Inteligente del Navegador**: Control del navegador con Playwright
- **Motor de Planificación IA**: NVIDIA Nemotron-3-Ultra LLM
- **Verificación Visual**: OCR y detección de objetos
- **Recuperación Automática**: Detección y recuperación automática de errores
- **Registro de Auditoría**: Registro completo de acciones
- **Monitoreo de Salud**: Panel de salud del sistema en tiempo real
- **Memoria Vectorial**: Repetición de experiencias con ChromaDB/Qdrant
- **Extensión del Navegador**: Extensión Manifest V3

### Instalación

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### Uso

```bash
npm run build
npm start
npm test
```

### Licencia

MIT License

---

## French

[](https://github.com/proxystar4u/Salesforce-proxy#french)

### Aperçu du Projet

Salesforce-proxy est un système d'automatisation Salesforce alimenté par l'IA qui utilise un agent de navigateur intelligent pour automatiser des flux de travail Salesforce complexes. Il combine l'automatisation du navigateur, la planification basée sur LLM (NVIDIA Nemotron-3-Ultra), la vérification visuelle (OCR + détection d'objets) et la récupération automatique pour accomplir des tâches Salesforce de manière autonome.

### Fonctionnalités

- **Automatisation Intelligente du Navigateur**: Contrôle du navigateur avec Playwright
- **Moteur de Planification IA**: NVIDIA Nemotron-3-Ultra LLM
- **Vérification Visuelle**: OCR et détection d'objets
- **Récupération Automatique**: Détection et récupération automatique des erreurs
- **Journal d'Audit**: Journalisation complète des actions
- **Surveillance de la Santé**: Tableau de bord de santé du système en temps réel
- **Mémoire Vectorielle**: Rejeu d'expérience avec ChromaDB/Qdrant
- **Extension du Navigateur**: Extension Manifest V3

### Installation

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### Utilisation

```bash
npm run build
npm start
npm test
```

### Licence

MIT License

---

## German

[](https://github.com/proxystar4u/Salesforce-proxy#german)

### Projektübersicht

Salesforce-proxy ist ein KI-gestütztes Salesforce-Automatisierungssystem, das einen intelligenten Browser-Agenten verwendet, um komplexe Salesforce-Workflows zu automatisieren. Es kombiniert Browser-Automatisierung, LLM-basierte Planung (NVIDIA Nemotron-3-Ultra), visuelle Überprüfung (OCR + Objekterkennung) und Selbstheilung, um Salesforce-Aufgaben autonom zu erledigen.

### Funktionen

- **Intelligente Browser-Automatisierung**: Browser-Steuerung mit Playwright
- **KI-Planungsmodul**: NVIDIA Nemotron-3-Ultra LLM
- **Visuelle Überprüfung**: OCR und Objekterkennung
- **Selbstheilung**: Automatische Fehlererkennung und -behebung
- **Audit-Protokollierung**: Umfassende Aktionsprotokollierung
- **Gesundheitsüberwachung**: Echtzeit-Systemgesundheitsdashboard
- **Vektorspeicher**: Erfahrungswiedergabe mit ChromaDB/Qdrant
- **Browser-Erweiterung**: Manifest V3 Erweiterung

### Installation

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### Verwendung

```bash
npm run build
npm start
npm test
```

### Lizenz

MIT License

---

## Chinese (Simplified)

[](https://github.com/proxystar4u/Salesforce-proxy#chinese-simplified)

### 项目概述

Salesforce-proxy 是一个由 AI 驱动的 Salesforce 自动化系统，使用智能浏览器代理来自动化复杂的 Salesforce 工作流。它结合了浏览器自动化、基于 LLM 的规划（NVIDIA Nemotron-3-Ultra）、视觉验证（OCR + 对象检测）和自我修复恢复，自主完成 Salesforce 任务。

### 主要功能

- **智能浏览器自动化**：使用 Playwright 进行浏览器控制
- **AI 规划引擎**：NVIDIA Nemotron-3-Ultra LLM
- **视觉验证**：OCR 和对象检测
- **自我修复恢复**：自动错误检测和恢复
- **审计日志**：全面的操作记录
- **健康监控**：实时系统健康仪表板
- **向量内存**：使用 ChromaDB/Qdrant 进行经验回放
- **浏览器扩展**：Manifest V3 扩展

### 安装

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### 使用

```bash
npm run build
npm start
npm test
```

### 许可证

MIT License

---

## Japanese

[](https://github.com/proxystar4u/Salesforce-proxy#japanese)

### プロジェクト概要

Salesforce-proxyは、インテリジェントブラウザエージェントを使用して複雑なSalesforceワークフローを自動化するAI搭載Salesforce自動化システムです。ブラウザ自動化、LLMベースの計画（NVIDIA Nemotron-3-Ultra）、視覚的検証（OCR + オブジェクト検出）、および自己修復リカバリを組み合わせて、Salesforceタスクを自律的に完了します。

### 主な機能

- **インテリジェントブラウザ自動化**: Playwrightによるブラウザ制御
- **AI計画エンジン**: NVIDIA Nemotron-3-Ultra LLM
- **視覚的検証**: OCRとオブジェクト検出
- **自己修復**: 自動エラー検出と回復
- **監査ログ**: 包括的な操作ログ
- **ヘルスモニタリング**: リアルタイムシステムヘルスダッシュボード
- **ベクトルメモリ**: ChromaDB/Qdrantによる経験再生
- **ブラウザ拡張**: Manifest V3拡張

### インストール

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### 使用方法

```bash
npm run build
npm start
npm test
```

### ライセンス

MIT License

---

## Portuguese

[](https://github.com/proxystar4u/Salesforce-proxy#portuguese)

### Visão Geral do Projeto

Salesforce-proxy é um sistema de automação Salesforce com IA que usa um agente de navegador inteligente para automatizar fluxos de trabalho complexos do Salesforce. Ele combina automação de navegador, planejamento baseado em LLM (NVIDIA Nemotron-3-Ultra), verificação visual (OCR + detecção de objetos) e recuperação automática para concluir tarefas do Salesforce de forma autônoma.

### Principais Recursos

- **Automação Inteligente do Navegador**: Controle de navegador com Playwright
- **Motor de Planejamento IA**: NVIDIA Nemotron-3-Ultra LLM
- **Verificação Visual**: OCR e detecção de objetos
- **Recuperação Automática**: Detecção e recuperação automática de erros
- **Registro de Auditoria**: Registro abrangente de ações
- **Monitoramento de Saúde**: Painel de saúde do sistema em tempo real
- **Memória Vetorial**: Replay de experiência com ChromaDB/Qdrant
- **Extensão do Navegador**: Extensão Manifest V3

### Instalação

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### Uso

```bash
npm run build
npm start
npm test
```

### Licença

MIT License

---

## Korean

[](https://github.com/proxystar4u/Salesforce-proxy#korean)

### 프로젝트 개요

Salesforce-proxy는 지능형 브라우저 에이전트를 사용하여 복잡한 Salesforce 워크플로를 자동화하는 AI 기반 Salesforce 자동화 시스템입니다. 브라우저 자동화, LLM 기반 계획(NVIDIA Nemotron-3-Ultra), 시각적 검증(OCR + 객체 감지) 및 자동 복구를 결합하여 Salesforce 작업을 자율적으로 완료합니다.

### 주요 기능

- **지능형 브라우저 자동화**: Playwright를 사용한 브라우저 제어
- **AI 계획 엔진**: NVIDIA Nemotron-3-Ultra LLM
- **시각적 검증**: OCR 및 객체 감지
- **자동 복구**: 자동 오류 감지 및 복구
- **감사 로깅**: 포괄적인 작업 로깅
- **상태 모니터링**: 실시간 시스템 상태 대시보드
- **벡터 메모리**: ChromaDB/Qdrant를 사용한 경험 재생
- **브라우저 확장**: Manifest V3 확장

### 설치

```bash
git clone https://github.com/proxystar4u/Salesforce-proxy.git
cd Salesforce-proxy
npm install
cd engine && npm install && cd ..
cd Salesforce-Agent && npm install && cd ..
cp .env.example .env
cp engine/.env.example engine/.env
```

### 사용법

```bash
npm run build
npm start
npm test
```

### 라이선스

MIT License
