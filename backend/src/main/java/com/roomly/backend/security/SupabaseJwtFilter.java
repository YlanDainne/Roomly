package com.roomly.backend.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.roomly.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * JWT Authentication Filter for Supabase tokens
 * Extracts and validates JWT tokens from Authorization header
 */
@Component
public class SupabaseJwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseJwtFilter.class);

    @Autowired
    private SupabaseJwtProvider jwtProvider;

    @Autowired
    private UserService userService;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        logger.debug("Processing request to {} with auth header: {}", request.getRequestURI(), authHeader != null ? "present" : "absent");

        // Skip filter if no auth header (public endpoints)
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            logger.debug("No bearer token found, proceeding as public access");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(BEARER_PREFIX.length());
            logger.debug("Attempting to validate JWT token");
            var decodedJwt = jwtProvider.validateToken(token);
            String userId = decodedJwt.getSubject();
            String email = decodedJwt.getClaim("email").asString();
            logger.info("JWT validation successful for user: {}", userId);

            // Ensure user exists in database for foreign key constraints
            UUID userUUID = UUID.fromString(userId);
            userService.ensureUserExists(userUUID, email);
            logger.debug("User record ensured in database for user: {}", userId);

            // Create authentication token
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("Authentication set for user: {} with authorities: ROLE_USER", userId);

        } catch (JWTVerificationException e) {
            // Invalid token - set authentication as null (public access)
            logger.warn("JWT validation failed: {}", e.getMessage());
            SecurityContextHolder.getContext().setAuthentication(null);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Skip filter for public endpoints
        return path.startsWith("/api/public/") ||
               path.startsWith("/api/listings") && request.getMethod().equals("GET") ||
               path.startsWith("/health");
    }
}
