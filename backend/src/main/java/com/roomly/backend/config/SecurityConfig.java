package com.roomly.backend.config;

import com.roomly.backend.security.SupabaseJwtFilter;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

  private final SupabaseJwtFilter supabaseJwtFilter;

  public SecurityConfig(SupabaseJwtFilter supabaseJwtFilter) {
    this.supabaseJwtFilter = supabaseJwtFilter;
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
          .requestMatchers(HttpMethod.GET, "/api/listings", "/api/listings/**", "/api/campuses", "/api/hotspots").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/listings").authenticated()
          .requestMatchers(HttpMethod.PUT, "/api/listings/**").authenticated()
          .requestMatchers(HttpMethod.DELETE, "/api/listings/**").authenticated()
          .requestMatchers("/api/admin/**").hasRole("ADMIN")
          .requestMatchers("/uploads/**", "/health").permitAll()
            .requestMatchers("/api/saved-homes/**").authenticated()
            .requestMatchers("/api/users/**").authenticated()
            .anyRequest().permitAll())
        .addFilterBefore(supabaseJwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}