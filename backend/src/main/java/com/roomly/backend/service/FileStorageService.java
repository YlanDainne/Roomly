package com.roomly.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

  private final Path uploadRoot = Paths.get("uploads").toAbsolutePath().normalize();

  public FileStorageService() throws IOException {
    Files.createDirectories(uploadRoot);
  }

  public String store(MultipartFile file) throws IOException {
    if (file == null || file.isEmpty()) {
      return null;
    }

    String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
    String extension = "";
    int dotIndex = originalName.lastIndexOf('.');
    if (dotIndex >= 0) {
      extension = originalName.substring(dotIndex).toLowerCase(Locale.ROOT);
    }

    String baseName = originalName.substring(0, Math.max(dotIndex, 0)).replaceAll("[^a-zA-Z0-9-_]", "-");
    String storedName = UUID.randomUUID() + "-" + baseName + extension;
    Path target = uploadRoot.resolve(storedName).normalize();
    Files.copy(file.getInputStream(), target);
    return "/uploads/" + storedName;
  }
}