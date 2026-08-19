from typing import List, Dict, Any


class InsightService:
    """Generate bug reports and recommendations from actual analysis data."""

    def generate_bug_reports(self, repository_id: int, metrics: List[Any], predictions: List[Any]) -> List[Dict[str, Any]]:
        bug_reports = []

        for prediction in predictions:
            file_path = getattr(prediction, 'file_path', None)
            if not file_path:
                continue

            risk_level = getattr(prediction, 'risk_level', 'low')
            fault_probability = getattr(prediction, 'fault_probability', 0.0)

            if risk_level in {'high', 'critical'} or fault_probability >= 0.75:
                severity = 'critical' if risk_level == 'critical' or fault_probability >= 0.9 else 'high'
                bug_reports.append({
                    'repository_id': repository_id,
                    'file_path': file_path,
                    'severity': severity,
                    'description': f'AI/ML analysis flagged {file_path} as high-risk due to fault probability {fault_probability:.2f}.',
                    'status': 'open',
                })

        if not bug_reports:
            for metric in metrics:
                if getattr(metric, 'cyclomatic_complexity', 0) > 20 or getattr(metric, 'maintainability_index', 100) < 50:
                    bug_reports.append({
                        'repository_id': repository_id,
                        'file_path': getattr(metric, 'file_path', 'unknown'),
                        'severity': 'high' if getattr(metric, 'cyclomatic_complexity', 0) > 30 else 'medium',
                        'description': 'Complexity and maintainability metrics indicate a likely defect-prone module.',
                        'status': 'open',
                    })

        return bug_reports

    def generate_recommendations(self, metrics: List[Any], predictions: List[Any]) -> List[Dict[str, Any]]:
        recommendations = []

        critical_files = [p for p in predictions if getattr(p, 'risk_level', 'low') == 'critical']
        if critical_files:
            recommendations.append({
                'id': 'critical-refactor',
                'title': 'Refactor Critical Risk Modules',
                'description': f"{len(critical_files)} module(s) were flagged as critical by the ML model. Prioritize refactoring and testing these files.",
                'priority': 'critical',
                'impact': 'Reduces production defects and improves stability.',
                'modules': [getattr(p, 'file_path', 'unknown') for p in critical_files[:5]],
            })

        high_complexity = [m for m in metrics if getattr(m, 'cyclomatic_complexity', 0) > 15]
        if high_complexity:
            recommendations.append({
                'id': 'complexity-reduction',
                'title': 'Reduce Code Complexity',
                'description': 'High-complexity modules should be split into smaller units and covered by additional tests.',
                'priority': 'high',
                'impact': 'Improves maintainability and lowers defect risk.',
                'modules': [getattr(m, 'file_path', 'unknown') for m in high_complexity[:5]],
            })

        low_maintainability = [m for m in metrics if getattr(m, 'maintainability_index', 100) < 50]
        if low_maintainability:
            recommendations.append({
                'id': 'maintainability-improve',
                'title': 'Improve Maintainability',
                'description': 'Modules with low maintainability should receive refactoring and documentation updates.',
                'priority': 'medium',
                'impact': 'Improves long-term maintainability and team productivity.',
                'modules': [getattr(m, 'file_path', 'unknown') for m in low_maintainability[:5]],
            })

        return recommendations
