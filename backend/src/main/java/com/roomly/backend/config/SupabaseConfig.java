package com.roomly.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import okhttp3.OkHttpClient;

@Configuration
public class SupabaseConfig {

    @Value("${supabase.url:https://klhgcqoypnxkqnrnbesz.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String supabaseApiKey;

    @Value("${supabase.storage.bucket-name:roomly-images}")
    private String storageBucketName;

    @Value("${supabase.jwt-secret}")
    private String jwtSecret;

    @Bean
    public OkHttpClient supabaseHttpClient() {
        return new OkHttpClient.Builder().build();
    }

    public String getSupabaseUrl() {
        return supabaseUrl;
    }

    public String getSupabaseApiKey() {
        return supabaseApiKey;
    }

    public String getStorageBucketName() {
        return storageBucketName;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }
}
