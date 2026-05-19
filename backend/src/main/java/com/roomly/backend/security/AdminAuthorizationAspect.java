package com.roomly.backend.security;

import com.roomly.backend.service.UserService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Aspect for enforcing admin role authorization on admin API endpoints.
 * This provides an additional layer of security beyond Spring Security's method-level security.
 */
@Aspect
@Component
public class AdminAuthorizationAspect {

    private static final Logger logger = LoggerFactory.getLogger(AdminAuthorizationAspect.class);

    @Autowired
    private UserService userService;

    /**
     * Intercept all admin controller methods to verify ROLE_ADMIN authority.
     * Returns 403 Forbidden if user is not an admin.
     */
    @Around("execution(* com.roomly.backend.controller.AdminController.*(..))")
    public Object enforceAdminAuthorization(ProceedingJoinPoint joinPoint) throws Throwable {
        UUID userId = getCurrentUserId();

        // Check if user is authenticated
        if (userId == null) {
            logger.warn("AdminAuthorizationAspect: Unauthenticated request to admin endpoint: {}",
                    joinPoint.getSignature().getName());
            return sendForbiddenResponse("User not authenticated");
        }

        // Check if user has admin role
        com.roomly.backend.entity.User user = userService.getUserById(userId);
        if (user == null || !"admin".equalsIgnoreCase(user.getRole())) {
            logger.warn("AdminAuthorizationAspect: User {} attempted admin operation without admin role",
                    userId);
            return sendForbiddenResponse("User does not have admin privileges");
        }

        logger.debug("AdminAuthorizationAspect: Admin {} authorized for {}", userId,
                joinPoint.getSignature().getName());

        // Proceed with the method execution
        return joinPoint.proceed();
    }

    /**
     * Extract the current user's ID from the security context.
     */
    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String userIdStr = (String) auth.getPrincipal();
            try {
                return UUID.fromString(userIdStr);
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid UUID in authentication principal: {}", userIdStr);
                return null;
            }
        }
        return null;
    }

    /**
     * Send a 403 Forbidden response.
     */
    private Object sendForbiddenResponse(String message) throws IOException {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if (attributes != null) {
            HttpServletResponse response = attributes.getResponse();
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"" + message + "\"}");
            response.getWriter().flush();
        }
        return null;
    }
}
