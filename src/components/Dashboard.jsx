import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Plotly from "plotly.js-dist";
import styled, { createGlobalStyle } from "styled-components";
import logo1 from '../assets/logo1.png';

// ========== STYLED COMPONENTS ========== //
const GlobalStyle = createGlobalStyle`
  :root {
    --dark-bg: #0a0a0f;
    --card-bg: rgba(25, 25, 40, 0.7);
    --sidebar-bg: rgba(15, 15, 25, 0.9);
    --accent: #646cff;
    --accent-hover: #535bf2;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.8);
    --border: rgba(255, 255, 255, 0.1);
  }

  body {
    background-color: var(--dark-bg);
    color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
`;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  width: 100%;
  background-color: var(--sidebar-bg);
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    width: 280px;
    height: 100vh;
    border-right: 1px solid var(--border);
    border-bottom: none;
    padding: 1.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);

  @media (min-width: 1024px) {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }
`;

const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  background: linear-gradient(90deg, #646cff, #61dafb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:hover {
    background-color: rgba(100, 108, 255, 0.1);
    color: var(--accent);
  }

  &.active {
    background-color: rgba(100, 108, 255, 0.2);
    color: var(--accent);
    font-weight: 500;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const GraphContainer = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const GraphTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const DateInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  background: rgba(10, 10, 15, 0.5);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.9rem;
  min-width: 150px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
  }
`;

const Separator = styled.span`
  color: var(--text-secondary);
`;

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Initialize date pickers with dark theme
    flatpickr("#startDate", {
      dateFormat: "Y-m-d",
      defaultDate: startDate,
      theme: "dark",
      onChange: (dates) => setStartDate(dates[0]?.toISOString().split('T')[0] || "")
    });

    flatpickr("#endDate", {
      dateFormat: "Y-m-d",
      defaultDate: endDate,
      theme: "dark",
      onChange: (dates) => setEndDate(dates[0]?.toISOString().split('T')[0] || "")
    });

    flatpickr("#selectedDate", {
      dateFormat: "Y-m-d",
      defaultDate: selectedDate,
      theme: "dark",
      onChange: (dates) => setSelectedDate(dates[0]?.toISOString().split('T')[0] || "")
    });

    // Initialize dark-themed graphs
    const darkLayout = {
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: { color: '#fff', family: 'Inter' },
      xaxis: {
        showgrid: true,
        gridcolor: 'rgba(255,255,255,0.1)',
        linecolor: 'rgba(255,255,255,0.2)',
        tickcolor: 'rgba(255,255,255,0.4)'
      },
      yaxis: {
        showgrid: true,
        gridcolor: 'rgba(255,255,255,0.1)',
        linecolor: 'rgba(255,255,255,0.2)',
        tickcolor: 'rgba(255,255,255,0.4)'
      },
      margin: { t: 40, r: 40, b: 60, l: 60 },
      hovermode: 'closest',
      hoverlabel: {
        bgcolor: 'rgba(30,30,40,0.9)',
        bordercolor: 'rgba(100,108,255,0.5)',
        font: { family: 'Inter' }
      }
    };

    // Sample data for demonstration
    const sampleData = [{
      x: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05'],
      y: [10, 15, 13, 17, 20],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: '#646cff' },
      line: { shape: 'spline', width: 3 }
    }];

    Plotly.newPlot("top-graph", sampleData, { ...darkLayout, title: 'Daily GNSS Data' });
    Plotly.newPlot("mid-graph", sampleData, { ...darkLayout, title: 'Detailed Analysis' });
    Plotly.newPlot("bot-graph", sampleData, { ...darkLayout, title: 'Predicted Trends' });

    return () => {
      Plotly.purge("top-graph");
      Plotly.purge("mid-graph");
      Plotly.purge("bot-graph");
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Layout>
        <Sidebar>
          <Logo>
            <img src="/logo1.png" alt="Logo" width={32} height={32} />
            <LogoText>Navavishkar</LogoText>
          </Logo>
          
          <NavMenu>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Dashboard
            </NavLink>
            <NavLink to="/data" className={({ isActive }) => isActive ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Data Analysis
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Reports
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </NavLink>
          </NavMenu>
        </Sidebar>

        <MainContent>
          <GraphContainer>
            <GraphHeader>
              <GraphTitle>Daily GNSS Data</GraphTitle>
              <DateInputGroup>
                <DateInput type="text" id="startDate" placeholder="Start Date" />
                <Separator>to</Separator>
                <DateInput type="text" id="endDate" placeholder="End Date" />
              </DateInputGroup>
            </GraphHeader>
            <div id="top-graph" style={{ height: "610px" }} />
          </GraphContainer>

          <GraphContainer>
            <GraphHeader>
              <GraphTitle>Detailed Analysis</GraphTitle>
              <DateInput type="text" id="selectedDate" placeholder="Select Date" />
            </GraphHeader>
            <div id="mid-graph" style={{ height: "610px" }} />
          </GraphContainer>

          <GraphContainer>
            <GraphHeader>
              <GraphTitle>Predicted Trends</GraphTitle>
            </GraphHeader>
            <div id="bot-graph" style={{ height: "610px" }} />
          </GraphContainer>
        </MainContent>
      </Layout>
    </>
  );
};

export default Dashboard;