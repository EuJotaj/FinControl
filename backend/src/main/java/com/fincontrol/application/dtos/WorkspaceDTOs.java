package com.fincontrol.application.dtos;

import com.fincontrol.domain.models.TeamRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

public class WorkspaceDTOs {

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class WorkspaceResponse {
        private UUID id;
        private String name;
        private String planName;
        private TeamRole userRole;
        private LocalDateTime joinedAt;
    }

    @Data
    @Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class CreateWorkspaceRequest {
        private String name;
    }
}
