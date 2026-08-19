import unittest

from services.insight_service import InsightService


class FakeMetric:
    def __init__(self, file_path, complexity, maintainability, loc=100):
        self.file_path = file_path
        self.cyclomatic_complexity = complexity
        self.maintainability_index = maintainability
        self.lines_of_code = loc


class FakePrediction:
    def __init__(self, file_path, probability, risk_level):
        self.file_path = file_path
        self.fault_probability = probability
        self.risk_level = risk_level


class InsightServiceTests(unittest.TestCase):
    def setUp(self):
        self.service = InsightService()

    def test_generate_bug_reports_from_risky_files(self):
        metrics = [
            FakeMetric('src/auth.py', 35, 40, 250),
            FakeMetric('src/payments.py', 10, 78, 120),
        ]
        predictions = [
            FakePrediction('src/auth.py', 0.9, 'critical'),
            FakePrediction('src/payments.py', 0.2, 'low'),
        ]

        bugs = self.service.generate_bug_reports(7, metrics, predictions)

        self.assertTrue(len(bugs) >= 1)
        self.assertEqual(bugs[0]['repository_id'], 7)
        self.assertEqual(bugs[0]['file_path'], 'src/auth.py')
        self.assertIn(bugs[0]['severity'], {'high', 'critical'})
        self.assertEqual(bugs[0]['status'], 'open')

    def test_generate_recommendations_from_real_analysis(self):
        metrics = [
            FakeMetric('src/auth.py', 35, 40, 250),
            FakeMetric('src/payments.py', 12, 60, 140),
        ]
        predictions = [
            FakePrediction('src/auth.py', 0.9, 'critical'),
            FakePrediction('src/payments.py', 0.4, 'medium'),
        ]

        recommendations = self.service.generate_recommendations(metrics, predictions)

        self.assertTrue(len(recommendations) >= 2)
        self.assertEqual(recommendations[0]['modules'][0], 'src/auth.py')
        self.assertIn(recommendations[0]['priority'], {'high', 'critical'})


if __name__ == '__main__':
    unittest.main()
