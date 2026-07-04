<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chapter 2: Software Requirements Specification (SRS)</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #2c3e50;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #3498db;
        }

        h1 {
            font-size: 2.5em;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .doc-info {
            color: #7f8c8d;
            font-size: 1.1em;
        }

        h2 {
            font-size: 2em;
            color: #2c3e50;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
            page-break-after: avoid;
        }

        h3 {
            font-size: 1.5em;
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
            page-break-after: avoid;
        }

        h4 {
            font-size: 1.2em;
            color: #34495e;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        p {
            margin-bottom: 15px;
            text-align: justify;
        }

        ul, ol {
            margin-left: 30px;
            margin-bottom: 15px;
        }

        li {
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        th {
            background-color: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        td {
            padding: 10px;
            border: 1px solid #ddd;
        }

        tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .box {
            background: #ecf0f1;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            page-break-inside: avoid;
        }

        .priority-high {
            color: #e74c3c;
            font-weight: bold;
        }

        .priority-medium {
            color: #f39c12;
            font-weight: bold;
        }

        .priority-low {
            color: #27ae60;
            font-weight: bold;
        }

        .tech-stack {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .diagram-box {
            background: #f8f9fa;
            border: 2px solid #3498db;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid;
        }

        .diagram-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            text-align: center;
        }

        .diagram-description {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 12px 0 18px 0;
            font-style: italic;
        }

        .diagram-image-container {
            text-align: center;
            padding: 15px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 15px 0;
        }

        .mermaid {
            background: white;
            padding: 10px;
            border-radius: 5px;
        }

        .note-box {
            background: #e3f2fd;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
                padding: 20px;
            }

            h2 {
                page-break-after: avoid;
            }

            table, .box, .code-block, .tech-stack {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Chapter 2: Software Requirements Specification (SRS)</h1>
            <div class="doc-info">
                Fault Prediction System<br>
                IEEE-830 Standard | Version 1.0 | February 4, 2026
            </div>
        </header>

        <h2>Cover Page</h2>
        <div class="box">
            <p><strong>Project Title:</strong> Fault Prediction System</p>
            <p><strong>Document:</strong> Software Requirements Specification (SRS)</p>
            <p><strong>Standard Reference:</strong> IEEE-830</p>
            <p><strong>Document Version:</strong> 1.0</p>
            <p><strong>Date:</strong> February 4, 2026</p>
        </div>

        <h2>Table of Contents</h2>
        <ol>
            <li><a href="#introduction">Introduction</a>
                <ol>
                    <li><a href="#product-overview">Product Overview</a></li>
                    <li><a href="#system-models">System Models (Use Case &amp; Data Flow)</a></li>
                </ol>
            </li>
            <li><a href="#specific-requirements">Specific Requirements</a>
                <ol>
                    <li><a href="#external-interfaces">External Interface Requirements</a>
                        <ol>
                            <li><a href="#user-interfaces">User Interfaces</a></li>
                            <li><a href="#hardware-interfaces">Hardware Interfaces</a></li>
                            <li><a href="#software-interfaces">Software Interfaces</a></li>
                            <li><a href="#communications-protocols">Communications Protocols</a></li>
                        </ol>
                    </li>
                    <li><a href="#software-features">Software Product Features</a></li>
                    <li><a href="#system-attributes">Software System Attributes</a>
                        <ol>
                            <li><a href="#reliability">Reliability</a></li>
                            <li><a href="#availability">Availability</a></li>
                            <li><a href="#security">Security</a></li>
                            <li><a href="#maintainability">Maintainability</a></li>
                            <li><a href="#portability">Portability</a></li>
                            <li><a href="#performance">Performance</a></li>
                        </ol>
                    </li>
                    <li><a href="#database-requirements">Database Requirements</a></li>
                </ol>
            </li>
            <li><a href="#additional-material">Additional Material</a></li>
        </ol>

        <div style="page-break-after: always;"></div>

        <h2 id="introduction">1. INTRODUCTION</h2>

        <h3 id="product-overview">1.1 Product Overview</h3>
        <p>The <strong>Fault Prediction System</strong> is an intelligent web-based platform that analyzes software repositories to predict fault-prone modules using machine learning techniques. The system integrates with GitHub to extract repository data, calculate code complexity metrics, and provide actionable insights for improving software quality and reducing technical debt.</p>

        <h4>Purpose of This Document:</h4>
        <p>This Software Requirements Specification (SRS) document specifies the functional and non-functional requirements, system interfaces, and design constraints for the Fault Prediction System. It is intended for developers, testers, project managers, stakeholders, and maintenance teams to understand system capabilities and limitations aligned to IEEE-830 standards.</p>

        <h4>Scope:</h4>
        <p>The system provides an end-to-end solution for code quality analysis and fault prediction by integrating with GitHub repositories. It analyzes code complexity, predicts bug-prone areas using machine learning, and offers intelligent recommendations for test prioritization and code improvements.</p>

        <h4>Major Features:</h4>
        <ol>
            <li><strong>User Authentication & Management</strong> - Secure user registration, login, profile management, GitHub token integration</li>
            <li><strong>Repository Analysis</strong> - GitHub repository import, multi-language code analysis, complexity metrics calculation</li>
            <li><strong>Machine Learning Predictions</strong> - Fault-prone module identification, risk scoring, confidence levels</li>
            <li><strong>Interactive Dashboards</strong> - Real-time metrics visualization, risk distribution charts, complexity trends</li>
            <li><strong>Test Prioritization</strong> - ML-based test recommendations, risk-based test ordering</li>
            <li><strong>Bug Report Management</strong> - Bug tracking, severity management, status workflow</li>
            <li><strong>Recommendations Engine</strong> - Code improvement suggestions, refactoring opportunities</li>
        </ol>

        <h3 id="system-models">1.2 System Models (Use Case &amp; Data Flow)</h3>
        <p>This section provides IEEE-830 compliant system models that clarify user interactions and data movement across the system.</p>

        <div class="diagram-box">
            <div class="diagram-title">Use Case Diagram</div>
            <div class="diagram-description">
                <strong>Purpose:</strong> Illustrates interactions between users (Developer, QA Engineer, Project Manager) and core system functionalities, including external dependency on GitHub API.
            </div>
            <div class="diagram-image-container">
                <div class="mermaid">
graph TB
    subgraph Actors
        Dev[👨‍💻 Software Developer]
        QA[🧪 QA Engineer]
        PM[📊 Project Manager]
        GitHub[🔗 GitHub API]
    end

    subgraph "System Use Cases"
        UC1[🔐 Login/Signup]
        UC2[➕ Add Repository]
        UC3[🔍 Analyze Code]
        UC4[📊 View Metrics]
        UC5[🎯 View Predictions]
        UC6[✅ Prioritize Tests]
        UC7[🐛 Manage Bugs]
        UC8[📈 View Dashboard]
        UC9[⚙️ Configure Settings]
        UC10[💡 View Recommendations]
    end

    Dev --> UC1
    Dev --> UC2
    Dev --> UC3
    Dev --> UC4
    Dev --> UC5
    Dev --> UC9

    QA --> UC1
    QA --> UC6
    QA --> UC7
    QA --> UC8

    PM --> UC1
    PM --> UC8
    PM --> UC10

    UC2 -.-> GitHub
    UC3 -.-> GitHub

    UC3 --> UC4
    UC3 --> UC5
    UC5 --> UC6
                </div>
            </div>
            <div class="note-box">
                <p><strong>Key Actors:</strong> Developer, QA Engineer, Project Manager, GitHub API</p>
            </div>
        </div>

        <div class="diagram-box">
            <div class="diagram-title">Data Flow Diagram (Level 0)</div>
            <div class="diagram-description">
                <strong>Purpose:</strong> Context diagram showing the system boundary and data exchanges with external entities.
            </div>
            <div class="diagram-image-container">
                <div class="mermaid">
graph LR
    Dev["👨‍💻 Software Developer\n(External Entity)"]
    GitHub["🔗 GitHub\n(External Entity)"]

    System[("⚙️ Fault Prediction\nSystem\n(Process 0)")]

    Dev -->|Repository URL\nUser Credentials| System
    System -->|Analysis Results\nPredictions\nRecommendations| Dev

    GitHub -->|Repository Data\nCommit History| System
    System -->|API Requests| GitHub
                </div>
            </div>
        </div>

        <div class="diagram-box">
            <div class="diagram-title">Data Flow Diagram (Level 1)</div>
            <div class="diagram-description">
                <strong>Purpose:</strong> Decomposes the system into key processes and data stores for authentication, analysis, prediction, and reporting.
            </div>
            <div class="diagram-image-container">
                <div class="mermaid">
graph TB
    Dev["👨‍💻 Developer"]
    GitHub["🔗 GitHub"]

    P1[("🔐 1.0\nAuthenticate User")]
    P2[("📥 2.0\nFetch Repository")]
    P3[("🔍 3.0\nAnalyze Code")]
    P4[("🤖 4.0\nPredict Faults")]
    P5[("📊 5.0\nGenerate Reports")]

    D1[("💾 D1:\nUsers")]
    D2[("💾 D2:\nRepositories")]
    D3[("💾 D3:\nMetrics")]
    D4[("💾 D4:\nPredictions")]

    Dev -->|Login Credentials| P1
    P1 -->|Auth Token| Dev
    P1 <-->|User Data| D1

    Dev -->|Repository URL| P2
    P2 -->|Repository Info| Dev
    P2 <-->|Repo Details| D2
    P2 -->|Source Code| GitHub
    GitHub -->|Repository Data| P2

    P2 -->|Code Files| P3
    P3 <-->|Code Metrics| D3

    P3 -->|Metric Features| P4
    P4 <-->|Fault Predictions| D4

    D3 -->|Historical Metrics| P5
    D4 -->|Prediction Data| P5
    D2 -->|Repository Info| P5
    P5 -->|Analysis Report| Dev
                </div>
            </div>
        </div>

        <div style="page-break-after: always;"></div>

        <h2 id="specific-requirements">2. SPECIFIC REQUIREMENTS</h2>

        <h3 id="external-interfaces">2.1 External Interface Requirements</h3>

        <h4 id="user-interfaces">2.1.1 User Interfaces</h4>
        <p>The system provides a modern, responsive web-based user interface built with React 19 and TypeScript. The interface is designed for intuitive interaction across desktop and tablet devices (768px to 1920px width).</p>

        <h4>Key UI Components:</h4>
        <ul>
            <li><strong>Dashboard:</strong> Overview of repositories, metrics summaries, and risk distribution</li>
            <li><strong>Repository Management:</strong> Add, list, analyze, and delete repositories with metadata display</li>
            <li><strong>Metrics Visualization:</strong> Interactive charts showing complexity trends, code churn, and risk analysis</li>
            <li><strong>Test Prioritization:</strong> Recommendations and priority ranking for test cases</li>
            <li><strong>Bug Report Management:</strong> Create, track, and manage bug reports with status workflows</li>
            <li><strong>Settings:</strong> User profile management and GitHub token configuration</li>
        </ul>

        <h4>UI Standards:</h4>
        <ul>
            <li>Built with Radix UI components for accessibility (WCAG 2.1 Level AA)</li>
            <li>Styled with Tailwind CSS for responsive design</li>
            <li>Keyboard navigation fully supported</li>
            <li>Color contrast ratios meet accessibility standards</li>
        </ul>

        <h4 id="hardware-interfaces">2.1.2 Hardware Interfaces</h4>

        <table>
            <thead>
                <tr>
                    <th>Environment</th>
                    <th>Component</th>
                    <th>Requirement</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="4"><strong>Development</strong></td>
                    <td>Processor</td>
                    <td>Intel Core i5 or equivalent (2.5GHz+)</td>
                </tr>
                <tr>
                    <td>RAM</td>
                    <td>8GB minimum, 16GB recommended</td>
                </tr>
                <tr>
                    <td>Storage</td>
                    <td>10GB free disk space for repositories</td>
                </tr>
                <tr>
                    <td>Network</td>
                    <td>Broadband internet (GitHub API access required)</td>
                </tr>
                <tr>
                    <td rowspan="4"><strong>Production</strong></td>
                    <td>Processor</td>
                    <td>Intel Core i7 or equivalent (3.0GHz+)</td>
                </tr>
                <tr>
                    <td>RAM</td>
                    <td>16GB minimum</td>
                </tr>
                <tr>
                    <td>Storage</td>
                    <td>50GB SSD for database and repositories</td>
                </tr>
                <tr>
                    <td>Network</td>
                    <td>Stable internet with 100Mbps+ bandwidth</td>
                </tr>
            </tbody>
        </table>

        <h4 id="software-interfaces">2.1.3 Software Interfaces</h4>

        <h4>Frontend Technology Stack:</h4>
        <table>
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Technology</th>
                    <th>Version</th>
                    <th>Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Runtime</td>
                    <td>Node.js</td>
                    <td>18+</td>
                    <td>JavaScript runtime for build and development</td>
                </tr>
                <tr>
                    <td>Framework</td>
                    <td>React</td>
                    <td>19.2.3</td>
                    <td>UI component framework</td>
                </tr>
                <tr>
                    <td>Language</td>
                    <td>TypeScript</td>
                    <td>5.9.3</td>
                    <td>Type-safe JavaScript</td>
                </tr>
                <tr>
                    <td>Build Tool</td>
                    <td>Vite</td>
                    <td>5.4.21</td>
                    <td>Fast bundling and development server</td>
                </tr>
                <tr>
                    <td>Styling</td>
                    <td>Tailwind CSS</td>
                    <td>3.4.19</td>
                    <td>Utility-first CSS framework</td>
                </tr>
                <tr>
                    <td>UI Components</td>
                    <td>Radix UI</td>
                    <td>Latest</td>
                    <td>Accessible component primitives</td>
                </tr>
                <tr>
                    <td>State Management</td>
                    <td>Zustand</td>
                    <td>4.5.0</td>
                    <td>Lightweight state management</td>
                </tr>
            </tbody>
        </table>

        <h4>Backend Technology Stack:</h4>
        <table>
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Technology</th>
                    <th>Version</th>
                    <th>Purpose</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Runtime</td>
                    <td>Python</td>
                    <td>3.8+</td>
                    <td>Backend programming language</td>
                </tr>
                <tr>
                    <td>Framework</td>
                    <td>Flask</td>
                    <td>Latest</td>
                    <td>Lightweight web framework</td>
                </tr>
                <tr>
                    <td>ORM</td>
                    <td>SQLAlchemy</td>
                    <td>Latest</td>
                    <td>Database abstraction layer</td>
                </tr>
                <tr>
                    <td>API</td>
                    <td>Flask-CORS</td>
                    <td>Latest</td>
                    <td>Cross-origin resource sharing</td>
                </tr>
                <tr>
                    <td>ML Library</td>
                    <td>scikit-learn</td>
                    <td>Latest</td>
                    <td>Machine learning algorithms</td>
                </tr>
                <tr>
                    <td>Data Processing</td>
                    <td>Pandas, NumPy</td>
                    <td>Latest</td>
                    <td>Data manipulation and analysis</td>
                </tr>
                <tr>
                    <td>Code Analysis</td>
                    <td>Radon, Lizard</td>
                    <td>Latest</td>
                    <td>Complexity metric computation</td>
                </tr>
            </tbody>
        </table>

        <h4 id="communications-protocols">2.1.4 Communications Protocols</h4>
        <ul>
            <li><strong>Frontend-Backend:</strong> REST API over HTTPS (HTTP in development)</li>
            <li><strong>Authentication:</strong> JWT (JSON Web Tokens) or session-based authentication</li>
            <li><strong>External APIs:</strong> GitHub REST API v3 via PyGithub library</li>
            <li><strong>Data Format:</strong> JSON for all API requests/responses</li>
            <li><strong>Error Handling:</strong> Standard HTTP status codes (200, 400, 401, 403, 404, 500)</li>
        </ul>

        <h3 id="software-features">2.2 Software Product Features</h3>

        <table>
            <thead>
                <tr>
                    <th>Feature ID</th>
                    <th>Feature Name</th>
                    <th>Description</th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>F1</td>
                    <td>User Authentication & Management</td>
                    <td>Secure user registration, login, logout, session management, profile management, GitHub token integration</td>
                    <td class="priority-high">High</td>
                </tr>
                <tr>
                    <td>F2</td>
                    <td>Repository Management</td>
                    <td>Add repositories via GitHub URL, list repositories, analyze code, delete repositories, display metadata</td>
                    <td class="priority-high">High</td>
                </tr>
                <tr>
                    <td>F3</td>
                    <td>Code Analysis & Metrics</td>
                    <td>Extract code files, calculate complexity metrics (CC, MI, Halstead, LOC), analyze code churn across multiple languages</td>
                    <td class="priority-high">High</td>
                </tr>
                <tr>
                    <td>F4</td>
                    <td>Machine Learning Predictions</td>
                    <td>Train fault prediction model, extract features, predict fault probability, classify risk levels, persist predictions</td>
                    <td class="priority-high">High</td>
                </tr>
                <tr>
                    <td>F5</td>
                    <td>Metrics Visualization</td>
                    <td>Interactive dashboards, risk distribution charts, complexity trends, code churn analytics, repository overview</td>
                    <td class="priority-high">High</td>
                </tr>
                <tr>
                    <td>F6</td>
                    <td>Test Prioritization</td>
                    <td>Generate test recommendations based on risk scores, display test cases with priority ranking, coverage optimization</td>
                    <td class="priority-medium">Medium</td>
                </tr>
                <tr>
                    <td>F7</td>
                    <td>Bug Report Management</td>
                    <td>Create bug reports, update status (Open → In Progress → Resolved → Closed), list and filter bugs, assign severity</td>
                    <td class="priority-medium">Medium</td>
                </tr>
                <tr>
                    <td>F8</td>
                    <td>Recommendations Engine</td>
                    <td>Generate code improvement suggestions, highlight refactoring opportunities, best practice recommendations</td>
                    <td class="priority-low">Low</td>
                </tr>
            </tbody>
        </table>

        <h3 id="system-attributes">2.3 Software System Attributes</h3>

        <h4 id="reliability">2.3.1 Reliability</h4>
        <ul>
            <li><strong>System Availability:</strong> 99% availability during business hours. Planned maintenance windows not exceed 2 hours.</li>
            <li><strong>Fault Tolerance:</strong> Gracefully handle GitHub API failures without crashing. Database errors do not corrupt existing data. Invalid inputs validated with appropriate error messages.</li>
            <li><strong>Recoverability:</strong> Database backup and recovery capabilities. Failed repository analyses do not corrupt metrics.</li>
            <li><strong>Error Handling:</strong> User-friendly error messages. Technical errors logged for debugging and analysis.</li>
        </ul>

        <h4 id="availability">2.3.2 Availability</h4>
        <ul>
            <li><strong>Target SLA:</strong> 99% uptime (except planned maintenance)</li>
            <li><strong>Scheduled Maintenance:</strong> Maintenance windows limited to off-peak hours (2-hour maximum)</li>
            <li><strong>Deployment:</strong> Support for rolling updates without service interruption</li>
        </ul>

        <h4 id="security">2.3.3 Security</h4>
        <ul>
            <li><strong>Authentication:</strong> Passwords hashed using werkzeug.security (PBKDF2). Sessions expire after 7 days inactivity. Failed login attempts limited to max 5 per user.</li>
            <li><strong>Authorization:</strong> Users only access their own repositories and data. API endpoints require valid authentication tokens. Role-based access control (RBAC) enforced.</li>
            <li><strong>Data Protection:</strong> HTTPS required for all client-server communication in production. SQL injection prevention through ORM parameterization. XSS protection via React auto-escaping.</li>
            <li><strong>Privacy:</strong> User data not shared with third parties. Deleted data permanently removed from database. GitHub tokens encrypted in storage. Tokens never logged or exposed in API responses.</li>
            <li><strong>Compliance:</strong> GDPR-compliant data handling. Secure token storage and transmission.</li>
        </ul>

        <h4 id="maintainability">2.3.4 Maintainability</h4>
        <ul>
            <li><strong>Code Quality:</strong> Code follows style guides (PEP 8 for Python, ESLint for TypeScript). All functions have docstrings/comments. Code coverage exceeds 70%.</li>
            <li><strong>Modularity:</strong> Layered architecture (presentation, business logic, data layers). Loosely coupled components. Database schema designed to support future extensions.</li>
            <li><strong>Documentation:</strong> API endpoints fully documented with request/response examples. Database schema documented. Deployment procedures documented. User guides provided.</li>
            <li><strong>Version Control:</strong> All code changes tracked via Git with meaningful commit messages.</li>
        </ul>

        <h4 id="portability">2.3.5 Portability</h4>
        <ul>
            <li><strong>Platform Independence:</strong> Frontend works on Chrome, Firefox, Safari, Edge (latest 2 versions). Backend runs on Windows, Linux, macOS. SQLite database is cross-platform.</li>
            <li><strong>Browser Support:</strong> Chrome 100+, Firefox 100+, Safari 15+, Edge 100+</li>
            <li><strong>Operating Systems:</strong> Client: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+). Server: Windows 10/11, Ubuntu 20.04+, macOS 11+</li>
            <li><strong>Responsive Design:</strong> UI adapts to screen sizes from 768px to 1920px. Mobile view (&lt;768px) displays simplified layout.</li>
        </ul>

        <h4 id="performance">2.3.6 Performance</h4>
        <table>
            <thead>
                <tr>
                    <th>Requirement</th>
                    <th>Target Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>API Response Time</td>
                    <td>≤ 2 seconds for 95% of requests</td>
                </tr>
                <tr>
                    <td>Dashboard Load Time</td>
                    <td>≤ 3 seconds</td>
                </tr>
                <tr>
                    <td>Repository Analysis Time</td>
                    <td>≤ 5 minutes for repos &lt; 1000 files</td>
                </tr>
                <tr>
                    <td>Concurrent Users</td>
                    <td>≥ 50 concurrent users supported</td>
                </tr>
                <tr>
                    <td>Database Performance</td>
                    <td>Handle 100 queries/second minimum</td>
                </tr>
                <tr>
                    <td>Data Scalability</td>
                    <td>Support up to 10,000 files per repository, 100 users, 1M prediction records</td>
                </tr>
            </tbody>
        </table>

        <h3 id="database-requirements">2.4 Database Requirements</h3>

        <h4>Database Type: SQLite 3.35+</h4>
        <p>File-based relational database suitable for single-instance deployment with cross-platform portability.</p>

        <h4>Database Schema Overview:</h4>
        <table>
            <thead>
                <tr>
                    <th>Table Name</th>
                    <th>Purpose</th>
                    <th>Key Attributes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>USER</td>
                    <td>User account and profile information</td>
                    <td>id, username, email, password_hash, full_name, organization, created_at, last_login</td>
                </tr>
                <tr>
                    <td>SETTINGS</td>
                    <td>User preferences and GitHub token</td>
                    <td>id, user_id (FK), github_token (encrypted), preferences (JSON), updated_at</td>
                </tr>
                <tr>
                    <td>REPOSITORY</td>
                    <td>GitHub repositories tracked by system</td>
                    <td>id, user_id (FK), name, owner, url, description, language, stars, forks, last_analyzed, created_at</td>
                </tr>
                <tr>
                    <td>CODE_METRIC</td>
                    <td>Code complexity metrics per file</td>
                    <td>id, repository_id (FK), file_path, loc, cyclomatic_complexity, maintainability_index, halstead_volume, code_churn, calculated_at</td>
                </tr>
                <tr>
                    <td>PREDICTION</td>
                    <td>ML fault prediction results</td>
                    <td>id, repository_id (FK), file_path, fault_probability, risk_level, confidence, predicted_at</td>
                </tr>
                <tr>
                    <td>BUG_REPORT</td>
                    <td>Bug tracking and management</td>
                    <td>id, repository_id (FK), title, description, severity, priority, status, module_path, created_at, resolved_at</td>
                </tr>
                <tr>
                    <td>TEST_CASE</td>
                    <td>Test case prioritization</td>
                    <td>id, repository_id (FK), name, target_module, priority_score, status, created_at</td>
                </tr>
            </tbody>
        </table>

        <h4>Data Integrity & Constraints:</h4>
        <ul>
            <li>Primary keys: All tables have unique integer primary key (id)</li>
            <li>Foreign keys: Maintain referential integrity between tables</li>
            <li>Unique constraints: username, email in USER table</li>
            <li>Indexes: Created on frequently queried columns (user_id, repository_id, file_path) for performance</li>
            <li>Backup: Database backups recommended weekly with automated recovery procedures</li>
        </ul>

        <h4>Data Retention:</h4>
        <ul>
            <li>User accounts and repositories: Retained until user deletion</li>
            <li>Metrics and predictions: Retained for historical trend analysis (minimum 1 year)</li>
            <li>Logs: System logs retained for 90 days for debugging and auditing</li>
            <li>Deleted data: Permanently removed from database within 24 hours</li>
        </ul>

        <div style="page-break-after: always;"></div>

        <h2 id="additional-material">3. ADDITIONAL MATERIAL</h2>

        <h4>Relevant Standards and References:</h4>
        <ul>
            <li><strong>IEEE-830:</strong> IEEE Guide to Software Requirements Specifications - Primary standard for SRS structure and content</li>
            <li><strong>IEEE-1058:</strong> Software Project Management Plans - Referenced in SPMP for project context</li>
        </ul>

        <h4>Related Documents:</h4>
        <ul>
            <li>Chapter 1 - SPMP (Software Project Management Plan)</li>
            <li>Chapter 3 - SDD (Software Design Document)</li>
            <li>System-Diagrams.html - Complete system architecture and UML diagrams</li>
        </ul>

        <h4>Definitions, Acronyms, and Abbreviations:</h4>

        <table>
            <thead>
                <tr>
                    <th>Term</th>
                    <th>Definition</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>API</strong></td>
                    <td>Application Programming Interface - A set of protocols for building software</td>
                </tr>
                <tr>
                    <td><strong>CC</strong></td>
                    <td>Cyclomatic Complexity - Measure of code complexity based on control flow</td>
                </tr>
                <tr>
                    <td><strong>CORS</strong></td>
                    <td>Cross-Origin Resource Sharing - Security feature for web browsers</td>
                </tr>
                <tr>
                    <td><strong>GDPR</strong></td>
                    <td>General Data Protection Regulation - Privacy and data protection law</td>
                </tr>
                <tr>
                    <td><strong>JWT</strong></td>
                    <td>JSON Web Token - Standard for secure token-based authentication</td>
                </tr>
                <tr>
                    <td><strong>LOC</strong></td>
                    <td>Lines of Code - Source code size metric</td>
                </tr>
                <tr>
                    <td><strong>MI</strong></td>
                    <td>Maintainability Index - Code maintainability metric (0-100 scale)</td>
                </tr>
                <tr>
                    <td><strong>ML</strong></td>
                    <td>Machine Learning - Algorithms that learn from data</td>
                </tr>
                <tr>
                    <td><strong>ORM</strong></td>
                    <td>Object-Relational Mapping - Database abstraction layer</td>
                </tr>
                <tr>
                    <td><strong>REST</strong></td>
                    <td>Representational State Transfer - API architectural style</td>
                </tr>
                <tr>
                    <td><strong>SQL</strong></td>
                    <td>Structured Query Language - Database query language</td>
                </tr>
                <tr>
                    <td><strong>SRS</strong></td>
                    <td>Software Requirements Specification - This document</td>
                </tr>
                <tr>
                    <td><strong>UI/UX</strong></td>
                    <td>User Interface / User Experience - Design aspects</td>
                </tr>
            </tbody>
        </table>

        <hr style="margin: 40px 0; border: none; border-top: 2px solid #3498db;">

        <footer style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>End of Chapter 2 - Software Requirements Specification (IEEE-830)</strong></p>
            <p style="color: #7f8c8d;">Fault Prediction System | Version 1.0 | February 4, 2026</p>
        </footer>

        <div style="margin-top: 40px; page-break-before: always;">
            <h2>Document Approval</h2>
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Name</th>
                        <th>Signature</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Requirements Analyst</td>
                        <td>____________</td>
                        <td>____________</td>
                        <td>______</td>
                    </tr>
                    <tr>
                        <td>Project Manager</td>
                        <td>____________</td>
                        <td>____________</td>
                        <td>______</td>
                    </tr>
                    <tr>
                        <td>System Architect</td>
                        <td>____________</td>
                        <td>____________</td>
                        <td>______</td>
                    </tr>
                </tbody>
            </table>

            <h3>Revision History</h3>
            <table>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Date</th>
                        <th>Author</th>
                        <th>Changes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1.0</td>
                        <td>February 4, 2026</td>
                        <td>Development Team</td>
                        <td>Initial SRS creation (IEEE-830 compliant)</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</body>
</html>
