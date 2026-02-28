#!/bin/bash

# Verse Creation Automation Script
# Usage: ./scripts/create-verse.sh <collection> <verse_id>
# Example: ./scripts/create-verse.sh sundar-kaand chaupai-05

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    echo "Usage: $0 <collection> <verse_id>"
    echo "Example: $0 sundar-kaand chaupai-05"
    exit 1
fi

COLLECTION="$1"
VERSE_ID_RAW="$2"
# Keep compatibility with old underscore IDs from script usage.
VERSE_ID="${VERSE_ID_RAW//_/-}"
VERSE_FILE="_verses/${COLLECTION}/${VERSE_ID}.md"

resolve_cmd() {
    local cmd="$1"
    if [ -x "./venv/bin/${cmd}" ]; then
        echo "./venv/bin/${cmd}"
        return
    fi
    if command -v "${cmd}" >/dev/null 2>&1; then
        command -v "${cmd}"
        return
    fi
    echo ""
}

VERSE_ADD_CMD="$(resolve_cmd verse-add)"
VERSE_GENERATE_CMD="$(resolve_cmd verse-generate)"
VERSE_EMBED_CMD="$(resolve_cmd verse-embeddings)"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Verse Creation Automation${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Collection: ${GREEN}${COLLECTION}${NC}"
echo -e "Verse ID: ${GREEN}${VERSE_ID}${NC}"
echo ""

echo -e "${YELLOW}Checking prerequisites...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env with OPENAI_API_KEY and ELEVENLABS_API_KEY"
    exit 1
fi

if [ -z "${VERSE_GENERATE_CMD}" ] || [ -z "${VERSE_EMBED_CMD}" ]; then
    echo -e "${RED}Error: Required SDK commands not found.${NC}"
    echo "Ensure verse-generate and verse-embeddings are installed (preferably in ./venv/bin)."
    exit 1
fi

if [ -f "${VERSE_FILE}" ]; then
    echo -e "${YELLOW}Warning: Verse file already exists: ${VERSE_FILE}${NC}"
    read -p "Do you want to continue and regenerate multimedia? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${YELLOW}Step 1: Creating verse placeholder via verse-add...${NC}"
    if [ -n "${VERSE_ADD_CMD}" ]; then
        VERSE_NUM="$(echo "${VERSE_ID}" | grep -oE '[0-9]+' | tail -1 || true)"
        if [ -n "${VERSE_NUM}" ]; then
            VERSE_PREFIX="$(echo "${VERSE_ID}" | sed -E 's/[0-9]+$//')"
            VERSE_WIDTH="${#VERSE_NUM}"
            "${VERSE_ADD_CMD}" \
                --collection "${COLLECTION}" \
                --verse "$((10#${VERSE_NUM}))" \
                --format "${VERSE_PREFIX}{:0${VERSE_WIDTH}d}" \
                --markdown || true
        fi
    fi

    if [ ! -f "${VERSE_FILE}" ]; then
        echo -e "${RED}Verse file was not auto-created.${NC}"
        echo -e "Please create manually: ${VERSE_FILE}"
        read -p "Press Enter when verse file is created..."
    fi

    if [ ! -f "${VERSE_FILE}" ]; then
        echo -e "${RED}Error: Verse file not created${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Verse file ready${NC}"
fi

echo -e "${YELLOW}Step 2: Scene description...${NC}"
SCENE_FILE="docs/image-prompts/${COLLECTION}.md"
if [ ! -f "${SCENE_FILE}" ]; then
    echo -e "${RED}Error: Image prompts file not found: ${SCENE_FILE}${NC}"
    exit 1
fi
echo -e "${RED}Please ensure scene description is added to:${NC}"
echo -e "  File: ${SCENE_FILE}"
echo -e "  Format: ### Verse N: Title + Scene Description"
echo ""
read -p "Press Enter when scene description is added..."
echo -e "${GREEN}✓ Scene description ready${NC}"

echo -e "${YELLOW}Step 3: Generating multimedia (image + audio)...${NC}"
set -a
source .env
set +a

"${VERSE_GENERATE_CMD}" \
  --collection "${COLLECTION}" \
  --verse "${VERSE_ID}" \
  --all \
  --theme modern-minimalist

echo -e "${GREEN}✓ Multimedia generated${NC}"

echo -e "${YELLOW}Step 4: Verifying image naming...${NC}"
IMAGE_DIR="images/${COLLECTION}/modern-minimalist"
EXPECTED_IMAGE="${IMAGE_DIR}/${VERSE_ID}.png"
VERSE_NUM="$(echo "${VERSE_ID}" | grep -oE '[0-9]+' | tail -1 || true)"
GENERATED_IMAGE="$(ls "${IMAGE_DIR}"/*"${VERSE_NUM}"*.png 2>/dev/null | tail -1 || true)"

if [ -n "${GENERATED_IMAGE}" ] && [ "${GENERATED_IMAGE}" != "${EXPECTED_IMAGE}" ]; then
    echo -e "${YELLOW}Renaming image to match convention${NC}"
    mv "${GENERATED_IMAGE}" "${EXPECTED_IMAGE}"
    echo -e "${GREEN}✓ Image renamed: ${EXPECTED_IMAGE}${NC}"
else
    echo -e "${GREEN}✓ Image naming correct${NC}"
fi

echo -e "${YELLOW}Step 5: Regenerating embeddings (canonical per-collection files)...${NC}"
TMP_EMBEDDINGS="$(mktemp)"
"${VERSE_EMBED_CMD}" \
  --multi-collection \
  --collections-file _data/collections.yml \
  --verses-dir _verses \
  --output "${TMP_EMBEDDINGS}"

python3 - <<'PY' "${TMP_EMBEDDINGS}"
import json
import os
import sys
from collections import defaultdict

src = sys.argv[1]
out_dir = "data/embeddings/providers/openai/collections"
os.makedirs(out_dir, exist_ok=True)

with open(src, "r", encoding="utf-8") as f:
    data = json.load(f)

seg_to_collection = {
    "chalisa": "hanuman-chalisa",
    "sundar-kaand": "sundar-kaand",
    "sankat-mochan-hanumanashtak": "sankat-mochan-hanumanashtak",
    "bajrang-baan": "bajrang-baan",
}

bucket = defaultdict(lambda: {"en": [], "hi": []})
for lang in ("en", "hi"):
    for verse in data.get("verses", {}).get(lang, []):
        url = verse.get("url", "").lstrip("/")
        seg = url.split("/")[0] if url else ""
        coll = seg_to_collection.get(seg)
        if not coll:
            continue
        v = dict(verse)
        v["collection"] = coll
        bucket[coll][lang].append(v)

files = []
for coll in sorted(bucket.keys()):
    verses = bucket[coll]
    payload = {
        "collection": coll,
        "model": data.get("model"),
        "dimensions": data.get("dimensions"),
        "provider": data.get("provider"),
        "generated_at": data.get("generated_at"),
        "verses": verses,
    }
    filename = f"{coll}.json"
    path = os.path.join(out_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    files.append(
        {
            "collection": coll,
            "path": f"/data/embeddings/providers/openai/collections/{filename}",
            "counts": {lang: len(verses[lang]) for lang in ("en", "hi")},
        }
    )

manifest = {"version": 1, "files": files}
with open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
PY
rm -f "${TMP_EMBEDDINGS}"

echo -e "${GREEN}✓ Embeddings updated in data/embeddings/providers/openai/collections/${NC}"

echo -e "${YELLOW}Step 6: Verifying generated files...${NC}"
echo ""
echo -e "Verse file: ${GREEN}✓${NC} ${VERSE_FILE}"

if [ -f "${EXPECTED_IMAGE}" ]; then
    IMAGE_SIZE="$(du -h "${EXPECTED_IMAGE}" | cut -f1)"
    echo -e "Image: ${GREEN}✓${NC} ${EXPECTED_IMAGE} (${IMAGE_SIZE})"
else
    echo -e "Image: ${RED}✗${NC} Not found"
fi

AUDIO_FULL="audio/${COLLECTION}/${VERSE_ID}-full.mp3"
AUDIO_SLOW="audio/${COLLECTION}/${VERSE_ID}-slow.mp3"

if [ -f "${AUDIO_FULL}" ]; then
    AUDIO_SIZE="$(du -h "${AUDIO_FULL}" | cut -f1)"
    echo -e "Audio (full): ${GREEN}✓${NC} ${AUDIO_FULL} (${AUDIO_SIZE})"
else
    echo -e "Audio (full): ${RED}✗${NC} Not found"
fi

if [ -f "${AUDIO_SLOW}" ]; then
    AUDIO_SIZE="$(du -h "${AUDIO_SLOW}" | cut -f1)"
    echo -e "Audio (slow): ${GREEN}✓${NC} ${AUDIO_SLOW} (${AUDIO_SIZE})"
else
    echo -e "Audio (slow): ${RED}✗${NC} Not found"
fi

echo -e "Embeddings: ${GREEN}✓${NC} data/embeddings/providers/openai/collections/index.json"
echo ""

echo -e "${YELLOW}Step 7: Update navigation links...${NC}"
echo -e "${RED}Please update the previous verse to link to this one:${NC}"
echo -e "  Find the previous verse file and set: next_verse: \"/${COLLECTION}/${VERSE_ID}\""
echo ""
read -p "Press Enter when navigation is updated..."
echo -e "${GREEN}✓ Navigation updated${NC}"

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✓ Verse creation complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "Test locally:"
echo -e "  ${BLUE}bundle exec jekyll serve${NC}"
echo -e "  http://localhost:4000/${COLLECTION}/${VERSE_ID}/"
echo ""
echo -e "To commit:"
echo -e "  ${BLUE}git add _verses/${COLLECTION}/${VERSE_ID}.md images/${COLLECTION}/ audio/${COLLECTION}/ docs/image-prompts/${COLLECTION}.md data/embeddings/providers/openai/collections/${NC}"
echo -e "  ${BLUE}git commit -m \"Add ${VERSE_ID} to ${COLLECTION} with multimedia\"${NC}"
echo -e "  ${BLUE}git push${NC}"
echo ""
