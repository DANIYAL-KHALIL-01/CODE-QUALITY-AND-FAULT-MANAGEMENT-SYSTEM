"""
Test Mapping Service
Maps tests to source modules and identifies impacted tests
"""

from typing import List, Dict, Set, Any
from difflib import SequenceMatcher


class TestMapping:
    """Service for mapping tests to source modules and finding impacted tests"""
    
    def __init__(self):
        pass
    
    def map_tests_to_modules(self, tests: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """
        Create mapping of source modules to test files that cover them.
        Returns: {'module_path': ['test_file_path', ...]}
        """
        mapping = {}
        
        for test in tests:
            for module in test.get('covered_modules', []):
                mapping.setdefault(module, []).append(test['path'])
        
        return mapping
    
    def find_impacted_tests(
        self,
        changed_files: List[str],
        test_mapping: Dict[str, List[str]]
    ) -> Dict[str, Any]:
        """
        Identify which tests are impacted by changed files.
        
        Returns: {
            'directly_impacted': [test files that test changed modules],
            'indirectly_impacted': [test files that may be affected],
            'unimpacted': [test files not related to changes]
        }
        """
        directly_impacted = set()
        unimpacted = set()
        changed_set = set(changed_files)
        
        all_tests = set()
        for module, test_paths in test_mapping.items():
            all_tests.update(test_paths)
            if module in changed_set or self._is_related_module(module, changed_set):
                directly_impacted.update(test_paths)

        unimpacted.update(all_tests - directly_impacted)
        
        return {
            'directly_impacted': sorted(list(directly_impacted)),
            'indirectly_impacted': [],  # Can be enhanced with static analysis
            'unimpacted': sorted(list(unimpacted))
        }
    
    def _is_related_module(self, module: str, changed_files: Set[str]) -> bool:
        """Check if a module is related to any changed file"""
        module_base = module.replace('.py', '').replace('.js', '').replace('.ts', '')
        
        for changed_file in changed_files:
            changed_base = changed_file.replace('.py', '').replace('.js', '').replace('.ts', '')
            
            # Check if they share common parts
            if module_base == changed_base:
                return True
            
            # Check if one is in the path of another
            if '/' in module_base or '/' in changed_base:
                if module_base in changed_base or changed_base in module_base:
                    return True
            
            # Fuzzy match for similar names
            similarity = SequenceMatcher(None, module_base, changed_base).ratio()
            if similarity > 0.6:  # 60% similarity threshold
                return True
        
        return False
    
    def rank_impacted_tests(
        self,
        impacted_tests: List[str],
        test_metadata: Dict[str, Dict[str, Any]],
        changed_file_count: int
    ) -> List[Dict[str, Any]]:
        """
        Rank impacted tests by priority.
        Consider: direct vs indirect impact, test size, and fail history
        """
        ranked = []
        
        for test_path in impacted_tests:
            metadata = test_metadata.get(test_path, {})
            
            score = 100  # Base score for impacted tests
            
            # Larger tests (more complex) get higher priority
            test_size = metadata.get('size', 0)
            complexity_bonus = min(10, test_size // 1000)  # Up to 10 points for large tests
            
            # Tests with failure history get higher priority
            failure_count = metadata.get('failure_count', 0)
            failure_bonus = min(15, failure_count * 5)  # Up to 15 points
            
            # Consider change impact breadth
            impact_bonus = min(5, changed_file_count)  # Up to 5 points
            
            total_score = score + complexity_bonus + failure_bonus + impact_bonus
            
            ranked.append({
                'test_path': test_path,
                'priority_score': total_score,
                'reason': self._generate_reason(metadata, failure_count, changed_file_count)
            })
        
        # Sort by score descending
        return sorted(ranked, key=lambda x: x['priority_score'], reverse=True)
    
    def _generate_reason(self, metadata: Dict, failure_count: int, changed_file_count: int) -> str:
        """Generate a human-readable reason for prioritization"""
        reasons = []
        
        if failure_count > 0:
            reasons.append(f"{failure_count} previous failures")
        
        if changed_file_count > 0:
            reasons.append(f"tests {changed_file_count} changed module(s)")
        
        if metadata.get('size', 0) > 5000:
            reasons.append("comprehensive test coverage")
        
        return "; ".join(reasons) if reasons else "affected by recent changes"
