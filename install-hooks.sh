#!/bin/bash
#
# Install repository-managed Git hooks.
#

set -euo pipefail

HOOKS_DIR=".githooks"

echo "Installing Git hooks from ${HOOKS_DIR}..."

if [ ! -d "${HOOKS_DIR}" ]; then
  echo "✗ ${HOOKS_DIR} directory not found."
  exit 1
fi

chmod +x "${HOOKS_DIR}/"*
git config core.hooksPath "${HOOKS_DIR}"

echo "✓ Enabled hooks via core.hooksPath=${HOOKS_DIR}"
echo "✓ Hooks are executable"
echo ""
echo "Enabled hooks:"
echo "  • commit-msg: Conventional Commits validation"
echo "  • prepare-commit-msg: Adds AI-assisted-by: OpenAI Codex trailer"
echo ""
echo "To bypass local hooks for one commit (not recommended):"
echo "  git commit --no-verify"
