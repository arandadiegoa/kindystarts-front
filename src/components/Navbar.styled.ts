import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const StyledNavContainer = styled.nav`
  background: #bafdff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const StyledContainerImg = styled.a`
  display: flex;
  gap: 8px;
  font-size: 1.2rem;
  font-weoght: bold;
  color: black;
  text-decoration: none;
  align-items: center;
`;

export const StyledNavMenu = styled.div`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;

`;

export const StyledNavItem = styled.li`
  margin-left: 1.5rem;
  display: flex;
`;

export const StyledLink = styled(NavLink)`
  text-decoration: none;
  padding: 10px 15px;
  transition: color 0.3s;

  &.active {
    color: #007bff;
    font-weight: bold;
    border-botton: 2px solid #007bff;
  }

  color: #6c757d;
`;
