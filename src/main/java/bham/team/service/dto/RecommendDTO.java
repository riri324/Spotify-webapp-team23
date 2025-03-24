package bham.team.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link bham.team.domain.Recommend} entity.
 */
@Schema(description = "Recommend Entity\nShows a user similar users based on common songs (at least 5 in common).")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RecommendDTO implements Serializable {

    @NotNull
    private Long id;

    @NotNull
    private String userId;

    @NotNull
    private String recommendedUserId;

    @NotNull
    @Min(value = 5)
    private Integer commonSongsCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRecommendedUserId() {
        return recommendedUserId;
    }

    public void setRecommendedUserId(String recommendedUserId) {
        this.recommendedUserId = recommendedUserId;
    }

    public Integer getCommonSongsCount() {
        return commonSongsCount;
    }

    public void setCommonSongsCount(Integer commonSongsCount) {
        this.commonSongsCount = commonSongsCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RecommendDTO)) {
            return false;
        }

        RecommendDTO recommendDTO = (RecommendDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, recommendDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RecommendDTO{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", recommendedUserId='" + getRecommendedUserId() + "'" +
            ", commonSongsCount=" + getCommonSongsCount() +
            "}";
    }
}
