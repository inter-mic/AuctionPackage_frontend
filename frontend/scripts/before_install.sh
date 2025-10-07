#!/usr/bin/env bash
set -euo pipefail

# ディレクトリ準備＆所有権
sudo mkdir -p /opt/next-app/{releases,_incoming,logs}
sudo chown -R appuser:appuser /opt/next-app

# 直前の_incomingを掃除（CodeDeployの上書きと競合しないように）
rm -rf /opt/next-app/_incoming/*
