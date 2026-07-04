<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chapter 3: System Design Description (SDD)</title>
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
            white-space: pre;
            font-size: 0.85em;
            line-height: 1.4;
        }

        .diagram-box {
            background: #f8f9fa;
            border: 2px solid #3498db;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            page-break-inside: avoid;
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

        .tech-stack {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
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

            table, .box, .code-block, .tech-stack, .diagram-box {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Chapter 3: Software Design Description (SDD)</h1>
            <div class="doc-info">
                Fault Prediction System<br>
                IEEE-1016 Standard | Version 1.0 | February 4, 2026
            </div>
        </header>

        <h2>Cover Page</h2>
        <div class="box">
            <p><strong>Project Title:</strong> Fault Prediction System</p>
            <p><strong>Document:</strong> Software Design Description (SDD)</p>
            <p><strong>Standard Reference:</strong> IEEE-1016</p>
            <p><strong>Document Version:</strong> 1.0</p>
            <p><strong>Date:</strong> February 4, 2026</p>
        </div>

        <h2>Table of Contents</h2>
        <ol>
            <li><a href="#introduction">Introduction</a>
                <ol>
                    <li><a href="#design-overview">Design Overview</a></li>
                    <li><a href="#requirements-traceability">Requirements Traceability Matrix</a></li>
                </ol>
            </li>
            <li><a href="#system-architecture">System Architectural Design</a>
                <ol>
                    <li><a href="#chosen-architecture">Chosen System Architecture</a>
                        <ol>
                            <li><a href="#architecture-diagram">Architecture Diagram</a></li>
                            <li><a href="#deployment-diagram">Deployment Diagram</a></li>
                        </ol>
                    </li>
                    <li><a href="#alternative-designs">Discussion of Alternative Designs</a></li>
                    <li><a href="#system-interface">System Interface Description</a>
                        <ol>
                            <li><a href="#sequence-diagrams">Sequence Diagrams</a></li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li><a href="#detailed-components">Detailed Description of Components</a>
                <ol>
                    <li><a href="#component-diagram">Component Diagram</a></li>
                    <li><a href="#er-diagram">Data Model (ER) Diagram</a></li>
                    <li><a href="#activity-diagram">Process Flow (Activity Diagram)</a></li>
                    <li><a href="#ml-pipeline-diagram">ML Pipeline Diagram</a></li>
                </ol>
            </li>
            <li><a href="#user-interface">User Interface Design</a>
                <ol>
                    <li><a href="#ui-description">Description of the User Interface</a>
                        <ol>
                            <li><a href="#screen-images">Screen Images</a></li>
                            <li><a href="#objects-actions">Objects and Actions</a></li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li><a href="#additional-material">Additional Material</a></li>
        </ol>

        <div style="page-break-after: always;"></div>

        <h2 id="introduction">1. INTRODUCTION</h2>

        <h3 id="design-overview">1.1 Design Overview</h3>
        <p>This Software Design Description (SDD) document provides a comprehensive architectural and detailed design specification for the <strong>Fault Prediction System</strong>. It describes the system architecture, component design, data models, interfaces, and technical implementation details necessary for developers to construct the system according to requirements specified in the SRS.</p>

        <p>The design document serves as:</p>
        <ul>
            <li>A blueprint for system implementation and construction</li>
            <li>A reference for understanding system structure and component interactions</li>
            <li>A guide for system maintenance and future enhancements</li>
            <li>A communication tool between architects, developers, and stakeholders</li>
            <li>A detailed specification for integration and testing activities</li>
        </ul>

        <h4>Design Scope:</h4>
        <p>This document covers the complete design of the Fault Prediction System, including:</p>
        <ul>
            <li><strong>Frontend Design:</strong> React component architecture, UI/UX design, routing, state management</li>
            <li><strong>Backend Design:</strong> API architecture, service layer design, business logic, request/response handling</li>
            <li><strong>Database Design:</strong> Schema, relationships, indexes, data persistence</li>
            <li><strong>ML Module Design:</strong> Feature engineering, model architecture, prediction pipeline, training logic</li>
            <li><strong>Integration Design:</strong> GitHub API integration, external service communication, error handling</li>
            <li><strong>Security Design:</strong> Authentication, authorization, data protection, encryption</li>
        </ul>

        <h3 id="requirements-traceability">1.2 Requirements Traceability Matrix</h3>
        <p>This section maps SRS requirements to design components and architectural decisions.</p>

        <table>
            <thead>
                <tr>
                    <th>SRS Requirement ID</th>
                    <th>SRS Title</th>
                    <th>Design Component(s)</th>
                    <th>Architecture Layer</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>FR1 - User Auth</td>
                    <td>User Authentication & Management</td>
                    <td>AuthContext, Login Page, /api/auth/*, User Table</td>
                    <td>Presentation, Business Logic, Data</td>
                </tr>
                <tr>
                    <td>FR2 - Repository Mgmt</td>
                    <td>Repository Management</td>
                    <td>Repository Page, /api/repositories/*, GitHubService, Repository Table</td>
                    <td>Presentation, Business Logic, Data</td>
                </tr>
                <tr>
                    <td>FR3 - Code Analysis</td>
                    <td>Code Analysis & Metrics</td>
                    <td>CodeAnalyzer, /api/analyze/*, code_metric Table</td>
                    <td>Business Logic, Data</td>
                </tr>
                <tr>
                    <td>FR4 - ML Predictions</td>
                    <td>Machine Learning Predictions</td>
                    <td>MLService, FaultPredictor, /api/predict/*, prediction Table</td>
                    <td>Business Logic, Data</td>
                </tr>
                <tr>
                    <td>FR5 - Visualization</td>
                    <td>Metrics Visualization</td>
                    <td>Dashboard, Metrics Page, /api/dashboard/*, Recharts components</td>
                    <td>Presentation, Business Logic</td>
                </tr>
                <tr>
                    <td>NFR1 - Performance</td>
                    <td>Performance Requirements</td>
                    <td>Database Indexes, API Caching, Vite Build Optimization</td>
                    <td>Data, Business Logic, Presentation</td>
                </tr>
                <tr>
                    <td>NFR2 - Security</td>
                    <td>Security Requirements</td>
                    <td>Password Hashing, JWT, HTTPS, SQL Injection Prevention</td>
                    <td>Business Logic, Data, Presentation</td>
                </tr>
            </tbody>
        </table>

        <h4>Design Assumptions and Constraints:</h4>

        <h5>Assumptions:</h5>
        <ol>
            <li>Users have stable internet connectivity for GitHub API access</li>
            <li>GitHub repositories are accessible with provided authentication tokens</li>
            <li>Users have modern web browsers with JavaScript enabled</li>
            <li>Server has sufficient storage for repository cloning and database operations</li>
            <li>Python 3.8+ and Node.js 18+ are available in deployment environment</li>
            <li>SQLite can be deployed as a file-based database in the target environment</li>
        </ol>

        <h5>Constraints:</h5>

        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Constraint Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Technology Stack</strong></td>
                    <td>Frontend: React 19 + TypeScript. Backend: Python 3.8+ + Flask. Database: SQLite 3.35+</td>
                </tr>
                <tr>
                    <td><strong>API Limitations</strong></td>
                    <td>GitHub API rate limits: 5,000 requests/hour (authenticated), RESTful architecture required</td>
                </tr>
                <tr>
                    <td><strong>Performance</strong></td>
                    <td>Repository analysis &lt; 5 minutes for 1000 files, Dashboard load &lt; 3 seconds</td>
                </tr>
                <tr>
                    <td><strong>Security</strong></td>
                    <td>Passwords hashed using PBKDF2, JWT tokens for session management, HTTPS in production</td>
                </tr>
                <tr>
                    <td><strong>Deployment</strong></td>
                    <td>Single-server deployment model, local file-based SQLite database, no cloud infrastructure</td>
                </tr>
            </tbody>
        </table>

        <div style="page-break-after: always;"></div>

        <h2 id="system-architecture">2. SYSTEM ARCHITECTURAL DESIGN</h2>

        <h3 id="chosen-architecture">2.1 Chosen System Architecture</h3>

        <h4>Architecture Pattern: Three-Tier Layered Architecture</h4>
        <p>The Fault Prediction System employs a three-tier layered architecture that separates concerns and promotes modularity, maintainability, and scalability.</p>

        <div class="diagram-box">
            <h4 style="text-align: center;">Three-Tier Architecture Overview</h4>
            <div class="box">
                <p><strong>Tier 1 (Presentation Layer):</strong> React Frontend</p>
                <ul>
                    <li>User interface components (React 19 + TypeScript)</li>
                    <li>Responsive design with Tailwind CSS</li>
                    <li>Client-side state management (Context API + Zustand)</li>
                    <li>Communication with backend via REST API</li>
                </ul>
            </div>

            <div class="box">
                <p><strong>Tier 2 (Application/Business Logic Layer):</strong> Flask Backend</p>
                <ul>
                    <li>RESTful API endpoints using Flask</li>
                    <li>Business logic services (GitHub integration, code analysis, ML predictions)</li>
                    <li>Request validation and error handling</li>
                    <li>Session management and authentication</li>
                </ul>
            </div>

            <div class="box">
                <p><strong>Tier 3 (Data Access Layer):</strong> SQLite Database</p>
                <ul>
                    <li>SQLAlchemy ORM for database abstraction</li>
                    <li>Data persistence and transaction management</li>
                    <li>Indexes for query performance optimization</li>
                    <li>7 tables: User, Settings, Repository, CodeMetric, Prediction, BugReport, TestCase</li>
                </ul>
            </div>
        </div>

        <h4 id="architecture-diagram">Architecture Diagram</h4>
        <div class="diagram-box">
            <div class="diagram-image-container">
                <div class="mermaid">
graph TB
    subgraph "🖥️ PRESENTATION LAYER - Tier 1"
        Frontend["⚛️ React Frontend<br/>Port 5173<br/>TypeScript + Vite"]
        Pages["📄 Pages<br/>Dashboard, Repository<br/>Metrics, Bugs"]
        UI["🎨 UI Components<br/>40+ Reusable<br/>Components"]
        Context["🔄 Context<br/>Auth, Repository<br/>Analysis State"]
    end

    subgraph "⚙️ APPLICATION LAYER - Tier 2"
        Backend["🐍 Flask Backend<br/>Port 5000<br/>Python 3.8+"]
        Routes["🛣️ API Routes<br/>/api/*"]
        Services["🔧 Services<br/>GitHub, CodeAnalyzer<br/>ML Service"]
        ML["🤖 ML Module<br/>Predictor<br/>Features"]
        Middleware["🛡️ Middleware<br/>Auth, CORS<br/>Error Handler"]
    end

    subgraph "💾 DATA LAYER - Tier 3"
        DB[("🗄️ SQLite Database<br/>app.db<br/>7 Tables")]
        Tables["📊 Tables<br/>User, Repository<br/>Metric, Prediction<br/>Bug, Test, Settings"]
    end

    subgraph "☁️ EXTERNAL SERVICES"
        GitHub["🔗 GitHub REST API<br/>api.github.com"]
    end

    Frontend --> Backend
    Pages --> Frontend
    UI --> Frontend
    Context --> Frontend

    Backend --> DB
    Routes --> Backend
    Services --> Backend
    ML --> Backend
    Middleware --> Backend

    Tables --> DB
    Services --> GitHub
                </div>
            </div>
        </div>

        <h4 id="deployment-diagram">Deployment Diagram</h4>
        <div class="diagram-box">
            <div class="diagram-image-container">
                <div class="mermaid">
graph TB
    subgraph "💻 Client Devices"
        Browser["🌐 Web Browser<br/>Chrome, Firefox, Safari, Edge"]
    end

    subgraph "🖥️ Web Server"
        WebApp["⚛️ React App<br/>Static Files<br/>Port 5173<br/>Vite Dev Server"]
    end

    subgraph "💻 Application Server"
        Flask["🐍 Flask Application<br/>Python 3.8+<br/>Port 5000<br/>WSGI Server"]
    end

    subgraph "📁 File System"
        DB[("💾 SQLite Database<br/>app.db")]
        Repos["📂 Repositories<br/>repos/"]
        Models["🤖 ML Models<br/>models/*.pkl"]
    end

    subgraph "☁️ Internet"
        GitHub["🔗 GitHub REST API<br/>api.github.com"]
    end

    Browser -->|HTTPS<br/>Port 5173| WebApp
    WebApp -->|HTTP/JSON<br/>REST API<br/>Port 5000| Flask
    Flask -->|File Access<br/>SQLAlchemy| DB
    Flask -->|File I/O<br/>Git Clone| Repos
    Flask -->|Load/Save<br/>Pickle| Models
    Flask -->|HTTPS<br/>API Calls| GitHub
                </div>
            </div>
        </div>

        <h4>Architectural Design Principles:</h4>
        <ul>
            <li><strong>Modularity:</strong> Components/modules with single responsibility principle</li>
            <li><strong>Loose Coupling:</strong> Minimal dependencies between layers and modules</li>
            <li><strong>High Cohesion:</strong> Related functionality grouped together</li>
            <li><strong>Separation of Concerns:</strong> UI, business logic, and data access clearly separated</li>
            <li><strong>DRY (Don't Repeat Yourself):</strong> Reusable components, services, and utilities</li>
            <li><strong>SOLID Principles:</strong> Applied in class and service design</li>
        </ul>

        <h4>Technology Selection Rationale:</h4>
        <table>
            <thead>
                <tr>
                    <th>Technology</th>
                    <th>Layer</th>
                    <th>Rationale</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>React 19</strong></td>
                    <td>Presentation</td>
                    <td>Component-based, virtual DOM for performance, large ecosystem, modern development experience</td>
                </tr>
                <tr>
                    <td><strong>TypeScript</strong></td>
                    <td>Presentation</td>
                    <td>Type safety, better IDE support, reduced runtime errors, improved maintainability</td>
                </tr>
                <tr>
                    <td><strong>Vite 5.4</strong></td>
                    <td>Presentation</td>
                    <td>Fast hot module replacement, optimized production builds, ES modules support</td>
                </tr>
                <tr>
                    <td><strong>Tailwind CSS</strong></td>
                    <td>Presentation</td>
                    <td>Utility-first CSS, consistent design system, responsive by default, small bundle size</td>
                </tr>
                <tr>
                    <td><strong>Flask</strong></td>
                    <td>Business Logic</td>
                    <td>Lightweight, flexible, excellent Python ecosystem for ML, easy to test</td>
                </tr>
                <tr>
                    <td><strong>SQLAlchemy</strong></td>
                    <td>Data Access</td>
                    <td>Database abstraction, SQL injection prevention, ORM benefits, query optimization</td>
                </tr>
                <tr>
                    <td><strong>SQLite</strong></td>
                    <td>Data</td>
                    <td>Zero-configuration, serverless, file-based, suitable for small-medium deployment</td>
                </tr>
                <tr>
                    <td><strong>scikit-learn</strong></td>
                    <td>Business Logic</td>
                    <td>Industry-standard ML library, Random Forest classifier proven for fault prediction</td>
                </tr>
            </tbody>
        </table>

        <h3 id="alternative-designs">2.2 Discussion of Alternative Designs</h3>

        <h4>Alternative 1: Microservices Architecture</h4>
        <ul>
            <li><strong>Description:</strong> Decompose system into multiple independent microservices (Auth Service, Analysis Service, Prediction Service)</li>
            <li><strong>Advantages:</strong> Scalability, independent deployment, technology diversity</li>
            <li><strong>Disadvantages:</strong> Added complexity, network overhead, distributed transaction management</li>
            <li><strong>Decision:</strong> Rejected - Monolithic approach is more appropriate for single-instance deployment model</li>
        </ul>

        <h4>Alternative 2: No-SQL Database (MongoDB)</h4>
        <ul>
            <li><strong>Description:</strong> Replace SQLite with MongoDB for schema flexibility</li>
            <li><strong>Advantages:</strong> Schema flexibility, horizontal scalability potential</li>
            <li><strong>Disadvantages:</strong> Added complexity, ACID transaction support, multi-server deployment required</li>
            <li><strong>Decision:</strong> Rejected - SQLite better fits single-server deployment constraints</li>
        </ul>

        <h4>Alternative 3: Vue.js/Angular Frontend</h4>
        <ul>
            <li><strong>Description:</strong> Use Vue.js or Angular instead of React</li>
            <li><strong>Advantages:</strong> Vue simpler learning curve, Angular more opinionated structure</li>
            <li><strong>Disadvantages:</strong> React ecosystem more extensive, larger community support</li>
            <li><strong>Decision:</strong> Rejected - React chosen per SRS requirements and team expertise</li>
        </ul>

        <h3 id="system-interface">2.3 System Interface Description</h3>

        <h4>Frontend-Backend Interface (REST API)</h4>
        <p>Communication between React frontend and Flask backend uses standard REST API with JSON payloads.</p>

        <table>
            <thead>
                <tr>
                    <th>Endpoint Category</th>
                    <th>Methods</th>
                    <th>Key Endpoints</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Authentication</strong></td>
                    <td>POST</td>
                    <td>/api/auth/signup, /api/auth/login, /api/auth/logout</td>
                </tr>
                <tr>
                    <td><strong>Repositories</strong></td>
                    <td>GET, POST, DELETE</td>
                    <td>/api/repositories, /api/repositories/:id</td>
                </tr>
                <tr>
                    <td><strong>Analysis</strong></td>
                    <td>POST, GET</td>
                    <td>/api/analyze/:repo_id, /api/metrics/:repo_id</td>
                </tr>
                <tr>
                    <td><strong>Dashboard</strong></td>
                    <td>GET</td>
                    <td>/api/dashboard/overview, /api/dashboard/stats</td>
                </tr>
                <tr>
                    <td><strong>Bugs & Tests</strong></td>
                    <td>GET, POST, PUT</td>
                    <td>/api/bugs/:repo_id, /api/tests/:repo_id</td>
                </tr>
            </tbody>
        </table>

        <h4>External API Interface (GitHub REST API v3)</h4>
        <ul>
            <li><strong>Integration Method:</strong> PyGithub library wraps GitHub REST API</li>
            <li><strong>Authentication:</strong> Personal Access Token with repo read permissions</li>
            <li><strong>Rate Limiting:</strong> 5,000 requests/hour (authenticated users)</li>
            <li><strong>Key Operations:</strong> Repository metadata retrieval, commit history access, file contents</li>
        </ul>

        <h4 id="sequence-diagrams">Sequence Diagrams</h4>
        <div class="diagram-box">
            <h4 style="text-align: center;">Repository Analysis Sequence</h4>
            <div class="diagram-image-container">
                <div class="mermaid">
sequenceDiagram
    participant U as 👤 User
    participant F as ⚛️ Frontend
    participant B as 🐍 Backend
    participant G as 🔗 GitHub Service
    participant A as 🔍 Code Analyzer
    participant M as 🤖 ML Service
    participant D as 💾 Database

    U->>F: Click "Analyze Repository"
    activate F
    F->>B: POST /api/analyze/:repo_id
    activate B
    B->>D: Get Repository Details
    D-->>B: Repository Info
    B->>G: Clone Repository
    activate G
    G-->>B: Repository Files
    deactivate G

    B->>A: Analyze Code Files
    activate A
    loop For Each File
        A->>A: Calculate Metrics<br/>(Complexity, LOC, Halstead)
    end
    A-->>B: Code Metrics
    deactivate A

    B->>D: Save Metrics
    D-->>B: Metrics Saved

    B->>M: Predict Faults
    activate M
    M->>M: Extract Features
    M->>M: Run Model Prediction
    M-->>B: Fault Predictions
    deactivate M

    B->>D: Save Predictions
    D-->>B: Predictions Saved
    B-->>F: Analysis Complete
    deactivate B
    F->>F: Update UI
    F-->>U: Display Results
    deactivate F
                </div>
            </div>
        </div>

        <div class="diagram-box">
            <h4 style="text-align: center;">Authentication Sequence</h4>
            <div class="diagram-image-container">
                <div class="mermaid">
sequenceDiagram
    participant U as 👤 User
    participant F as ⚛️ Frontend
    participant B as 🐍 Backend
    participant D as 💾 Database

    U->>F: Enter Credentials
    activate F
    F->>F: Validate Input
    F->>B: POST /api/auth/login
    activate B
    B->>D: Query User by Username
    activate D
    D-->>B: User Record
    deactivate D

    alt User Found
        B->>B: Verify Password Hash<br/>(PBKDF2-SHA256)
        alt Password Valid
            B->>B: Create Session
            B->>D: Update last_login
            activate D
            D-->>B: Updated
            deactivate D
            B-->>F: 200 OK + Session Cookie
            deactivate B
            F->>F: Store Auth State
            F-->>U: ✅ Redirect to Dashboard
        else Password Invalid
            B-->>F: ❌ 401 Unauthorized
            deactivate B
            F-->>U: Show Error Message
        end
    else User Not Found
        B-->>F: ❌ 401 Unauthorized
        deactivate B
        F-->>U: Show Error Message
    end
    deactivate F
                </div>
            </div>
        </div>

        <div style="page-break-after: always;"></div>

        <h2 id="detailed-components">3. DETAILED DESCRIPTION OF COMPONENTS</h2>

        <h4>Frontend Components (React):</h4>
        <ul>
            <li><strong>Pages:</strong> Dashboard, Repository, Metrics, BugReports, TestPrioritization, Recommendations, Settings</li>
            <li><strong>Layout:</strong> Header (navigation), Sidebar (menu), MainLayout (container)</li>
            <li><strong>Contexts:</strong> AuthContext (user auth state), RepositoryContext (repo state), AnalysisContext (analysis state)</li>
            <li><strong>UI Components:</strong> 40+ Radix UI-based components (Button, Card, Dialog, Table, etc.)</li>
            <li><strong>Hooks:</strong> useApi (API calls), use-toast (notifications), custom hooks for business logic</li>
        </ul>

        <h4>Backend Services (Flask):</h4>
        <ul>
            <li><strong>GitHubService:</strong> Repository info retrieval, token validation, commit history access</li>
            <li><strong>CodeAnalyzer:</strong> Cyclomatic complexity, Halstead metrics, maintainability index, code churn</li>
            <li><strong>MLService:</strong> Model training, feature extraction, fault prediction, risk classification</li>
            <li><strong>Authentication Service:</strong> User registration, login, session management, password hashing</li>
        </ul>

        <h4>Database Tables:</h4>
        <ul>
            <li><strong>users:</strong> User accounts and authentication</li>
            <li><strong>settings:</strong> User preferences and GitHub tokens (encrypted)</li>
            <li><strong>repository:</strong> GitHub repositories tracked by user</li>
            <li><strong>code_metric:</strong> Code metrics per file (complexity, churn, etc.)</li>
            <li><strong>prediction:</strong> ML fault predictions per file</li>
            <li><strong>bug_report:</strong> Bug tracking and management</li>
            <li><strong>test_case:</strong> Test case prioritization</li>
        </ul>

        <h4 id="component-diagram">Component Diagram</h4>
        <div class="diagram-box">
            <div class="diagram-image-container">
                <div class="mermaid">
graph TB
    subgraph "🖥️ Frontend Components"
        Pages["📄 Pages<br/>Dashboard, Repository<br/>Metrics, Bugs, Settings"]
        UI["🎨 UI Library<br/>40+ Components<br/>Button, Card, Table"]
        Context["🔄 Context<br/>Auth, Repository<br/>Analysis State"]
        API["🔌 API Client<br/>HTTP Requests"]
        Hooks["🪝 Hooks<br/>useAuth, useApi"]
    end

    subgraph "⚙️ Backend Services"
        Routes["🛣️ API Routes<br/>REST Endpoints"]
        GitHubSvc["🔗 GitHub Service<br/>Repository Access"]
        Analyzer["🔍 Code Analyzer<br/>Metrics Calculation"]
        MLSvc["🤖 ML Service<br/>Prediction Orchestration"]
        Auth["🔐 Auth Middleware<br/>Session Management"]
    end

    subgraph "🤖 ML Module"
        Features["📊 Feature Extractor<br/>Metric Extraction"]
        Predictor["🎯 Fault Predictor<br/>Random Forest Model"]
        Trainer["🏋️ Model Trainer<br/>Training Pipeline"]
    end

    subgraph "💾 Data Models"
        Models["🗂️ ORM Models<br/>User, Repository<br/>Metric, Prediction"]
        Session["🔗 Database Session<br/>SQLAlchemy"]
    end

    subgraph "☁️ External"
        GitHub["🔗 GitHub API"]
    end

    Pages --> UI
    Pages --> Context
    Pages --> Hooks
    Hooks --> API
    Hooks --> Context

    API --> Routes
    Routes --> GitHubSvc
    Routes --> Analyzer
    Routes --> MLSvc
    Routes --> Auth

    MLSvc --> Features
    MLSvc --> Predictor
    Features --> Predictor

    Routes --> Models
    Models --> Session

    GitHubSvc --> GitHub
    GitHubSvc --> Analyzer
    Analyzer --> MLSvc
    MLSvc --> Models
                </div>
            </div>
        </div>

        <h4 id="er-diagram">Data Model (ER) Diagram</h4>
        <div class="diagram-box">
            <div class="diagram-image-container">
                <div class="mermaid">
erDiagram
    USER ||--o{ REPOSITORY : owns
    USER ||--|| SETTINGS : has
    REPOSITORY ||--o{ CODE_METRIC : contains
    REPOSITORY ||--o{ PREDICTION : has
    REPOSITORY ||--o{ BUG_REPORT : tracks
    REPOSITORY ||--o{ TEST_CASE : includes

    USER {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar organization
        timestamp created_at
        timestamp last_login
    }

    SETTINGS {
        int id PK
        int user_id FK
        varchar github_token
        text preferences
        timestamp updated_at
    }

    REPOSITORY {
        int id PK
        int user_id FK
        varchar name
        varchar owner
        varchar url
        text description
        varchar language
        int stars
        int forks
        timestamp last_analyzed
        timestamp created_at
    }

    CODE_METRIC {
        int id PK
        int repository_id FK
        varchar file_path
        int loc
        float cyclomatic_complexity
        float maintainability_index
        float halstead_volume
        float halstead_difficulty
        int code_churn
        timestamp calculated_at
    }

    PREDICTION {
        int id PK
        int repository_id FK
        varchar file_path
        float fault_probability
        varchar risk_level
        float confidence
        timestamp predicted_at
    }

    BUG_REPORT {
        int id PK
        int repository_id FK
        varchar title
        text description
        varchar severity
        varchar priority
        varchar status
        varchar module_path
        timestamp created_at
        timestamp resolved_at
    }

    TEST_CASE {
        int id PK
        int repository_id FK
        varchar name
        varchar target_module
        int priority_score
        varchar status
        timestamp created_at
    }
                </div>
            </div>
        </div>

        <h4 id="activity-diagram">Process Flow (Activity Diagram)</h4>
        <div class="diagram-box">
            <div class="diagram-image-container">
                <div class="mermaid">
flowchart TD
    Start(("🏁 Start")) --> Select["📋 User selects repository"]
    Select --> Click["🖘️ Click Analyze button"]
    Click --> Validate{"✅ Repository<br/>valid?"}

    Validate -->|Yes| Clone["📥 Clone repository<br/>from GitHub"]
    Validate -->|No| Error1["❌ Return error:<br/>Invalid repository"]
    Error1 --> Stop1(("🛑 Stop"))

    Clone --> CloneOK{"✅ Clone<br/>successful?"}
    CloneOK -->|Yes| GetFiles["📂 Get list of code files"]
    CloneOK -->|No| Error2["❌ Return error:<br/>Clone failed"]
    Error2 --> Stop2(("🛑 Stop"))

    GetFiles --> Init["🔄 Initialize metrics<br/>and predictions lists"]
    Init --> Loop{"🔁 More files<br/>to analyze?"}

    Loop -->|Yes| Read["📄 Read next file"]
    Read --> CalcLOC["📊 Calculate LOC"]
    CalcLOC --> CalcCC["🔢 Calculate Cyclomatic<br/>Complexity"]
    CalcCC --> CalcHal["📝 Calculate Halstead<br/>Metrics"]
    CalcHal --> CalcMI["🎯 Calculate Maintainability<br/>Index"]
    CalcMI --> CalcChurn["📈 Get Code Churn<br/>from Git"]
    CalcChurn --> SaveMetrics["💾 Save metrics<br/>to database"]
    SaveMetrics --> ExtractFeatures["🔧 Extract features<br/>from metrics"]
    ExtractFeatures --> RunML["🤖 Run fault prediction<br/>model"]
    RunML --> CalcRisk["⚠️ Calculate risk level"]
    CalcRisk --> SavePred["💾 Save prediction<br/>to database"]
    SavePred --> Loop

    Loop -->|No| Summary["📊 Generate summary<br/>statistics"]
    Summary --> UpdateTS["🕒 Update repository<br/>last_analyzed"]
    UpdateTS --> Return["📤 Return analysis<br/>results"]
    Return --> Display["💻 Display results<br/>on dashboard"]
    Display --> End(("✅ End"))
                </div>
            </div>
        </div>

        <h4 id="ml-pipeline-diagram">ML Pipeline Diagram</h4>
        <div class="diagram-box">
            <div class="diagram-image-container">
                <div class="mermaid">
flowchart LR
    subgraph "📥 Stage 1: Data Collection"
        S1A["🔗 Clone repositories<br/>from GitHub"]
        S1B["📂 Extract commit<br/>history"]
        S1C["📄 Get source code<br/>files"]
    end

    subgraph "🔧 Stage 2: Feature Extraction"
        S2A["📊 Calculate LOC<br/>Complexity"]
        S2B["📝 Calculate Halstead<br/>Metrics"]
        S2C["📈 Calculate Code<br/>Churn"]
        S2D["🎯 Calculate MI<br/>Index"]
    end

    subgraph "📦 Stage 3: Data Preparation"
        S3A["🧯 Feature<br/>Normalization"]
        S3B["⚖️ Handle Missing<br/>Values"]
        S3C["🔀 Train/Test<br/>Split (80/20)"]
    end

    subgraph "🏋️ Stage 4: Model Training"
        S4A["🌳 Random Forest<br/>Classifier"]
        S4B["🎯 Cross-validation<br/>(5-fold)"]
        S4C["⚙️ Hyperparameter<br/>Tuning"]
        S4D["💾 Save trained<br/>model (.pkl)"]
    end

    subgraph "🚀 Stage 5: Deployment"
        S5A["📤 Load model<br/>in API"]
        S5B["🔮 Real-time<br/>prediction"]
        S5C["📊 Performance<br/>monitoring"]
    end

    S1A --> S1B
    S1B --> S1C
    S1C --> S2A

    S2A --> S2B
    S2B --> S2C
    S2C --> S2D
    S2D --> S3A

    S3A --> S3B
    S3B --> S3C
    S3C --> S4A

    S4A --> S4B
    S4B --> S4C
    S4C --> S4D
    S4D --> S5A

    S5A --> S5B
    S5B --> S5C
                </div>
            </div>
        </div>

        <div style="page-break-after: always;"></div>

        <h2 id="user-interface">4. USER INTERFACE DESIGN</h2>

        <h3 id="ui-description">4.1 Description of the User Interface</h3>

        <h4>Design System Overview:</h4>
        <p>The Fault Prediction System uses a modern, professional UI design system with consistent typography, color palette, and component library.</p>

        <h5>Color Palette:</h5>
        <div class="tech-stack">
            <ul>
                <li><strong>Primary Accent:</strong> #3498db (Blue)</li>
                <li><strong>Success:</strong> #10B981 (Green)</li>
                <li><strong>Warning:</strong> #F59E0B (Amber)</li>
                <li><strong>Error:</strong> #EF4444 (Red)</li>
                <li><strong>Background:</strong> #FFFFFF (White)</li>
                <li><strong>Text Primary:</strong> #2c3e50 (Dark Gray)</li>
                <li><strong>Text Secondary:</strong> #7f8c8d (Medium Gray)</li>
            </ul>
        </div>

        <h5>Typography:</h5>
        <ul>
            <li>Font Family: Georgia (serif) for documents, Inter for UI</li>
            <li>Body Text: 1rem (16px), line-height: 1.6</li>
            <li>Headings: h1 (2.5rem), h2 (2rem), h3 (1.5rem), h4 (1.2rem)</li>
        </ul>

        <h4 id="screen-images">4.1.1 Screen Images</h4>

        <h5>Login Page:</h5>
        <div class="note-box">
            <p>Displays user registration and login forms with email/password validation. Supports new user sign-up and existing user login with "Remember Me" option.</p>
        </div>

        <h5>Dashboard Page:</h5>
        <div class="note-box">
            <p>Overview of all repositories with summary metrics including:</p>
            <ul>
                <li>Overview Cards: Total Files, High Risk Modules, Average Complexity, Recent Analysis</li>
                <li>Risk Distribution Chart: Pie/Donut chart showing Low/Medium/High/Critical risk breakdown</li>
                <li>Complexity Trend: Line chart showing complexity metrics over time</li>
                <li>Recent Analysis List: Table of recently analyzed repositories</li>
            </ul>
        </div>

        <h5>Repository Page:</h5>
        <div class="note-box">
            <p>Detailed repository view with:</p>
            <ul>
                <li>Repository metadata (name, owner, stars, forks, description)</li>
                <li>"Add Repository" button for GitHub URL input</li>
                <li>Repository list with edit/delete/analyze actions</li>
                <li>Last analyzed timestamp and analysis status</li>
            </ul>
        </div>

        <h5>Metrics Page:</h5>
        <div class="note-box">
            <p>Detailed code metrics and analysis results:</p>
            <ul>
                <li>Metrics tables showing LOC, Complexity, Maintainability Index per file</li>
                <li>Risk distribution breakdown by severity</li>
                <li>Sorting and filtering options</li>
                <li>Export metrics functionality</li>
            </ul>
        </div>

        <h5>Bug Reports Page:</h5>
        <div class="note-box">
            <p>Bug tracking and management interface:</p>
            <ul>
                <li>Bug list with status, severity, priority</li>
                <li>"Create Bug Report" button</li>
                <li>Bug detail view with description, module path, lifecycle</li>
                <li>Status workflow: Open → In Progress → Resolved → Closed</li>
            </ul>
        </div>

        <h5>Test Prioritization Page:</h5>
        <div class="note-box">
            <p>ML-based test case prioritization:</p>
            <ul>
                <li>Test cases ranked by risk score</li>
                <li>Target module indication</li>
                <li>Priority score visualization</li>
                <li>Recommended test order for execution</li>
            </ul>
        </div>

        <h4 id="objects-actions">4.1.2 Objects and Actions</h4>

        <h4>Key UI Objects:</h4>
        <table>
            <thead>
                <tr>
                    <th>Object</th>
                    <th>Type</th>
                    <th>Purpose</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Repository Card</strong></td>
                    <td>Component</td>
                    <td>Display repository summary</td>
                    <td>View Details, Analyze, Delete, Add</td>
                </tr>
                <tr>
                    <td><strong>Risk Badge</strong></td>
                    <td>Component</td>
                    <td>Visual risk level indicator</td>
                    <td>Color-coded display (Green/Amber/Orange/Red)</td>
                </tr>
                <tr>
                    <td><strong>Metrics Table</strong></td>
                    <td>Component</td>
                    <td>Display detailed metrics</td>
                    <td>Sort, Filter, Export</td>
                </tr>
                <tr>
                    <td><strong>Risk Chart</strong></td>
                    <td>Chart (Recharts)</td>
                    <td>Visualize risk distribution</td>
                    <td>Pie/Donut chart display</td>
                </tr>
                <tr>
                    <td><strong>Complexity Trend</strong></td>
                    <td>Chart (Recharts)</td>
                    <td>Show complexity over time</td>
                    <td>Line chart with date range</td>
                </tr>
                <tr>
                    <td><strong>Bug Report Form</strong></td>
                    <td>Form</td>
                    <td>Create new bug report</td>
                    <td>Title, Description, Severity, Priority inputs</td>
                </tr>
                <tr>
                    <td><strong>Navigation Sidebar</strong></td>
                    <td>Component</td>
                    <td>App navigation and routing</td>
                    <td>Route navigation, Active link highlighting</td>
                </tr>
                <tr>
                    <td><strong>User Profile Menu</strong></td>
                    <td>Dropdown</td>
                    <td>User account options</td>
                    <td>Settings, Logout</td>
                </tr>
            </tbody>
        </table>

        <h4>User Interactions:</h4>
        <ul>
            <li><strong>Authentication:</strong> User registers/logs in with email and password</li>
            <li><strong>Repository Management:</strong> User adds GitHub URL, system fetches and stores repo metadata</li>
            <li><strong>Analysis:</strong> User initiates code analysis, progress displayed, results updated</li>
            <li><strong>Metrics Viewing:</strong> User views detailed metrics with sorting and filtering</li>
            <li><strong>Bug Tracking:</strong> User creates bug reports linked to high-risk modules</li>
            <li><strong>Test Prioritization:</strong> User views ML-recommended test execution order</li>
        </ul>

        <div style="page-break-after: always;"></div>

        <h2 id="additional-material">5. ADDITIONAL MATERIAL</h2>

        <h4>Relevant Standards and References:</h4>
        <ul>
            <li><strong>IEEE-1016:</strong> IEEE Standard for Information Technology - Systems and Software Engineering - Software Design Descriptions</li>
            <li><strong>IEEE-830:</strong> IEEE Guide to Software Requirements Specifications (referenced for requirements mapping)</li>
            <li><strong>IEEE-1058:</strong> IEEE Standard for Software Project Management Plans (referenced for project context)</li>
        </ul>

        <h4>Related Documents:</h4>
        <ul>
            <li>Chapter 1 - SPMP (Software Project Management Plan)</li>
            <li>Chapter 2 - SRS (Software Requirements Specification)</li>
            <li>System-Diagrams.html - Complete system architecture and UML diagrams</li>
        </ul>

        <h4>Design References and Tools:</h4>
        <ul>
            <li><strong>Design Diagrams:</strong> System architecture, ER diagram, deployment diagram, sequence diagrams (in System-Diagrams.html)</li>
            <li><strong>Component Library:</strong> Radix UI for accessible components</li>
            <li><strong>Styling Framework:</strong> Tailwind CSS 3.4.19</li>
            <li><strong>API Documentation:</strong> OpenAPI/Swagger format for REST endpoints</li>
        </ul>

        <hr style="margin: 40px 0; border: none; border-top: 2px solid #3498db;">

        <footer style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>End of Chapter 3 - Software Design Description (IEEE-1016)</strong></p>
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
                        <td>System Architect</td>
                        <td>____________</td>
                        <td>____________</td>
                        <td>______</td>
                    </tr>
                    <tr>
                        <td>Lead Developer</td>
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
                        <td>Design Team</td>
                        <td>Initial SDD creation (IEEE-1016 compliant)</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</body>
</html>
       