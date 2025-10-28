import {
  StyledContainerImg,
  StyledLink,
  StyledNavContainer,
  StyledNavItem,
  StyledNavMenu,
} from "./Navbar.styled";

export function Navbar() {
  return (
    <StyledNavContainer>
      <StyledContainerImg>
        <img src="./img/logo.png" alt="Logo" width={40} />
        KindyStarts
      </StyledContainerImg>
      <StyledNavMenu>
        <StyledNavItem>
          <StyledLink to="/">Inicio</StyledLink>

          <StyledLink to="/login">Login</StyledLink>

          <StyledLink to="/register">Register</StyledLink>
        </StyledNavItem>
      </StyledNavMenu>
    </StyledNavContainer>
  );
}
