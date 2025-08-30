"""
Google Sheets Service for SESG Research Website
Handles data fetching from Google Sheets or mock data for development
"""

import os
import json
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class SESGSheetsService:
    def __init__(self):
        self.use_mock_data = False  # Set to False to use real Google Sheets
        # Google Sheets API URLs - can be configured via environment variables
        self.publications_api_url = os.environ.get(
            'PUBLICATIONS_API_URL',
            "https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6"
        )
        self.projects_api_url = os.environ.get(
            'PROJECTS_API_URL',  
            "https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7"
        )
        self.achievements_api_url = os.environ.get(
            'ACHIEVEMENTS_API_URL',
            "https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8"
        )
        self.news_events_api_url = os.environ.get(
            'NEWS_EVENTS_API_URL',
            "https://script.google.com/macros/s/AKfycbwLVCtEI2Mr2J76jf72kfK6OhaMNNdfvLTcJTV8J6mtWcNNGVnHtt0Gxu__lavtnrc8/exec?sheet=sheet9"
        )
        
        # Cache configuration for performance optimization
        self.cache = {}
        self.cache_duration = timedelta(seconds=30)  # Reduced to 30 seconds for faster updates
        self.last_fetch_time = {}
        
    def get_publications(self, 
                        page: int = 1, 
                        per_page: int = 20,
                        year_filter: Optional[str] = None,
                        area_filter: Optional[str] = None,
                        category_filter: Optional[str] = None,
                        author_filter: Optional[str] = None,
                        title_filter: Optional[str] = None,
                        search_filter: Optional[str] = None,
                        sort_by: str = "year",
                        sort_order: str = "desc") -> Dict[str, Any]:
        """Get publications with filtering, pagination, and sorting"""
        
        if self.use_mock_data:
            return self._get_mock_publications(page, per_page, year_filter, area_filter, 
                                            category_filter, author_filter, title_filter, 
                                            search_filter, sort_by, sort_order)
        else:
            return self._get_google_sheets_publications(page, per_page, year_filter, area_filter, 
                                                      category_filter, author_filter, title_filter, 
                                                      search_filter, sort_by, sort_order)
    
    def get_projects(self,
                    page: int = 1,
                    per_page: int = 20,
                    status_filter: Optional[str] = None,
                    area_filter: Optional[str] = None,
                    title_filter: Optional[str] = None,
                    sort_by: str = "start_date",
                    sort_order: str = "desc") -> Dict[str, Any]:
        """Get projects with filtering and pagination"""
        
        if self.use_mock_data:
            return self._get_mock_projects(page, per_page, status_filter, area_filter, 
                                         title_filter, sort_by, sort_order)
        else:
            return self._get_google_sheets_projects(page, per_page, status_filter, area_filter, 
                                                  title_filter, sort_by, sort_order)
    
    def get_achievements(self,
                        page: int = 1,
                        per_page: int = 12,
                        category_filter: Optional[str] = None,
                        title_filter: Optional[str] = None,
                        sort_by: str = "date",
                        sort_order: str = "desc") -> Dict[str, Any]:
        """Get achievements with filtering and pagination"""
        
        if self.use_mock_data:
            return self._get_mock_achievements(page, per_page, category_filter, 
                                            title_filter, sort_by, sort_order)
        else:
            return self._get_google_sheets_achievements(page, per_page, category_filter, 
                                                      title_filter, sort_by, sort_order)
    
    def get_news_events(self,
                       page: int = 1,
                       per_page: int = 15,
                       category_filter: Optional[str] = None,
                       title_filter: Optional[str] = None,
                       sort_by: str = "date",
                       sort_order: str = "desc") -> Dict[str, Any]:
        """Get news and events with filtering and pagination"""
        
        if self.use_mock_data:
            return self._get_mock_news_events(page, per_page, category_filter, 
                                            title_filter, sort_by, sort_order)
        else:
            return self._get_google_sheets_news_events(page, per_page, category_filter, 
                                                     title_filter, sort_by, sort_order)
    
    def get_achievement_details(self, achievement_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed achievement for blog-style page"""
        if self.use_mock_data:
            return self._get_mock_achievement_details(achievement_id)
        else:
            return self._get_google_sheets_achievement_details(achievement_id)
    
    def get_news_event_details(self, news_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed news/event for blog-style page"""
        if self.use_mock_data:
            return self._get_mock_news_event_details(news_id)
        else:
            return self._get_google_sheets_news_event_details(news_id)

    def _get_mock_publications(self, page, per_page, year_filter, area_filter, 
                              category_filter, author_filter, title_filter, 
                              search_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Generate comprehensive mock publications data"""
        
        # Mock publications data
        publications = [
            {
                "id": "pub_001",
                "title": "Machine Learning Approaches for Smart Grid Optimization: A Comprehensive Review",
                "authors": ["Dr. Ahmed Rahman", "Prof. Sarah Mitchell", "Dr. James Chen", "Ms. Fatima Al-Zahra"],
                "publication_info": "IEEE Transactions on Smart Grid, vol. 15, no. 3, pp. 2145-2158, 2024",
                "year": "2024",
                "category": "Journal Articles",
                "research_areas": ["Smart Grid Technologies", "Grid Optimization & Stability"],
                "citations": 45,
                "open_access": True,
                "full_paper_link": "https://example.com/paper1.pdf",
                "abstract": "This paper presents a comprehensive review of machine learning approaches for smart grid optimization, covering deep learning, reinforcement learning, and ensemble methods."
            },
            {
                "id": "pub_002", 
                "title": "Renewable Energy Integration Strategies for Microgrids: Performance Analysis and Optimization",
                "authors": ["Prof. Maria Rodriguez", "Dr. Ahmed Rahman", "Eng. Michael Johnson"],
                "publication_info": "Renewable Energy, vol. 198, pp. 1156-1169, 2024",
                "year": "2024",
                "category": "Journal Articles",
                "research_areas": ["Microgrids & Distributed Energy Systems", "Renewable Energy Integration"],
                "citations": 32,
                "open_access": False,
                "full_paper_link": None,
                "abstract": "An analysis of various renewable energy integration strategies for microgrids with focus on optimization algorithms and performance metrics."
            },
            {
                "id": "pub_003",
                "title": "Cybersecurity Framework for Smart Power Grids: Threat Analysis and Defense Mechanisms",
                "authors": ["Dr. Elena Petrov", "Prof. John Williams", "Dr. Ahmed Rahman"],
                "publication_info": "IEEE Conference on Smart Grid Communications, pp. 234-239, 2024",
                "year": "2024", 
                "category": "Conference Proceedings",
                "research_areas": ["Cybersecurity and AI for Power Infrastructure"],
                "citations": 18,
                "open_access": True,
                "full_paper_link": "https://example.com/paper3.pdf",
                "abstract": "This work proposes a comprehensive cybersecurity framework for smart power grids addressing emerging threats and defense strategies."
            },
            {
                "id": "pub_004",
                "title": "Advanced Energy Storage Systems for Grid Stability: A Technical Review",
                "authors": ["Dr. Lisa Chang", "Prof. David Kumar", "Dr. Ahmed Rahman", "Eng. Robert Smith"],
                "publication_info": "Journal of Energy Storage, vol. 67, article 107543, 2023",
                "year": "2023",
                "category": "Journal Articles", 
                "research_areas": ["Energy Storage Systems", "Grid Optimization & Stability"],
                "citations": 67,
                "open_access": True,
                "full_paper_link": "https://example.com/paper4.pdf",
                "abstract": "Comprehensive review of advanced energy storage technologies and their impact on grid stability and performance."
            },
            {
                "id": "pub_005",
                "title": "IoT-Based Monitoring Systems for Smart Grid Infrastructure",
                "authors": ["Eng. Alex Thompson", "Dr. Ahmed Rahman", "Prof. Sarah Mitchell"],
                "publication_info": "International Conference on Internet of Things, pp. 145-152, 2023",
                "year": "2023",
                "category": "Conference Proceedings",
                "research_areas": ["Smart Grid Technologies", "Power System Automation"],
                "citations": 29,
                "open_access": False,
                "full_paper_link": None,
                "abstract": "Development of IoT-based monitoring systems for real-time smart grid infrastructure management and optimization."
            },
            {
                "id": "pub_006",
                "title": "Distributed Energy Resources Management in Smart Grids",
                "authors": ["Prof. Maria Rodriguez", "Dr. Elena Petrov", "Eng. Michael Johnson"],
                "publication_info": "Smart Grid Technologies Handbook, Chapter 12, pp. 245-278, Springer, 2023",
                "year": "2023",
                "category": "Book Chapters",
                "research_areas": ["Microgrids & Distributed Energy Systems", "Smart Grid Technologies"],
                "citations": 41,
                "open_access": False,
                "full_paper_link": None,
                "abstract": "Comprehensive guide to managing distributed energy resources in modern smart grid systems."
            }
        ]
        
        # Add more publications for pagination testing
        for i in range(7, 51):
            publications.append({
                "id": f"pub_{i:03d}",
                "title": f"Research Paper {i}: Advanced Topics in Sustainable Energy Systems",
                "authors": ["Dr. Researcher A", "Prof. Researcher B"],
                "publication_info": f"Conference on Energy Systems, vol. {i}, pp. 100-110, {2022 + (i % 3)}",
                "year": str(2022 + (i % 3)),
                "category": ["Journal Articles", "Conference Proceedings", "Book Chapters"][i % 3],
                "research_areas": [["Smart Grid Technologies"], ["Renewable Energy Integration"], 
                                 ["Energy Storage Systems"], ["Grid Optimization & Stability"]][i % 4],
                "citations": max(1, 50 - i),
                "open_access": i % 2 == 0,
                "full_paper_link": f"https://example.com/paper{i}.pdf" if i % 2 == 0 else None,
                "abstract": f"Abstract for research paper {i} covering advanced topics in sustainable energy systems."
            })
        
        # Apply filters
        filtered_pubs = self._apply_publication_filters(
            publications, year_filter, area_filter, category_filter, 
            author_filter, title_filter, search_filter
        )
        
        # Apply sorting
        filtered_pubs = self._sort_publications(filtered_pubs, sort_by, sort_order)
        
        # Apply pagination
        total = len(filtered_pubs)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_pubs = filtered_pubs[start_idx:end_idx]
        
        return {
            "publications": paginated_pubs,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_items": total,
                "total_pages": (total + per_page - 1) // per_page,
                "has_next": end_idx < total,
                "has_prev": page > 1
            },
            "statistics": {
                "total_publications": total,
                "total_citations": sum(pub["citations"] for pub in filtered_pubs)
            }
        }
    
    def _get_mock_projects(self, page, per_page, status_filter, area_filter, 
                          title_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Generate mock projects data"""
        
        projects = [
            {
                "id": "proj_001",
                "title": "AI-Powered Smart Grid Optimization Platform",
                "description": "Development of an intelligent platform for real-time smart grid optimization using machine learning algorithms and predictive analytics.",
                "status": "Active",
                "start_date": "2024-01-15",
                "end_date": "2025-12-31",
                "research_areas": ["Smart Grid Technologies", "Grid Optimization & Stability"],
                "principal_investigator": "Dr. Ahmed Rahman",
                "team_members": ["Prof. Sarah Mitchell", "Dr. James Chen", "Ms. Fatima Al-Zahra"],
                "funding_agency": "National Science Foundation",
                "budget": "$450,000",
                "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
            },
            {
                "id": "proj_002",
                "title": "Microgrid Integration for Rural Communities",
                "description": "Implementation of sustainable microgrid solutions for rural communities with focus on renewable energy integration and energy storage systems.",
                "status": "Active",
                "start_date": "2023-06-01",
                "end_date": "2025-05-31",
                "research_areas": ["Microgrids & Distributed Energy Systems", "Renewable Energy Integration"],
                "principal_investigator": "Prof. Maria Rodriguez",
                "team_members": ["Dr. Elena Petrov", "Eng. Michael Johnson", "Dr. Lisa Chang"],
                "funding_agency": "Department of Energy",
                "budget": "$650,000",
                "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7"
            },
            {
                "id": "proj_003",
                "title": "Cybersecurity Enhancement for Smart Power Infrastructure",
                "description": "Research and development of advanced cybersecurity measures to protect smart grid infrastructure from emerging cyber threats.",
                "status": "Completed",
                "start_date": "2022-09-01", 
                "end_date": "2024-08-31",
                "research_areas": ["Cybersecurity and AI for Power Infrastructure"],
                "principal_investigator": "Dr. Elena Petrov",
                "team_members": ["Prof. John Williams", "Dr. Ahmed Rahman", "Eng. Alex Thompson"],
                "funding_agency": "Defense Advanced Research Projects Agency",
                "budget": "$750,000",
                "image": "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e"
            },
            {
                "id": "proj_004",
                "title": "Next-Generation Battery Management Systems",
                "description": "Development of intelligent battery management systems for large-scale energy storage applications in smart grids.",
                "status": "Active",
                "start_date": "2024-03-01",
                "end_date": "2026-02-28",
                "research_areas": ["Energy Storage Systems", "Power System Automation"],
                "principal_investigator": "Dr. Lisa Chang",
                "team_members": ["Prof. David Kumar", "Eng. Robert Smith", "Dr. Ahmed Rahman"],
                "funding_agency": "Tesla Energy Research Fund",
                "budget": "$850,000",
                "image": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9"
            }
        ]
        
        # Add more projects for pagination testing
        for i in range(5, 21):
            projects.append({
                "id": f"proj_{i:03d}",
                "title": f"Research Project {i}: Sustainable Energy Innovation",
                "description": f"Project {i} focuses on innovative approaches to sustainable energy systems and smart grid technologies.",
                "status": ["Active", "Completed", "Planning"][i % 3],
                "start_date": f"2024-{(i % 12) + 1:02d}-01",
                "end_date": f"2025-{(i % 12) + 1:02d}-31",
                "research_areas": [["Smart Grid Technologies"], ["Renewable Energy Integration"], 
                                 ["Energy Storage Systems"]][i % 3],
                "principal_investigator": f"Dr. Researcher {chr(65 + (i % 5))}",
                "team_members": [f"Prof. Member {i}", f"Eng. Assistant {i}"],
                "funding_agency": ["NSF", "DOE", "Private Industry"][i % 3],
                "budget": f"${(i * 50000):,}",
                "image": "https://images.unsplash.com/photo-1467533003447-e295ff1b0435"
            })
        
        # Apply filters and sorting
        filtered_projects = self._apply_project_filters(projects, status_filter, area_filter, title_filter)
        filtered_projects = self._sort_projects(filtered_projects, sort_by, sort_order)
        
        # Apply pagination
        total = len(filtered_projects)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_projects = filtered_projects[start_idx:end_idx]
        
        return {
            "projects": paginated_projects,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_items": total,
                "total_pages": (total + per_page - 1) // per_page,
                "has_next": end_idx < total,
                "has_prev": page > 1
            }
        }
    
    def _get_mock_achievements(self, page, per_page, category_filter, 
                              title_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Generate mock achievements data"""
        
        achievements = [
            {
                "id": "ach_001",
                "title": "Best Paper Award at IEEE Smart Grid Conference 2024",
                "short_description": "Our research on AI-powered grid optimization received the prestigious Best Paper Award at the IEEE International Conference on Smart Grid Technologies.",
                "category": "Award",
                "date": "2024-11-15",
                "image": "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
                "featured": 1,
                "full_content": """
                # Best Paper Award at IEEE Smart Grid Conference 2024

                We are thrilled to announce that our research paper titled "Machine Learning Approaches for Smart Grid Optimization: A Comprehensive Review" has been awarded the **Best Paper Award** at the IEEE International Conference on Smart Grid Technologies 2024.

                ## About the Research

                The award-winning paper, authored by Dr. Ahmed Rahman, Prof. Sarah Mitchell, Dr. James Chen, and Ms. Fatima Al-Zahra, presents a comprehensive analysis of machine learning applications in smart grid optimization.

                ### Key Contributions:
                - Novel deep learning architectures for grid optimization
                - Comparative analysis of reinforcement learning algorithms
                - Real-world case studies and performance benchmarks
                - Future research directions and challenges

                ## Conference Highlights

                The IEEE International Conference on Smart Grid Technologies brought together over 500 researchers from around the world. Our presentation highlighted the potential of AI in revolutionizing power grid management.

                ### Impact and Recognition

                This recognition validates our lab's commitment to cutting-edge research in sustainable energy systems. The paper has already received significant attention from the research community and industry partners.

                **Citation:** Rahman, A., Mitchell, S., Chen, J., & Al-Zahra, F. (2024). Machine Learning Approaches for Smart Grid Optimization: A Comprehensive Review. *IEEE Transactions on Smart Grid*, 15(3), 2145-2158.
                """
            },
            {
                "id": "ach_002",
                "title": "Strategic Partnership with Tesla Energy Announced",
                "short_description": "SESG Research Lab partners with Tesla Energy to develop next-generation battery management systems for smart grid applications.",
                "category": "Partnership",
                "date": "2024-10-28",
                "image": "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800",
                "featured": 0,
                "full_content": """
                # Strategic Partnership with Tesla Energy

                The Sustainable Energy and Smart Grid Research Lab is proud to announce a groundbreaking partnership with **Tesla Energy** to advance research in battery management systems and energy storage technologies.

                ## Partnership Overview

                This collaboration brings together our lab's academic research expertise with Tesla's industry-leading energy storage solutions to develop innovative technologies for smart grid applications.

                ### Research Focus Areas:
                1. **Advanced Battery Management Systems**
                2. **Grid-Scale Energy Storage Solutions**
                3. **AI-Powered Energy Optimization**
                4. **Sustainable Energy Integration**

                ## Expected Outcomes

                The partnership is expected to yield significant advances in:
                - Battery performance optimization algorithms
                - Smart grid integration protocols
                - Real-time energy management systems
                - Sustainable energy storage solutions

                ### Funding and Duration

                Tesla Energy will provide $850,000 in funding over two years, along with access to cutting-edge battery technology and testing facilities.

                ## Team Leadership

                The project will be led by **Dr. Lisa Chang** as Principal Investigator, with support from Prof. David Kumar and the entire SESG research team.

                This partnership represents a significant milestone in our mission to advance sustainable energy technologies and smart grid solutions.
                """
            }
        ]
        
        # Add more achievements for testing
        for i in range(3, 26):
            achievements.append({
                "id": f"ach_{i:03d}",
                "title": f"Research Milestone {i}: Innovation in Sustainable Energy",
                "short_description": f"Achievement {i} represents a significant breakthrough in our ongoing research efforts.",
                "category": ["Award", "Partnership", "Publication", "Grant"][i % 4],
                "date": f"2024-{(i % 12) + 1:02d}-{(i % 28) + 1:02d}",
                "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
                "featured": 1 if i == 5 else 0,  # Make one of them featured for testing
                "full_content": f"""
                # Research Milestone {i}: Innovation in Sustainable Energy

                This achievement represents our continued commitment to advancing sustainable energy research.

                ## Overview
                Achievement {i} demonstrates our lab's innovative approach to solving complex energy challenges.

                ### Key Points:
                - Significant research breakthrough
                - Industry collaboration
                - Academic recognition
                - Future impact potential

                This milestone contributes to our broader mission of sustainable energy advancement.
                """
            })
        
        # Apply filters and sorting
        filtered_achievements = self._apply_achievement_filters(achievements, category_filter, title_filter)
        filtered_achievements = self._sort_achievements(filtered_achievements, sort_by, sort_order)
        
        # Apply pagination
        total = len(filtered_achievements)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_achievements = filtered_achievements[start_idx:end_idx]
        
        return {
            "achievements": paginated_achievements,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_items": total,
                "total_pages": (total + per_page - 1) // per_page,
                "has_next": end_idx < total,
                "has_prev": page > 1
            }
        }
    
    def _get_mock_news_events(self, page, per_page, category_filter, 
                             title_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Generate mock news and events data"""
        
        news_events = [
            {
                "id": "news_001",
                "title": "International Smart Grid Symposium 2024 - Call for Papers",
                "short_description": "Submit your research papers for the upcoming International Smart Grid Symposium to be held at BRAC University in December 2024.",
                "description": "Submit your research papers for the upcoming International Smart Grid Symposium to be held at BRAC University in December 2024.",
                "category": "Upcoming Event",
                "date": "2024-12-15",
                "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                "featured": 1,
                "full_content": """
                # International Smart Grid Symposium 2024

                ## Call for Papers - Deadline Extended!

                The SESG Research Lab is organizing the **International Smart Grid Symposium 2024** at BRAC University, Dhaka, Bangladesh.

                ### Important Dates:
                - **Paper Submission Deadline:** November 30, 2024
                - **Notification of Acceptance:** December 5, 2024  
                - **Conference Date:** December 15-16, 2024

                ## Conference Themes:
                1. Smart Grid Technologies and Applications
                2. Renewable Energy Integration
                3. Energy Storage Systems
                4. Grid Cybersecurity
                5. AI and Machine Learning in Power Systems

                ### Keynote Speakers:
                - Prof. Elena Rodriguez (MIT)
                - Dr. James Patterson (Stanford University)
                - Industry leaders from Tesla, Google, and Siemens

                ## Registration Information:
                - **Academic:** $150
                - **Industry:** $300
                - **Students:** $75

                Join us for two days of cutting-edge research presentations, networking opportunities, and collaborative discussions on the future of smart grid technologies.

                **Contact:** symposium@sesg.bracu.ac.bd
                """
            },
            {
                "id": "news_002",
                "title": "SESG Lab Receives $1.2M Grant from National Science Foundation",
                "short_description": "Major funding awarded for groundbreaking research in AI-powered smart grid optimization and renewable energy integration.",
                "description": "Major funding awarded for groundbreaking research in AI-powered smart grid optimization and renewable energy integration.",
                "category": "News",
                "date": "2024-11-20",
                "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
                "featured": 0,
                "full_content": """
                # Major NSF Grant Awarded to SESG Research Lab

                The Sustainable Energy and Smart Grid Research Lab has been awarded a **$1.2 million grant** from the National Science Foundation (NSF) for our proposal titled "AI-Powered Optimization Framework for Next-Generation Smart Grids."

                ## Project Overview

                This three-year project will focus on developing advanced artificial intelligence algorithms for optimizing smart grid operations, with particular emphasis on renewable energy integration and demand response systems.

                ### Research Objectives:
                - Develop novel deep learning architectures for grid optimization
                - Create real-time decision-making systems for energy distribution
                - Integrate renewable energy sources more effectively
                - Enhance grid resilience and reliability

                ## Team and Collaboration

                The project will be led by **Dr. Ahmed Rahman** as Principal Investigator, with co-investigators Prof. Sarah Mitchell and Dr. James Chen.

                ### Industry Partners:
                - Tesla Energy
                - Siemens Smart Infrastructure
                - Bangladesh Power Development Board

                ## Expected Impact

                This research is expected to significantly advance the field of smart grid technologies and contribute to more sustainable and efficient power systems worldwide.

                The grant will also support graduate student research and state-of-the-art laboratory equipment for advanced energy systems research.
                """
            },
            {
                "id": "news_003",
                "title": "Student Team Wins First Place at IEEE Power & Energy Student Competition",
                "short_description": "Our undergraduate students secured first place in the prestigious IEEE Power & Energy Society Student Competition with their innovative microgrid design.",
                "category": "Achievement",
                "date": "2024-11-10",
                "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
                "full_content": """
                # IEEE Competition Victory: Students Excel in Microgrid Design

                Congratulations to our outstanding undergraduate student team for winning **First Place** in the IEEE Power & Energy Society Student Competition 2024!

                ## Winning Project: "Smart Microgrid for Rural Electrification"

                The team developed an innovative microgrid solution specifically designed for rural communities in Bangladesh, incorporating:

                ### Key Features:
                - Solar and wind energy integration
                - Smart battery management system
                - IoT-based monitoring and control
                - Machine learning for demand prediction
                - Community engagement platform

                ## Team Members:
                - **Fatima Al-Zahra** (Team Leader, Electrical Engineering)
                - **Michael Rahman** (Computer Science & Engineering)
                - **Sarah Ahmed** (Electrical Engineering)  
                - **David Kumar** (Environmental Science)

                ### Faculty Supervisor:
                Prof. Maria Rodriguez provided guidance throughout the project development.

                ## Competition Details

                The IEEE Power & Energy Society Student Competition brought together 150 teams from universities across Asia-Pacific. Our team's presentation impressed judges with its practical approach and innovative technology integration.

                ### Prize and Recognition:
                - $5,000 cash prize
                - IEEE PES membership for team members
                - Invitation to present at IEEE PES General Meeting 2025
                - Industry mentorship opportunities

                This achievement highlights the quality of education and research opportunities available at our lab and BRAC University.
                """
            },
            {
                "id": "news_004",
                "title": "Smart Campus Microgrid Installation Completed Successfully",
                "short_description": "BRAC University's new smart microgrid system is now operational, serving as a living laboratory for sustainable energy research.",
                "category": "Event",
                "date": "2024-10-25",
                "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
                "full_content": """
                # Smart Campus Microgrid Goes Live

                We are excited to announce the successful completion and activation of the **BRAC University Smart Campus Microgrid**, a state-of-the-art installation that will serve as both a sustainable energy solution and a living laboratory for research.

                ## System Specifications

                The microgrid system includes:
                - **500 kW Solar PV Array** installed across campus rooftops
                - **200 kWh Battery Storage System** for energy management
                - **Smart Inverters and Controllers** for grid integration
                - **IoT Monitoring Network** for real-time data collection

                ### Performance Highlights:
                - 30% reduction in grid electricity consumption
                - Real-time energy optimization
                - Seamless backup power during outages
                - Carbon footprint reduction of 150 tons CO2/year

                ## Research Opportunities

                This installation creates unique research opportunities for:
                - Graduate student thesis projects
                - Industry collaboration studies
                - Technology validation and testing
                - Educational demonstrations

                ### Current Research Projects:
                1. Machine learning for energy forecasting
                2. Demand response optimization
                3. Battery management algorithms
                4. Grid integration protocols

                ## Community Impact

                The microgrid serves as a demonstration site for sustainable energy technologies, hosting visits from government officials, industry partners, and other universities.

                **Project Partners:** Tesla Energy, Siemens, Solar Power Bangladesh Ltd.

                This achievement represents a significant step toward our vision of a sustainable energy future.
                """
            },
            {
                "id": "news_005",
                "title": "Advanced Mathematical Modeling for Optimal Power Flow in Smart Grids",
                "short_description": "New research breakthrough in mathematical optimization algorithms for efficient power distribution in renewable energy integrated smart grids.",
                "category": "News",
                "date": "2024-11-25",
                "location": "SESG Research Lab, BRAC University",
                "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
                "full_content": """
                # Advanced Mathematical Modeling for Optimal Power Flow in Smart Grids

                Our research team has developed groundbreaking mathematical models for optimal power flow (OPF) in smart grids with high renewable energy penetration.

                ## Mathematical Framework

                The optimization problem is formulated as a multi-objective function:

                ### Objective Function:
                **Minimize:** f(x) = α₁ · Cost + α₂ · Losses + α₃ · Emissions

                Where:
                - **Cost Function:** C(P) = Σᵢ₌₁ⁿ (aᵢPᵢ² + bᵢPᵢ + cᵢ)
                - **Power Loss:** PLoss = Σᵢ₌₁ᵐ Rᵢ · |Iᵢ|²
                - **Emission Factor:** E(P) = Σᵢ₌₁ⁿ (αᵢPᵢ² + βᵢPᵢ + γᵢ)

                ### Constraints:
                
                **Power Balance Equations:**
                - Pᵢ - Pᴅᵢ = Vᵢ Σⱼ₌₁ⁿ Vⱼ(Gᵢⱼcos(θᵢⱼ) + Bᵢⱼsin(θᵢⱼ))
                - Qᵢ - Qᴅᵢ = Vᵢ Σⱼ₌₁ⁿ Vⱼ(Gᵢⱼsin(θᵢⱼ) - Bᵢⱼcos(θᵢⱼ))

                **Voltage Limits:**
                Vᵢᵐⁱⁿ ≤ Vᵢ ≤ Vᵢᵐᵃˣ, ∀i ∈ {1,2,...,n}

                **Line Flow Limits:**
                |Sᵢⱼ| = √(Pᵢⱼ² + Qᵢⱼ²) ≤ Sᵢⱼᵐᵃˣ

                ## Renewable Energy Integration Model

                ### Solar PV Output:
                Psolar(t) = η · A · G(t) · [1 - β(T(t) - Tref)]

                Where:
                - η = Panel efficiency
                - A = Panel area (m²)
                - G(t) = Solar irradiance (W/m²)
                - β = Temperature coefficient
                - T(t) = Cell temperature (°C)

                ### Wind Power Model:
                **Pwind(v) = {**
                - 0, if v < vcut-in or v > vcut-out
                - Prated · (v³ - vcut-in³)/(vrated³ - vcut-in³), if vcut-in ≤ v ≤ vrated
                - Prated, if vrated ≤ v ≤ vcut-out
                **}**

                ## Optimization Algorithm

                We employ a **Particle Swarm Optimization (PSO)** enhanced with Gaussian mutation:

                ### Velocity Update:
                vᵢ(t+1) = w·vᵢ(t) + c₁r₁(pbest_i - xᵢ(t)) + c₂r₂(gbest - xᵢ(t))

                ### Position Update:
                xᵢ(t+1) = xᵢ(t) + vᵢ(t+1)

                ### Gaussian Mutation:
                xᵢ = xᵢ + N(0, σ²), where σ = σ₀ · e^(-t/τ)

                ## Results and Performance

                ### Test System: IEEE 30-Bus Modified
                - **Convergence Rate:** 99.7% within 100 iterations
                - **Cost Reduction:** 12.3% compared to conventional methods
                - **Computational Time:** 0.847 seconds average
                - **Voltage Profile Improvement:** 4.2% better THD

                ### Statistical Analysis:
                **Mean Fitness Function:** f̄ = 1/N Σᵢ₌₁ᴺ fᵢ = 2847.32 $/h

                **Standard Deviation:** σf = √(1/(N-1) Σᵢ₌₁ᴺ (fᵢ - f̄)²) = 23.47

                **Confidence Interval (95%):** [2823.85, 2870.79] $/h

                ## Complex Mathematical Validations

                ### Fourier Transform for Harmonic Analysis:
                X(k) = Σₙ₌₀ᴺ⁻¹ x(n)e^(-j2πkn/N)

                ### Laplace Transform for Stability Analysis:
                L{f(t)} = F(s) = ∫₀^∞ f(t)e^(-st)dt

                ### Eigenvalue Analysis for Small-Signal Stability:
                Det[λI - A] = 0, where A is the system Jacobian matrix

                ## Future Research Directions

                ### Machine Learning Integration:
                We are developing **Neural Network-based forecasting** models:

                **RNN Model:** h(t) = tanh(Wxh·x(t) + Whh·h(t-1) + bh)

                **LSTM Gates:**
                - **Forget Gate:** ft = σ(Wf·[ht-1, xt] + bf)
                - **Input Gate:** it = σ(Wi·[ht-1, xt] + bi)
                - **Candidate Values:** C̃t = tanh(WC·[ht-1, xt] + bC)
                - **Cell State:** Ct = ft * Ct-1 + it * C̃t
                - **Output Gate:** ot = σ(Wo·[ht-1, xt] + bo)
                - **Hidden State:** ht = ot * tanh(Ct)

                ## Conclusion

                This research demonstrates the effectiveness of advanced mathematical modeling in optimizing smart grid operations. The integration of complex optimization algorithms with renewable energy forecasting models provides a robust framework for future smart grid implementations.

                **Research Team:** Dr. Ahmed Rahman, Prof. Sarah Mitchell, Dr. James Chen, Ms. Fatima Al-Zahra

                **Publications:** Submitted to IEEE Transactions on Smart Grid (Under Review)

                **Code Repository:** Available on GitHub - github.com/sesg-bracu/optimal-power-flow
                """
            }
        ]
        
        # Add more news/events for testing
        for i in range(5, 41):
            description = f"Update {i} provides the latest information about our ongoing research and activities."
            news_events.append({
                "id": f"news_{i:03d}",
                "title": f"News/Event {i}: Latest Update from SESG Lab",
                "short_description": description,
                "description": description,
                "category": ["News", "Event", "Achievement", "Upcoming Event"][i % 4],
                "date": f"2024-{(i % 12) + 1:02d}-{(i % 28) + 1:02d}",
                "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
                "featured": 1 if i == 7 else 0,  # Make one of them featured for testing
                "full_content": f"""
                # News/Event {i}: Latest Update from SESG Lab

                ## Overview
                This update covers the latest developments in our research activities.

                ### Key Points:
                - Research progress update
                - Team accomplishments
                - Future plans and objectives
                - Community engagement activities

                Stay tuned for more updates from the SESG Research Lab.
                """
            })
        
        # Apply filters and sorting
        filtered_news = self._apply_news_filters(news_events, category_filter, title_filter)
        filtered_news = self._sort_news_events(filtered_news, sort_by, sort_order)
        
        # Apply pagination
        total = len(filtered_news)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_news = filtered_news[start_idx:end_idx]
        
        return {
            "news_events": paginated_news,
            "pagination": {
                "current_page": page,
                "per_page": per_page,
                "total_items": total,
                "total_pages": (total + per_page - 1) // per_page,
                "has_next": end_idx < total,
                "has_prev": page > 1
            }
        }

    # Helper methods for filtering and sorting
    def _apply_publication_filters(self, publications, year_filter, area_filter, 
                                  category_filter, author_filter, title_filter, search_filter=None):
        filtered = publications
        
        # Single search filter (searches in title, authors, or year)
        if search_filter:
            search_term = search_filter.lower()
            filtered = [p for p in filtered if (
                search_term in p["title"].lower() or
                any(search_term in author.lower() for author in p["authors"]) or
                search_term in p["year"] or
                (p.get("abstract") and search_term in p["abstract"].lower())
            )]
        
        # Individual filters (only apply if search_filter is not used)
        if not search_filter:
            if year_filter:
                filtered = [p for p in filtered if p["year"] == year_filter]
            if area_filter:
                filtered = [p for p in filtered if area_filter in p["research_areas"]]
            if author_filter:
                filtered = [p for p in filtered if any(author_filter.lower() in author.lower() 
                                                      for author in p["authors"])]
            if title_filter:
                filtered = [p for p in filtered if title_filter.lower() in p["title"].lower()]
        
        # Category filter always applies
        if category_filter:
            filtered = [p for p in filtered if p["category"] == category_filter]
            
        return filtered
    
    def _sort_publications(self, publications, sort_by, sort_order):
        reverse = sort_order == "desc"
        
        if sort_by == "year":
            return sorted(publications, key=lambda x: int(x["year"]) if x["year"].isdigit() else 0, reverse=reverse)
        elif sort_by == "citations":
            return sorted(publications, key=lambda x: x["citations"], reverse=reverse)
        elif sort_by == "title":
            return sorted(publications, key=lambda x: x["title"].lower(), reverse=reverse)
        elif sort_by == "area":
            return sorted(publications, key=lambda x: x["research_areas"][0].lower() if x["research_areas"] else "", reverse=reverse)
        else:
            return publications
    
    def clear_cache(self):
        """Clear all cached data"""
        self.cache.clear()
        self.last_fetch_time.clear()
        logger.info("Cache cleared successfully")
    
    def _apply_project_filters(self, projects, status_filter, area_filter, title_filter):
        filtered = projects
        
        if status_filter:
            filtered = [p for p in filtered if p["status"] == status_filter]
        if area_filter:
            filtered = [p for p in filtered if area_filter in p["research_areas"]]
        if title_filter:
            filtered = [p for p in filtered if title_filter.lower() in p["title"].lower()]
            
        return filtered
    
    def _sort_projects(self, projects, sort_by, sort_order):
        reverse = sort_order == "desc"
        
        if sort_by == "start_date":
            return sorted(projects, key=lambda x: x["start_date"], reverse=reverse)
        elif sort_by == "title":
            return sorted(projects, key=lambda x: x["title"], reverse=reverse)
        else:
            return projects
    
    def _apply_achievement_filters(self, achievements, category_filter, title_filter):
        filtered = achievements
        
        if category_filter:
            filtered = [a for a in filtered if a["category"] == category_filter]
        if title_filter:
            filtered = [a for a in filtered if title_filter.lower() in a["title"].lower()]
            
        return filtered
    
    def _sort_achievements(self, achievements, sort_by, sort_order):
        reverse = sort_order == "desc"
        
        # Always prioritize featured items first, then apply the requested sort
        def sort_key(x):
            featured_priority = -x.get("featured", 0)  # Featured items (1) get negative value for priority
            
            if sort_by == "date":
                # For date sorting, reverse the secondary sort but keep featured priority intact
                secondary_sort = x["date"]
                if reverse:
                    # For descending date, we want newer dates first, so negate the date for proper sorting
                    return (featured_priority, secondary_sort)
                else:
                    return (featured_priority, secondary_sort)
            elif sort_by == "title":
                secondary_sort = x["title"].lower()
                if reverse:
                    # For descending title (Z-A), we need to handle this in the secondary sort
                    return (featured_priority, secondary_sort)
                else:
                    return (featured_priority, secondary_sort)
            else:
                # Default to date sorting
                secondary_sort = x["date"]
                return (featured_priority, secondary_sort)
        
        # Sort with featured items always first, but handle reverse for secondary sort only
        if sort_by == "title":
            # For title sorting, we can use reverse directly since string comparison works correctly
            return sorted(achievements, key=sort_key, reverse=reverse)
        else:
            # For date sorting, we need to handle the reverse logic more carefully
            # First sort by featured priority (always ascending to keep featured first)
            # Then sort by date within each group
            featured_items = [item for item in achievements if item.get("featured", 0) == 1]
            non_featured_items = [item for item in achievements if item.get("featured", 0) == 0]
            
            # Sort each group separately
            if sort_by == "date":
                featured_items.sort(key=lambda x: x["date"], reverse=reverse)
                non_featured_items.sort(key=lambda x: x["date"], reverse=reverse)
            else:
                featured_items.sort(key=lambda x: x["date"], reverse=reverse)
                non_featured_items.sort(key=lambda x: x["date"], reverse=reverse)
            
            # Combine with featured items first
            return featured_items + non_featured_items
    
    def _apply_news_filters(self, news_events, category_filter, title_filter):
        filtered = news_events
        
        if category_filter:
            filtered = [n for n in filtered if n["category"] == category_filter]
        if title_filter:
            filtered = [n for n in filtered if title_filter.lower() in n["title"].lower()]
            
        return filtered
    
    def _sort_news_events(self, news_events, sort_by, sort_order):
        reverse = sort_order == "desc"
        
        # Always prioritize featured items first, then apply the requested sort
        def sort_key(x):
            featured_priority = -x.get("featured", 0)  # Featured items (1) get negative value for priority
            
            if sort_by == "date":
                return (featured_priority, x["date"])
            elif sort_by == "title":
                return (featured_priority, x["title"].lower())
            else:
                return (featured_priority, x["date"])
        
        # Sort with featured items always first
        return sorted(news_events, key=sort_key, reverse=reverse)

    def _get_mock_achievement_details(self, achievement_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed achievement for blog-style page"""
        # This would normally query the Google Sheets for full content
        # For now, return mock detailed content
        achievements = self._get_mock_achievements(1, 100, None, None, "date", "desc")["achievements"]
        return next((a for a in achievements if a["id"] == achievement_id), None)
    
    def _get_mock_news_event_details(self, news_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed news/event for blog-style page"""
        # This would normally query the Google Sheets for full content
        news_events = self._get_mock_news_events(1, 100, None, None, "date", "desc")["news_events"]
        return next((n for n in news_events if n["id"] == news_id), None)

    def _get_google_sheets_publications(self, page, per_page, year_filter, area_filter, 
                                      category_filter, author_filter, title_filter, 
                                      search_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Get publications from Google Sheets API with caching for performance"""
        cache_key = "publications_raw_data"
        
        try:
            # Check if we have cached data that's still valid
            current_time = datetime.now()
            if (cache_key in self.cache and 
                cache_key in self.last_fetch_time and
                current_time - self.last_fetch_time[cache_key] < self.cache_duration):
                
                logger.info("Using cached publications data for performance")
                publications = self.cache[cache_key]
            else:
                # Fetch fresh data from Google Sheets
                logger.info("Fetching fresh publications data from Google Sheets")
                response = requests.get(self.publications_api_url, timeout=30)  # Increased timeout
                response.raise_for_status()
                
                # Parse the response
                sheets_data = response.json()
                
                # Convert sheets data to our publication format
                publications = self._convert_sheets_to_publications(sheets_data)
                
                # Cache the raw publications data
                self.cache[cache_key] = publications
                self.last_fetch_time[cache_key] = current_time
                logger.info(f"Cached {len(publications)} publications for performance")
            
            # Apply filters on cached data
            filtered_pubs = self._apply_publication_filters(
                publications, year_filter, area_filter, category_filter, 
                author_filter, title_filter, search_filter
            )
            
            # Apply sorting
            filtered_pubs = self._sort_publications(filtered_pubs, sort_by, sort_order)
            
            # Calculate statistics
            total_publications = len(filtered_pubs)
            total_citations = sum(pub.get("citations", 0) for pub in filtered_pubs)
            latest_year = max((int(pub.get("year", 0)) for pub in filtered_pubs), default=datetime.now().year)
            
            # Get unique research areas
            all_areas = set()
            for pub in filtered_pubs:
                if pub.get("research_areas"):
                    all_areas.update(pub["research_areas"])
            total_areas = len(all_areas)
            
            # Apply pagination
            total = len(filtered_pubs)
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            paginated_pubs = filtered_pubs[start_idx:end_idx]
            
            return {
                "publications": paginated_pubs,
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_items": total,
                    "total_pages": (total + per_page - 1) // per_page,
                    "has_next": end_idx < total,
                    "has_prev": page > 1
                },
                "statistics": {
                    "total_publications": total_publications,
                    "total_citations": total_citations,
                    "latest_year": latest_year,
                    "total_areas": total_areas
                }
            }
            
        except Exception as e:
            logger.error(f"Error fetching Google Sheets data: {e}")
            # Fallback to mock data on error
            return self._get_mock_publications(page, per_page, year_filter, area_filter, 
                                            category_filter, author_filter, title_filter, 
                                            search_filter, sort_by, sort_order)

    def _convert_sheets_to_publications(self, sheets_data) -> List[Dict[str, Any]]:
        """Convert Google Sheets data to IEEE publication format"""
        publications = []
        
        try:
            # Handle direct array response from Google Sheets API
            if isinstance(sheets_data, list):
                data_rows = sheets_data
            else:
                # Fallback to nested data structure
                data_rows = sheets_data.get('data', [])
            
            for i, row in enumerate(data_rows):
                try:
                    # Handle object format (direct from Google Sheets API)
                    if isinstance(row, dict):
                        # Your Google Sheets data structure mapping
                        publication = {
                            "id": f"pub_{row.get('id', i):03d}",
                            "category": self._normalize_category(str(row.get('category', 'Journal Articles'))),
                            "authors": self._parse_authors(row.get('authors', [])),
                            "title": str(row.get('title', '')),
                            # Map your Google Sheets fields to IEEE format
                            "journal_book_conference_name": str(
                                row.get('journal_name', '') or 
                                row.get('conference_name', '') or 
                                row.get('book_title', '') or
                                row.get('journal_book_conference_name', '') or 
                                row.get('publication_info', '')
                            ),
                            "volume": str(row.get('volume', '')),
                            "issue": str(row.get('issue', '')),
                            "editors": str(row.get('editor', '') or row.get('editors', '')),
                            "publisher": str(row.get('publisher', '')),
                            "location": str(row.get('city', '') + (', ' + str(row.get('country', '')) if row.get('country') else '') if row.get('city') else ''),
                            "pages": str(row.get('pages', '')),
                            "year": str(row.get('year', datetime.now().year)),
                            "citations": int(row.get('citations', 0)) if str(row.get('citations', 0)).isdigit() else 0,
                            "doi_link": str(row.get('doi_link', '') or row.get('full_paper_link', '')) if (row.get('doi_link') or row.get('full_paper_link')) else None,
                            "research_areas": self._parse_research_areas(row.get('research_areas', [])),
                            # Additional fields for functionality
                            "open_access": bool(row.get('open_access', False)),
                            "full_paper_link": str(row.get('full_paper_link', '') or row.get('doi_link', '')) if (row.get('full_paper_link') or row.get('doi_link')) else None,
                            # Keep original abstract for search functionality
                            "abstract": str(row.get('abstract', ''))
                        }
                    else:
                        # Handle array format for IEEE columns
                        # Expected order: Category, Authors, Title, Journal/Book/Conference Name, Volume, Issue, 
                        # Editors, Publisher, Location, Pages, Year, Citations, DOI/Link, Research Areas
                        
                        # Skip header row if exists
                        if i == 0 and isinstance(row, list) and len(row) > 0 and str(row[0]).lower() in ['category', 'type', 'publication type']:
                            continue
                        
                        publication = {
                            "id": f"pub_{i:03d}",
                            "category": self._normalize_category(str(row[0])) if len(row) > 0 else "Journal Articles",
                            "authors": self._parse_authors(str(row[1])) if len(row) > 1 else [],
                            "title": str(row[2]) if len(row) > 2 else "",
                            "journal_book_conference_name": str(row[3]) if len(row) > 3 else "",
                            "volume": str(row[4]) if len(row) > 4 else "",
                            "issue": str(row[5]) if len(row) > 5 else "",
                            "editors": str(row[6]) if len(row) > 6 else "",
                            "publisher": str(row[7]) if len(row) > 7 else "",
                            "location": str(row[8]) if len(row) > 8 else "",
                            "pages": str(row[9]) if len(row) > 9 else "",
                            "year": str(row[10]) if len(row) > 10 else str(datetime.now().year),
                            "citations": int(row[11]) if len(row) > 11 and str(row[11]).isdigit() else 0,
                            "doi_link": str(row[12]) if len(row) > 12 and str(row[12]).startswith('http') else None,
                            "research_areas": self._parse_research_areas(str(row[13])) if len(row) > 13 else [],
                            # Additional fields for functionality
                            "open_access": bool(str(row[12]).startswith('http')) if len(row) > 12 else False,
                            "full_paper_link": str(row[12]) if len(row) > 12 and str(row[12]).startswith('http') else None,
                        }
                    
                    # Generate IEEE formatted publication info
                    publication["ieee_formatted"] = self._generate_ieee_format(publication)
                    
                    # Only add if title is not empty
                    if publication["title"].strip():
                        publications.append(publication)
                        
                except (ValueError, IndexError, TypeError) as e:
                    logger.warning(f"Error processing row {i}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error converting sheets data: {e}")
            
        return publications

    def _normalize_category(self, category: str) -> str:
        """Normalize category names to standard format"""
        category_lower = category.lower().strip()
        
        if 'journal' in category_lower:
            return "Journal Articles"
        elif 'conference' in category_lower or 'proceeding' in category_lower:
            return "Conference Proceedings"
        elif 'book' in category_lower or 'chapter' in category_lower:
            return "Book Chapters"
        else:
            return category.strip() or "Journal Articles"

    def _parse_authors(self, authors_input) -> List[str]:
        """Parse authors string or list into list"""
        if not authors_input:
            return []
        
        # If it's already a list, return it
        if isinstance(authors_input, list):
            return [str(author).strip() for author in authors_input if str(author).strip()]
        
        # If it's a string, split by comma
        if isinstance(authors_input, str):
            return [author.strip() for author in authors_input.split(',') if author.strip()]
        
        # Fallback
        return [str(authors_input).strip()] if str(authors_input).strip() else []

    def _parse_research_areas(self, areas_input) -> List[str]:
        """Parse research areas string or list into list"""
        if not areas_input:
            return []
        
        # If it's already a list, return it
        if isinstance(areas_input, list):
            return [str(area).strip() for area in areas_input if str(area).strip()]
        
        # If it's a string, split by comma
        if isinstance(areas_input, str):
            return [area.strip() for area in areas_input.split(',') if area.strip()]
        
        # Fallback
        return [str(areas_input).strip()] if str(areas_input).strip() else []

    def _generate_ieee_format(self, publication: Dict[str, Any]) -> str:
        """Generate IEEE formatted citation based on publication type"""
        try:
            authors = ", ".join(publication["authors"])
            title = f'"{publication["title"]}"'
            category = publication["category"]
            
            if category == "Journal Articles":
                # IEEE Journal format: Authors, "Title," Journal Name, vol. X, no. Y, pp. Z-W, Year.
                format_parts = [authors, title]
                if publication["journal_book_conference_name"]:
                    journal = publication["journal_book_conference_name"]
                    # Make journal name italic (we'll handle this in frontend)
                    format_parts.append(f"*{journal}*")
                
                if publication["volume"]:
                    format_parts.append(f"vol. {publication['volume']}")
                
                if publication["issue"]:
                    format_parts.append(f"no. {publication['issue']}")
                
                if publication["pages"]:
                    format_parts.append(f"pp. {publication['pages']}")
                
                format_parts.append(publication["year"])
                return ", ".join(format_parts) + "."
                
            elif category == "Conference Proceedings":
                # IEEE Conference format: Authors, "Title," Conference Name, Location, pp. X-Y, Year.
                format_parts = [authors, title]
                if publication["journal_book_conference_name"]:
                    conf = publication["journal_book_conference_name"]
                    format_parts.append(f"*{conf}*")
                
                if publication["location"]:
                    format_parts.append(publication["location"])
                
                if publication["pages"]:
                    format_parts.append(f"pp. {publication['pages']}")
                
                format_parts.append(publication["year"])
                return ", ".join(format_parts) + "."
                
            elif category == "Book Chapters":
                # IEEE Book Chapter format: Authors, "Chapter Title," in Book Title, Editors, Ed(s). Publisher, Location, pp. X-Y, Year.
                format_parts = [authors, title]
                if publication["journal_book_conference_name"]:
                    book = publication["journal_book_conference_name"]
                    format_parts.append(f"in *{book}*")
                
                if publication["editors"]:
                    format_parts.append(f"{publication['editors']}, Ed(s).")
                
                if publication["publisher"]:
                    format_parts.append(publication["publisher"])
                
                if publication["location"]:
                    format_parts.append(publication["location"])
                
                if publication["pages"]:
                    format_parts.append(f"pp. {publication['pages']}")
                
                format_parts.append(publication["year"])
                return ", ".join(format_parts) + "."
            
            else:
                # Generic format
                format_parts = [authors, title]
                if publication["journal_book_conference_name"]:
                    format_parts.append(f"*{publication['journal_book_conference_name']}*")
                format_parts.append(publication["year"])
                return ", ".join(format_parts) + "."
                
        except Exception as e:
            logger.error(f"Error generating IEEE format: {e}")
            return f"{', '.join(publication.get('authors', []))}, \"{publication.get('title', '')}\", {publication.get('year', '')}."

    def _get_google_sheets_projects(self, page, per_page, status_filter, area_filter, 
                                   title_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Get projects from Google Sheets API with caching for performance"""
        cache_key = "projects_raw_data"
        
        try:
            # Check if we have cached data that's still valid
            current_time = datetime.now()
            if (cache_key in self.cache and 
                cache_key in self.last_fetch_time and
                current_time - self.last_fetch_time[cache_key] < self.cache_duration):
                
                logger.info("Using cached projects data for performance")
                projects = self.cache[cache_key]
            else:
                # Fetch fresh data from Google Sheets
                logger.info("Fetching fresh projects data from Google Sheets")
                response = requests.get(self.projects_api_url, timeout=30)
                response.raise_for_status()
                
                # Parse the response
                sheets_data = response.json()
                
                # Convert sheets data to our projects format
                projects = self._convert_sheets_to_projects(sheets_data)
                
                # Cache the raw projects data
                self.cache[cache_key] = projects
                self.last_fetch_time[cache_key] = current_time
                logger.info(f"Cached {len(projects)} projects for performance")
            
            # Apply filters on cached data
            filtered_projects = self._apply_project_filters(projects, status_filter, area_filter, title_filter)
            
            # Apply sorting
            filtered_projects = self._sort_projects(filtered_projects, sort_by, sort_order)
            
            # Apply pagination
            total = len(filtered_projects)
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            paginated_projects = filtered_projects[start_idx:end_idx]
            
            return {
                "projects": paginated_projects,
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_items": total,
                    "total_pages": (total + per_page - 1) // per_page,
                    "has_next": end_idx < total,
                    "has_prev": page > 1
                }
            }
            
        except Exception as e:
            logger.error(f"Error fetching Google Sheets projects data: {e}")
            # Fallback to mock data on error
            return self._get_mock_projects(page, per_page, status_filter, area_filter, 
                                         title_filter, sort_by, sort_order)

    def _get_google_sheets_achievements(self, page, per_page, category_filter, 
                                       title_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Get achievements from Google Sheets API with caching for performance"""
        cache_key = "achievements_raw_data"
        
        try:
            # Check if we have cached data that's still valid
            current_time = datetime.now()
            if (cache_key in self.cache and 
                cache_key in self.last_fetch_time and
                current_time - self.last_fetch_time[cache_key] < self.cache_duration):
                
                logger.info("Using cached achievements data for performance")
                achievements = self.cache[cache_key]
            else:
                # Fetch fresh data from Google Sheets
                logger.info("Fetching fresh achievements data from Google Sheets")
                response = requests.get(self.achievements_api_url, timeout=30)
                response.raise_for_status()
                
                # Parse the response
                sheets_data = response.json()
                
                # Convert sheets data to our achievements format
                achievements = self._convert_sheets_to_achievements(sheets_data)
                
                # Cache the raw achievements data
                self.cache[cache_key] = achievements
                self.last_fetch_time[cache_key] = current_time
                logger.info(f"Cached {len(achievements)} achievements for performance")
            
            # Apply filters on cached data
            filtered_achievements = self._apply_achievement_filters(achievements, category_filter, title_filter)
            
            # Apply sorting
            filtered_achievements = self._sort_achievements(filtered_achievements, sort_by, sort_order)
            
            # Apply pagination
            total = len(filtered_achievements)
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            paginated_achievements = filtered_achievements[start_idx:end_idx]
            
            return {
                "achievements": paginated_achievements,
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_items": total,
                    "total_pages": (total + per_page - 1) // per_page,
                    "has_next": end_idx < total,
                    "has_prev": page > 1
                }
            }
            
        except Exception as e:
            logger.error(f"Error fetching Google Sheets achievements data: {e}")
            # Fallback to mock data on error
            return self._get_mock_achievements(page, per_page, category_filter, 
                                            title_filter, sort_by, sort_order)

    def _get_google_sheets_news_events(self, page, per_page, category_filter, 
                                      title_filter, sort_by, sort_order) -> Dict[str, Any]:
        """Get news and events from Google Sheets API with caching for performance"""
        cache_key = "news_events_raw_data"
        
        try:
            # Check if we have cached data that's still valid
            current_time = datetime.now()
            if (cache_key in self.cache and 
                cache_key in self.last_fetch_time and
                current_time - self.last_fetch_time[cache_key] < self.cache_duration):
                
                logger.info("Using cached news events data for performance")
                news_events = self.cache[cache_key]
            else:
                # Fetch fresh data from Google Sheets
                logger.info("Fetching fresh news events data from Google Sheets")
                response = requests.get(self.news_events_api_url, timeout=30)
                response.raise_for_status()
                
                # Parse the response
                sheets_data = response.json()
                
                # Convert sheets data to our news events format
                news_events = self._convert_sheets_to_news_events(sheets_data)
                
                # Cache the raw news events data
                self.cache[cache_key] = news_events
                self.last_fetch_time[cache_key] = current_time
                logger.info(f"Cached {len(news_events)} news events for performance")
            
            # Apply filters on cached data
            filtered_news = self._apply_news_filters(news_events, category_filter, title_filter)
            
            # Apply sorting
            filtered_news = self._sort_news_events(filtered_news, sort_by, sort_order)
            
            # Apply pagination
            total = len(filtered_news)
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            paginated_news = filtered_news[start_idx:end_idx]
            
            return {
                "news_events": paginated_news,
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_items": total,
                    "total_pages": (total + per_page - 1) // per_page,
                    "has_next": end_idx < total,
                    "has_prev": page > 1
                }
            }
            
        except Exception as e:
            logger.error(f"Error fetching Google Sheets news events data: {e}")
            # Fallback to mock data on error
            return self._get_mock_news_events(page, per_page, category_filter, 
                                            title_filter, sort_by, sort_order)

    def _get_google_sheets_achievement_details(self, achievement_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed achievement for blog-style page from Google Sheets"""
        try:
            # Get all achievements and find the specific one
            achievements_data = self._get_google_sheets_achievements(1, 1000, None, None, "date", "desc")
            achievements = achievements_data.get("achievements", [])
            return next((a for a in achievements if a["id"] == achievement_id), None)
        except Exception as e:
            logger.error(f"Error fetching achievement details from Google Sheets: {e}")
            # Fallback to mock data
            return self._get_mock_achievement_details(achievement_id)

    def _get_google_sheets_news_event_details(self, news_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed news/event for blog-style page from Google Sheets"""
        try:
            # Get all news events and find the specific one
            news_data = self._get_google_sheets_news_events(1, 1000, None, None, "date", "desc")
            news_events = news_data.get("news_events", [])
            return next((n for n in news_events if n["id"] == news_id), None)
        except Exception as e:
            logger.error(f"Error fetching news event details from Google Sheets: {e}")
            # Fallback to mock data
            return self._get_mock_news_event_details(news_id)

    def _convert_sheets_to_projects(self, sheets_data) -> List[Dict[str, Any]]:
        """Convert Google Sheets data to projects format"""
        projects = []
        
        try:
            # Handle direct array response from Google Sheets API
            if isinstance(sheets_data, list):
                data_rows = sheets_data
            else:
                # Handle nested data structure from Google Sheets API - look for 'projects' key first
                data_rows = sheets_data.get('projects', sheets_data.get('data', []))
            
            for i, row in enumerate(data_rows):
                try:
                    # Handle object format (direct from Google Sheets API)
                    if isinstance(row, dict):
                        project = {
                            "id": f"proj_{row.get('id', i):03d}",
                            "title": str(row.get('title', '')),
                            "description": str(row.get('description', '')),
                            "status": str(row.get('status', 'Active')),
                            "start_date": str(row.get('start_date', '')),
                            "end_date": str(row.get('end_date', '')),
                            "research_areas": self._parse_research_areas(row.get('research_areas', [])),
                            "principal_investigator": str(row.get('principal_investigator', '')),
                            "team_members": self._parse_authors(row.get('team_members', [])),
                            "funding_agency": str(row.get('funding_agency', '')),
                            "budget": str(row.get('budget', '')),
                            "image": str(row.get('image', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e'))
                        }
                    else:
                        # Handle array format
                        # Expected order: Title, Description, Status, Start Date, End Date, Research Areas, 
                        # Principal Investigator, Team Members, Funding Agency, Budget, Image
                        
                        # Skip header row if exists
                        if i == 0 and isinstance(row, list) and len(row) > 0 and str(row[0]).lower() in ['title', 'project title']:
                            continue
                        
                        project = {
                            "id": f"proj_{i:03d}",
                            "title": str(row[0]) if len(row) > 0 else "",
                            "description": str(row[1]) if len(row) > 1 else "",
                            "status": str(row[2]) if len(row) > 2 else "Active",
                            "start_date": str(row[3]) if len(row) > 3 else "",
                            "end_date": str(row[4]) if len(row) > 4 else "",
                            "research_areas": self._parse_research_areas(str(row[5])) if len(row) > 5 else [],
                            "principal_investigator": str(row[6]) if len(row) > 6 else "",
                            "team_members": self._parse_authors(str(row[7])) if len(row) > 7 else [],
                            "funding_agency": str(row[8]) if len(row) > 8 else "",
                            "budget": str(row[9]) if len(row) > 9 else "",
                            "image": str(row[10]) if len(row) > 10 and str(row[10]).startswith('http') else "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
                        }
                    
                    # Only add if title is not empty
                    if project["title"].strip():
                        projects.append(project)
                        
                except (ValueError, IndexError, TypeError) as e:
                    logger.warning(f"Error processing project row {i}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error converting sheets data to projects: {e}")
            
        return projects

    def _convert_sheets_to_achievements(self, sheets_data) -> List[Dict[str, Any]]:
        """Convert Google Sheets data to achievements format"""
        achievements = []
        
        try:
            # Handle direct array response from Google Sheets API
            if isinstance(sheets_data, list):
                data_rows = sheets_data
            else:
                # Handle nested data structure from Google Sheets API - look for 'achievements' key first
                data_rows = sheets_data.get('achievements', sheets_data.get('data', []))
            
            for i, row in enumerate(data_rows):
                try:
                    # Handle object format (direct from Google Sheets API)
                    if isinstance(row, dict):
                        achievement = {
                            "id": f"ach_{row.get('id', i):03d}",
                            "title": str(row.get('title', '')),
                            # Fix: Map 'description' to 'short_description' for display
                            "short_description": str(row.get('description', row.get('short_description', ''))),
                            "category": str(row.get('category', 'Award')),
                            "date": str(row.get('date', '')),
                            "image": str(row.get('image', 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800')),
                            "full_content": str(row.get('full_content', row.get('description', ''))),
                            # Add featured field support
                            "featured": int(row.get('featured', 0)) if str(row.get('featured', 0)).isdigit() else 0
                        }
                    else:
                        # Handle array format
                        # Expected order: Title, Description, Category, Date, Image, Full Content, Featured
                        
                        # Skip header row if exists
                        if i == 0 and isinstance(row, list) and len(row) > 0 and str(row[0]).lower() in ['title', 'achievement title']:
                            continue
                        
                        achievement = {
                            "id": f"ach_{i:03d}",
                            "title": str(row[0]) if len(row) > 0 else "",
                            "short_description": str(row[1]) if len(row) > 1 else "",
                            "category": str(row[2]) if len(row) > 2 else "Award",
                            "date": str(row[3]) if len(row) > 3 else "",
                            "image": str(row[4]) if len(row) > 4 and str(row[4]).startswith('http') else "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800",
                            "full_content": str(row[5]) if len(row) > 5 else "",
                            "featured": int(row[6]) if len(row) > 6 and str(row[6]).isdigit() else 0
                        }
                    
                    # Only add if title is not empty
                    if achievement["title"].strip():
                        achievements.append(achievement)
                        
                except (ValueError, IndexError, TypeError) as e:
                    logger.warning(f"Error processing achievement row {i}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error converting sheets data to achievements: {e}")
            
        return achievements

    def _convert_sheets_to_news_events(self, sheets_data) -> List[Dict[str, Any]]:
        """Convert Google Sheets data to news events format"""
        news_events = []
        
        try:
            # Handle direct array response from Google Sheets API
            if isinstance(sheets_data, list):
                data_rows = sheets_data
            else:
                # Handle nested data structure from Google Sheets API - look for 'news_events' key first (user's script format)
                data_rows = sheets_data.get('news_events', sheets_data.get('achievements', sheets_data.get('data', [])))
            
            for i, row in enumerate(data_rows):
                try:
                    # Handle object format (direct from Google Sheets API)
                    if isinstance(row, dict):
                        news_event = {
                            "id": str(row.get('id', f"news_{i:03d}")),
                            "title": str(row.get('title', '')),
                            # Fix: Map 'description' to 'short_description' for display, also keep 'description' field for backward compatibility
                            "description": str(row.get('description', row.get('short_description', ''))),
                            "short_description": str(row.get('description', row.get('short_description', ''))),
                            "category": str(row.get('category', 'News')),
                            "date": str(row.get('date', '')),
                            "image": str(row.get('image', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800')),
                            "full_content": str(row.get('full_content', row.get('description', ''))),
                            # Add featured field support
                            "featured": int(row.get('featured', 0)) if str(row.get('featured', 0)).isdigit() else 0
                        }
                    else:
                        # Handle array format
                        # Expected order: Title, Description, Category, Date, Image, Full Content, Featured
                        
                        # Skip header row if exists
                        if i == 0 and isinstance(row, list) and len(row) > 0 and str(row[0]).lower() in ['title', 'news title']:
                            continue
                        
                        description = str(row[1]) if len(row) > 1 else ""
                        news_event = {
                            "id": f"news_{i:03d}",
                            "title": str(row[0]) if len(row) > 0 else "",
                            "description": description,
                            "short_description": description,
                            "category": str(row[2]) if len(row) > 2 else "News",
                            "date": str(row[3]) if len(row) > 3 else "",
                            "image": str(row[4]) if len(row) > 4 and str(row[4]).startswith('http') else "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                            "full_content": str(row[5]) if len(row) > 5 else "",
                            "featured": int(row[6]) if len(row) > 6 and str(row[6]).isdigit() else 0
                        }
                    
                    # Only add if title is not empty
                    if news_event["title"].strip():
                        news_events.append(news_event)
                        
                except (ValueError, IndexError, TypeError) as e:
                    logger.warning(f"Error processing news event row {i}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error converting sheets data to news events: {e}")
            
        return news_events


# Global instance
sheets_service = SESGSheetsService()
