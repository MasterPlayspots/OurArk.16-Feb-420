#!/bin/bash
# Quick validation testing script
# Tests Zod validation on API endpoints

BASE_URL="http://localhost:3000"

echo "🧪 Testing Zod API Validation"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Valid chat request
echo -e "${YELLOW}Test 1: Valid Chat Request${NC}"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"model":"gpt-4"}' \
  | jq -r 'if .error then "❌ FAIL: " + .error else "✅ PASS" end'
echo ""

# Test 2: Missing required field (model)
echo -e "${YELLOW}Test 2: Missing Model (should fail)${NC}"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}' \
  | jq -r 'if .error == "Validation failed" then "✅ PASS (correctly rejected)" else "❌ FAIL" end'
echo ""

# Test 3: Invalid message role
echo -e "${YELLOW}Test 3: Invalid Message Role (should fail)${NC}"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"hacker","content":"Hello"}],"model":"gpt-4"}' \
  | jq -r 'if .error == "Validation failed" then "✅ PASS (correctly rejected)" else "❌ FAIL" end'
echo ""

# Test 4: Empty message content
echo -e "${YELLOW}Test 4: Empty Message Content (should fail)${NC}"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":""}],"model":"gpt-4"}' \
  | jq -r 'if .error == "Validation failed" then "✅ PASS (correctly rejected)" else "❌ FAIL" end'
echo ""

# Test 5: Invalid temperature
echo -e "${YELLOW}Test 5: Invalid Temperature (should fail)${NC}"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}],"model":"gpt-4","temperature":5.0}' \
  | jq -r 'if .error == "Validation failed" then "✅ PASS (correctly rejected)" else "❌ FAIL" end'
echo ""

# Test 6: Valid conversation creation
echo -e "${YELLOW}Test 6: Valid Conversation Creation${NC}"
curl -s -X POST "$BASE_URL/api/conversations" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Chat"}' \
  | jq -r 'if .conversation or .id then "✅ PASS" else "❌ FAIL" end'
echo ""

# Test 7: Empty conversation body (should work - all optional)
echo -e "${YELLOW}Test 7: Empty Conversation Body (should work)${NC}"
curl -s -X POST "$BASE_URL/api/conversations" \
  -H "Content-Type: application/json" \
  -d '{}' \
  | jq -r 'if .conversation or .id or .error != "Validation failed" then "✅ PASS" else "❌ FAIL" end'
echo ""

echo "=============================="
echo "🎉 Validation Tests Complete!"
echo ""
echo "Note: Some tests may show 502/500 if upstream is unreachable."
echo "This is OK - validation happens BEFORE upstream call."
echo "Look for 400 errors with 'Validation failed' message."
