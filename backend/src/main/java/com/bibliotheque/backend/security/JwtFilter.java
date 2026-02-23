package com.bibliotheque.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");

        if (header != null && header.toLowerCase().startsWith("bearer ")) {
            String token = header.substring(7).trim(); // Trimming is better
            try {
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.extractUsername(token);
                    String role = jwtUtil.extractRole(token);

                    if (username != null && role != null) {
                        String cleanRole = role.trim().toUpperCase();
                        var authority = new SimpleGrantedAuthority("ROLE_" + cleanRole);
                        var auth = new UsernamePasswordAuthenticationToken(
                                username, null, List.of(authority));

                        SecurityContextHolder.getContext().setAuthentication(auth);
                        System.err.println("Auth success: " + username + " role=" + cleanRole + " authorities=" + auth.getAuthorities());
                    } else {
                        System.err.println("Auth fail: username or role is null. username=" + username + " role=" + role);
                    }
                } else {
                    System.err.println("Auth fail: validateToken returned false (Token maybe expired or invalid signature)");
                }
            } catch (Exception e) {
                System.err.println("Auth fatal error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(req, res);
    }
}
