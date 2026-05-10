package com.roomly.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

/**
 * Supabase JWT Token Provider
 * Validates Supabase JWT tokens by checking structure, issuer, and expiration
 */
@Component
public class SupabaseJwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseJwtProvider.class);

    @Value("${supabase.url:}")
    private String supabaseUrl;

    /**
     * Validate and decode a Supabase JWT token
     * Performs structural validation and issuer/expiration checks
     */
    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        if (token == null || token.isEmpty()) {
            throw new JWTVerificationException("Token cannot be empty");
        }

        String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        try {
            // Decode without full verification to inspect claims
            DecodedJWT jwt = JWT.decode(cleanToken);
            
            String issuer = jwt.getIssuer();
            logger.debug("Token issuer: {}", issuer);
            
            // Validate issuer is from Supabase
            if (issuer == null || !issuer.contains("supabase")) {
                logger.error("Token issuer is not from Supabase: {}", issuer);
                throw new JWTVerificationException("Invalid token issuer. Expected Supabase, got: " + issuer);
            }
            
            // Validate token has not expired
            Date expirationTime = jwt.getExpiresAt();
            if (expirationTime != null && expirationTime.before(new Date())) {
                logger.error("Token has expired at: {}", expirationTime);
                throw new JWTVerificationException("Token has expired");
            }
            
            // Validate token has a subject (user ID)
            String subject = jwt.getSubject();
            if (subject == null || subject.isEmpty()) {
                logger.error("Token has no subject (user ID)");
                throw new JWTVerificationException("Token has no subject");
            }
            
            logger.info("JWT validation successful for user: {}", subject);
            return jwt;
            
        } catch (JWTVerificationException e) {
            logger.error("JWT verification failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("JWT processing error: {}", e.getMessage(), e);
            throw new JWTVerificationException("Failed to process JWT token: " + e.getMessage(), e);
        }
    }

    /**
     * Extract user ID from token
     */
    public UUID extractUserId(String token) throws JWTVerificationException {
        DecodedJWT jwt = validateToken(token);
        String sub = jwt.getSubject();
        try {
            return UUID.fromString(sub);
        } catch (IllegalArgumentException e) {
            throw new JWTVerificationException("Invalid user ID format in token: " + sub, e);
        }
    }

    /**
     * Check if token is valid
     */
    public boolean isTokenValid(String token) {
        try {
            validateToken(token);
            return true;
        } catch (Exception e) {
            logger.debug("Token validation returned false: {}", e.getMessage());
            return false;
        }
    }
}
