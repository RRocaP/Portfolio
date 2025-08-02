#!/bin/bash

# Content Validation Script
# Ensures biographical and research content remains unchanged

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Content Validation Test ===${NC}"

# Critical content patterns that must be preserved
check_patterns() {
    case "$1" in
        "phd_institution") echo "Autonomous University of Barcelona" ;;
        "name") echo "Ramon Roca Pinilla" ;;
        "title") echo "Biomedical Engineer.*Molecular Biologist" ;;
        "tagline") echo "Fighting antimicrobial resistance through rigorous science" ;;
    esac
}

# Files to check for content preservation
FILES_TO_CHECK=(
    "src/i18n/en.json"
    "src/i18n/es.json" 
    "src/i18n/ca.json"
    "src/components/Hero.astro"
    "README.md"
)

# Function to check if content exists in files
check_content() {
    local pattern="$1"
    local description="$2"
    local found=false
    
    echo -n "Checking $description... "
    
    for file in "${FILES_TO_CHECK[@]}"; do
        if [ -f "$file" ]; then
            if grep -q "$pattern" "$file" 2>/dev/null; then
                found=true
                break
            fi
        fi
    done
    
    if [ "$found" = true ]; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗ MISSING${NC}"
        return 1
    fi
}

# Function to check for prohibited changes
check_no_hallucinations() {
    echo -n "Checking for content hallucinations... "
    
    # Check for common AI hallucinations
    PROHIBITED_PATTERNS=(
        "KU Leuven.*PhD"
        "University of.*PhD.*[0-9]{4}"
        "completed.*PhD.*[0-9]{4}"
        "graduated.*[0-9]{4}"
    )
    
    for pattern in "${PROHIBITED_PATTERNS[@]}"; do
        for file in "${FILES_TO_CHECK[@]}"; do
            if [ -f "$file" ] && grep -q "$pattern" "$file" 2>/dev/null; then
                echo -e "${RED}✗ HALLUCINATION DETECTED: $pattern${NC}"
                echo -e "${RED}Found in: $file${NC}"
                return 1
            fi
        done
    done
    
    echo -e "${GREEN}✓${NC}"
    return 0
}

# Function to validate i18n structure
validate_i18n_structure() {
    echo -n "Validating i18n structure... "
    
    REQUIRED_KEYS=(
        ".hero.name"
        ".hero.title" 
        ".hero.tagline"
        ".timeline.institutions.uab"
        ".contact.title"
    )
    
    for lang in en es ca; do
        local file="src/i18n/${lang}.json"
        if [ ! -f "$file" ]; then
            echo -e "${RED}✗ Missing $lang.json${NC}"
            return 1
        fi
        
        for key in "${REQUIRED_KEYS[@]}"; do
            if ! jq -e "$key" "$file" >/dev/null 2>&1; then
                echo -e "${RED}✗ Missing key $key in $lang.json${NC}"
                return 1
            fi
        done
    done
    
    echo -e "${GREEN}✓${NC}"
    return 0
}

# Function to check file integrity
check_file_integrity() {
    echo -n "Checking file integrity... "
    
    for file in "${FILES_TO_CHECK[@]}"; do
        if [ ! -f "$file" ]; then
            echo -e "${RED}✗ Missing required file: $file${NC}"
            return 1
        fi
        
        if [ ! -s "$file" ]; then
            echo -e "${RED}✗ Empty file: $file${NC}"
            return 1
        fi
    done
    
    echo -e "${GREEN}✓${NC}"
    return 0
}

# Main validation process
ERRORS=0

echo "Validating content preservation..."
echo "=================================="

# Check file integrity first
if ! check_file_integrity; then
    ((ERRORS++))
fi

# Check required content patterns
for pattern in "phd_institution" "name" "title" "tagline"; do
    content_pattern=$(check_patterns "$pattern")
    if ! check_content "$content_pattern" "$pattern"; then
        ((ERRORS++))
    fi
done

# Check for hallucinations
if ! check_no_hallucinations; then
    ((ERRORS++))
fi

# Validate i18n structure
if ! validate_i18n_structure; then
    ((ERRORS++))
fi

# Summary
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All content validation tests passed!${NC}"
    echo -e "${GREEN}Content integrity preserved.${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS validation test(s) failed!${NC}"
    echo -e "${RED}Content integrity compromised.${NC}"
    echo ""
    echo "Please fix the above issues before proceeding."
    echo "Content must be preserved exactly as specified."
    exit 1
fi