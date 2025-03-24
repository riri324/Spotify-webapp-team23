package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Recommend Entity
 * Shows a user similar users based on common songs (at least 5 in common).
 */
@Entity
@Table(name = "recommend")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Recommend implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private String userId;

    @NotNull
    @Column(name = "recommended_user_id", nullable = false)
    private String recommendedUserId;

    @NotNull
    @Min(value = 5)
    @Column(name = "common_songs_count", nullable = false)
    private Integer commonSongsCount;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Recommend id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public Recommend userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRecommendedUserId() {
        return this.recommendedUserId;
    }

    public Recommend recommendedUserId(String recommendedUserId) {
        this.setRecommendedUserId(recommendedUserId);
        return this;
    }

    public void setRecommendedUserId(String recommendedUserId) {
        this.recommendedUserId = recommendedUserId;
    }

    public Integer getCommonSongsCount() {
        return this.commonSongsCount;
    }

    public Recommend commonSongsCount(Integer commonSongsCount) {
        this.setCommonSongsCount(commonSongsCount);
        return this;
    }

    public void setCommonSongsCount(Integer commonSongsCount) {
        this.commonSongsCount = commonSongsCount;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Recommend)) {
            return false;
        }
        return getId() != null && getId().equals(((Recommend) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Recommend{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", recommendedUserId='" + getRecommendedUserId() + "'" +
            ", commonSongsCount=" + getCommonSongsCount() +
            "}";
    }
}
