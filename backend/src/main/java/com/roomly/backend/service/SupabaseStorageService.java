package com.roomly.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import okhttp3.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url:https://klhgcqoypnxkqnrnbesz.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String supabaseApiKey;

    @Value("${supabase.storage.api-key:${supabase.api-key}}")
    private String supabaseStorageApiKey;

    @Value("${supabase.storage.bucket-name:roomly-images}")
    private String bucketName;

    @Autowired
    private OkHttpClient supabaseHttpClient;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Upload a file to Supabase Storage bucket
     * @param file MultipartFile to upload
     * @return Public URL of the uploaded file
     */
    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        String filePath = "listings/" + uniqueFilename;

        // Upload to Supabase Storage
        uploadToStorage(filePath, file.getBytes());

        // Return public URL
        return String.format("%s/storage/v1/object/public/%s/%s",
                supabaseUrl, bucketName, filePath);
    }

    /**
     * Delete a file from Supabase Storage
     * @param fileUrl Public URL of the file to delete
     */
    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        // Extract file path from URL
        String filePath = extractFilePathFromUrl(fileUrl);
        if (filePath == null) {
            return;
        }

        String url = String.format("%s/storage/v1/object/%s/%s",
                supabaseUrl, bucketName, filePath);

        Request request = new Request.Builder()
                .url(url)
                .delete()
            .header("Authorization", "Bearer " + supabaseStorageApiKey)
            .header("apikey", supabaseStorageApiKey)
                .build();

        try (Response response = supabaseHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                System.err.println("Failed to delete file: " + response.code() + " " + response.message());
            }
        }
    }

    /**
     * Get public URL for a file
     * @param filePath Path within the bucket
     * @return Public URL
     */
    public String getPublicUrl(String filePath) {
        return String.format("%s/storage/v1/object/public/%s/%s",
                supabaseUrl, bucketName, filePath);
    }

    // Private helper methods

    private void uploadToStorage(String filePath, byte[] fileBytes) throws IOException {
        String url = String.format("%s/storage/v1/object/%s/%s",
                supabaseUrl, bucketName, filePath);

        RequestBody body = RequestBody.create(fileBytes, MediaType.parse("application/octet-stream"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .header("Authorization", "Bearer " + supabaseStorageApiKey)
                .header("apikey", supabaseStorageApiKey)
                .addHeader("Content-Type", "application/octet-stream")
                .build();

        try (Response response = supabaseHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String responseBody = response.body() != null ? response.body().string() : "";
                throw new IOException("Failed to upload file to Supabase Storage: " +
                        response.code() + " " + response.message() +
                        (responseBody.isBlank() ? "" : " - " + responseBody));
            }
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private String extractFilePathFromUrl(String fileUrl) {
        // Extract path from public URL format:
        // https://klhgcqoypnxkqnrnbesz.supabase.co/storage/v1/object/public/roomly-images/listings/uuid.ext
        try {
            String[] parts = fileUrl.split("/storage/v1/object/public/");
            if (parts.length == 2) {
                String[] bucketAndPath = parts[1].split("/", 2);
                if (bucketAndPath.length == 2 && bucketAndPath[0].equals(bucketName)) {
                    return bucketAndPath[1];
                }
            }
        } catch (Exception e) {
            System.err.println("Error extracting file path from URL: " + e.getMessage());
        }
        return null;
    }
}
