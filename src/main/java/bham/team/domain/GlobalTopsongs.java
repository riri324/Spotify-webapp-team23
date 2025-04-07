package bham.team.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GlobalTopsongs.
 */
@Entity
@Table(name = "global_topsongs")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GlobalTopsongs implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "play_count", nullable = false)
    private Integer playCount;

    @NotNull
    @Column(name = "month_year", nullable = false)
    private Instant monthYear;

    @NotNull
    @Min(value = 2000)
    @Max(value = 2100)
    @Column(name = "year", nullable = false)
    private Integer year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(
        value = { "globalTopsongs", "album", "genre", "artist", "likedSongs", "playlists", "listeningHistories" },
        allowSetters = true
    )
    private Song song;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GlobalTopsongs id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPlayCount() {
        return this.playCount;
    }

    public GlobalTopsongs playCount(Integer playCount) {
        this.setPlayCount(playCount);
        return this;
    }

    public void setPlayCount(Integer playCount) {
        this.playCount = playCount;
    }

    public Instant getMonthYear() {
        return this.monthYear;
    }

    public GlobalTopsongs monthYear(Instant monthYear) {
        this.setMonthYear(monthYear);
        return this;
    }

    public void setMonthYear(Instant monthYear) {
        this.monthYear = monthYear;
    }

    public Integer getYear() {
        return this.year;
    }

    public GlobalTopsongs year(Integer year) {
        this.setYear(year);
        return this;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Song getSong() {
        return this.song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public GlobalTopsongs song(Song song) {
        this.setSong(song);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GlobalTopsongs)) {
            return false;
        }
        return getId() != null && getId().equals(((GlobalTopsongs) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GlobalTopsongs{" +
            "id=" + getId() +
            ", playCount=" + getPlayCount() +
            ", monthYear='" + getMonthYear() + "'" +
            ", year=" + getYear() +
            "}";
    }
}
